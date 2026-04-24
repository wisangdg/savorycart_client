# Dokumentasi Komponen

Dokumen ini menjelaskan komponen-komponen utama yang digunakan dalam aplikasi Eduwork E-Commerce.

## Komponen Umum

### ErrorBoundary

Komponen yang menangkap error yang terjadi pada komponen child dan menampilkan fallback UI.

```jsx
<ErrorBoundary>
  <ComponentYangMungkinError />
</ErrorBoundary>
```

### ErrorAlert

Komponen untuk menampilkan pesan error.

```jsx
<ErrorAlert 
  title="Error Title" 
  message="Error message" 
  onClose={() => {}} 
/>
```

### LoadingFallback

Komponen yang ditampilkan saat komponen lain sedang di-load.

```jsx
<Suspense fallback={<LoadingFallback />}>
  <ComponentYangDiLoad />
</Suspense>
```

### OptimizedImage

Komponen untuk menampilkan gambar yang dioptimasi.

```jsx
<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Image description" 
  width={300} 
  height={200} 
/>
```

## Komponen Header

### Header

Komponen header utama yang berisi logo, navigasi, dan ikon-ikon.

```jsx
<Header />
```

### Logo

Komponen logo aplikasi.

```jsx
<Logo />
```

### Search

Komponen pencarian.

```jsx
<Search 
  handleSearchChange={handleSearchChange} 
  searchKeyword={searchKeyword} 
/>
```

### CartList

Komponen untuk menampilkan daftar item di keranjang.

```jsx
<CartList />
```

## Komponen Main

### MenuItems

Komponen untuk menampilkan daftar produk.

```jsx
<MenuItems 
  handleAddCart={handleAddCart} 
  searchKeyword={searchKeyword} 
  selectedCategory={selectedCategory} 
/>
```

### Tags

Komponen untuk menampilkan daftar tag.

```jsx
<Tags />
```

### AddToCart

Komponen tombol tambah ke keranjang.

```jsx
<AddToCart 
  product={product} 
  onAddToCart={handleAddToCart} 
/>
```

## Komponen Skeleton

### SkeletonCard

Komponen skeleton untuk card produk.

```jsx
<SkeletonCard />
```

### SkeletonList

Komponen skeleton untuk daftar.

```jsx
<SkeletonList count={5} />
```

## Komponen Form

### FormInput

Komponen input form dengan validasi.

```jsx
<FormInput 
  name="email" 
  type="email" 
  placeholder="Email" 
  error={errors.email} 
  touched={touched.email} 
/>
```

### FormSelect

Komponen select form dengan validasi.

```jsx
<FormSelect 
  name="category" 
  options={categories} 
  error={errors.category} 
  touched={touched.category} 
/>
```

## Komponen Halaman

### Home

Halaman utama aplikasi.

```jsx
<Home 
  searchKeyword={searchKeyword} 
  handleSearchChange={handleSearchChange} 
  categories={categories} 
/>
```

### Login

Halaman login.

```jsx
<Login />
```

### Register

Halaman register.

```jsx
<Register />
```

### Account

Halaman akun pengguna.

```jsx
<Account />
```

### Orders

Halaman pesanan.

```jsx
<Orders />
```

### Invoices

Halaman faktur.

```jsx
<Invoices orderId={orderId} />
```

## Komponen Context

### ErrorProvider

Provider untuk error handling global.

```jsx
<ErrorProvider>
  <App />
</ErrorProvider>
```

### QueryProvider

Provider untuk React Query.

```jsx
<QueryProvider>
  <App />
</QueryProvider>
```

## Custom Hooks

### useAuth

Hook untuk autentikasi.

```jsx
const { isAuthenticated, user, token, login, register, logout, checkLoginStatus } = useAuth();
```

### useErrorHandler

Hook untuk menangani error.

```jsx
const { error, handleError, clearError } = useErrorHandler();
```

### useFetchProducts

Hook untuk mengambil data produk.

```jsx
const { menus, totalPages, loading, error, refetch } = useFetchProducts(currentPage, activeTags, searchKeyword, selectedCategory);
```

### useQueryProducts

Hook untuk mengambil data produk dengan React Query.

```jsx
const { data, isLoading, isError, error, refetch, prefetchNextPage } = useQueryProducts({
  page: currentPage,
  tags: activeTags,
  search: searchKeyword,
  category: selectedCategory
});
```

### useFormValidation

Hook untuk validasi form.

```jsx
const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit, resetForm } = useFormValidation(
  initialValues,
  validationSchema,
  onSubmit
);
```
