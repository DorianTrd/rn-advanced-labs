-- Migration 001: Initialisation de la table robots
-- Version: 1

CREATE TABLE IF NOT EXISTS robots (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    label TEXT NOT NULL,
    year INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('industrial', 'service', 'medical', 'educational', 'other')),
    created_at INTEGER NOT NULL,
    updated_at INTEGER NOT NULL
);

-- Vérification des contraintes
-- name: min 2 caractères, unique
-- label: min 3 caractères  
-- year: entre 1950 et année courante
