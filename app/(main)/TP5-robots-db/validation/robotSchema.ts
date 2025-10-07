import * as yup from 'yup';

// Types pour les robots
export type RobotType = 'industrial' | 'service' | 'medical' | 'educational' | 'other';

export interface Robot {
  id: string;
  name: string;
  label: string;
  year: number;
  type: RobotType;
  created_at: number;
  updated_at: number;
  archived: boolean;
}

export interface RobotInput {
  name: string;
  label: string;
  year: number;
  type: RobotType;
}

export interface RobotUpdate {
  name?: string;
  label?: string;
  year?: number;
  type?: RobotType;
}

// Options pour les types de robots
export const robotTypes: { value: RobotType; label: string }[] = [
  { value: 'industrial', label: 'Industriel' },
  { value: 'service', label: 'Service' },
  { value: 'medical', label: 'Médical' },
  { value: 'educational', label: 'Éducatif' },
  { value: 'other', label: 'Autre' },
];

// Schéma de validation pour la création d'un robot
export const robotCreateSchema = yup.object({
  name: yup
    .string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  label: yup
    .string()
    .required('Le label est requis')
    .min(3, 'Le label doit contenir au moins 3 caractères')
    .max(100, 'Le label ne peut pas dépasser 100 caractères')
    .trim(),
  year: yup
    .number()
    .required('L\'année est requise')
    .integer('L\'année doit être un nombre entier')
    .min(1950, 'L\'année doit être supérieure ou égale à 1950')
    .max(new Date().getFullYear(), `L\'année ne peut pas dépasser ${new Date().getFullYear()}`),
  type: yup
    .string()
    .required('Le type est requis')
    .oneOf(['industrial', 'service', 'medical', 'educational', 'other'], 'Type de robot invalide'),
});

// Schéma de validation pour la mise à jour d'un robot
export const robotUpdateSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .trim(),
  label: yup
    .string()
    .min(3, 'Le label doit contenir au moins 3 caractères')
    .max(100, 'Le label ne peut pas dépasser 100 caractères')
    .trim(),
  year: yup
    .number()
    .integer('L\'année doit être un nombre entier')
    .min(1950, 'L\'année doit être supérieure ou égale à 1950')
    .max(new Date().getFullYear(), `L\'année ne peut pas dépasser ${new Date().getFullYear()}`),
  type: yup
    .string()
    .oneOf(['industrial', 'service', 'medical', 'educational', 'other'], 'Type de robot invalide'),
}).test(
  'at-least-one-field',
  'Au moins un champ doit être fourni pour la mise à jour',
  function (value) {
    return Object.values(value).some(val => val !== undefined);
  }
);

// Schéma pour les options de liste (filtres et tri)
export interface ListOptions {
  q?: string; // recherche textuelle
  sort?: 'name' | 'year' | 'created_at' | 'updated_at';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeArchived?: boolean;
}

export const listOptionsSchema = yup.object({
  q: yup.string().trim(),
  sort: yup.string().oneOf(['name', 'year', 'created_at', 'updated_at']),
  order: yup.string().oneOf(['asc', 'desc']),
  limit: yup.number().integer().min(1).max(100),
  offset: yup.number().integer().min(0),
  includeArchived: yup.boolean(),
});

// Fonction utilitaire pour valider les données d'entrée
export const validateRobotInput = async (data: unknown): Promise<RobotInput> => {
  return await robotCreateSchema.validate(data, { abortEarly: false }) as RobotInput;
};

// Fonction utilitaire pour valider les données de mise à jour
export const validateRobotUpdate = async (data: unknown): Promise<RobotUpdate> => {
  return await robotUpdateSchema.validate(data, { abortEarly: false }) as RobotUpdate;
};

// Fonction utilitaire pour valider les options de liste
export const validateListOptions = async (data: unknown): Promise<ListOptions> => {
  return await listOptionsSchema.validate(data, { abortEarly: false }) as ListOptions;
};
