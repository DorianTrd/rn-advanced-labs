import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RobotForm } from '../components/RobotForm';
import { getRobotById, RobotError, updateRobot } from '../services/robotRepo';
import { RobotInput, RobotUpdate } from '../validation/robotSchema';

export default function EditRobotScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [robot, setRobot] = useState<RobotInput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Charger le robot à éditer
  useEffect(() => {
    const loadRobot = async () => {
      if (!id) {
        Alert.alert('Erreur', 'ID du robot manquant');
        router.push('/TP5-robots-db');
        return;
      }

      try {
        setIsLoading(true);
        const robotData = await getRobotById(id);
        
        if (!robotData) {
          Alert.alert('Erreur', 'Robot introuvable');
          router.push('/TP5-robots-db');
          return;
        }

        setRobot({
          name: robotData.name,
          label: robotData.label,
          year: robotData.year,
          type: robotData.type,
        });
      } catch (error) {
        console.error('Erreur lors du chargement du robot:', error);
        Alert.alert('Erreur', 'Impossible de charger le robot');
        router.push('/TP5-robots-db');
      } finally {
        setIsLoading(false);
      }
    };

    loadRobot();
  }, [id, router]);

  const handleSubmit = async (updates: RobotUpdate) => {
    if (!id) return;

    try {
      setIsSaving(true);
      const updatedRobot = await updateRobot(id, updates);
      
      Alert.alert(
        'Succès',
        `Le robot "${updatedRobot.name}" a été mis à jour avec succès !`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/TP5-robots-db'),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      
      if (error instanceof RobotError) {
        if (error.code === 'NOT_FOUND') {
          Alert.alert('Erreur', 'Robot introuvable');
          router.push('/TP5-robots-db');
        } else if (error.code === 'DUPLICATE_NAME') {
          Alert.alert(
            'Erreur',
            `Un robot avec le nom "${updates.name}" existe déjà. Veuillez choisir un autre nom.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Erreur', error.message);
        }
      } else {
        Alert.alert('Erreur', 'Une erreur inattendue est survenue lors de la mise à jour du robot.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler les modifications ? Les changements seront perdus.',
      [
        {
          text: 'Continuer l\'édition',
          style: 'cancel',
        },
        {
          text: 'Annuler',
          style: 'destructive',
          onPress: () => router.push('/TP5-robots-db'),
        },
      ]
    );
  };

  // Affichage du loading pendant le chargement du robot
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Chargement du robot...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Si le robot n'est pas chargé, ne rien afficher
  if (!robot) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement du robot</Text>
           <TouchableOpacity
             style={styles.retryButton}
             onPress={() => router.push('/TP5-robots-db')}
           >
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={handleCancel}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        
        <Text style={styles.title}>Modifier le Robot</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Formulaire */}
      <RobotForm
        initialValues={robot}
        onSubmit={handleSubmit}
        isLoading={isSaving}
        submitButtonText="Enregistrer les modifications"
        mode="edit"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ff3b30',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 60, // Pour équilibrer la mise en page
  },
});
