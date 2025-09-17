import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert } from 'react-native';
import { RobotForm } from './components/RobotForm';
import { useRobotsStore } from './store/robotsStore';

export default function CreateRobotScreen() {
  const create = useRobotsStore(state => state.create);
  const robots = useRobotsStore(state => state.robots);
  const router = useRouter();
  const [formKey, setFormKey] = React.useState(0);

  React.useEffect(() => {
    setFormKey(k => k + 1);
    return () => setFormKey(k => k + 1); // reset le formulaire en quittant
  }, []);

  return (
    <RobotForm
      key={formKey}
      initialValues={{ name: '', label: '', year: '', type: '' }}
      mode="create"
      isNameUnique={name => !robots.some(r => r.name === name)}
      onSubmit={values => {
        const success = create(values);
        if (success) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Alert.alert('Succès', 'Robot créé !');
          setFormKey(k => k + 1); // reset le formulaire
          router.replace('/(main)/TP4-robots');
        } else {
          Alert.alert('Erreur', 'Nom déjà utilisé.');
        }
      }}
    />
  );
}
