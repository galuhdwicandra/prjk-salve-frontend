# Keputusan Model Akses CRAFT

Status: **Disepakati** — implementasi bertahap, belum selesai.
Tanggal: 2026-08-03.
Cakupan: `backend/` dan `frontend/`. `project-pwa/` hanya rujukan desain.

---

## 1. Keputusan inti

Model akses mengikuti CRAFT sepenuhnya:

1. **`modules[]` per user** menentukan menu dan endpoint apa yang boleh diakses.
2. **`role_label` adalah label teks bebas** — hanya untuk ditampilkan. Tidak
   dipakai untuk keputusan otorisasi apa pun.
3. **Tiga flag boolean per user**: `manager`, `show_balance`, `custom_price`.
4. **Multi-cabang per user** lewat tabel pivot `branch_user`.
5. **Role backend (Spatie) tidak lagi menentukan akses.** Paket
   `spatie/laravel-permission` tetap terpasang sementara sebagai sumber
   backfill dan penopang kode lama yang belum dipindahkan.

Konsekuensi yang diterima: satu user bisa punya kombinasi modul yang tidak
sesuai dengan enam role lama mana pun. Itu memang tujuannya.

---

## 2. Daftar 22 modul

Sumber kebenaran ada di kode, bukan di dokumen ini:
`frontend/src/api/client.ts` → konstanta `MODULE_KEYS`.

| # | Key | Kelompok | Halaman |
|---|---|---|---|
| 1 | `dashboard` | Dashboard | `/` |
| 2 | `kasir-pos` | Kasir | `/pos` |
| 3 | `kasir-receipt` | Kasir | `/orders` |
| 4 | `kasir-customer` | Kasir | `/customers` |
| 5 | `kasir-promo` | Kasir | `/vouchers` |
| 6 | `ops-sorting` | Operasional | — belum ada |
| 7 | `ops-proses` | Operasional | `/production-board` |
| 8 | `ops-kirim` | Operasional | `/deliveries` |
| 9 | `ops-tracker` | Operasional | — belum ada |
| 10 | `fin-kas` | Keuangan | — belum ada |
| 11 | `fin-transaksi` | Keuangan | `/expenses` |
| 12 | `fin-kontak` | Keuangan | — belum ada |
| 13 | `laporan` | Laporan | `/accounting/ledger`, `/accounting/cash-flow`, `/production-board/reports` |
| 14 | `set-user` | Pengaturan | `/users` |
| 15 | `set-master` | Pengaturan | `/services` |
| 16 | `set-outlet` | Pengaturan | `/branches` |
| 17 | `set-coa` | Pengaturan | — belum ada |
| 18 | `set-jurnal` | Pengaturan | `/accounting/account-mappings` |
| 19 | `set-labels` | Pengaturan | — belum ada |
| 20 | `set-paymethod` | Pengaturan | — belum ada |
| 21 | `set-num` | Pengaturan | — belum ada |
| 22 | `set-wa` | Pengaturan | `/settings` |

Pemetaan modul ke halaman ada di `frontend/src/layouts/menu.tsx` →
`MENU_GROUPS`. **14 dari 22 modul sudah terhubung ke halaman.** Delapan
sisanya (`ops-sorting`, `ops-tracker`, `fin-kas`, `fin-kontak`, `set-coa`,
`set-labels`, `set-paymethod`, `set-num`) sudah dideklarasikan tapi belum
punya layar. Key-nya dikunci sekarang supaya backfill tidak perlu diulang
saat layarnya menyusul.

---

## 3. Flag

| Flag | Arti | Default |
|---|---|---|
| `manager` | Boleh melakukan aksi supervisor: ubah order yang sudah berjalan, setujui koreksi produksi, buka kembali sesi kas | `false` |
| `show_balance` | Boleh melihat angka saldo dan nominal keuangan | `false` |
| `custom_price` | Boleh mengubah harga di luar daftar harga saat transaksi | `false` |

Flag bersifat ortogonal terhadap `modules[]`. Punya `kasir-pos` menentukan
boleh membuka POS; `custom_price` menentukan boleh mengubah harga di dalamnya.

---

## 4. Multi-cabang

- Tabel pivot **`branch_user`** — `user_id` (bigint, FK `users.id`),
  `branch_id` (uuid, FK `branches.id`), primary key gabungan.
- Relasi `User::branches()` (`belongsToMany`), helper `User::branchIds()` dan
  `User::inBranch(?string $branchId)`.
- Kolom lama **`users.branch_id` tetap ada untuk sementara** karena masih
  dipakai puluhan controller sebagai scope. Ia dibuang setelah semua
  pemanggilnya pindah ke `branchIds()`.
- Backfill: setiap user dengan `users.branch_id` terisi mendapat satu baris
  `branch_user` untuk cabang itu.

Endpoint `/auth/me` mengembalikan `branches[]` berisi `{id, code, name}`.
Frontend mengambil cabang aktif dari `branches[0]`, bukan lagi dari objek
`branch` tunggal.

---

## 5. Pemetaan backfill dari 6 role lama

Enam role lama: `Superadmin`, `Admin Cabang`, `Kasir`, `Petugas Cuci`,
`Kurir`, `Akuntansi` (`backend/database/seeders/RolesTableSeeder.php`).

| Role lama | modules | manager | show_balance | custom_price |
|---|---|---|---|---|
| **Superadmin** | seluruh 22 modul | ✅ | ✅ | ✅ |
| **Admin Cabang** | `dashboard`, `kasir-pos`, `kasir-receipt`, `kasir-customer`, `kasir-promo`, `ops-proses`, `ops-kirim`, `fin-transaksi`, `laporan`, `set-user`, `set-master`, `set-wa` | ✅ | ✅ | ✅ |
| **Kasir** | `dashboard`, `kasir-pos`, `kasir-receipt`, `kasir-customer`, `kasir-promo`, `laporan` | ❌ | ❌ | ❌ |
| **Petugas Cuci** | `dashboard`, `ops-proses` | ❌ | ❌ | ❌ |
| **Kurir** | `dashboard`, `ops-kirim` | ❌ | ❌ | ❌ |
| **Akuntansi** | `dashboard`, `laporan`, `set-coa`, `set-jurnal` | ❌ | ✅ | ❌ |

`role_label` diisi dengan nama role lama apa adanya.

### Dasar pemetaan

Setiap baris diturunkan dari policy yang benar-benar ada di backend, bukan
dari asumsi:

| Modul | Bukti |
|---|---|
| `kasir-pos`, `kasir-receipt` | `OrderPolicy` — `create`/`update` untuk Admin Cabang & Kasir |
| `kasir-customer` | `CustomerPolicy::viewAny` — Admin Cabang, Kasir |
| `kasir-promo` | `VoucherPolicy` — Admin Cabang (CRUD), Kasir (view) |
| `ops-proses` | `ProductionBoardController` — Admin Cabang, Petugas Cuci |
| `ops-kirim` | `DeliveryPolicy` — Admin Cabang, Kasir, Kurir |
| `fin-transaksi` | `ExpensePolicy` — Admin Cabang |
| `laporan` | `ReportFilterRequest` — Admin Cabang, Kasir, Akuntansi |
| `set-user` | `UserPolicy` — Admin Cabang |
| `set-master` | `ServicePolicy` — Admin Cabang |
| `set-coa`, `set-jurnal` | `AccountingAccountPolicy`, `AccountingAccountMappingPolicy` — Akuntansi |
| `set-wa` | `WhatsappTemplatePolicy` — Admin Cabang |

### Aturan penggabungan

Spatie mengizinkan satu user memegang lebih dari satu role. Untuk user
seperti itu, backfill **menggabungkan** hasilnya: `modules` adalah gabungan
unik dari semua role yang dimiliki, dan tiap flag benar bila salah satu role
memberinya. `role_label` diambil dari role pertama yang cocok.

---

## 6. Titik penegakan

| Lapis | Mekanisme | Berkas |
|---|---|---|
| Menu | `useVisibleMenuGroups()` menyaring item berdasarkan `modules` | `frontend/src/layouts/menu.tsx` |
| Rute frontend | Komponen `Guarded` | `frontend/src/router/Guarded.tsx` |
| Rute backend | Middleware alias `module:<key>` | `backend/app/Http/Middleware/EnsureModuleAccess.php` |
| Data per baris | Policy — scope cabang lewat `inBranch()`, aksi supervisor lewat `isManager()` | `backend/app/Policies/` |

Penyaringan di frontend adalah kenyamanan tampilan, **bukan** kontrol
keamanan. Middleware dan policy backend adalah penegak sebenarnya.

Middleware `module:` sudah terpasang pada `set-user`, `set-outlet`,
`set-master`, `set-jurnal`, `laporan`, `ops-proses`, `ops-kirim`,
`kasir-promo`, `fin-transaksi`, `dashboard`, dan `set-wa` — 71 dari 126 rute
`v1`. Syarat rilis: kedua migrasi backfill **wajib jalan sebelum** kode ini
dideploy; `modules` kosong berarti 403 untuk semua orang, termasuk Superadmin.

---

## 7. Yang belum diputuskan

1. **`set-outlet` (`/branches`).** `BranchPolicy` memberi `create`/`delete`
   hanya ke Superadmin tapi `update` juga ke Admin Cabang. Satu modul tidak
   bisa mewakili dua level ini. Pilihan: Superadmin-only, atau Admin Cabang
   ikut dapat dengan pembatasan aksi di policy. Sementara ini `set-outlet`
   hanya diberikan ke Superadmin.
2. **Delapan modul tanpa layar.** Sementara ini hanya Superadmin yang
   memilikinya. Ditinjau ulang saat layarnya dibuat.
3. **Pemetaan endpoint order ke modul.** `DELETE /orders/{order}` lebih dekat
   ke pembatalan daripada ke POS; belum diputuskan masuk `kasir-pos` atau
   `kasir-receipt`. Rute turunan `/orders/{order}/status`,
   `/loyalty-correction`, `/photos`, `/apply-voucher` juga belum dipetakan.
4. **Kontrak user CRUD.** Frontend sudah mengirim `role_label`, `modules`,
   `manager`, `show_balance`, `custom_price`, `branch_ids`
   (`frontend/src/types/users.ts`), sementara `UserStoreRequest` backend masih
   mewajibkan `role`. Aturan validasi `branch_ids` bergantung pada keputusan
   nomor 1.

---

## 8. Rencana migrasi bertahap

Model lama dan baru berjalan berdampingan sampai langkah 5 selesai.

| # | Langkah | Status |
|---|---|---|
| 1 | Skema: kolom CRAFT di `users` + tabel `branch_user` + backfill `branch_user` dari `users.branch_id` | Migration siap |
| 2 | Backfill `modules` dan flag dari 6 role lama | Migration siap |
| 3 | `/auth/me` mengirim `modules`, `branches`, flag, `role_label` — **aditif**, `roles` lama tetap dikirim | Selesai |
| 4 | Frontend beralih ke `modules` untuk menu dan guard rute | Selesai |
| 5 | Backend pindah dari `hasRole()` ke `canModule()`/`isManager()`/`inBranch()`, satu domain per PR: Order → WashNote → Delivery → Accounting | Belum |
| 6 | Pasang middleware `module:` ke rute | Selesai untuk 11 modul; `/orders`, `/customers`, `/wash-notes`, `/receivables`, `/cash-sessions`, `/loyalty`, `/invoice-counters` sengaja dibiarkan (lihat §7.3) |
| 7 | Selaraskan `UserStoreRequest`/`UserUpdateRequest`/`UserService` ke payload CRAFT | Selesai |
| 8 | Buang `users.branch_id`, endpoint `POST /users/{user}/roles`, dan `spatie/laravel-permission` | Belum — menunggu 5 dan 7 |

Langkah 5 dipecah per domain supaya tiap PR bisa di-rollback sendiri.
Sekitar 230 pemanggilan `hasRole`/`hasAnyRole`/`getRoleNames` tersebar di
policy, controller, service, dan form request — memindahkannya sekaligus
tidak bisa diverifikasi.

---

## 9. Sumber kebenaran di kode

| Apa | Di mana |
|---|---|
| Daftar 22 modul | `frontend/src/api/client.ts` → `MODULE_KEYS` |
| Bentuk user terautentikasi | `frontend/src/api/client.ts` → `MeUser` |
| Modul → halaman | `frontend/src/layouts/menu.tsx` → `MENU_GROUPS` |
| Bentuk payload user CRUD | `frontend/src/types/users.ts` → `UserUpsertPayload` |
| Skema kolom & pivot | `backend/database/migrations/2026_08_03_192029_add_craft_access_to_users_table.php` |
| Pemetaan backfill | `backend/database/migrations/2026_08_03_192134_backfill_user_modules_from_roles.php` |
| Helper akses | `backend/app/Models/User.php` → `canModule`, `isManager`, `inBranch`, `branchIds` |
| Penegakan rute | `backend/app/Http/Middleware/EnsureModuleAccess.php` |
| Payload `/auth/me` | `backend/app/Services/AuthService.php` → `presentUser` |

Dokumen ini merangkum keputusan. Bila isinya berbeda dengan kode, kode yang
berlaku dan dokumen ini yang diperbarui.
