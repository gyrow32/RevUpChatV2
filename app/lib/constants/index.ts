// API endpoints
export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  VEHICLES: '/api/vehicles',
  AUTH: '/api/auth',
} as const;

// UI constants
export const UI_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 1000,
  TYPING_INDICATOR_DELAY: 1000,
  MESSAGE_ANIMATION_DURATION: 300,
} as const;

// Theme constants
export const THEME = {
  COLORS: {
    PRIMARY: '#3B82F6', // blue-500
    SECONDARY: '#6B7280', // gray-500
    SUCCESS: '#10B981', // emerald-500
    ERROR: '#EF4444', // red-500
    WARNING: '#F59E0B', // amber-500
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
} as const;

// Animation constants
export const ANIMATIONS = {
  DURATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  EASING: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    LINEAR: 'linear',
    IN: 'cubic-bezier(0.4, 0, 1, 1)',
    OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  },
} as const; 