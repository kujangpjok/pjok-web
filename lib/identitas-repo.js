import { db } from "./db";

const ROW_ID = "default";

export async function loadIdentitas() {
  const row = await db.identitas.get(ROW_ID);
  return row?.data || {
    namaSekolah:"", namaGuru:"", nipGuru:"",
    namaKepsek:"", nipKepsek:"", namaPengawas:"", nipPengawas:""
  };
}

export async function saveIdentitas(data) {
  await db.identitas.put({ id: ROW_ID, data });
}

export async function hasIdentitas() {
  const d = await loadIdentitas();
  const fields = ["namaSekolah","namaGuru","nipGuru","namaKepsek","nipKepsek","namaPengawas","nipPengawas"];
  return fields.every(k => d[k] && String(d[k]).trim() !== "");
}
