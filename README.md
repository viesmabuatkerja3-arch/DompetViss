# 💰 DompetKu - Aplikasi Pengelolaan Keuangan Pribadi

Aplikasi pengelolaan keuangan pribadi yang ringan, rapi, dan responsif untuk mencatat pemasukan, pengeluaran, memantau batas anggaran kategori, serta menganalisis arus kas dengan grafik interaktif Chart.js.

---

## 🚀 Panduan Deploy ke GitHub Pages

Aplikasi ini sudah dilengkapi dengan alur kerja **GitHub Actions (`.github/workflows/deploy.yml`)** sehingga akan ter-deploy secara otomatis setiap kali Anda melakukan push ke GitHub.

### Langkah 1: Buat Repository di GitHub
1. Buka [GitHub](https://github.com) dan buat repository baru (misal: `dompetku`).
2. Jangan centang "Add a README file" (karena kita sudah memiliki kode sumber).

### Langkah 2: Hubungkan & Push Kode dari Komputer Anda
Jalankan perintah berikut di terminal:

```bash
# Inisialisasi git jika belum
git init

# Tambahkan semua file dan buat commit awal
git add .
git commit -m "feat: inisialisasi aplikasi DompetKu dengan GitHub Pages"

# Ganti branch utama menjadi main
git branch -M main

# Hubungkan dengan repository GitHub Anda (ganti USERNAME dan REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Push ke GitHub
git push -u origin main
```

### Langkah 3: Aktifkan GitHub Pages di Repository
1. Masuk ke halaman repository Anda di GitHub.
2. Klik tab **Settings** (Pengaturan).
3. Di bilah menu kiri, klik **Pages**.
4. Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
5. Tunggu proses build selesai di tab **Actions** (biasanya 1–2 menit).
6. Website Anda akan langsung online di:
   ```
   https://USERNAME.github.io/REPO_NAME/
   ```

---

## 🌟 Opsi 2: Deploy Instan Tanpa Build (File HTML Mandiri)

Selain project Vite React, repository ini juga menyertakan file **`keuangan-pribadi.html`** yang merupakan versi mandiri (HTML + Tailwind CDN + Chart.js CDN).

Anda dapat:
1. Mengubah nama `keuangan-pribadi.html` menjadi `index.html`.
2. Mengunggahnya langsung ke GitHub Pages cabang `gh-pages` atau hosting statis apa pun (Vercel, Netlify, Cloudflare Pages, GitHub Pages via branch) tanpa perlu `npm install` atau build server!
3. Membuka file `keuangan-pribadi.html` secara offline langsung di laptop atau HP dengan klik 2 kali.

---

## 🛠️ Menjalankan Lokal di Komputer (Development)

Jika ingin menjalankan server pengembangan lokal:

```bash
# 1. Install dependensi
npm install

# 2. Jalankan server lokal
npm run dev

# 3. Buka browser di http://localhost:3000
```

---

## 📋 Fitur yang Tersedia:
- **Layar Masuk**: Login dengan Google, Login & Daftar dengan Email, serta Mode Tamu Demo.
- **Dashboard Ringkasan**: Pemasukan, pengeluaran, sisa saldo, total tabungan, nilai emas, dan 5 transaksi terakhir.
- **Pencatatan Pemasukan**: Form input nominal Rupiah, sumber pemasukan, filter bulan, dan aksi edit/hapus.
- **Pencatatan Pengeluaran**: Form input, kategori, pencarian teks, filter bulan & kategori.
- **Kategori & Batas Anggaran**: Kategori dinamis dengan warna kustom, bar progress anggaran bulanan, dan peringatan batas belanja 80%/100%.
- **Analisis & Grafik Chart.js**: Donut chart distribusi pengeluaran, bar chart arus kas 6 bulan, line chart tren belanja harian/bulanan, rasio tabungan, dan insight otomatis.
- **Penyimpanan Aman**: 100% tersimpan di `localStorage` browser Anda tanpa server eksternal.
