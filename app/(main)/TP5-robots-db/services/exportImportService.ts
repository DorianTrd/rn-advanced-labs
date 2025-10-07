import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system/legacy'; // Import Legacy pour éviter l'avertissement de dépréciation
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { Robot } from '../validation/robotSchema';
import { createRobot, getAllRobots, RobotError } from './robotRepo';

// Nom du fichier d'export
const EXPORT_FILENAME = 'robots_export.json';

// Fonction utilitaire pour obtenir le répertoire de documents (espace de stockage interne de l'app)
const getDocumentDirectory = () => {
    // Utiliser le répertoire de documents permanent fourni par Expo
    return FileSystem.documentDirectory;
};

// Interface pour les données d'export
export interface ExportData {
    robots: Robot[];
    exportDate: string;
    version: string;
    count: number;
}

// Interface pour les données d'import
export interface ImportResult {
    success: number;
    errors: Array<{
        robot: Partial<Robot>;
        error: string;
    }>;
    duplicates: number;
}

// ------------------------------------------
// --- LOGIQUE D'EXPORT & PARTAGE (SUR TÉLÉPHONE) ---
// ------------------------------------------

/**
 * Exporte tous les robots vers un fichier JSON temporaire et lance le partage
 */
export const exportRobotsToFile = async (includeArchived = false): Promise<void> => {
    try {
        // 1. Récupérer tous les robots
        const robots = await getAllRobots(includeArchived);
        
        // 2. Préparer les données JSON
        const exportData: ExportData = {
            robots,
            exportDate: new Date().toISOString(),
            version: '1.0',
            count: robots.length,
        };
        
        const jsonContent = JSON.stringify(exportData, null, 2);
        
        // 3. Déterminer le chemin du fichier (dans le DocumentDirectory de l'application)
        const fileUri = `${getDocumentDirectory()}${EXPORT_FILENAME}`;
        
        // 4. Écrire le fichier
        await FileSystem.writeAsStringAsync(fileUri, jsonContent);

        // 5. Vérifier si le partage est possible et le lancer
        if (!(await Sharing.isAvailableAsync())) {
            Alert.alert(
                'Partage non disponible',
                `L'export a réussi, mais la fonctionnalité de partage n'est pas supportée sur cet appareil ou plateforme. Le fichier est enregistré en interne à l'URI:\n\n${fileUri}`,
                [{ text: 'OK' }]
            );
            return;
        }

        // 6. Lancer le partage (permet de sauvegarder sur le cloud/locale, ou d'envoyer)
        await Sharing.shareAsync(fileUri, {
            mimeType: 'application/json',
            dialogTitle: 'Exporter les données de robots',
        });

        console.log(`Export réussi : ${robots.length} robots. Partage initié.`);
    } catch (error) {
        console.error('Erreur lors de l\'export:', error);
        Alert.alert(
            'Erreur d\'export ❌',
            'Une erreur est survenue lors de la préparation ou du partage du fichier.',
            [{ text: 'OK' }]
        );
        throw new Error('Erreur lors de l\'export des robots');
    }
};

// ------------------------------------------
// --- LOGIQUE D'IMPORT (DEPUIS TÉLÉPHONE) ---
// ------------------------------------------

/**
 * Importe des robots depuis un fichier JSON
 */
export const importRobotsFromFile = async (fileUri: string): Promise<ImportResult> => {
    try {
        // 1. Lire le fichier
        const fileContent = await FileSystem.readAsStringAsync(fileUri);

        // 2. Valider le contenu et parser le JSON
        const validation = validateExportFile(fileContent);
        if (!validation.valid) {
            throw new Error(`Format de fichier invalide : ${validation.errors.join(', ')}`);
        }

        const importData: ExportData = JSON.parse(fileContent);

        const result: ImportResult = {
            success: 0,
            errors: [],
            duplicates: 0, 
        };

        // 3. Importer chaque robot
        for (const robotData of importData.robots) {
            try {
                // Vérifier les champs requis
                if (!robotData.name || !robotData.label || !robotData.year || !robotData.type) {
                    result.errors.push({
                        robot: robotData,
                        error: 'Champs requis manquants (name, label, year, type)',
                    });
                    continue;
                }

                // Préparer l'objet pour la création (on ignore les métadonnées pour générer un nouvel enregistrement)
                const { id, created_at, updated_at, archived, ...robotInput } = robotData;
                
                await createRobot(robotInput); // createRobot est supposé gérer la validation d'unicité (name)
                result.success++;

            } catch (error) {
                if (error instanceof RobotError && error.code === 'DUPLICATE_NAME') {
                    // Gestion de la fusion : ignorer si le nom existe déjà
                    result.duplicates++;
                } else {
                    result.errors.push({
                        robot: robotData,
                        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la création',
                    });
                }
            }
        }

        return result;
    } catch (error) {
        console.error('Erreur lors de l\'import:', error);
        if (error instanceof SyntaxError) {
            throw new Error('Format de fichier invalide : JSON malformé');
        }
        throw new Error(error instanceof Error ? error.message : 'Erreur lors de l\'import des robots');
    }
};

/**
 * Affiche un sélecteur de fichier pour l'import et lance l'import
 */
export const selectAndImportFile = async (): Promise<ImportResult | null> => {
    try {
        // Utilisation de expo-document-picker pour sélectionner un fichier
        const result = await DocumentPicker.getDocumentAsync({
            type: 'application/json', // Limite à la sélection de fichiers JSON
            copyToCacheDirectory: true, // IMPORTANT: Copie le fichier sélectionné vers un URI accessible par FileSystem
        });

        if (result.canceled || !result.assets || result.assets.length === 0) {
            return null; // Annulation ou aucun fichier sélectionné
        }

        const selectedFile = result.assets[0];

        // Lancer l'import
        const importResult = await importRobotsFromFile(selectedFile.uri);

        // Afficher le résultat de l'import
        Alert.alert(
            'Import terminé 🎉',
            `Opération terminée :\n- Succès : ${importResult.success} robots créés\n- Duplicata : ${importResult.duplicates} robots ignorés (nom déjà existant)\n- Erreurs : ${importResult.errors.length} robots en échec`,
            [{ text: 'OK' }]
        );

        return importResult;
    } catch (error) {
        console.error('Erreur lors de la sélection/import du fichier:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        Alert.alert(
            'Échec de l\'import 🛑',
            `Erreur lors de l'opération : ${errorMessage}`,
            [{ text: 'OK' }]
        );
        return null;
    }
};

// ------------------------------------------
// --- FONCTION SECONDAIRE ---
// ------------------------------------------

/**
 * Valide un fichier d'export avant l'import
 */
export const validateExportFile = (fileContent: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    try {
        const data = JSON.parse(fileContent);

        if (!data.robots) {
            errors.push('Propriété "robots" manquante');
        } else if (!Array.isArray(data.robots)) {
            errors.push('La propriété "robots" doit être un tableau');
        } else {
            // Valider chaque robot
            data.robots.forEach((robot: any, index: number) => {
                if (!robot.name) errors.push(`Robot ${index + 1}: nom manquant`);
                if (!robot.label) errors.push(`Robot ${index + 1}: label manquant`);
                if (!robot.year) errors.push(`Robot ${index + 1}: année manquante`);
                if (!robot.type) errors.push(`Robot ${index + 1}: type manquant`);
                
                if (robot.name && typeof robot.name !== 'string') {
                    errors.push(`Robot ${index + 1}: nom doit être une chaîne de caractères`);
                }
                if (robot.year && typeof robot.year !== 'number') {
                    errors.push(`Robot ${index + 1}: année doit être un nombre`);
                }
            });
        }

        if (!data.exportDate) {
            errors.push('Date d\'export manquante');
        }

        if (!data.version) {
            errors.push('Version manquante');
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    } catch (error) {
        errors.push('Fichier JSON invalide');
        return {
            valid: false,
            errors,
        };
    }
};