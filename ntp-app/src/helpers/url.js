// API Configuration
export const API_CONFIG = {
  HOST: 'http://localhost/testapp', // TODO: Update with actual domain
  PREFIX: '/wp-json',
  VERSION: '/mb/v1',
  PATH: {
    // Customer paths
    CUSTOMERS: '/customers',
    APPOINTMENTS: '/appointments',
    USERS: '/user',
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
    ASSIGN: createUrl(`${API_CONFIG.PATH.CUSTOMERS}/assign`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
  },

  USERS: {
    GET_BY_ROLE: (role) => createUrl(`${API_CONFIG.PATH.USERS}/role/${role}`)
  }
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