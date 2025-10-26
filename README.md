# 📚 Library Management System 

Bu proje, bir kütüphane yönetim sistemidir.
Amaç, kullanıcıların yayımcı, yazar, kategori ve kitap ekleyebilmesini; ayrıca stok kontrolü ile kitap ödünç alma işlemlerini yapabilmesini sağlamaktır.

---

## Live Demo

- **Live Site:** 
- **Live Backend:** https://libraryappspringbootbackend.onrender.com
- **Repository:** 

---

## 🚀 Özellikler

| Modül        | Özellikler |
|-------------|-------------|
| Yayımcı     | Listeleme, Ekleme, Güncelleme, Silme |
| Yazar       | Listeleme, Ekleme, Güncelleme, Silme |
| Kategori    | Listeleme, Ekleme, Güncelleme, Silme |
| Kitap       | Listeleme, Ekleme, Güncelleme, Silme (Yazar/Yayımcı/Kategori seçimiyle) |
| Kitap Alma  | Ödünç alma, güncelleme, iade / silme, **stok kontrolü**, kitap bilgisi değiştiğinde otomatik yansıma |

---

## 🧠 Kullanılan Teknolojiler

| Teknoloji | Amaç |
|----------|------|
| React + Vite | SPA Mimarisi |
| React Router | Sayfa yönlendirme |
| Context API  | Global state yönetimi |
| Axios        | API istekleri |
| TailwindCSS  | Tasarım ve component stilleri |
| react-hot-toast | Bildirim sistemi |
| Backend (Hazır API) | CRUD işlemleri için (Spring Boot) |

---

## 🧱 MİMARİ YAPISI
src
├── api
│ └── client.js
├── context
│ ├── authorContext.jsx
│ ├── bookContext.jsx
│ ├── borrowingContext.jsx
│ ├── categoryContext.jsx
│ └── publisherContext.jsx
├── layout
│ ├── Layout.jsx
│ └── Providers.jsx
├── pages
│ ├── Authors.jsx
│ ├── Books.jsx
│ ├── Borrows.jsx
│ ├── Categories.jsx
│ ├── Publishers.jsx
├── services
│ ├── authors.js
│ ├── books.js
│ ├── borrows.js
│ ├── categories.js
│ └── publishers.js
└── App.jsx

---

## 🔄 Akış (Workflow)

1. Kullanıcı modül seçer (Yayımcı / Yazar / Kategori / Kitap / Kitap Alma)
2. Form doldurur → **CRUD işlemleri yapılır**
3. Context API → API çağrısı yapılır
4. Başarılı / Hatalı işlem → `react-hot-toast` ile kullanıcı bildirilir
5. Kitap alma ekranında stok kontrolü yapılır  
   - Stokta yoksa → yeni kayıt engellenir  
   - Bir kitap bilgisi güncellenirse → mevcut borrow kayıtlarına otomatik yansır

---

## 🎨 Tasarım Bilgileri

Sayfa genişliği 1200px odaklı (responsive gerekmiyor)

Ortalanmış layout

Tüm form ve tablo görselleri Tailwind ile

Uyarılar toast sistemi ile

---

## ⚙️ Kurulum

```bash
# Bağımlılıkları yükle
npm install

# .env dosyasına backend API adresini girin
VITE_API_URL=http://localhost:8080/api/v1

# Projeyi çalıştır
npm run dev
