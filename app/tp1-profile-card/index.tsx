import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ProfileCard from './components/ProfileCard';

export default function ProfilesPage() {
  return (
    <SafeAreaView style={styles.container}>
      <ProfileCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
