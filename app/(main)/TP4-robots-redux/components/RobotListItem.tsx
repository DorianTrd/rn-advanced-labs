import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type RobotListItemProps = {
  robot?: {
    id: string;
    name: string;
    label: string;
    year: number;
    type: string;
  };
  onEdit: () => void;
  onDelete: () => void;
};

const getRobotAvatar = (type?: string) => {
  switch (type) {
    case 'industrial': return '🤖';
    case 'service': return '🛎️';
    case 'medical': return '🩺';
    case 'educational': return '📚';
    default: return '🚀';
  }
};

export const RobotListItem: React.FC<RobotListItemProps> = ({ robot, onEdit, onDelete }) => {
  if (!robot) return null;
  return (
    <View style={styles.itemRow}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{getRobotAvatar(robot.type)}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{robot.name}</Text>
        <Text style={styles.label}>{robot.label}</Text>
        <Text style={styles.yearType}>{robot.year} • {robot.type}</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={onEdit}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={onDelete}
          activeOpacity={0.7}
          accessibilityRole="button"
        >
          <Text style={styles.actionText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 8,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    fontSize: 28,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1e293b',
    marginBottom: 2,
  },
  label: {
    fontSize: 15,
    color: '#2563eb',
    marginBottom: 2,
  },
  yearType: {
    fontSize: 13,
    color: '#64748b',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f0f6ff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.10,
    shadowRadius: 2,
    elevation: 1,
  },
  editBtn: {
    backgroundColor: '#e0f7fa',
  },
  deleteBtn: {
    backgroundColor: '#ffe4e6',
  },
  actionText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
