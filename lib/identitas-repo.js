import { db } from "./db";

const ROW_ID = "default";
const FIELDS = [
  "namaSekolah",
  "namaGuru",
  "nipGuru",
  "namaKepsek",
  "nipKepsek",
  "namaPengawas",
  "nipPengawas",
];

// muat data identitas (single row)
export async function loadIdentitas() {
  const row = await db.identitas.get(ROW_ID);
  return (
    row?.data || {
      namaSekolah: "",
      namaGuru: "",
      nipGuru: "",
      namaKepsek: "",
      nipKepsek: "",
      namaPengawas: "",
      nipPengawas: "",
    }
  );
}

// simpan data identitas
export async function saveIdentitas(data) {
  await db.identitas.put({ id: ROW_ID, data });
}

// cek kelengkapan
export async function hasIdentitas() {
  const d = await loadIdentitas();
  return FIELDS.every((k) => d[k] && String(d[k]).trim() !== "");
}
