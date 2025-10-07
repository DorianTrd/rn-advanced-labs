import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RobotListItem } from './components/RobotListItem';
import { createSampleExportFile, exportRobotsToFile, selectAndImportFile } from './services/exportImportService';
import { archiveRobot, getRobotStats, listRobots, RobotError } from './services/robotRepo';
import { Robot } from './validation/robotSchema';

export default function RobotsListScreen() {
  const router = useRouter();
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'year' | 'created_at'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showArchived, setShowArchived] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    archived: 0,
    byType: {} as Record<string, number>,
  });
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [exportModalVisible, setExportModalVisible] = useState(false);

  // Charger les robots
  const loadRobots = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await listRobots({
        q: searchQuery,
        sort: sortBy,
        order: sortOrder,
        includeArchived: showArchived,
        limit: 100, // Charger plus de robots pour une meilleure UX
      });

      setRobots(result.data);

      // Charger les statistiques
      const statsData = await getRobotStats();
      setStats(statsData);
    } catch (error) {
      console.error('Erreur lors du chargement des robots:', error);
      Alert.alert('Erreur', 'Impossible de charger la liste des robots');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [searchQuery, sortBy, sortOrder, showArchived]);

  // Effet pour charger les robots au montage et quand les paramètres changent
  useEffect(() => {
    loadRobots();
  }, [loadRobots]);

  // Gestionnaire de suppression
  const handleDelete = async (robot: Robot) => {
    try {
      await archiveRobot(robot.id);
      Alert.alert('Succès', 'Robot archivé avec succès');
      loadRobots(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (error instanceof RobotError) {
        Alert.alert('Erreur', error.message);
      } else {
        Alert.alert('Erreur', 'Impossible de supprimer le robot');
      }
    }
  };

  // Gestionnaire d'édition
  const handleEdit = (robot: Robot) => {
    router.push(`/TP5-robots-db/edit/${robot.id}` as any);
  };

  // Gestionnaire de visualisation
  const handleView = (robot: Robot) => {
    Alert.alert(
      robot.name,
      `Label: ${robot.label}\nAnnée: ${robot.year}\nType: ${robot.type}\nCréé le: ${new Date(robot.created_at).toLocaleDateString('fr-FR')}`,
      [{ text: 'OK' }]
    );
  };

  // Gestionnaire de recherche
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Gestionnaire de tri
  const handleSort = (field: 'name' | 'year' | 'created_at') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Gestionnaire d'export
  const handleExport = async () => {
    try {
      await exportRobotsToFile(showArchived);
      Alert.alert('Succès', 'Export terminé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
      Alert.alert('Erreur', 'Impossible d\'exporter les robots');
    }
  };

  // Gestionnaire d'import
  const handleImport = async () => {
    try {
      const result = await selectAndImportFile();
      if (result) {
        Alert.alert(
          'Import terminé',
          `Succès: ${result.success}\nErreurs: ${result.errors.length}\nDoublons: ${result.duplicates}`,
          [{ text: 'OK', onPress: () => loadRobots() }]
        );
      }
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      Alert.alert('Erreur', 'Impossible d\'importer les robots');
    }
  };

  // Gestionnaire de création d'un fichier d'exemple
  const handleCreateSample = async () => {
    try {
      const fileUri = await createSampleExportFile();
      Alert.alert(
        'Fichier d\'exemple créé',
        `Fichier créé : ${fileUri}\nVous pouvez l'utiliser pour tester l'import.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur lors de la création du fichier d\'exemple:', error);
      Alert.alert('Erreur', 'Impossible de créer le fichier d\'exemple');
    }
  };

  // Fonction pour afficher les statistiques
  const renderStatsModal = () => (
    <Modal
      visible={statsModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Statistiques</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setStatsModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.active}</Text>
            <Text style={styles.statLabel}>Actifs</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.archived}</Text>
            <Text style={styles.statLabel}>Archivés</Text>
          </View>
        </View>

        <View style={styles.typeStatsContainer}>
          <Text style={styles.typeStatsTitle}>Par type</Text>
          {Object.entries(stats.byType).map(([type, count]) => (
            <View key={type} style={styles.typeStatRow}>
              <Text style={styles.typeStatLabel}>{type}</Text>
              <Text style={styles.typeStatCount}>{count}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </Modal>
  );

  // Fonction pour afficher le modal d'export/import
  const renderExportModal = () => (
    <Modal
      visible={exportModalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Export / Import</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setExportModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Fermer</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.exportContainer}>
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleExport}
          >
            <Text style={styles.exportButtonText}>📤 Exporter les robots</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleImport}
          >
            <Text style={styles.exportButtonText}>📥 Importer des robots</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.exportButton}
            onPress={handleCreateSample}
          >
            <Text style={styles.exportButtonText}>📄 Créer un fichier d'exemple</Text>
          </TouchableOpacity>
        </View>


      </SafeAreaView>
    </Modal>
  );

  // Fonction pour rendre un élément de la liste
  const renderRobotItem = ({ item }: { item: Robot }) => (
    <RobotListItem
      robot={item}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onView={handleView}
    />
  );

  // Fonction pour rendre l'en-tête de la liste
  const renderListHeader = () => (
    <View style={styles.header}>
      {/* Barre de recherche */}
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un robot..."
        value={searchQuery}
        onChangeText={handleSearch}
        returnKeyType="search"
      />

      {/* Contrôles de tri et filtres */}
      <View style={styles.controls}>
        <View style={styles.sortControls}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.activeSortButton]}
            onPress={() => handleSort('name')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.activeSortButtonText]}>
              Nom {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'year' && styles.activeSortButton]}
            onPress={() => handleSort('year')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'year' && styles.activeSortButtonText]}>
              Année {sortBy === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'created_at' && styles.activeSortButton]}
            onPress={() => handleSort('created_at')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'created_at' && styles.activeSortButtonText]}>
              Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterControls}>
          <TouchableOpacity
            style={[styles.filterButton, showArchived && styles.activeFilterButton]}
            onPress={() => setShowArchived(!showArchived)}
          >
            <Text style={[styles.filterButtonText, showArchived && styles.activeFilterButtonText]}>
              {showArchived ? 'Masquer archivés' : 'Voir archivés'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement des robots...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête avec titre et actions */}
      <View style={styles.topHeader}>
        <Text style={styles.title}>Robots ({robots.length})</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setStatsModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setExportModalVisible(true)}
          >
            <Text style={styles.actionButtonText}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => router.push('/TP5-robots-db/create')}
          >
            <Text style={[styles.actionButtonText, styles.primaryButtonText]}>+ Nouveau</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des robots */}
      <FlatList
        data={robots}
        renderItem={renderRobotItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadRobots(true)}
            colors={['#007AFF']}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun robot trouvé' : 'Aucun robot enregistré'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => router.push('/TP5-robots-db/create')}
              >
                <Text style={styles.emptyButtonText}>Créer le premier robot</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal des statistiques */}
      {renderStatsModal()}
      
      {/* Modal d'export/import */}
      {renderExportModal()}
    </View>
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
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  controls: {
    gap: 12,
  },
  sortControls: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  activeSortButtonText: {
    color: '#fff',
  },
  filterControls: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#34C759',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  activeFilterButtonText: {
    color: '#fff',
  },
  listContainer: {
    padding: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#007AFF',
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  typeStatsContainer: {
    padding: 20,
  },
  typeStatsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  typeStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  typeStatLabel: {
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },
  typeStatCount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#007AFF',
  },
  exportContainer: {
    padding: 20,
    gap: 16,
  },
  exportButton: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  exportInfo: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    margin: 20,
    borderRadius: 12,
  },
  exportInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  exportInfoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
});
