// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ACCOUNT: '/account',
  ORDERS: '/orders',
  INVOICES: (orderId) => `/invoices/${orderId}`,
};
