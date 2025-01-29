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
  CONTRACTS: {
    LIST: '/contracts',
    NEW: '/contracts/new',
    DETAIL: '/contracts/:id',
    EDIT: '/contracts/:id/edit'
  },
  PRODUCTS: {
    LIST: '/products',
    NEW: '/products/new',
    DETAIL: '/products/:id',
    EDIT: '/products/:id/edit'
  },
  TASKS: {
    LIST: '/tasks',
    NEW: '/tasks/new',
    DETAIL: '/tasks/:id',
    EDIT: '/tasks/:id/edit'
  },
  EMPLOYEES: {
    LIST: "/employees",
    DETAIL: "/employees/:id",
  },
  FINANCES: '/finances',
  SETTINGS: '/settings',
  APPOINTMENTS: {
    TODAY: '/appointments'
  },
  FINANCE: {
    LIST: '/finance',
  },
}