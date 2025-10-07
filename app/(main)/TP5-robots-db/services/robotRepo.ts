import uuid from 'react-native-uuid';
import { getDatabase } from '../db';
import { ListOptions, Robot, RobotInput, RobotUpdate } from '../validation/robotSchema';

// Interface pour les résultats paginés
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

// Interface pour les erreurs personnalisées
export class RobotError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RobotError';
  }
}

// Fonction pour créer un nouveau robot
export const createRobot = async (robotInput: RobotInput): Promise<Robot> => {
  try {
    const db = await getDatabase();
    const now = Date.now();
    const id = uuid.v4() as string;

    // Vérifier l'unicité du nom
    const existingRobot = await getRobotByName(robotInput.name);
    if (existingRobot) {
      throw new RobotError(`Un robot avec le nom "${robotInput.name}" existe déjà`, 'DUPLICATE_NAME');
    }

    const robot: Robot = {
      id,
      ...robotInput,
      created_at: now,
      updated_at: now,
      archived: false,
    };

    await db.runAsync(
      `INSERT INTO robots (id, name, label, year, type, created_at, updated_at, archived)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [robot.id, robot.name, robot.label, robot.year, robot.type, robot.created_at, robot.updated_at, robot.archived ? 1 : 0]
    );

    return robot;
  } catch (error) {
    if (error instanceof RobotError) {
      throw error;
    }
    console.error('Erreur lors de la création du robot:', error);
    throw new RobotError('Erreur lors de la création du robot', 'CREATE_ERROR');
  }
};

// Fonction pour récupérer un robot par son ID
export const getRobotById = async (id: string): Promise<Robot | null> => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      name: string;
      label: string;
      year: number;
      type: string;
      created_at: number;
      updated_at: number;
      archived: number;
    }>(
      'SELECT * FROM robots WHERE id = ?',
      [id]
    );

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      name: result.name,
      label: result.label,
      year: result.year,
      type: result.type as any,
      created_at: result.created_at,
      updated_at: result.updated_at,
      archived: Boolean(result.archived),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du robot:', error);
    throw new RobotError('Erreur lors de la récupération du robot', 'GET_ERROR');
  }
};

// Fonction pour récupérer un robot par son nom
export const getRobotByName = async (name: string): Promise<Robot | null> => {
  try {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{
      id: string;
      name: string;
      label: string;
      year: number;
      type: string;
      created_at: number;
      updated_at: number;
      archived: number;
    }>(
      'SELECT * FROM robots WHERE name = ?',
      [name]
    );

    if (!result) {
      return null;
    }

    return {
      id: result.id,
      name: result.name,
      label: result.label,
      year: result.year,
      type: result.type as any,
      created_at: result.created_at,
      updated_at: result.updated_at,
      archived: Boolean(result.archived),
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du robot par nom:', error);
    throw new RobotError('Erreur lors de la récupération du robot', 'GET_ERROR');
  }
};

// Fonction pour mettre à jour un robot
export const updateRobot = async (id: string, updates: RobotUpdate): Promise<Robot> => {
  try {
    const db = await getDatabase();
    
    // Vérifier que le robot existe
    const existingRobot = await getRobotById(id);
    if (!existingRobot) {
      throw new RobotError('Robot introuvable', 'NOT_FOUND');
    }

    // Vérifier l'unicité du nom si il est modifié
    if (updates.name && updates.name !== existingRobot.name) {
      const robotWithSameName = await getRobotByName(updates.name);
      if (robotWithSameName) {
        throw new RobotError(`Un robot avec le nom "${updates.name}" existe déjà`, 'DUPLICATE_NAME');
      }
    }

    const now = Date.now();
    const updatedRobot = { ...existingRobot, ...updates, updated_at: now };

    // Construire la requête UPDATE dynamiquement
    const updateFields: string[] = [];
    const values: any[] = [];

    if (updates.name !== undefined) {
      updateFields.push('name = ?');
      values.push(updates.name);
    }
    if (updates.label !== undefined) {
      updateFields.push('label = ?');
      values.push(updates.label);
    }
    if (updates.year !== undefined) {
      updateFields.push('year = ?');
      values.push(updates.year);
    }
    if (updates.type !== undefined) {
      updateFields.push('type = ?');
      values.push(updates.type);
    }

    updateFields.push('updated_at = ?');
    values.push(now);
    values.push(id);

    await db.runAsync(
      `UPDATE robots SET ${updateFields.join(', ')} WHERE id = ?`,
      values
    );

    return updatedRobot;
  } catch (error) {
    if (error instanceof RobotError) {
      throw error;
    }
    console.error('Erreur lors de la mise à jour du robot:', error);
    throw new RobotError('Erreur lors de la mise à jour du robot', 'UPDATE_ERROR');
  }
};

// Fonction pour supprimer un robot (soft delete)
export const archiveRobot = async (id: string): Promise<void> => {
  try {
    const db = await getDatabase();
    
    // Vérifier que le robot existe
    const existingRobot = await getRobotById(id);
    if (!existingRobot) {
      throw new RobotError('Robot introuvable', 'NOT_FOUND');
    }

    const now = Date.now();
    await db.runAsync(
      'UPDATE robots SET archived = 1, updated_at = ? WHERE id = ?',
      [now, id]
    );
  } catch (error) {
    if (error instanceof RobotError) {
      throw error;
    }
    console.error('Erreur lors de l\'archivage du robot:', error);
    throw new RobotError('Erreur lors de la suppression du robot', 'DELETE_ERROR');
  }
};

// Fonction pour supprimer définitivement un robot
export const deleteRobot = async (id: string): Promise<void> => {
  try {
    const db = await getDatabase();
    
    // Vérifier que le robot existe
    const existingRobot = await getRobotById(id);
    if (!existingRobot) {
      throw new RobotError('Robot introuvable', 'NOT_FOUND');
    }

    await db.runAsync('DELETE FROM robots WHERE id = ?', [id]);
  } catch (error) {
    if (error instanceof RobotError) {
      throw error;
    }
    console.error('Erreur lors de la suppression du robot:', error);
    throw new RobotError('Erreur lors de la suppression du robot', 'DELETE_ERROR');
  }
};

// Fonction pour lister les robots avec filtres et pagination
export const listRobots = async (options: ListOptions = {}): Promise<PaginatedResult<Robot>> => {
  try {
    const db = await getDatabase();
    
    const {
      q = '',
      sort = 'name',
      order = 'asc',
      limit = 20,
      offset = 0,
      includeArchived = false,
    } = options;

    // Construire les conditions WHERE
    const whereConditions: string[] = [];
    const values: any[] = [];

    // Filtre de recherche textuelle
    if (q.trim()) {
      whereConditions.push('(name LIKE ? OR label LIKE ?)');
      const searchTerm = `%${q.trim()}%`;
      values.push(searchTerm, searchTerm);
    }

    // Filtre pour les robots archivés
    if (!includeArchived) {
      whereConditions.push('archived = 0');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Construire la clause ORDER BY
    const orderBy = `ORDER BY ${sort} ${order.toUpperCase()}`;

    // Requête pour compter le total
    const countResult = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM robots ${whereClause}`,
      values
    );
    const total = countResult?.count || 0;

    // Requête pour récupérer les données
    const robots = await db.getAllAsync<{
      id: string;
      name: string;
      label: string;
      year: number;
      type: string;
      created_at: number;
      updated_at: number;
      archived: number;
    }>(
      `SELECT * FROM robots ${whereClause} ${orderBy} LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const data = robots.map(robot => ({
      id: robot.id,
      name: robot.name,
      label: robot.label,
      year: robot.year,
      type: robot.type as any,
      created_at: robot.created_at,
      updated_at: robot.updated_at,
      archived: Boolean(robot.archived),
    }));

    return {
      data,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste des robots:', error);
    throw new RobotError('Erreur lors de la récupération de la liste des robots', 'LIST_ERROR');
  }
};

// Fonction pour récupérer tous les robots (pour l'export)
export const getAllRobots = async (includeArchived = false): Promise<Robot[]> => {
  try {
    const db = await getDatabase();
    
    const whereClause = includeArchived ? '' : 'WHERE archived = 0';
    
    const robots = await db.getAllAsync<{
      id: string;
      name: string;
      label: string;
      year: number;
      type: string;
      created_at: number;
      updated_at: number;
      archived: number;
    }>(
      `SELECT * FROM robots ${whereClause} ORDER BY name`,
      []
    );

    return robots.map(robot => ({
      id: robot.id,
      name: robot.name,
      label: robot.label,
      year: robot.year,
      type: robot.type as any,
      created_at: robot.created_at,
      updated_at: robot.updated_at,
      archived: Boolean(robot.archived),
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les robots:', error);
    throw new RobotError('Erreur lors de la récupération de tous les robots', 'GET_ALL_ERROR');
  }
};

// Fonction pour restaurer un robot archivé
export const restoreRobot = async (id: string): Promise<void> => {
  try {
    const db = await getDatabase();
    
    // Vérifier que le robot existe
    const existingRobot = await getRobotById(id);
    if (!existingRobot) {
      throw new RobotError('Robot introuvable', 'NOT_FOUND');
    }

    const now = Date.now();
    await db.runAsync(
      'UPDATE robots SET archived = 0, updated_at = ? WHERE id = ?',
      [now, id]
    );
  } catch (error) {
    if (error instanceof RobotError) {
      throw error;
    }
    console.error('Erreur lors de la restauration du robot:', error);
    throw new RobotError('Erreur lors de la restauration du robot', 'RESTORE_ERROR');
  }
};

/**
 * Supprime définitivement tous les robots marqués comme archivés (archived: true).
 * @returns Le nombre d'enregistrements supprimés.
 */
export const permanentlyDeleteArchivedRobots = async (): Promise<number> => {
  try {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM robots WHERE archived = 1');
    return result.changes ?? 0;
  } catch (error) {
    console.error('Erreur lors de la suppression définitive des robots archivés:', error);
    throw new RobotError('Erreur lors de la suppression définitive des robots archivés', 'PERMANENT_DELETE_ERROR');
  }
};

// Fonction pour obtenir des statistiques
export const getRobotStats = async (): Promise<{
  total: number;
  active: number;
  archived: number;
  byType: Record<string, number>;
}> => {
  try {
    const db = await getDatabase();
    
    const totalResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM robots');
    const activeResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM robots WHERE archived = 0');
    const archivedResult = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM robots WHERE archived = 1');
    
    const typeResults = await db.getAllAsync<{ type: string; count: number }>(
      'SELECT type, COUNT(*) as count FROM robots WHERE archived = 0 GROUP BY type'
    );

    const byType = typeResults.reduce((acc, row) => {
      acc[row.type] = row.count;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: totalResult?.count || 0,
      active: activeResult?.count || 0,
      archived: archivedResult?.count || 0,
      byType,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    throw new RobotError('Erreur lors de la récupération des statistiques', 'STATS_ERROR');
  }
};