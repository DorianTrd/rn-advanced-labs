import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { RobotForm } from '../components/RobotForm';
import { saveRobotAsync } from '../features/robots/robotsSlice';

export default function EditRobotScreen() {
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();
  const robots = useAppSelector((state) => state.robots.items);

  const robot = robots.find(r => r.id === id);

  if (!robot) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Robot non trouvé</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <RobotForm
      mode="edit"
      initialValues={{ name: robot.name, label: robot.label, year: robot.year, type: robot.type }}
      isNameUnique={(name) => !robots.some(r => r.name.toLowerCase() === name.trim().toLowerCase() && r.id !== robot.id)}
      onSubmit={(values) => {
        const yearNum = typeof values.year === 'string' ? parseInt(values.year, 10) : values.year;
        dispatch(saveRobotAsync({ id: robot.id, data: {
          name: values.name.trim(),
          label: values.label.trim(),
          year: yearNum,
          type: values.type,
        }}));
        Alert.alert('Succès', 'Robot modifié avec succès', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 50,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 18,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});