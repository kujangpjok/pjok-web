import Dexie from "dexie";

export const db = new Dexie("pjok_db");
db.version(1).stores({
  identitas: "id",           // single row: id='default'
  siswa: "++id, nama, kelas",
  jadwal: "++id, hari, jamKe",
  presensi: "++id, tanggal, kelas, siswaId, materi, pertemuan, status",
  nilai: "++id, kelas, materi, pertemuan, siswaId"
});
