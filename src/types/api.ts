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

export interface Report {
  id: string;
  title: string;
  description?: string;
  type?: string;
  id_archive?: string;
  created_at: string;
  created_by: string;
  status_id?: string;
  school_year_id?: string;
}

export interface Intern {
  id: string;
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

export interface UserApi {
  id: string;
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
