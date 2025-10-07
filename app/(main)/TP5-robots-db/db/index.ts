import * as SQLite from 'expo-sqlite';

// Interface pour les migrations
interface Migration {
  version: number;
  filename: string;
  sql: string;
}

// Instance de la base de données
let db: SQLite.SQLiteDatabase | null = null;

// Fonction pour ouvrir la base de données
export const openDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) {
    return db;
  }

  try {
    db = await SQLite.openDatabaseAsync('robots.db');
    
    // Exécuter les migrations au démarrage
    await runMigrations(db);
    
    return db;
  } catch (error) {
    console.error('Erreur lors de l\'ouverture de la base de données:', error);
    throw error;
  }
};

// Fonction pour obtenir la version actuelle de la base
const getCurrentVersion = async (database: SQLite.SQLiteDatabase): Promise<number> => {
  try {
    const result = await database.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    return result?.user_version || 0;
  } catch (error) {
    console.error('Erreur lors de la récupération de la version:', error);
    return 0;
  }
};

// Fonction pour définir la version de la base
const setVersion = async (database: SQLite.SQLiteDatabase, version: number): Promise<void> => {
  try {
    await database.execAsync(`PRAGMA user_version = ${version}`);
  } catch (error) {
    console.error('Erreur lors de la définition de la version:', error);
    throw error;
  }
};

// Fonction pour charger les migrations
const loadMigrations = async (): Promise<Migration[]> => {
  const migrations: Migration[] = [
    {
      version: 1,
      filename: '001_init.sql',
      sql: `CREATE TABLE IF NOT EXISTS robots (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL,
        year INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('industrial', 'service', 'medical', 'educational', 'other')),
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`
    },
    {
      version: 2,
      filename: '002_add_indexes.sql',
      sql: `CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);
            CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);
            CREATE INDEX IF NOT EXISTS idx_robots_created_at ON robots(created_at);
            CREATE INDEX IF NOT EXISTS idx_robots_updated_at ON robots(updated_at);`
    },
    {
      version: 3,
      filename: '003_add_archived.sql',
      sql: `ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;
            CREATE INDEX IF NOT EXISTS idx_robots_archived ON robots(archived);
            CREATE INDEX IF NOT EXISTS idx_robots_active_name ON robots(name) WHERE archived = 0;`
    }
  ];

  return migrations;
};

// Fonction pour exécuter les migrations
const runMigrations = async (database: SQLite.SQLiteDatabase): Promise<void> => {
  try {
    const currentVersion = await getCurrentVersion(database);
    const migrations = await loadMigrations();
    
    // Trier les migrations par version
    const pendingMigrations = migrations
      .filter(migration => migration.version > currentVersion)
      .sort((a, b) => a.version - b.version);

    console.log(`Version actuelle: ${currentVersion}, Migrations en attente: ${pendingMigrations.length}`);

    // Exécuter chaque migration en attente
    for (const migration of pendingMigrations) {
      console.log(`Exécution de la migration ${migration.filename} (version ${migration.version})`);
      
      // Exécuter la migration dans une transaction
      await database.withTransactionAsync(async () => {
        await database.execAsync(migration.sql);
        await setVersion(database, migration.version);
      });
      
      console.log(`Migration ${migration.filename} exécutée avec succès`);
    }

    console.log('Toutes les migrations ont été exécutées');
  } catch (error) {
    console.error('Erreur lors de l\'exécution des migrations:', error);
    throw error;
  }
};

// Fonction pour fermer la base de données
export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.closeAsync();
    db = null;
  }
};

// Fonction pour obtenir l'instance de la base de données (à utiliser dans les repositories)
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  return await openDatabase();
};

// Export par défaut
export default { openDatabase, closeDatabase, getDatabase };
