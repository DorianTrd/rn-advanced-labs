-- Migration 003: Ajout de la colonne archived pour le soft delete
-- Version: 3

-- Ajout de la colonne archived avec valeur par défaut false (0)
ALTER TABLE robots ADD COLUMN archived INTEGER NOT NULL DEFAULT 0;

-- Index sur archived pour filtrer les robots actifs
CREATE INDEX IF NOT EXISTS idx_robots_archived ON robots(archived);

-- Index composite pour les requêtes fréquentes (robots actifs triés par nom)
CREATE INDEX IF NOT EXISTS idx_robots_active_name ON robots(name) WHERE archived = 0;
