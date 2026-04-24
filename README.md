# Eduwork E-Commerce Frontend

Frontend aplikasi e-commerce yang dibangun dengan React.

## Dokumentasi

Dokumentasi lengkap tersedia di direktori `docs/`:

- [Struktur Project](docs/PROJECT_STRUCTURE.md) - Penjelasan tentang struktur direktori dan file
- [Komponen](docs/COMPONENTS.md) - Dokumentasi komponen-komponen utama
- [API](docs/API.md) - Dokumentasi endpoint API yang digunakan
- [Panduan Pengembangan](docs/DEVELOPMENT_GUIDE.md) - Panduan untuk pengembang

## Fitur Utama

- Autentikasi pengguna (login/register)
- Katalog produk dengan kategori dan tag
- Pencarian produk
- Keranjang belanja
- Checkout dan pemesanan
- Manajemen alamat pengiriman
- Riwayat pesanan dan faktur

## Teknologi yang Digunakan

- React.js
- React Router
- React Query
- Redux Toolkit
- CSS Modular
- Axios
- Jest dan React Testing Library

## Cara Instalasi

### Prasyarat

- Node.js (versi 14.x atau lebih tinggi)
- npm (versi 6.x atau lebih tinggi) atau yarn (versi 1.22.x atau lebih tinggi)

### Langkah-langkah Instalasi

1. Clone repository:
   ```bash
   git clone https://github.com/username/eduwork-ecommerce.git
   cd eduwork-ecommerce/eduwork-client
   ```

2. Instal dependencies:
   ```bash
   npm install
   ```

3. Buat file `.env`:
   ```
   REACT_APP_API_URL=http://localhost:3000/api
   REACT_APP_STORAGE_URL=http://localhost:3000/uploads
   REACT_APP_VERSION=1.0.0
   REACT_APP_ENV=development
   REACT_APP_DEBUG=true
   ```

## Cara Menjalankan Aplikasi

### Development Mode

```bash
npm start
```

Aplikasi akan berjalan di [http://localhost:3001](http://localhost:3001).

### Production Build

```bash
npm run build
```

### Menjalankan Test

```bash
npm test
```

## Struktur Direktori

```
eduwork-client/
├── public/                  # File statis
├── src/                     # Source code
│   ├── api/                 # Konfigurasi API
│   ├── assets/              # Asset statis (gambar, font, dll)
│   ├── components/          # Komponen React
│   ├── constants/           # Konstanta
│   ├── features/            # Fitur (Redux Toolkit)
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Layout komponen
│   ├── pages/               # Halaman
│   ├── providers/           # Context providers
│   ├── styles/              # File CSS
│   ├── utils/               # Utilitas
│   ├── App.js               # Komponen utama
│   ├── index.js             # Entry point
│   └── store.js             # Redux store
├── docs/                    # Dokumentasi
├── .env                     # Environment variables
├── package.json             # Dependencies
└── README.md                # Dokumentasi utama
```

## Kontribusi

Silakan baca [Panduan Pengembangan](docs/DEVELOPMENT_GUIDE.md) untuk informasi tentang cara berkontribusi ke project ini.

## Lisensi

MIT
