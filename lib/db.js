// lib/db.js
import Dexie from "dexie";

export const db = new Dexie("pjok_cloud");

db.version(1).stores({
  files: "id",                 // primary key string
  jadwal: "++id, jamKe, hari", // auto-increment id, index jamKe & hari
});

db.version(2).stores({
  files: "id",
  jadwal: "++id, jamKe, hari",
  siswaKelas: "&kelas", // unique key kelas
}).upgrade(async (tx) => {
  
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
