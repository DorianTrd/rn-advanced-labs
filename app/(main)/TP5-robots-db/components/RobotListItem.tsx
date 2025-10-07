import React from 'react';
import {
    Alert,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Robot, robotTypes } from '../validation/robotSchema';

interface RobotListItemProps {
  robot: Robot;
  onEdit: (robot: Robot) => void;
  onDelete: (robot: Robot) => void;
  onView: (robot: Robot) => void;
}

export const RobotListItem: React.FC<RobotListItemProps> = ({
  robot,
  onEdit,
  onDelete,
  onView,
}) => {
  const getTypeLabel = (type: string): string => {
    const robotType = robotTypes.find(rt => rt.value === type);
    return robotType?.label || type;
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le robot',
      `Êtes-vous sûr de vouloir supprimer le robot "${robot.name}" ?`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => onDelete(robot),
        },
      ]
    );
  };

  const { width } = Dimensions.get('window');

  return (
    <View style={[styles.container, { width: width - 40 }]}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onView(robot)}
        activeOpacity={0.7}
      >
        {/* En-tête avec nom et type */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {robot.name}
            </Text>
            {robot.archived && (
              <View style={styles.archivedBadge}>
                <Text style={styles.archivedText}>Archivé</Text>
              </View>
            )}
          </View>
          <View style={styles.typeContainer}>
            <Text style={styles.type}>{getTypeLabel(robot.type)}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.label} numberOfLines={2}>
          {robot.label}
        </Text>

        {/* Informations secondaires */}
        <View style={styles.footer}>
          <View style={styles.infoContainer}>
            <Text style={styles.year}>Année: {robot.year}</Text>
            <Text style={styles.date}>
              Créé le {formatDate(robot.created_at)}
            </Text>
            {robot.updated_at !== robot.created_at && (
              <Text style={styles.date}>
                Modifié le {formatDate(robot.updated_at)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => onEdit(robot)}
          activeOpacity={0.7}
        >
          <Text style={styles.editButtonText}>Modifier</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDelete}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  archivedBadge: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  archivedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  typeContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  type: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1976d2',
  },
  label: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    fontSize: 13,
    fontWeight: '500',
    color: '#007AFF',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    marginLeft: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
