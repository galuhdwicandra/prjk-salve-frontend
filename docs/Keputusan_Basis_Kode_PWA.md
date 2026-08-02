# Keputusan: Basis Kode PWA

- **Status:** Diputuskan
- **Tanggal:** 2026-08-01
- **Ticket:** LARK — Spike: putuskan basis kode PWA
- **Berlaku untuk:** seluruh pekerjaan frontend setelah tanggal di atas

## Keputusan

Basis kode adalah **`frontend/` yang sudah ada** (React 19 + Vite 7 +
TypeScript + Tailwind 4, di atas API Laravel `backend/`).

`project-pwa/CRAFT V0.html` diperlakukan sebagai **spesifikasi desain**:
referensi visual dan alur, **bukan** kode yang akan di-port baris per baris,
dan **bukan** basis yang akan dikembangkan lebih lanjut.

Tidak ada rewrite. Tidak ada penambahan halaman baru ke file HTML tunggal itu.

## Konteks

Pilihan yang tertulis di ticket ("port ke React/Vite" vs "lanjut vanilla
single-file") mengandaikan belum ada aplikasi React. Kenyataannya `frontend/`
sudah berisi 44 file halaman, 55 deklarasi route, dan 22 modul API di atas
`backend/routes/api.php`, mencakup domain yang sama dengan CRAFT V0.

## Alasan

1. **Domainnya tumpang tindih hampir seluruhnya.** POS, order, customer,
   voucher, production board, delivery, kas, expense, dashboard, laporan,
   buku besar, cash flow, COA, mapping jurnal, user, branch, layanan,
   penomoran invoice, dan template WhatsApp sudah punya halaman dan endpoint.
   Port berarti menulis ulang yang sudah berjalan.

2. **CRAFT V0 adalah prototipe, bukan aplikasi setengah jadi.** Nol panggilan
   HTTP ke backend. Seluruh state di `localStorage` / `window.storage`.
   Password user plaintext. Hint login menyebut dirinya "Akun demo
   (prototype)". Melanjutkannya berarti membangun ulang auth Sanctum,
   22 modul API, dan modul akuntansi dari nol.

3. **Ia belum PWA.** `manifest.webmanifest`, `sw.js`, dan `icon-192.png`
   dirujuk tetapi tidak ada di folder. Tanpa service worker tidak ada offline,
   dan xlsx serta font masih ditarik dari CDN.

4. **Penyimpanan foto mentok.** Alur wajib foto di sortir, workshop,
   serah-terima, dan surat jalan. Foto disimpan base64 di dalam objek order;
   kuota `localStorage` ~5 MB, dan kegagalan `setItem` ditelan diam-diam
   sehingga kasir tidak tahu data gagal tersimpan. Ini masalah tempat
   penyimpanan, tidak selesai dengan ganti framework.

5. **Single-file sulit direview.** 7.829 baris tanpa modul, 322 assignment
   `.onclick`, 175 assignment `.innerHTML =`, dan folder `project-pwa/`
   berada di luar repository frontend.

## Konsekuensi

- Setiap layar CRAFT dikerjakan sebagai PR restyle terhadap halaman React
  yang sudah ada. Satu layar, satu PR.
- Fitur di CRAFT yang belum punya padanan — **kontak/vendor**,
  **metode pembayaran**, **label customer** — masuk backlog sebagai
  pekerjaan backend + frontend terpisah, di luar lingkup redesign.
- `CRAFT V0.html` disimpan read-only sebagai artefak desain. Saat ini file
  berada di `project-pwa/` dan tidak terdaftar pada repository frontend.
  Tidak ada fitur baru yang ditambahkan ke sana.
- Kebutuhan "installable / offline" belum diimplementasikan oleh keputusan
  ini. Implementasi PWA, strategi cache, dan offline-write harus menjadi
  pekerjaan terpisah setelah requirement installability, sinkronisasi, dan
  konflik data ditetapkan.

## Yang perlu dikonfirmasi ke stakeholder

CRAFT dibranding "CRAFT · by Ruang Kolase" sementara `frontend/` berjudul
"Salve". Kalau CRAFT dimaksudkan sebagai produk multi-tenant, itu keputusan
produk yang terpisah — dan tetap tidak mengubah keputusan di dokumen ini,
karena basis multi-tenant yang masuk akal tetap `frontend/` + API, bukan
aplikasi `localStorage`.
