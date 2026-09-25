# Website Resmi RA Al-Maqom

Website portal resmi Raudhatul Athfal (RA) Al-Maqom dengan fitur Profil Madrasah, Kurikulum Merdeka PAUD/RA & Program Unggulan, Galeri & Sarana, Ekstrakurikuler, Berita/Warta, Prestasi Santri, Sistem Pendaftaran PPDB Online, dan Panel Admin Manajemen Konten Sekolah.

---

## 🚀 Panduan Hosting ke GitHub & Vercel

Project ini dibangun dengan **Vite + React + TypeScript + Tailwind CSS** dan telah dilengkapi konfigurasi `vercel.json` untuk routing SPA yang mulus.

### 1. Upload / Push ke GitHub

Buka terminal di folder project Anda, lalu jalankan perintah berikut:

```bash
# 1. Inisialisasi git (jika belum)
git init

# 2. Tambahkan seluruh file
git add .

# 3. Commit pertama
git commit -m "feat: Website Resmi RA Al-Maqom"

# 4. Ubah branch utama menjadi main
git branch -M main

# 5. Hubungkan ke repository GitHub Anda (ganti URL dengan repo Anda)
git remote add origin https://github.com/ilhamfazril/ra-almaqom.git

# 6. Push ke GitHub
git push -u origin main
```

---

### 2. Deploy ke Vercel

1. Buka [https://vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik tombol **"Add New..."** lalu pilih **"Project"**.
3. Pilih repository GitHub **`ra-almaqom`** yang baru saja Anda upload, lalu klik **"Import"**.
4. Di bagian pengaturan proyek Vercel:
   - **Framework Preset**: Pilih **Vite** (biasanya terdeteksi otomatis).
   - **Root Directory**: `./` (default).
   - **Build Command**: `npm run build` (atau `vite build`).
   - **Output Directory**: `dist`.
5. Klik tombol **"Deploy"**.
6. Tunggu proses build sekitar 1–2 menit. Website RA Al-Maqom akan langsung aktif dengan domain gratis `*.vercel.app` (dan Anda juga bisa menghubungkan domain custom madrasah nantinya).

---

### 3. File Konfigurasi Vercel (`vercel.json`)

Project ini sudah dilengkapi file `vercel.json` di root folder untuk menangani routing SPA (Single Page Application):
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### 4. Perintah Lokal (Development)

- **Menjalankan server lokal**: `npm run dev` (buka `http://localhost:3000`)
- **Build untuk produksi**: `npm run build`
- **Pratinjau build produksi**: `npm run preview`
- **Pemeriksaan tipe TypeScript**: `npm run lint`
