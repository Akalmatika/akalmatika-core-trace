# Akalmatika — Interactive Math Learning Platform

Akalmatika adalah platform pembelajaran matematika interaktif untuk mendiagnosis dan memulihkan miskonsepsi dasar (seperti bilangan bulat negatif, pecahan, persen, aljabar, dan PLSV) melalui jembatan konsep visual, drill bertahap, dan mastery check.

Portal ini dibagi menjadi dua area utama:
*   **Student Portal**: Tempat belajar mandiri terarah bagi murid.
*   **Teacher Portal**: Dashboard analitis bagi guru untuk memetakan kelemahan kelas secara visual.

Dokumen detail status rilis stabil pertama tersedia di [MVP_STABLE_FREEZE.md](MVP_STABLE_FREEZE.md). Skrip panduan presentasi demo 5-7 menit tersedia di [DEMO_SCRIPT.md](DEMO_SCRIPT.md).

---

## Panduan Menjalankan Platform

### 1. Prasyarat (Prerequisites)
Pastikan Anda memiliki **Node.js** terinstal di sistem Anda.

### 2. Instalasi Dependensi
Jalankan perintah berikut di direktori utama proyek:
```bash
npm install
```

### 3. Menjalankan Development Server (Local)
Gunakan perintah berikut untuk menyalakan Vite development server:
```bash
npm run dev
```
Setelah aktif, buka browser Anda di alamat: `http://localhost:3000/`

---

## Panduan Uji Coba & Pengujian Kode

### 1. Pengecekan Type-safety (TypeScript Check)
Pastikan kode bebas dari kesalahan penulisan tipe data:
```bash
npm run lint
```
*(Atau jalankan perintah internal: `node ./node_modules/typescript/bin/tsc --noEmit`)*

### 2. Menjalankan Playwright Test Suite Secara Lengkap
Untuk memvalidasi seluruh alur belajar murid (Worked Example, Guided Practice, Independent Practice, Mastery Check, Learning Map locks, dan Dashboard Guru) pada viewport Mobile 320x640:
```bash
node ./node_modules/playwright/cli.js test tests/audit-sprint-2.spec.ts tests/audit-sprint-3-integer.spec.ts tests/audit-sprint-3-fractions.spec.ts tests/audit-sprint-3-percent.spec.ts tests/audit-sprint-3-algebra.spec.ts tests/audit-sprint-3-plsv.spec.ts tests/audit-mvp-chain.spec.ts tests/audit-sprint-4-dashboard-student.spec.ts tests/audit-sprint-4-teacher-dashboard.spec.ts --project="Mobile 320x640" --reporter=line
```

---

## Alur & Rute Demo Utama (Core Routes)

*   **Beranda Utama (Landing Page)**: `http://localhost:3000/`
*   **Dashboard Belajar Siswa**: `http://localhost:3000/student/dashboard`
*   **Diagnosis Fondasi Awal**: `http://localhost:3000/student/diagnostic-foundation`
*   **Peta Alur Belajar Siswa**: `http://localhost:3000/student/learning-map`
*   **Dashboard Analitis Guru**: `http://localhost:3000/teacher/dashboard`
