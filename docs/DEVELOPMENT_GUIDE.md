# Panduan Pengembangan

Dokumen ini berisi panduan pengembangan untuk project Eduwork E-Commerce.

## Persiapan Lingkungan Pengembangan

### Prasyarat

- Node.js (versi 14.x atau lebih tinggi)
- npm (versi 6.x atau lebih tinggi) atau yarn (versi 1.22.x atau lebih tinggi)
- MongoDB (versi 4.x atau lebih tinggi)
- Git

### Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/username/eduwork-ecommerce.git
   cd eduwork-ecommerce
   ```

2. Instal dependencies untuk client:
   ```bash
   cd eduwork-client
   npm install
   ```

3. Instal dependencies untuk server:
   ```bash
   cd ../eduwork-server
   npm install
   ```

4. Buat file `.env` di direktori `eduwork-client`:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_STORAGE_URL=http://localhost:3000/uploads
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENV=development
   REACT_APP_DEBUG=true
   ```

5. Buat file `.env` di direktori `eduwork-server`:
   ```
   PORT=3000
   DATABASE_URL=mongodb://localhost:27017/eduwork
   SECRET_KEY=your_secret_key
   DEBUG=true
   ```

### Menjalankan Aplikasi

1. Jalankan server:
   ```bash
   cd eduwork-server
   npm run dev
   ```

2. Jalankan client:
   ```bash
   cd eduwork-client
   npm start
   ```

3. Buka aplikasi di browser:
   ```
   http://localhost:3001
   ```

## Struktur Kode

### Konvensi Penamaan

- **Komponen**: PascalCase (contoh: `ProductCard.jsx`)
- **File JavaScript**: camelCase (contoh: `formatPrice.js`)
- **File CSS**: kebab-case (contoh: `product-card.css`)
- **Konstanta**: UPPER_SNAKE_CASE (contoh: `API_ENDPOINTS.js`)
- **Variabel dan Fungsi**: camelCase (contoh: `handleSubmit`)
- **Folder**: kebab-case (contoh: `product-card`)

### Struktur Komponen

```jsx
// Import statements
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

/**
 * Deskripsi komponen
 * 
 * @component
 * @param {Object} props - Props komponen
 * @param {string} props.propName - Deskripsi prop
 * @returns {React.ReactElement} Komponen React
 */
function ComponentName({ propName }) {
  // State dan hooks
  const [state, setState] = useState(initialState);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Event logic
  };

  // Helper functions
  const helperFunction = () => {
    // Helper logic
  };

  // Render
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
}

// PropTypes
ComponentName.propTypes = {
  propName: PropTypes.string.isRequired,
};

// Default props
ComponentName.defaultProps = {
  propName: 'default value',
};

export default ComponentName;
```

### Struktur Custom Hook

```jsx
// Import statements
import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook untuk [deskripsi]
 * 
 * @param {any} param - Parameter hook
 * @returns {Object} Object berisi state dan methods
 */
function useCustomHook(param) {
  // State
  const [state, setState] = useState(initialState);

  // Callbacks
  const handleAction = useCallback(() => {
    // Action logic
  }, [dependencies]);

  // Effects
  useEffect(() => {
    // Effect logic
    return () => {
      // Cleanup logic
    };
  }, [dependencies]);

  // Return
  return {
    state,
    handleAction,
  };
}

export default useCustomHook;
```

## Panduan Styling

### CSS Modular

Aplikasi ini menggunakan pendekatan CSS modular dengan file CSS terpisah untuk setiap komponen atau fitur.

```css
/* buttons.css */
.btn {
  /* Base button styles */
}

.btn-primary {
  /* Primary button styles */
}

.btn-secondary {
  /* Secondary button styles */
}
```

### Variabel CSS

Gunakan variabel CSS untuk konsistensi desain.

```css
/* variables.css */
:root {
  /* Colors */
  --primary-color: #3498db;
  --secondary-color: #2ecc71;
  --neutral-900: #1a202c;
  --neutral-800: #2d3748;
  --neutral-700: #4a5568;
  --neutral-600: #718096;
  --neutral-500: #a0aec0;
  --neutral-400: #cbd5e0;
  --neutral-300: #e2e8f0;
  --neutral-200: #edf2f7;
  --neutral-100: #f7fafc;
  --neutral-50: #f9fafb;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;

  /* Font sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Font weights */
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Border radius */
  --border-radius-sm: 0.125rem;
  --border-radius-md: 0.25rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 1rem;
  --border-radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* Transitions */
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.3s ease-in-out;
  --transition-slow: 0.5s ease-in-out;

  /* Z-index */
  --z-index-dropdown: 1000;
  --z-index-sticky: 1020;
  --z-index-fixed: 1030;
  --z-index-modal-backdrop: 1040;
  --z-index-modal: 1050;
  --z-index-popover: 1060;
  --z-index-tooltip: 1070;
}
```

### Responsivitas

Gunakan media queries untuk responsivitas.

```css
/* Base styles */
.container {
  width: 100%;
  padding: var(--spacing-md);
}

/* Responsive styles */
@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}
```

## Panduan State Management

### Redux Toolkit

Aplikasi ini menggunakan Redux Toolkit untuk state management.

```jsx
// features/cart/cartSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

// Async thunk
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/carts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Reducers
  },
  extraReducers: (builder) => {
    // Extra reducers
  },
});

export const { actions } = cartSlice;
export default cartSlice.reducer;
```

### React Query

Aplikasi ini juga menggunakan React Query untuk data fetching.

```jsx
// hooks/useQueryProducts.js
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';
import { API_ENDPOINTS } from '../constants';
import { handleApiError } from '../utils/errorHandlers';

export const useQueryProducts = (options = {}) => {
  const {
    page = 1,
    tags = [],
    search = '',
    category = null,
    enabled = true,
  } = options;

  // Create a query key
  const queryKey = ['products', { page, tags, search, category }];

  // Define the query function
  const fetchProducts = async () => {
    try {
      const params = {
        skip: (page - 1) * 10,
        limit: 10,
      };

      // Add other params

      const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS, {
        params,
      });

      return {
        data: response.data.data,
        totalPages: response.data.totalPages || 1,
      };
    } catch (error) {
      throw handleApiError(error);
    }
  };

  // Use the useQuery hook
  return useQuery({
    queryKey,
    queryFn: fetchProducts,
    enabled,
    // Other options
  });
};

export default useQueryProducts;
```

## Panduan Error Handling

### Error Boundary

Gunakan Error Boundary untuk menangkap error yang terjadi pada komponen.

```jsx
// components/common/ErrorBoundary.jsx
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ErrorFallback from './ErrorFallback';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.logErrorToServer(error, errorInfo);
  }

  logErrorToServer(error, errorInfo) {
    // Implementation
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
```

### Error Handler

Gunakan custom hook untuk menangani error.

```jsx
// hooks/useErrorHandler.js
import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  
  const handleError = useCallback((err, fallbackMessage = 'Terjadi kesalahan. Silakan coba lagi.') => {
    console.error('Error caught by useErrorHandler:', err);
    
    // Determine error message based on error type
    let errorMessage = fallbackMessage;
    let errorTitle = 'Error';
    let errorDetails = null;
    
    // Error handling logic
    
    setError({
      title: errorTitle,
      message: errorMessage,
      details: errorDetails,
      timestamp: new Date().toISOString(),
      raw: err
    });
    
    // Log error to server if needed
    logErrorToServer(err, errorMessage);
    
    return errorMessage;
  }, []);
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
  return {
    error,
    handleError,
    clearError
  };
};

export default useErrorHandler;
```

## Panduan Testing

### Unit Testing

Gunakan Jest dan React Testing Library untuk unit testing.

```jsx
// __tests__/components/Button.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../../components/common/Button';

describe('Button', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies primary class when variant is primary', () => {
    render(<Button variant="primary">Click me</Button>);
    expect(screen.getByText('Click me')).toHaveClass('btn-primary');
  });
});
```

### Integration Testing

Gunakan Cypress untuk integration testing.

```jsx
// cypress/integration/login.spec.js
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('displays login form', () => {
    cy.get('form').should('exist');
    cy.get('input[name="email"]').should('exist');
    cy.get('input[name="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });

  it('shows error message with invalid credentials', () => {
    cy.get('input[name="email"]').type('invalid@example.com');
    cy.get('input[name="password"]').type('invalidpassword');
    cy.get('button[type="submit"]').click();
    cy.get('.form-error').should('be.visible');
  });

  it('redirects to home page with valid credentials', () => {
    cy.get('input[name="email"]').type('valid@example.com');
    cy.get('input[name="password"]').type('validpassword');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/');
  });
});
```

## Panduan Deployment

### Build

```bash
# Build client
cd eduwork-client
npm run build

# Build server
cd ../eduwork-server
npm run build
```

### Deployment ke Production

1. Deploy server:
   ```bash
   cd eduwork-server
   npm run deploy
   ```

2. Deploy client:
   ```bash
   cd eduwork-client
   npm run deploy
   ```

### Environment Variables

Pastikan environment variables sudah dikonfigurasi dengan benar di production.

## Panduan Kontribusi

1. Fork repository
2. Buat branch baru:
   ```bash
   git checkout -b feature/nama-fitur
   ```
3. Commit perubahan:
   ```bash
   git commit -m "feat: tambah fitur baru"
   ```
4. Push ke branch:
   ```bash
   git push origin feature/nama-fitur
   ```
5. Buat pull request

### Konvensi Commit

Gunakan konvensi commit berikut:

- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Perubahan yang tidak mempengaruhi kode (formatting, missing semi colons, etc)
- `refactor`: Perubahan kode yang tidak memperbaiki bug atau menambahkan fitur
- `perf`: Perubahan kode yang meningkatkan performa
- `test`: Menambahkan test atau memperbaiki test yang sudah ada
- `chore`: Perubahan pada build process atau auxiliary tools

Contoh:
```
feat: tambah fitur login dengan Google
fix: perbaiki bug pada keranjang belanja
docs: update dokumentasi API
style: format kode dengan prettier
refactor: refactor kode product service
perf: optimasi query database
test: tambah test untuk komponen Button
chore: update dependencies
```
