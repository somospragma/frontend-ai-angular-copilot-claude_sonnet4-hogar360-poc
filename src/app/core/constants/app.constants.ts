export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  LANDING: '/landing',
  PROPERTIES: '/propiedades',
  PROPERTY_DETAIL: '/propiedades/:id',
  VISIT_SCHEDULES: '/horarios-disponibles',
  
  // Protected routes
  DASHBOARD: '/dashboard',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CATEGORIES: '/admin/categorias',
  ADMIN_LOCATIONS: '/admin/ubicaciones',
  ADMIN_USERS: '/admin/usuarios-vendedores',
  ADMIN_PROPERTIES: '/admin/propiedades',
  ADMIN_SETTINGS: '/admin/configuracion',
  
  // Seller routes
  SELLER_DASHBOARD: '/vendedor/dashboard',
  SELLER_PROPERTIES: '/vendedor/propiedades',
  SELLER_SCHEDULES: '/vendedor/horarios-visitas',
  
  // Buyer routes
  BUYER_DASHBOARD: '/comprador/dashboard',
  BUYER_VISITS: '/comprador/visitas',
  BUYER_SCHEDULE_VISIT: '/comprador/agendar-visita',
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 1,
  LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

export const MESSAGES = {
  SUCCESS: {
    LOGIN: 'Inicio de sesión exitoso',
    LOGOUT: 'Sesión cerrada exitosamente',
    CREATED: 'Creado exitosamente',
    UPDATED: 'Actualizado exitosamente',
    DELETED: 'Eliminado exitosamente',
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión',
    UNAUTHORIZED: 'No autorizado',
    FORBIDDEN: 'Acceso denegado',
    NOT_FOUND: 'Recurso no encontrado',
    VALIDATION: 'Datos inválidos',
  },
  CONFIRMATION: {
    DELETE: '¿Está seguro de que desea eliminar este elemento?',
    LOGOUT: '¿Está seguro de que desea cerrar sesión?',
  },
} as const;
