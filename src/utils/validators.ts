import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Contraseña debe tener al menos 6 caracteres'),
});

export const reporteSchema = z.object({
  titulo: z.string().min(1, 'Título es requerido'),
  descripcion: z.string().min(10, 'Descripción debe tener al menos 10 caracteres'),
  periodo: z.string(),
  evidencias: z.array(z.instanceof(File)).optional(),
});

export const profileSchema = z.object({
  firstName: z.string().min(1, 'Nombre es requerido'),
  lastName: z.string().min(1, 'Apellido es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ReporteFormData = z.infer<typeof reporteSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;