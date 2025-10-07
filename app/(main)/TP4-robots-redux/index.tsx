import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { deleteRobot, Robot } from './features/robots/robotsSlice';
import { selectRobotsSortedByName } from './features/robots/selectors';

export default function RobotsReduxScreen() {
  const robots = useAppSelector(selectRobotsSortedByName);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const renderRobot = ({ item }: { item: Robot }) => (
    <View style={styles.robotCard}>
      <Text style={styles.robotName}>{item.name}</Text>
      <Text style={styles.robotLabel}>{item.label}</Text>
      <Text style={styles.robotYear}>Année: {item.year}</Text>
      <Text style={styles.robotType}>Type: {item.type}</Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
  style={[styles.button, styles.editButton]}
  onPress={() => router.push(`/TP4-robots-redux/edit/${item.id}`)}
>
  <Text style={styles.buttonText}>Modifier</Text>
</TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={() => {
            Alert.alert('Confirmation', `Supprimer "${item.name}" ?`, [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Supprimer', style: 'destructive', onPress: () => dispatch(deleteRobot(item.id)) },
            ]);
          }}
        >
          <Text style={styles.buttonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Robots avec Redux</Text>
      
      <Link href="/TP4-robots-redux/create" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Ajouter un Robot</Text>
        </TouchableOpacity>
      </Link>

      {robots.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Aucun robot trouvé</Text>
          <Text style={styles.emptySubtext}>Créez votre premier robot !</Text>
        </View>
      ) : (
        <FlatList
          data={robots}
          renderItem={renderRobot}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  robotCard: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 15,
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
  robotName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  robotLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  robotYear: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  robotType: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#34C759',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});