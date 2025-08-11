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
  details?: any;
}

export enum DocumentType {
  CEDULA = 'CEDULA',
  CERTIFICADO_ESTUDIOS = 'CERTIFICADO_ESTUDIOS',
  CARTA_ACEPTACION = 'CARTA_ACEPTACION',
  FOTO = 'FOTO'
}

export enum ReportType {
  ACTIVIDADES = 'ACTIVIDADES',
  BECAS = 'BECAS',
  CAPACITACION = 'CAPACITACION'
}