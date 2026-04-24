# Dokumentasi Pengujian Frontend

Dokumen ini menjelaskan strategi dan implementasi pengujian di frontend Eduwork E-Commerce.

## Jenis Pengujian

### Unit Testing

Pengujian unit menguji komponen individual secara terisolasi. Pengujian ini fokus pada:
- Fungsi-fungsi utilitas
- Custom hooks
- Komponen UI sederhana

### Integration Testing

Pengujian integrasi menguji interaksi antar komponen. Pengujian ini fokus pada:
- Interaksi antar komponen
- Alur data antar komponen
- Integrasi dengan state management

### Snapshot Testing

Pengujian snapshot menguji tampilan komponen. Pengujian ini fokus pada:
- Konsistensi tampilan komponen
- Perubahan tampilan yang tidak diinginkan

## Tools Pengujian

### Jest

Jest adalah framework pengujian JavaScript yang digunakan untuk:
- Menjalankan pengujian
- Menyediakan assertions
- Menyediakan mocking
- Mengukur code coverage

### React Testing Library

React Testing Library adalah library untuk menguji komponen React yang fokus pada:
- Menguji komponen seperti pengguna menggunakannya
- Menguji DOM, bukan implementasi
- Menguji aksesibilitas

### Mock Service Worker (MSW)

MSW adalah library untuk mocking API request yang digunakan untuk:
- Mocking API request
- Simulasi response API
- Simulasi error API

## Struktur Pengujian

```
src/
└── __tests__/
    ├── components/         # Pengujian komponen
    ├── helpers/            # Helper untuk pengujian
    ├── hooks/              # Pengujian custom hooks
    ├── integration/        # Pengujian integrasi
    ├── mocks/              # Mock data dan service
    └── utils/              # Pengujian utilitas
```

## Contoh Pengujian

### Pengujian Komponen

```javascript
// src/__tests__/components/Footer.test.js
import { render, screen } from '@testing-library/react';
import Footer from '../../components/Footer';

describe('Footer Component', () => {
  it('renders correctly', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2023 Eduwork/i)).toBeInTheDocument();
  });
});
```

### Pengujian Hook

```javascript
// src/__tests__/hooks/useFetchTags.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import useFetchTags from '../../hooks/useFetchTags';
import { mockTags } from '../mocks/mockData';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: mockTags }))
}));

describe('useFetchTags Hook', () => {
  it('fetches tags successfully', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useFetchTags());
    
    expect(result.current.loading).toBe(true);
    
    await waitForNextUpdate();
    
    expect(result.current.loading).toBe(false);
    expect(result.current.tags).toEqual(mockTags);
    expect(result.current.error).toBe(null);
  });
});
```

### Pengujian Integrasi

```javascript
// src/__tests__/integration/ProductList.test.js
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClientProvider, QueryClient } from 'react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProductList from '../../components/ProductList';
import { mockProducts } from '../mocks/mockData';

// Setup MSW server
const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.json(mockProducts));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductList Integration', () => {
  it('renders products after fetching', async () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );
    
    // Initially shows loading state
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
    
    // Wait for products to load
    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
    
    // Check if products are rendered
    mockProducts.forEach(product => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });
});
```

## Menjalankan Pengujian

### Menjalankan Semua Pengujian

```bash
npm test
```

### Menjalankan Pengujian Tertentu

```bash
npm test -- -t "Footer Component"
```

### Menjalankan Pengujian dengan Coverage

```bash
npm test -- --coverage
```

## Code Coverage

Code coverage mengukur seberapa banyak kode yang diuji. Target coverage:
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

## Continuous Integration

Pengujian dijalankan secara otomatis pada:
- Pull request
- Merge ke branch main

## Best Practices

### Do's

- Uji perilaku, bukan implementasi
- Gunakan selectors yang mirip dengan cara pengguna menemukan elemen
- Gunakan data-testid untuk elemen yang sulit diseleksi
- Mock dependencies eksternal
- Tulis pengujian yang independen

### Don'ts

- Jangan uji implementasi internal
- Jangan bergantung pada struktur DOM yang spesifik
- Jangan uji library pihak ketiga
- Jangan tulis pengujian yang bergantung pada pengujian lain
