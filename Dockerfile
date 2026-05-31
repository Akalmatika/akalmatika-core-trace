# Tahap 1: Membangun Aplikasi (Build Stage)
FROM node:18-alpine AS builder

# Atur direktori kerja di dalam container
WORKDIR /app

# Salin file dependencies terlebih dahulu (untuk optimasi cache Docker)
COPY package*.json ./

# Install semua dependency
RUN npm install

# Salin seluruh kode proyek
COPY . .

# Eksekusi proses build Vite (hasilnya akan masuk ke folder /dist)
RUN npm run build

# Tahap 2: Menjalankan Aplikasi dengan Web Server Ringan (Production Stage)
FROM nginx:alpine

# Salin konfigurasi Nginx khusus untuk Single Page Application (SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Salin folder hasil build (/dist) dari tahap 1 ke folder publik Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Ekspos port 80 (Port default HTTP)
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
