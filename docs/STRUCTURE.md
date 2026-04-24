# Struktur Proyek Frontend

Dokumen ini menjelaskan struktur proyek frontend Eduwork E-Commerce.

## Struktur Direktori

```
eduwork-client/
├── public/                 # File statis
├── src/                    # Kode sumber
│   ├── api/                # Layanan API dan konfigurasi
│   ├── components/         # Komponen React
│   │   ├── common/         # Komponen yang digunakan di banyak tempat
│   │   ├── header/         # Komponen header
│   │   ├── main/           # Komponen utama
│   │   └── skeleton/       # Komponen loading skeleton
│   ├── constants/          # Konstanta aplikasi
│   ├── features/           # Fitur-fitur aplikasi
│   ├── hooks/              # Custom hooks
│   ├── layouts/            # Layout aplikasi
│   ├── pages/              # Halaman aplikasi
│   ├── providers/          # Provider context
│   ├── styles/             # File CSS
│   ├── utils/              # Utilitas
│   └── __tests__/          # Unit test
└── package.json            # Dependensi dan script
```

## Komponen Utama

### API

- `api/axiosInstance.js`: Konfigurasi Axios untuk komunikasi dengan API
- `api/authService.js`: Layanan untuk autentikasi

### Components

- `components/common/`: Komponen yang digunakan di banyak tempat
  - `ErrorAlert.jsx`: Komponen untuk menampilkan pesan error
  - `ErrorBoundary.jsx`: Komponen untuk menangkap error
  - `OptimizedImage.jsx`: Komponen untuk menampilkan gambar yang dioptimasi
- `components/header/`: Komponen header
  - `AccountIcon.js`: Ikon akun pengguna
  - `CartList.js`: Daftar item di keranjang
  - `Kategori.js`: Daftar kategori
  - `Logo.js`: Logo aplikasi
  - `Search.js`: Komponen pencarian
  - `SearchIcon.js`: Ikon pencarian
- `components/main/`: Komponen utama
  - `AddToCart.js`: Tombol tambah ke keranjang
  - `HomeTitle.js`: Judul halaman utama
  - `MenuItems.js`: Daftar item menu
  - `Tags.js`: Daftar tag
- `components/skeleton/`: Komponen loading skeleton
  - `SkeletonCard.jsx`: Skeleton untuk card
  - `SkeletonList.jsx`: Skeleton untuk list
  - `SkeletonTag.jsx`: Skeleton untuk tag

### Constants

- `constants/apiEndpoints.js`: Endpoint API
- `constants/categoryMap.js`: Mapping kategori
- `constants/routes.js`: Rute aplikasi

### Features

- `features/auth/`: Fitur autentikasi
- `features/cart/`: Fitur keranjang belanja
- `features/product/`: Fitur produk

### Hooks

- `hooks/useAuth.js`: Hook untuk autentikasi
- `hooks/useErrorHandler.js`: Hook untuk menangani error
- `hooks/useFetchProducts.js`: Hook untuk mengambil data produk
- `hooks/useFetchTags.js`: Hook untuk mengambil data tag
- `hooks/useQueryCategories.js`: Hook untuk query kategori
- `hooks/useQueryProducts.js`: Hook untuk query produk
- `hooks/useQueryTags.js`: Hook untuk query tag

### Layouts

- `layouts/Footer.jsx`: Layout footer
- `layouts/Header.jsx`: Layout header
- `layouts/MainLayout.jsx`: Layout utama

### Pages

- `pages/Account.jsx`: Halaman akun
- `pages/ErrorPage.jsx`: Halaman error
- `pages/Home.jsx`: Halaman utama
- `pages/Loading.jsx`: Halaman loading
- `pages/Login.jsx`: Halaman login
- `pages/Orders.jsx`: Halaman pesanan
- `pages/Register.jsx`: Halaman register

### Providers

- `providers/ErrorProvider.jsx`: Provider untuk error
- `providers/QueryProvider.jsx`: Provider untuk query

### Utils

- `utils/errorHandlers.js`: Fungsi untuk menangani error
- `utils/formatters.js`: Fungsi untuk memformat data
- `utils/keyboardNavigation.js`: Fungsi untuk navigasi keyboard
- `utils/storageCache.js`: Fungsi untuk caching di storage

## State Management

Aplikasi ini menggunakan Redux untuk state management. State utama:

- `auth`: State untuk autentikasi
- `cart`: State untuk keranjang belanja
- `product`: State untuk produk

## Routing

Aplikasi ini menggunakan React Router untuk routing. Rute utama:

- `/`: Halaman utama
- `/login`: Halaman login
- `/register`: Halaman register
- `/account`: Halaman akun
- `/orders`: Halaman pesanan

## Styling

Aplikasi ini menggunakan CSS modules untuk styling. File CSS:

- `styles/accessibility.css`: Style untuk aksesibilitas
- `styles/account.css`: Style untuk halaman akun
- `styles/address.css`: Style untuk alamat
- `styles/app.css`: Style untuk aplikasi
- `styles/auth.css`: Style untuk autentikasi
- `styles/carts.css`: Style untuk keranjang
- `styles/design-system.css`: Style untuk design system
- `styles/error.css`: Style untuk error
- `styles/footer.css`: Style untuk footer
- `styles/header.css`: Style untuk header
- `styles/invoices.css`: Style untuk faktur
- `styles/kategori.css`: Style untuk kategori
- `styles/loading.css`: Style untuk loading
- `styles/logo.css`: Style untuk logo
- `styles/main.css`: Style untuk main
- `styles/optimized-image.css`: Style untuk gambar yang dioptimasi
- `styles/orders.css`: Style untuk pesanan
- `styles/pagination.css`: Style untuk pagination
- `styles/profile.css`: Style untuk profil
- `styles/search.css`: Style untuk pencarian
- `styles/variables.css`: Variabel CSS
