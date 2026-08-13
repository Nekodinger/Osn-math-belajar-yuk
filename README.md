# Aljabar — Siap Olimpiade Matematika SMP (Modul Interaktif)

Situs statis satu halaman (`index.html` + `app.js`) berisi BAB 1 Aljabar:
Operasi Aljabar, Fungsi, Persamaan Linear, SPLDV, Pertidaksamaan Linear,
Barisan & Deret, dan Statistika — lengkap dengan alat peraga interaktif
dan 35 soal latihan berkoreksi otomatis.

Tidak perlu build step. Murni HTML/CSS/JS + MathJax (CDN) untuk render rumus.

## Cara deploy ke GitHub Pages

1. Buat repository baru di GitHub (boleh publik atau privat‑lalu‑publik‑pages).
2. Upload `index.html` dan `app.js` ke root repository tersebut (drag‑and‑drop
   lewat web GitHub juga bisa, tidak perlu command line).
3. Buka **Settings → Pages** pada repo.
4. Pada **Source**, pilih branch `main` dan folder `/ (root)`, lalu **Save**.
5. Tunggu 1–2 menit, situs akan aktif di:
   `https://<username-github-anda>.github.io/<nama-repo>/`

## Struktur file

- `index.html` — semua konten & markup (teori, contoh, 7 alat interaktif, kuis)
- `app.js` — logika navigasi, alat interaktif, dan mesin kuis (vanilla JS)

## Catatan

- Skor kuis tiap sub-bab tersimpan di `localStorage` browser murid (per
  perangkat), sehingga progres tetap ada saat halaman dibuka ulang.
- Semua rumus dan contoh soal telah diverifikasi ulang perhitungannya saat
  modul ini disusun.
