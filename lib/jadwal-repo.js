import { db } from "./db";
import { HARI_LIST } from "./jadwal-helpers";

// Bentuk map: { [jamKe:number]: { [hari:string]: string } }
export async function loadJadwalMap() {
  const rows = await db.jadwal.toArray(); // {id, jamKe, hari, isi}
  const map = {};
  for (const r of rows) {
    if (!map[r.jamKe]) map[r.jamKe] = {};
    map[r.jamKe][r.hari] = r.isi ?? r.text ?? r.value ?? "";
  }
  return map;
}

export async function saveJadwalMap(map) {
  // bersihkan tabel & tulis ulang (sederhana dan aman)
  await db.jadwal.clear();
  const bulk = [];
  for (const [jamKeStr, perHari] of Object.entries(map || {})) {
    const jamKe = Number(jamKeStr);
    for (const hari of HARI_LIST) {
      const isi = perHari?.[hari] ?? "";
      bulk.push({ jamKe, hari, isi });
    }
  }
  if (bulk.length) await db.jadwal.bulkAdd(bulk);
}
