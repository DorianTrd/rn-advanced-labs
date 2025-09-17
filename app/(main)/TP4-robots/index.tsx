import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RobotListItem } from './components/RobotListItem';
import { useRobotsStore } from './store/robotsStore';

export default function RobotsListScreen() {
  const robots = useRobotsStore(state => state.robots);
  const remove = useRobotsStore(state => state.remove);
  const router = useRouter();

  const handleDelete = (id: string) => {
    Alert.alert('Confirmation', 'Supprimer ce robot ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => remove(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des robots</Text>
      <FlatList
        data={robots.sort((a, b) => a.name.localeCompare(b.name))}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItemCard}>
            <RobotListItem
              robot={item}
              onEdit={() => router.push({ pathname: '/(main)/TP4-robots/edit/[id]', params: { id: item.id } })}
              onDelete={() => handleDelete(item.id)}
            />
          </View>
        )}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push({ pathname: '/(main)/TP4-robots/create' })}
        accessibilityRole="button"
      >
        <Text style={styles.addBtnText}>+ Ajouter un robot</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 18,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 24,
  },
  listItemCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 4,
  },
  addBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  addBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
