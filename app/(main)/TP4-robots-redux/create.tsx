import { router } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { RobotForm } from './components/RobotForm';
import { saveRobotAsync } from './features/robots/robotsSlice';

export default function CreateRobotScreen() {
  const dispatch = useAppDispatch();
  const robots = useAppSelector((s) => s.robots.items);

  return (
    <RobotForm
      mode="create"
      initialValues={{ name: '', label: '', year: '', type: '' }}
      isNameUnique={(name) => !robots.some(r => r.name.toLowerCase() === name.trim().toLowerCase())}
      onSubmit={(values) => {
        const yearNum = typeof values.year === 'string' ? parseInt(values.year, 10) : values.year;
        dispatch(saveRobotAsync({ data: {
          name: values.name.trim(),
          label: values.label.trim(),
          year: yearNum,
          type: values.type,
        }}));
        Alert.alert('Succès', 'Robot créé avec succès', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }}
    />
  );
}