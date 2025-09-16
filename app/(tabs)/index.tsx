import { StyleSheet } from 'react-native';

import ProfileCardScreen from '@/app/tp1-profile-card/components/ProfileCard';

export default function HomeScreen() {
  return (
    <ProfileCardScreen />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
