<div align="center">

# 🗺️ Banyumas Policy Intel

### Platform Intelijen Kebijakan Berbasis Data & AI untuk Kabupaten Banyumas

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://banyumas-policy-intel.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

> _Dashboard analitik interaktif berbasis AI untuk mendukung pengambilan kebijakan publik yang berbasis data di Kabupaten Banyumas, Jawa Tengah._

</div>

---

## 📌 Tentang Proyek

**Banyumas Policy Intel** adalah platform intelijen kebijakan berbasis web yang dirancang untuk membantu pengambil keputusan, peneliti, dan akademisi dalam menganalisis kondisi sosial-ekonomi Kabupaten Banyumas. Platform ini mengintegrasikan data spasial, visualisasi interaktif, dan kecerdasan buatan untuk menghasilkan wawasan kebijakan yang mendalam dan berbasis bukti.

Proyek ini dibangun sebagai portofolio mahasiswa yang mengeksplorasi persimpangan antara **data science**, **kebijakan publik**, dan **pengembangan web modern**.

---

## ✨ Fitur Utama

### 🗺️ Peta Interaktif Kecamatan
- Visualisasi seluruh kecamatan di Kabupaten Banyumas menggunakan **Leaflet.js**
- Kode warna berdasarkan tingkat kemiskinan (choropleth map)
- Klik pada kecamatan untuk membuka panel analisis detail

### 📊 Simulasi Kebijakan
- Simulasikan perubahan variabel: fasilitas kesehatan, sekolah, UMKM, dan kualitas jalan
- Prediksi dampak terhadap angka kemiskinan secara *real-time*
- Model regresi linear sederhana sebagai dasar simulasi

### 🤖 Analisis AI (Powered by OpenRouter)
- **Analisis Strategis SWOT & Risiko** per kecamatan
- **Rekomendasi Alokasi Anggaran** optimal berdasarkan tujuan kebijakan
- **Analisis Klaster** wilayah berdasarkan profil sosial-ekonomi
- **Analisis Peramalan** tren kemiskinan 5 tahun ke depan
- **Rekomendasi Kebijakan** dari hasil skenario simulasi

### 💬 Asisten AI Chatbot
- Tanyakan apapun tentang data Banyumas secara percakapan
- Mendukung pertanyaan perbandingan antar kecamatan
- Analisis SWOT dan risiko via chat natural

### 📈 Peramalan & Perbandingan
- Proyeksi tren kemiskinan menggunakan regresi linear historis
- Panel perbandingan side-by-side antar dua kecamatan
- Visualisasi chart interaktif dengan **Recharts**

### 📄 Ekspor Data
- **Export PDF** laporan lengkap per kecamatan (via jsPDF + autotable)
- **Export CSV** data kecamatan untuk analisis lanjutan

### 💰 Optimasi Anggaran
- Input total anggaran dan tujuan kebijakan
- AI merekomendasikan alokasi optimal (faskes, sekolah, UMKM, jalan)
- Justifikasi naratif dari setiap rekomendasi

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| **Frontend Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS (via CDN) |
| **Peta** | Leaflet.js + React-Leaflet |
| **Charting** | Recharts |
| **AI/LLM** | OpenRouter API (Hermes 3 Llama 3.1 405B) |
| **PDF Export** | jsPDF + jsPDF-AutoTable |
| **Ikon** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Cara Menjalankan Lokal

### Prasyarat
- Node.js 18+ & npm

### Langkah Instalasi

```bash
# 1. Clone repository
git clone https://github.com/FirmanRcode/Banyumas-Policy-Intel.git
cd Banyumas-Policy-Intel

# 2. Install dependencies
npm install

# 3. Buat file environment variable
cp .env.example .env
```

### Konfigurasi Environment

Buat file `.env` di root proyek:

```env
VITE_DEEPSEEK_API_KEY=sk-or-v1-your-api-key-here
```

> 🔑 Dapatkan API Key gratis di [OpenRouter.ai](https://openrouter.ai) — daftarkan akun, lalu generate key baru.

```bash
# 4. Jalankan development server
npm run dev

# App akan berjalan di http://localhost:3000
```

---

## 🌐 Deployment ke Vercel

### Langkah Deploy

```bash
# Build untuk production
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

### ⚠️ Penting: Environment Variables di Vercel

Setelah deploy, tambahkan environment variable di **Vercel Dashboard**:

1. Buka: `Project Settings → Environment Variables`
2. Tambahkan:
   - **Key:** `VITE_DEEPSEEK_API_KEY`
   - **Value:** *API key kamu dari OpenRouter*
   - **Environment:** All Environments
3. **Redeploy** project

> File `.env` tidak akan ter-push ke GitHub karena sudah ada di `.gitignore`.

---

## 📁 Struktur Proyek

```
Banyumas-Policy-Intel/
├── components/
│   ├── Charts.tsx          # Komponen forecast chart (Recharts)
│   ├── ComparisonPanel.tsx # Panel perbandingan antar kecamatan
│   ├── MapComponent.tsx    # Peta interaktif Leaflet
│   └── SimulationPanel.tsx # Panel simulasi kebijakan
├── services/
│   ├── geminiService.ts    # Integrasi OpenRouter AI API
│   └── pdfService.ts       # Export laporan PDF
├── App.tsx                 # Root component & state management
├── constants.ts            # Dataset kecamatan Banyumas
├── types.ts                # TypeScript type definitions
├── index.tsx               # Entry point
├── index.html              # HTML template
├── vite.config.ts          # Konfigurasi Vite + proxy
└── vercel.json             # Konfigurasi deployment Vercel
```

---

## 📊 Dataset

Dataset yang digunakan merupakan data sintetis yang diinspirasi dari kondisi riil Kabupaten Banyumas, mencakup:

- **27 Kecamatan** dengan data sosial-ekonomi lengkap
- Variabel: angka kemiskinan, jumlah faskes, sekolah, UMKM, kualitas jalan
- Data historis kemiskinan 5 tahun (2019–2023)
- Koordinat geografis untuk visualisasi peta



## 🔌 API & Proxy

Project ini menggunakan **OpenRouter** sebagai gateway ke model LLM gratis (Hermes 3 Llama 3.1 405B).

Proxy dikonfigurasi di `vite.config.ts` untuk development:
```
/api/deepseek/* → https://openrouter.ai/api/v1/*
```

Di production Vercel, proxy ditangani oleh `vercel.json` rewrites.

---

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository ini
2. Buat branch fitur: `git checkout -b feature/nama-fitur`
3. Commit perubahan: `git commit -m 'feat: tambah fitur baru'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request

---

## 👤 Author

**Restu Firmansyah**

[![GitHub](https://img.shields.io/badge/GitHub-FirmanRcode-181717?style=flat-square&logo=github)](https://github.com/FirmanRcode)

---

## 📄 Lisensi

Proyek ini menggunakan lisensi [MIT](LICENSE).

---

<div align="center">

Dibuat dengan ❤️ untuk mendukung kebijakan publik berbasis data di Indonesia

⭐ Jangan lupa beri bintang jika proyek ini bermanfaat!

</div>
