// lib/db.js
import Dexie from "dexie";

/**
 * PJOK Cloud DB (IndexedDB via Dexie)
 *
 * Tabel:
 * - files:     simpan blob kecil base64 (avatar, dsb)  -> { id: string, dataUrl: string }
 * - jadwal:    jadwal per jamKe & hari                 -> { id?: number, jamKe: number, hari: string, isi: string }
 * - siswaKelas: daftar siswa per kelas (unik)          -> { kelas: string (PK), list: string[] }
 *
 * Versi:
 * v1  : files, jadwal
 * v2+ : tambah siswaKelas
 */

export const db = new Dexie("pjok_cloud");

// --- v1 schema (kalau DB baru, step ini otomatis dibuat) ---
db.version(1).stores({
  files: "id",                 // primary key string
  jadwal: "++id, jamKe, hari", // auto-increment id, index jamKe & hari
});

// --- v2 schema: tambah siswaKelas (PK=kelas) ---
db.version(2).stores({
  files: "id",
  jadwal: "++id, jamKe, hari",
  siswaKelas: "&kelas", // unique key kelas
}).upgrade(async (tx) => {
  // nothing to migrate explicitly; table baru saja ditambahkan
});

// (opsional) versi berikutnya jika nanti butuh perubahan lain, biarkan placeholder:
db.version(3).stores({
  files: "id",
  jadwal: "++id, jamKe, hari",
  siswaKelas: "&kelas",
}).upgrade(async () => { /* no-op */ });

/**
 * Helper opsional agar aman dipakai di SSR/CSR
 * (Dexie otomatis handle, ini hanya placeholder kalau mau cek fitur browser)
 */
export function isIDBAvailable() {
  try {
    return typeof indexedDB !== "undefined";
  } catch {
    return false;
  }
}
