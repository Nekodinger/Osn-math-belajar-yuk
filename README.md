# Aljabar — Siap Olimpiade Matematika SMP (Modul Interaktif)

Situs statis satu halaman (`index.html` + `app.js`) berisi BAB 1 Aljabar:
Operasi Aljabar, Fungsi, Persamaan Linear, SPLDV, Pertidaksamaan Linear,
Barisan & Deret, dan Statistika — lengkap dengan alat peraga interaktif
dan 35 soal latihan berkoreksi otomatis.

## Struktur file

- `index.html` — semua konten & markup (teori, contoh, 7 alat interaktif, kuis)
- `app.js` — logika navigasi, alat interaktif, dan mesin kuis (vanilla JS)

## Catatan

- Skor kuis tiap sub-bab tersimpan di `localStorage` browser murid (per
  perangkat), sehingga progres tetap ada saat halaman dibuka ulang.
- Semua rumus dan contoh soal telah diverifikasi ulang perhitungannya saat
  modul ini disusun.
