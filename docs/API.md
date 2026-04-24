# Dokumentasi API

Dokumen ini menjelaskan endpoint API yang digunakan dalam aplikasi Eduwork E-Commerce.

## Autentikasi

### Register

Mendaftarkan pengguna baru.

- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "full_name": "Nama Lengkap",
    "email": "email@example.com",
    "password": "Password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Register success",
    "user": {
      "_id": "user_id",
      "full_name": "Nama Lengkap",
      "email": "email@example.com"
    },
    "token": "jwt_token"
  }
  ```

### Login

Melakukan login pengguna.

- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "email@example.com",
    "password": "Password123"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login success",
    "user": {
      "_id": "user_id",
      "full_name": "Nama Lengkap",
      "email": "email@example.com"
    },
    "token": "jwt_token"
  }
  ```

### Logout

Melakukan logout pengguna.

- **URL**: `/auth/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "message": "Logout success"
  }
  ```

## Produk

### Mendapatkan Daftar Produk

Mendapatkan daftar produk dengan pagination, filtering, dan pencarian.

- **URL**: `/api/products`
- **Method**: `GET`
- **Query Parameters**:
  - `page`: Nomor halaman (default: 1)
  - `limit`: Jumlah item per halaman (default: 10)
  - `skip`: Jumlah item yang dilewati (default: 0)
  - `q`: Kata kunci pencarian
  - `tags`: ID tag yang dipisahkan koma
  - `category`: Nama kategori
- **Response**:
  ```json
  {
    "data": [
      {
        "_id": "product_id",
        "name": "Nama Produk",
        "description": "Deskripsi Produk",
        "price": 100000,
        "image_url": "/uploads/products/image.jpg",
        "category": {
          "_id": "category_id",
          "name": "Nama Kategori"
        },
        "tags": [
          {
            "_id": "tag_id",
            "name": "Nama Tag"
          }
        ]
      }
    ],
    "count": 100,
    "totalPages": 10,
    "currentPage": 1
  }
  ```

### Mendapatkan Detail Produk

Mendapatkan detail produk berdasarkan ID.

- **URL**: `/api/products/:id`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "data": {
      "_id": "product_id",
      "name": "Nama Produk",
      "description": "Deskripsi Produk",
      "price": 100000,
      "image_url": "/uploads/products/image.jpg",
      "category": {
        "_id": "category_id",
        "name": "Nama Kategori"
      },
      "tags": [
        {
          "_id": "tag_id",
          "name": "Nama Tag"
        }
      ]
    }
  }
  ```

### Menambahkan Produk

Menambahkan produk baru (admin only).

- **URL**: `/api/products`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: `multipart/form-data`
  - `name`: Nama produk
  - `description`: Deskripsi produk
  - `price`: Harga produk
  - `category`: ID kategori
  - `tags`: Array ID tag
  - `image`: File gambar
- **Response**:
  ```json
  {
    "message": "Product created successfully",
    "data": {
      "_id": "product_id",
      "name": "Nama Produk",
      "description": "Deskripsi Produk",
      "price": 100000,
      "image_url": "/uploads/products/image.jpg",
      "category": "category_id",
      "tags": ["tag_id"]
    }
  }
  ```

### Mengupdate Produk

Mengupdate produk berdasarkan ID (admin only).

- **URL**: `/api/products/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**: `multipart/form-data`
  - `name`: Nama produk
  - `description`: Deskripsi produk
  - `price`: Harga produk
  - `category`: ID kategori
  - `tags`: Array ID tag
  - `image`: File gambar (opsional)
- **Response**:
  ```json
  {
    "message": "Product updated successfully",
    "data": {
      "_id": "product_id",
      "name": "Nama Produk",
      "description": "Deskripsi Produk",
      "price": 100000,
      "image_url": "/uploads/products/image.jpg",
      "category": "category_id",
      "tags": ["tag_id"]
    }
  }
  ```

### Menghapus Produk

Menghapus produk berdasarkan ID (admin only).

- **URL**: `/api/products/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

## Kategori

### Mendapatkan Daftar Kategori

Mendapatkan daftar kategori.

- **URL**: `/api/categories`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "category_id",
      "name": "Nama Kategori"
    }
  ]
  ```

### Menambahkan Kategori

Menambahkan kategori baru (admin only).

- **URL**: `/api/categories`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "name": "Nama Kategori"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Category created successfully",
    "data": {
      "_id": "category_id",
      "name": "Nama Kategori"
    }
  }
  ```

## Tag

### Mendapatkan Daftar Tag

Mendapatkan daftar tag.

- **URL**: `/api/tags`
- **Method**: `GET`
- **Response**:
  ```json
  [
    {
      "_id": "tag_id",
      "name": "Nama Tag"
    }
  ]
  ```

### Menambahkan Tag

Menambahkan tag baru (admin only).

- **URL**: `/api/tags`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "name": "Nama Tag"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Tag created successfully",
    "data": {
      "_id": "tag_id",
      "name": "Nama Tag"
    }
  }
  ```

## Keranjang

### Mendapatkan Keranjang

Mendapatkan keranjang pengguna.

- **URL**: `/api/carts`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "data": [
      {
        "_id": "cart_id",
        "product": {
          "_id": "product_id",
          "name": "Nama Produk",
          "price": 100000,
          "image_url": "/uploads/products/image.jpg"
        },
        "qty": 2,
        "user": "user_id"
      }
    ]
  }
  ```

### Menambahkan Item ke Keranjang

Menambahkan item ke keranjang.

- **URL**: `/api/carts`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "product": "product_id",
    "qty": 1
  }
  ```
- **Response**:
  ```json
  {
    "message": "Item added to cart",
    "data": {
      "_id": "cart_id",
      "product": "product_id",
      "qty": 1,
      "user": "user_id"
    }
  }
  ```

### Mengupdate Item di Keranjang

Mengupdate jumlah item di keranjang.

- **URL**: `/api/carts/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "qty": 2
  }
  ```
- **Response**:
  ```json
  {
    "message": "Cart updated",
    "data": {
      "_id": "cart_id",
      "product": "product_id",
      "qty": 2,
      "user": "user_id"
    }
  }
  ```

### Menghapus Item dari Keranjang

Menghapus item dari keranjang.

- **URL**: `/api/carts/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "message": "Item removed from cart"
  }
  ```

## Alamat

### Mendapatkan Daftar Alamat

Mendapatkan daftar alamat pengguna.

- **URL**: `/api/delivery-addresses`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "data": [
      {
        "_id": "address_id",
        "nama": "Nama Alamat",
        "provinsi": "Nama Provinsi",
        "kabupaten": "Nama Kabupaten",
        "kecamatan": "Nama Kecamatan",
        "kelurahan": "Nama Kelurahan",
        "detail": "Detail Alamat",
        "user": "user_id"
      }
    ]
  }
  ```

### Menambahkan Alamat

Menambahkan alamat baru.

- **URL**: `/api/delivery-addresses`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "nama": "Nama Alamat",
    "provinsi": "Nama Provinsi",
    "kabupaten": "Nama Kabupaten",
    "kecamatan": "Nama Kecamatan",
    "kelurahan": "Nama Kelurahan",
    "detail": "Detail Alamat"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Address added successfully",
    "data": {
      "_id": "address_id",
      "nama": "Nama Alamat",
      "provinsi": "Nama Provinsi",
      "kabupaten": "Nama Kabupaten",
      "kecamatan": "Nama Kecamatan",
      "kelurahan": "Nama Kelurahan",
      "detail": "Detail Alamat",
      "user": "user_id"
    }
  }
  ```

## Order

### Membuat Order

Membuat order baru.

- **URL**: `/api/orders`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "delivery_fee": 10000,
    "delivery_address": "address_id"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Order created successfully",
    "data": {
      "_id": "order_id",
      "status": "waiting_payment",
      "delivery_fee": 10000,
      "delivery_address": {
        "_id": "address_id",
        "nama": "Nama Alamat",
        "provinsi": "Nama Provinsi",
        "kabupaten": "Nama Kabupaten",
        "kecamatan": "Nama Kecamatan",
        "kelurahan": "Nama Kelurahan",
        "detail": "Detail Alamat"
      },
      "order_items": [
        {
          "product": {
            "_id": "product_id",
            "name": "Nama Produk",
            "price": 100000,
            "image_url": "/uploads/products/image.jpg"
          },
          "qty": 2,
          "price": 100000
        }
      ],
      "user": "user_id",
      "order_number": "ORD-123456789"
    }
  }
  ```

### Mendapatkan Daftar Order

Mendapatkan daftar order pengguna.

- **URL**: `/api/orders`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Query Parameters**:
  - `page`: Nomor halaman (default: 1)
  - `limit`: Jumlah item per halaman (default: 10)
  - `skip`: Jumlah item yang dilewati (default: 0)
- **Response**:
  ```json
  {
    "data": [
      {
        "_id": "order_id",
        "status": "waiting_payment",
        "delivery_fee": 10000,
        "delivery_address": {
          "_id": "address_id",
          "nama": "Nama Alamat",
          "provinsi": "Nama Provinsi",
          "kabupaten": "Nama Kabupaten",
          "kecamatan": "Nama Kecamatan",
          "kelurahan": "Nama Kelurahan",
          "detail": "Detail Alamat"
        },
        "order_items": [
          {
            "product": {
              "_id": "product_id",
              "name": "Nama Produk",
              "price": 100000,
              "image_url": "/uploads/products/image.jpg"
            },
            "qty": 2,
            "price": 100000
          }
        ],
        "user": "user_id",
        "order_number": "ORD-123456789"
      }
    ],
    "count": 10,
    "totalPages": 1,
    "currentPage": 1
  }
  ```

### Mendapatkan Detail Order

Mendapatkan detail order berdasarkan ID.

- **URL**: `/api/orders/:id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "data": {
      "_id": "order_id",
      "status": "waiting_payment",
      "delivery_fee": 10000,
      "delivery_address": {
        "_id": "address_id",
        "nama": "Nama Alamat",
        "provinsi": "Nama Provinsi",
        "kabupaten": "Nama Kabupaten",
        "kecamatan": "Nama Kecamatan",
        "kelurahan": "Nama Kelurahan",
        "detail": "Detail Alamat"
      },
      "order_items": [
        {
          "product": {
            "_id": "product_id",
            "name": "Nama Produk",
            "price": 100000,
            "image_url": "/uploads/products/image.jpg"
          },
          "qty": 2,
          "price": 100000
        }
      ],
      "user": "user_id",
      "order_number": "ORD-123456789"
    }
  }
  ```

### Mengupdate Status Order

Mengupdate status order (admin only).

- **URL**: `/api/orders/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "status": "delivered"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Order status updated",
    "data": {
      "_id": "order_id",
      "status": "delivered"
    }
  }
  ```

## Invoice

### Mendapatkan Invoice

Mendapatkan invoice berdasarkan order ID.

- **URL**: `/api/invoices/:order_id`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer jwt_token`
- **Response**:
  ```json
  {
    "data": {
      "_id": "invoice_id",
      "order": {
        "_id": "order_id",
        "status": "waiting_payment",
        "order_number": "ORD-123456789"
      },
      "payment_status": "waiting",
      "sub_total": 200000,
      "delivery_fee": 10000,
      "total": 210000,
      "user": "user_id",
      "invoice_number": "INV-123456789"
    }
  }
  ```

### Mengupdate Status Pembayaran

Mengupdate status pembayaran invoice (admin only).

- **URL**: `/api/invoices/:id`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer jwt_token`
- **Body**:
  ```json
  {
    "payment_status": "paid"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Payment status updated",
    "data": {
      "_id": "invoice_id",
      "payment_status": "paid"
    }
  }
  ```
