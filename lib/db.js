// lib/db.js
import Dexie from "dexie";

export const db = new Dexie("pjok_cloud");

// v1 (contoh lama): files, jadwal
// v2: tambah siswaKelas
db.version(2).stores({
  files: "id",                  // {id, dataUrl}
  jadwal: "++id, jamKe, hari",  // {id, jamKe, hari, isi}
  siswaKelas: "&kelas"          // {kelas, list: string[]}
});

// optional upgrade kalau dari versi lama
db.version(3).stores({
  files: "id",
  jadwal: "++id, jamKe, hari",
  siswaKelas: "&kelas"
}).upgrade(async () => { /* no-op, just ensure table exists */ });
