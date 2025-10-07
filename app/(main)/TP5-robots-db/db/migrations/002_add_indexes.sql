-- Migration 002: Ajout d'index pour optimiser les requêtes
-- Version: 2

-- Index sur le nom pour les recherches et l'unicité
CREATE INDEX IF NOT EXISTS idx_robots_name ON robots(name);

-- Index sur l'année pour les tris et filtres
CREATE INDEX IF NOT EXISTS idx_robots_year ON robots(year);

-- Index sur la date de création pour les tris chronologiques
CREATE INDEX IF NOT EXISTS idx_robots_created_at ON robots(created_at);

-- Index sur la date de mise à jour pour le suivi des modifications
CREATE INDEX IF NOT EXISTS idx_robots_updated_at ON robots(updated_at);
