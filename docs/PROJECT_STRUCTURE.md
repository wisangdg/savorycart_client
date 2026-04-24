# Struktur Project

Dokumen ini menjelaskan struktur project Eduwork E-Commerce.

## Struktur Direktori

```
eduwork-client/
├── public/                  # File statis
├── src/                     # Source code
│   ├── api/                 # Konfigurasi API
│   ├── assets/              # Asset statis (gambar, font, dll)
│   ├── components/          # Komponen React
│   │   ├── common/          # Komponen umum
│   │   ├── header/          # Komponen header
│   │   ├── main/            # Komponen utama
│   │   └── ...
│   ├── constants/           # Konstanta
│   ├── features/            # Fitur (Redux Toolkit)
│   │   ├── auth/            # Fitur autentikasi
│   │   ├── cart/            # Fitur keranjang
│   │   ├── product/         # Fitur produk
│   │   └── ...
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Layout komponen
│   ├── pages/               # Halaman
│   ├── providers/           # Context providers
│   ├── styles/              # File CSS
│   │   ├── animations.css   # Animasi
│   │   ├── buttons.css      # Tombol
│   │   ├── cards.css        # Kartu
│   │   ├── header.css       # Header
│   │   ├── layout.css       # Layout
│   │   ├── main.css         # Utama
│   │   ├── pagination.css   # Pagination
│   │   ├── variables.css    # Variabel CSS
│   │   └── ...
│   ├── utils/               # Utilitas
│   ├── App.js               # Komponen utama
│   ├── index.js             # Entry point
│   └── store.js             # Redux store
├── docs/                    # Dokumentasi
│   ├── API.md               # Dokumentasi API
│   ├── COMPONENTS.md        # Dokumentasi komponen
│   ├── PROJECT_STRUCTURE.md # Dokumentasi struktur project
│   └── ...
├── .env                     # Environment variables
├── .gitignore               # Git ignore
├── package.json             # Dependencies
└── README.md                # Dokumentasi utama
```

## Struktur Komponen

### Komponen Umum

Komponen yang digunakan di seluruh aplikasi.

- `ErrorBoundary`: Menangkap error yang terjadi pada komponen child.
- `ErrorAlert`: Menampilkan pesan error.
- `LoadingFallback`: Ditampilkan saat komponen lain sedang di-load.
- `OptimizedImage`: Menampilkan gambar yang dioptimasi.
- `Pagination`: Komponen pagination.
- `Rating`: Komponen rating.

### Komponen Header

Komponen yang digunakan di header.

- `Header`: Komponen header utama.
- `Logo`: Komponen logo.
- `Search`: Komponen pencarian.
- `CartList`: Komponen daftar item di keranjang.
- `UserMenu`: Komponen menu pengguna.

### Komponen Main

Komponen yang digunakan di konten utama.

- `MenuItems`: Komponen daftar produk.
- `Tags`: Komponen daftar tag.
- `AddToCart`: Komponen tombol tambah ke keranjang.
- `ProductCard`: Komponen kartu produk.
- `CategoryList`: Komponen daftar kategori.

### Komponen Form

Komponen yang digunakan di form.

- `FormInput`: Komponen input form dengan validasi.
- `FormSelect`: Komponen select form dengan validasi.
- `FormCheckbox`: Komponen checkbox form dengan validasi.
- `FormTextarea`: Komponen textarea form dengan validasi.
- `FormButton`: Komponen tombol form.

## Struktur Redux

### Slices

- `authSlice`: State untuk autentikasi.
- `cartSlice`: State untuk keranjang.
- `productSlice`: State untuk produk.
- `tagSlice`: State untuk tag.
- `categorySlice`: State untuk kategori.
- `orderSlice`: State untuk pesanan.

### Actions

- `authActions`: Action untuk autentikasi.
- `cartActions`: Action untuk keranjang.
- `productActions`: Action untuk produk.
- `tagActions`: Action untuk tag.
- `categoryActions`: Action untuk kategori.
- `orderActions`: Action untuk pesanan.

## Custom Hooks

- `useAuth`: Hook untuk autentikasi.
- `useErrorHandler`: Hook untuk menangani error.
- `useFetchProducts`: Hook untuk mengambil data produk.
- `useFetchTags`: Hook untuk mengambil data tag.
- `useQueryProducts`: Hook untuk mengambil data produk dengan React Query.
- `useQueryTags`: Hook untuk mengambil data tag dengan React Query.
- `useQueryCategories`: Hook untuk mengambil data kategori dengan React Query.
- `useFormValidation`: Hook untuk validasi form.
- `useNotification`: Hook untuk menampilkan notifikasi.

## Utilitas

- `errorHandlers`: Fungsi untuk menangani error.
- `formatters`: Fungsi untuk memformat data.
- `validators`: Fungsi untuk validasi data.
- `storageCache`: Fungsi untuk caching data di local storage.
- `imageOptimizer`: Fungsi untuk optimasi gambar.

## Konstanta

- `API_ENDPOINTS`: Endpoint API.
- `ROUTES`: Rute aplikasi.
- `CATEGORY_NAME_MAP`: Mapping nama kategori.
- `VALIDATION_MESSAGES`: Pesan validasi.
- `ERROR_MESSAGES`: Pesan error.

## Providers

- `ErrorProvider`: Provider untuk error handling global.
- `QueryProvider`: Provider untuk React Query.
- `AuthProvider`: Provider untuk autentikasi.
- `NotificationProvider`: Provider untuk notifikasi.

## Layouts

- `MainLayout`: Layout utama.
- `AuthLayout`: Layout untuk halaman autentikasi.
- `AdminLayout`: Layout untuk halaman admin.
- `CheckoutLayout`: Layout untuk halaman checkout.

## Pages

- `Home`: Halaman utama.
- `Login`: Halaman login.
- `Register`: Halaman register.
- `Account`: Halaman akun pengguna.
- `Orders`: Halaman pesanan.
- `Invoices`: Halaman faktur.
- `Cart`: Halaman keranjang.
- `Checkout`: Halaman checkout.
- `ProductDetail`: Halaman detail produk.
- `NotFound`: Halaman 404.
- `ErrorPage`: Halaman error.

## API

- `axiosInstance`: Konfigurasi Axios.
- `authAPI`: API untuk autentikasi.
- `productAPI`: API untuk produk.
- `cartAPI`: API untuk keranjang.
- `orderAPI`: API untuk pesanan.
- `addressAPI`: API untuk alamat.
- `invoiceAPI`: API untuk faktur.

## Styles

- `variables.css`: Variabel CSS.
- `main.css`: Style utama.
- `buttons.css`: Style tombol.
- `cards.css`: Style kartu.
- `layout.css`: Style layout.
- `animations.css`: Style animasi.
- `header.css`: Style header.
- `pagination.css`: Style pagination.
- `forms.css`: Style form.
- `responsive.css`: Style responsif.

## Assets

- `images/`: Gambar.
- `icons/`: Ikon.
- `fonts/`: Font.
- `animations/`: Animasi.

## Environment Variables

- `REACT_APP_API_URL`: URL API.
- `REACT_APP_STORAGE_URL`: URL storage.
- `REACT_APP_VERSION`: Versi aplikasi.
- `REACT_APP_ENV`: Environment (development, production, staging).
- `REACT_APP_DEBUG`: Mode debug.

## Scripts

- `start`: Menjalankan aplikasi di mode development.
- `build`: Membangun aplikasi untuk production.
- `test`: Menjalankan test.
- `eject`: Eject dari Create React App.
- `lint`: Menjalankan linter.
- `format`: Memformat kode.
- `analyze`: Menganalisis bundle size.
