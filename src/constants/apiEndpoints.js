// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  ME: '/auth/me',
  
  // Product endpoints
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: (id) => `/api/products/${id}`,
  
  // Category endpoints
  CATEGORIES: '/api/categories',
  
  // Tag endpoints
  TAGS: '/api/tags',
  
  // Cart endpoints
  CARTS: '/api/carts',
  
  // Order endpoints
  ORDERS: '/api/orders',
  ORDER_DETAIL: (id) => `/api/orders/${id}`,
  
  // Address endpoints
  ADDRESSES: '/api/delivery-addresses',
  
  // Ping endpoint
  PING: '/api/ping'
};
