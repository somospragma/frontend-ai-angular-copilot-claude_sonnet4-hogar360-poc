export const VALIDATION_RULES = {
  // User validation
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DOCUMENT_MAX_LENGTH: 20,
  PHONE_MAX_LENGTH: 13,
  PASSWORD_MIN_LENGTH: 8,
  
  // Category validation
  CATEGORY_NAME_MAX_LENGTH: 50,
  CATEGORY_DESCRIPTION_MAX_LENGTH: 90,
  
  // Location validation
  LOCATION_NAME_MAX_LENGTH: 50,
  LOCATION_DESCRIPTION_MAX_LENGTH: 120,
  
  // Property validation
  PROPERTY_NAME_MAX_LENGTH: 100,
  PROPERTY_DESCRIPTION_MAX_LENGTH: 500,
  MIN_ROOMS: 1,
  MAX_ROOMS: 10,
  MIN_BATHROOMS: 1,
  MAX_BATHROOMS: 10,
  MIN_PRICE: 1,
  MAX_PRICE: 999999999,
  
  // Visit schedule validation
  MAX_WEEKS_AHEAD: 3,
  MAX_VISITORS_PER_SCHEDULE: 2,
} as const;

export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  DOCUMENT: /^\d+$/,
  NAME: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
} as const;
