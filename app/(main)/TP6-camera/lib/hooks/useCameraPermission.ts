import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Alert, Linking } from 'react-native';

export const useCameraPermission = () => {
  const [status, setStatus] = useState<'granted' | 'denied' | 'undetermined'>('undetermined');

  const requestPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setStatus(status);
    if (status !== 'granted') {
      Alert.alert(
        'Permission caméra refusée',
        'Vous devez autoriser l’accès à la caméra pour prendre des photos.',
        [
          { text: 'Ouvrir les réglages', onPress: () => Linking.openSettings() },
          { text: 'Annuler', style: 'cancel' },
        ]
      );
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return { status, requestPermission };
};
