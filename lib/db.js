import Dexie from "dexie";

export const db = new Dexie("pjok_db");

// v1: identitas, siswa, jadwal, presensi, nilai
// v2: + files (untuk avatar selfie, dsb)
db.version(1).stores({
  identitas: "id",
  siswa: "++id, nama, kelas",
  jadwal: "++id, hari, jamKe",
  presensi: "++id, tanggal, kelas, siswaId, materi, pertemuan, status",
  nilai: "++id, kelas, materi, pertemuan, siswaId"
});

db.version(2).stores({
  files: "id" // simpan dataUrl base64: id='avatar_self'
});
