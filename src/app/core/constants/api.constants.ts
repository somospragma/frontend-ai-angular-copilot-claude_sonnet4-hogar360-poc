export const API_CONFIG = {
  BASE_URL: 'http://localhost:3000/api', // Cambiar por la URL del backend
  VERSION: 'v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
  LOGOUT: '/auth/logout',
  
  // Users
  USERS: '/users',
  USER_PROFILE: '/users/profile',
  CREATE_SELLER: '/users/sellers',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Locations
  DEPARTMENTS: '/departments',
  CITIES: '/cities',
  LOCATIONS: '/locations',
  SEARCH_LOCATIONS: '/locations/search',
  
  // Properties
  PROPERTIES: '/properties',
  MY_PROPERTIES: '/properties/mine',
  
  // Visit Schedules
  VISIT_SCHEDULES: '/visit-schedules',
  AVAILABLE_SCHEDULES: '/visit-schedules/available',
  
  // Scheduled Visits
  SCHEDULED_VISITS: '/scheduled-visits',
} as const;
