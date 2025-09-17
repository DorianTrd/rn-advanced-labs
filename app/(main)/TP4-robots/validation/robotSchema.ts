import * as Yup from 'yup';

export const robotTypes = [
  'industrial',
  'service',
  'medical',
  'educational',
  'other',
] as const;
export type RobotType = typeof robotTypes[number];

export const robotSchema = Yup.object({
  name: Yup.string().min(2, 'Min 2 caractères').required('Nom obligatoire'),
  label: Yup.string().min(3, 'Min 3 caractères').required('Label obligatoire'),
  year: Yup.number()
    .integer('Année entière')
    .min(1950, 'Année ≥ 1950')
    .max(new Date().getFullYear(), `Année ≤ ${new Date().getFullYear()}`)
    .required('Année obligatoire'),
  type: Yup.mixed<RobotType>().oneOf(robotTypes).required('Type obligatoire'),
});
