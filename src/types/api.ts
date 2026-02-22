export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

interface BaseEntity {
  id: string;
}

interface BaseNamedEntity extends BaseEntity {
  title: string;
  description?: string;
}

interface BaseAuditedEntity extends BaseEntity {
  created_by: string;
  created_at: string;
  school_year_id?: string;
  status_id?: string;
}

interface BaseStatusEntity extends BaseEntity {
  status_id?: string;
}

export const Status = {
  '36b08c13-fa5a-4761-a040-811f6e571b11': "INACTIVO",
  '4f58dd2d-e305-4f60-9f90-b65deb048a2b': "ELIMINADO",
  'dfbac22b-3f2b-4d7f-9dde-21159ebd8d06': "ACTIVO",
} as const;

export type Status = typeof Status[keyof typeof Status];

export enum DocumentType {
  CEDULA = "CEDULA",
  CERTIFICADO_ESTUDIOS = "CERTIFICADO_ESTUDIOS",
  CARTA_ACEPTACION = "CARTA_ACEPTACION",
  FOTO = "FOTO",
}

export enum ReportType {
  ACTIVIDADES = "ACTIVIDADES",
  BECAS = "BECAS",
  CAPACITACION = "CAPACITACION",
}

export interface Report extends BaseNamedEntity, BaseAuditedEntity {
  type?: string;
  id_archive?: string;
}

export interface Intern extends BaseEntity {
  chid: string;
  id_user: string;
  status: boolean;
  address?: string;
  education_level?: string;
  career_name?: string;
  grade?: string;
  name_tutor?: string;
  service?: string;
  documentation?: string;
  id_subproject?: string;
  id_social_facilitator?: string;
  start_date?: string;
  end_date?: string;
  status_id?: string;
  school_year_id?: string;
}

export interface Subproject extends BaseEntity {
  name_subproject: string;
  id_region?: string;
  region_id?: string;
  status_id?: string;
  coordinator_id?: string;
  social_facilitator_id?: string;
  school_year_id?: string;
}

export interface Coordinator extends BaseStatusEntity {
  id_user: string;
  id_region: string;
}

export interface Document extends BaseNamedEntity {
  internId: string;
  id_archive: string;
  school_year_id?: string;
  status_id?: string;
}

export interface EventPhoto extends BaseEntity {
  id_event: string;
  id_photo: string;
}

export interface Event extends BaseNamedEntity, BaseAuditedEntity {}

export interface Photo extends BaseNamedEntity {
  id_archive: string;
}

export interface Format extends BaseNamedEntity {
  id_archive: string;
}

export interface SchoolYear extends BaseEntity {
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export interface SocialFacilitator extends BaseStatusEntity {
  id_user: string;
  id_region: string;
  status_id?: string;
}

export interface SuccessStory extends BaseNamedEntity, BaseAuditedEntity {
  id_photo?: string;
}

export interface TrainingProgress extends BaseEntity {
  id_training: string;
  id_user: string;
  completed: boolean;
  progress_percentage: number;
  completed_at?: string;
  last_viewed_at?: string;
}

export interface Training extends BaseNamedEntity {
  target_audience?: string;
  school_year_id?: string;
  status_id?: string;
  url: string;
  tiempo: string;
}

export interface Region extends BaseStatusEntity {
  name_region?: string;
  name?: string;
}

export interface UserApi extends BaseEntity {
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  profile_photo_id?: string;
  status_id?: string;
  created_at?: string;
}

export interface SignedUrlResponse {
  signed_url: string;
  expires_in: number;
}
