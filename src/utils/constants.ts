export const USER_ROLES = {
  BECARIO: 'INTERN',
  FACILITADOR: 'FACILITATOR',
  ADMIN: 'ADMIN'
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password'
  },
  BECARIO: {
    HOME: '/becario',
    ACTIVIDADES: '/becario/actividades',
    BECAS: '/becario/becas',
    PERFIL: '/becario/perfil',
    DOCUMENTOS: '/becario/documentos',
    CAPACITACION: '/becario/capacitacion',
    HISTORIAS_EXITO: '/becario/historias-exito'
  },
  FACILITADOR: {
    HOME: '/facilitador',
    BECARIOS: '/facilitador/becarios',
    REPORTES: '/facilitador/reportes',
    CAPACITACIONES: '/facilitador/capacitaciones',
    PERFIL: '/facilitador/perfil'
  },
  ADMIN: {
    HOME: '/admin',
    USUARIOS: '/admin/usuarios',
    REPORTES: '/admin/reportes',
    CONFIGURACION: '/admin/configuracion'
  }
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh'
  },
  USERS: '/users',
  INTERNS: '/interns',
  DOCUMENTS: '/documents',
  REPORTS: '/reports',
  REGIONS: '/regions',
  SUBPROJECTS: '/subprojects'
} as const;