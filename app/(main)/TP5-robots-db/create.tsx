import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RobotForm } from './components/RobotForm';
import { createRobot, RobotError } from './services/robotRepo';
import { RobotInput, RobotUpdate } from './validation/robotSchema';

export default function CreateRobotScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (robotInput: RobotInput | RobotUpdate) => {
    try {
      setIsLoading(true);
      // En mode création, on s'attend à recevoir un RobotInput complet
      if (!robotInput.name || !robotInput.label || !robotInput.year || !robotInput.type) {
        throw new Error('Tous les champs sont requis pour créer un robot');
      }
      const newRobot = await createRobot(robotInput as RobotInput);
      
      Alert.alert(
        'Succès',
        `Le robot "${newRobot.name}" a été créé avec succès !`,
        [
          {
            text: 'OK',
            onPress: () => router.push('/TP5-robots-db'),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      
      if (error instanceof RobotError) {
        if (error.code === 'DUPLICATE_NAME') {
          Alert.alert(
            'Erreur',
            `Un robot avec le nom "${robotInput.name}" existe déjà. Veuillez choisir un autre nom.`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Erreur', error.message);
        }
      } else {
        Alert.alert('Erreur', 'Une erreur inattendue est survenue lors de la création du robot.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler',
      'Êtes-vous sûr de vouloir annuler la création ? Les modifications seront perdues.',
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
        
        <Text style={styles.title}>Nouveau Robot</Text>
        
        <View style={styles.placeholder} />
      </View>

      {/* Formulaire */}
      <RobotForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        submitButtonText="Créer le robot"
        mode="create"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
