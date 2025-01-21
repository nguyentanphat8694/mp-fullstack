// API Configuration
export const API_CONFIG = {
  HOST: 'http://localhost/testapp', // TODO: Update with actual domain
  PREFIX: '/wp-json',
  VERSION: '/mb/v1',
  PATH: {
    // Customer paths
    CUSTOMERS: '/customers',
    APPOINTMENTS: '/appointments',
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
    DETAIL: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
    CREATE: createUrl(API_CONFIG.PATH.CUSTOMERS),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
    DELETE: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}`),
    
    // Customer history
    HISTORY: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}/history`),
    
    // Customer assignment
    ASSIGN: (id) => createUrl(`${API_CONFIG.PATH.CUSTOMERS}/${id}/assign`),
    
    // Customer filters
    BY_SOURCE: createUrl(`${API_CONFIG.PATH.CUSTOMERS}/by-source`),
  },

  // Appointment URLs
  APPOINTMENTS: {
    // Main appointment endpoints
    LIST: createUrl(API_CONFIG.PATH.APPOINTMENTS),
    CREATE: createUrl(API_CONFIG.PATH.APPOINTMENTS),
    UPDATE: (id) => createUrl(`${API_CONFIG.PATH.APPOINTMENTS}/${id}`),
    
    // Special appointment endpoints
    TODAY: createUrl(`${API_CONFIG.PATH.CUSTOMERS}/appointments/today`),
    TAKE: (id) => createUrl(`${API_CONFIG.PATH.APPOINTMENTS}/${id}/take`),
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