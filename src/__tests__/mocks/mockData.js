// Mock data for testing

// Mock products
export const mockProducts = [
  {
    _id: '1',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam, dan sayuran',
    price: 25000,
    image_url: 'nasi-goreng.jpg',
    category: {
      _id: '1',
      name: 'mainDish'
    },
    tags: [
      { _id: '1', name: 'Pedas' },
      { _id: '2', name: 'Populer' }
    ]
  },
  {
    _id: '2',
    name: 'Mie Goreng',
    description: 'Mie goreng dengan telur dan sayuran',
    price: 22000,
    image_url: 'mie-goreng.jpg',
    category: {
      _id: '1',
      name: 'mainDish'
    },
    tags: [
      { _id: '1', name: 'Pedas' }
    ]
  },
  {
    _id: '3',
    name: 'Es Teh Manis',
    description: 'Teh manis dingin',
    price: 8000,
    image_url: 'es-teh.jpg',
    category: {
      _id: '3',
      name: 'drinks'
    },
    tags: [
      { _id: '3', name: 'Minuman' }
    ]
  }
];

// Mock categories
export const mockCategories = [
  { _id: '1', name: 'mainDish', originalName: 'mainDish' },
  { _id: '2', name: 'snacks', originalName: 'snacks' },
  { _id: '3', name: 'drinks', originalName: 'drinks' },
  { _id: '4', name: 'pastry', originalName: 'pastry' }
];

// Mock tags
export const mockTags = [
  { _id: '1', name: 'Pedas' },
  { _id: '2', name: 'Populer' },
  { _id: '3', name: 'Minuman' },
  { _id: '4', name: 'Dessert' },
  { _id: '5', name: 'Vegetarian' }
];

// Mock user
export const mockUser = {
  _id: '1',
  full_name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
};

// Mock cart items
export const mockCartItems = [
  {
    _id: '1',
    product: {
      _id: '1',
      name: 'Nasi Goreng Spesial',
      price: 25000,
      image_url: 'nasi-goreng.jpg'
    },
    qty: 2
  },
  {
    _id: '2',
    product: {
      _id: '3',
      name: 'Es Teh Manis',
      price: 8000,
      image_url: 'es-teh.jpg'
    },
    qty: 1
  }
];

// Mock orders
export const mockOrders = [
  {
    _id: '1',
    status: 'waiting_payment',
    order_number: 'ORD-001',
    order_items: [
      {
        _id: '1',
        name: 'Nasi Goreng Spesial',
        price: 25000,
        qty: 2
      }
    ],
    delivery_fee: 10000,
    delivery_address: {
      provinsi: 'DKI Jakarta',
      kabupaten: 'Jakarta Selatan',
      kecamatan: 'Pancoran',
      kelurahan: 'Kalibata',
      detail: 'Jl. Kalibata Utara No. 10'
    },
    total: 60000,
    user: {
      _id: '1',
      full_name: 'John Doe'
    },
    createdAt: '2023-01-01T10:00:00.000Z'
  }
];
