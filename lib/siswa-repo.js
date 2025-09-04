import { db } from "./db";

// Struktur dokumen: { kelas: "Kelas 1A", list: ["Ani", "Budi", ...] }

export async function getAllKelas() {
  const rows = await db.siswaKelas.toArray();
  // urutkan case-insensitive
  rows.sort((a,b) => a.kelas.localeCompare(b.kelas, undefined, {sensitivity:"base"}));
  return rows;
}

export async function getKelas(kelas) {
  const row = await db.siswaKelas.get(kelas);
  return row?.list || [];
}

export async function saveKelas(kelas, list) {
  await db.siswaKelas.put({ kelas, list: [...new Set(list.map(s=>s.trim()).filter(Boolean))] });
}

export async function addKelas(kelas) {
  const trimmed = (kelas || "").trim();
  if (!trimmed) return;
  const exists = await db.siswaKelas.get(trimmed);
  if (!exists) await db.siswaKelas.add({ kelas: trimmed, list: [] });
}

export async function deleteKelas(kelas) {
  await db.siswaKelas.delete(kelas);
}

export async function addSiswa(kelas, nama) {
  const list = await getKelas(kelas);
  list.push(nama.trim());
  await saveKelas(kelas, list);
}

export async function removeSiswaAt(kelas, idx) {
  const list = await getKelas(kelas);
  if (idx >= 0 && idx < list.length) {
    list.splice(idx, 1);
    await saveKelas(kelas, list);
  }
}

export function downloadTemplateCSV(kelas) {
  const header = "No,Nama\n";
  const blob = new Blob([header], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Template_Data_Siswa_${kelas || "Kelas"}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importCSVToKelas(kelas, file) {
  const text = await file.text();
  // simple CSV: ambil kolom kedua (Nama) dari baris, skip header
  const lines = text.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const names = [];
  for (let i=0;i<lines.length;i++){
    const cols = lines[i].split(",");
    if (i===0 && /nama/i.test(lines[i])) continue; // skip header jika ada
    const nama = (cols[1] ?? cols[0] ?? "").trim();
    if (nama && !/^(no|nama)$/i.test(nama)) names.push(nama);
  }
  if (!names.length) return 0;
  const cur = await getKelas(kelas);
  const merged = [...new Set([...cur, ...names])];
  await saveKelas(kelas, merged);
  return names.length;
}
