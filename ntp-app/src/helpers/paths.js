export const PATHS = {
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  
  // Main routes
  DASHBOARD: '/',
  CUSTOMERS: {
    LIST: '/customers',
    NEW: '/customers/new',
    DETAIL: '/customers/:id',
    EDIT: '/customers/:id/edit'
  },
  CONTRACTS: '/contracts',
  PRODUCTS: {
    LIST: '/products',
    NEW: '/products/new',
    DETAIL: '/products/:id',
    EDIT: '/products/:id/edit'
  },
  TASKS: '/tasks',
  EMPLOYEES: '/employees',
  FINANCES: '/finances',
  SETTINGS: '/settings',
  APPOINTMENTS: {
    TODAY: '/appointments'
  }
}