// API Configuration
export const API_CONFIG = {
  // HOST: 'https://mediumspringgreen-wolf-274309.hostingersite.com/', // TODO: Update with actual domain
  HOST: 'http://localhost/mb', // TODO: Update with actual domain
  PREFIX: '/wp-json',
  VERSION: '/mb/v1',
  PATH: {
    // Customer paths
    CUSTOMERS: '/customer',
    APPOINTMENTS: '/appointment',
    USERS: '/user',
    PRODUCT: '/product',
    TASK: '/task',
    CONTRACT: '/contract',
  }
}

// Combine parts to create full URLs
const createUrl = (path) => {
  return `${API_CONFIG.HOST}${API_CONFIG.PREFIX}${API_CONFIG.VERSION}${path}`
}

export const URLs = {
  AUTH: {
    LOGIN: `${API_CONFIG.HOST}${API_CONFIG.PREFIX}/jwt-auth/v1/token`,
    VALIDATE: `${API_CONFIG.HOST}${API_CONFIG.PREFIX}/jwt-auth/v1/token/validate`,
  },

  CUSTOMERS: {
    // Main customer endpoints
    LIST: createUrl(API_CONFIG.PATH.CUSTOMERS),
    CREATE: createUrl(API_CONFIG.PATH.CUSTOMERS),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
    ASSIGN: createUrl(`${API_CONFIG.PATH.CUSTOMERS}/assign`),
    DETAIL: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
    HISTORY: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/history/${id}`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
    SELECT: createUrl(`${API_CONFIG.PATH.CUSTOMERS}/select`),
  },

  APPOINTMENTS: {
    LIST: createUrl(API_CONFIG.PATH.APPOINTMENTS),
    CREATE: createUrl(API_CONFIG.PATH.APPOINTMENTS),
    ASSIGN: (id) => createUrl(`${API_CONFIG.PATH.APPOINTMENTS}/${id}/assign`),
    COMPLETE: (id) => createUrl(`${API_CONFIG.PATH.APPOINTMENTS}/${id}/completed`),
  },

  USERS: {
    GET_BY_ROLE: createUrl(`${API_CONFIG.PATH.USERS}/role`),
    LIST: createUrl(API_CONFIG.PATH.USERS),
    CREATE: createUrl(API_CONFIG.PATH.USERS),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.USERS}/${id}`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.USERS}/${id}`),
  },

  PRODUCTS: {
    LIST: createUrl(API_CONFIG.PATH.PRODUCT),
    CREATE: createUrl(API_CONFIG.PATH.PRODUCT),
    DETAIL: (id) => createUrl(`${API_CONFIG.PATH.PRODUCT}/${id}`),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.PRODUCT}/${id}`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.PRODUCT}/${id}`),
    HISTORY: (id) => createUrl(`${API_CONFIG.PATH.PRODUCT}/${id}/history`),
    CHECK: (id) => createUrl(`${API_CONFIG.PATH.PRODUCT}/${id}/check`),
  },

  TASKS: {
    LIST: createUrl(API_CONFIG.PATH.TASK),
    CREATE: createUrl(API_CONFIG.PATH.TASK),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.TASK}/${id}`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.TASK}/${id}`),
    COMMENT: (id) => createUrl(`${API_CONFIG.PATH.TASK}/${id}/comment`),
    UPDATE_STATUS: (id) => createUrl(`${API_CONFIG.PATH.TASK}/${id}/status`),
  },

  CONTRACTS: {
    LIST: createUrl(API_CONFIG.PATH.CONTRACT),
    CREATE: createUrl(API_CONFIG.PATH.CONTRACT),
    DETAIL: (id) => createUrl(`${API_CONFIG.PATH.CONTRACT}/${id}`),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.CONTRACT}/${id}`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.CONTRACT}/${id}`),
  },

  FINANCE: {
    LIST: '/mb/v1/finance',
    CREATE: '/mb/v1/finance',
    UPDATE: (id) => `/mb/v1/finance/${id}`,
    DELETE: (id) => `/mb/v1/finance/${id}`,
    DETAIL: (id) => `/mb/v1/finance/${id}`,
  },
}

// Usage examples:
/*
// Get all customers
fetch(URLs.CUSTOMERS.LIST)

// Get customer detail
fetch(URLs.CUSTOMERS.DETAIL(123))

// Create customer
fetch(URLs.CUSTOMERS.CREATE, {
  method: 'POST',
  body: JSON.stringify(customerData)
})

// Update customer
fetch(URLs.CUSTOMERS.UPDATE(123), {
  method: 'PUT',
  body: JSON.stringify(updateData)
})

// Get customer history
fetch(URLs.CUSTOMERS.HISTORY(123))

// Get today's appointments
fetch(URLs.APPOINTMENTS.TODAY)

// Take appointment
fetch(URLs.APPOINTMENTS.TAKE(123), {
  method: 'PUT'
})
*/ 