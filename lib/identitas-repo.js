import { db } from "./db";

const ROW_ID = "default";
export const IDENTITAS_FIELDS = [
  "namaSekolah",
  "namaGuru",
  "nipGuru",
  "namaKepalaSekolah",
  "nipKepalaSekolah",
  "namaPengawas",
  "nipPengawas",
  // "kotaSekolah", // opsional
];

export async function loadIdentitas() {
  const row = await db.identitas.get(ROW_ID);
  return (
    row?.data || {
      namaSekolah: "",
      namaGuru: "",
      nipGuru: "",
      namaKepalaSekolah: "",
      nipKepalaSekolah: "",
      namaPengawas: "",
      nipPengawas: "",
      kotaSekolah: "", // opsional
    }
  );
}

export async function saveIdentitas(data) {
  await db.identitas.put({ id: ROW_ID, data });
}

export async function hasIdentitas() {
  const d = await loadIdentitas();
  // kotaSekolah tidak diwajibkan di sini (samakan logikamu)
  const requiredOk =
    d.namaSekolah?.trim() &&
    d.namaGuru?.trim() &&
    d.namaKepalaSekolah?.trim() &&
    d.namaPengawas?.trim();

  const digitsOrEmpty = (v) => !v || String(v).trim() === "" || /^\d+$/.test(String(v));
  const nipsOk =
    digitsOrEmpty(d.nipGuru) &&
    digitsOrEmpty(d.nipKepalaSekolah) &&
    digitsOrEmpty(d.nipPengawas);

  return Boolean(requiredOk && nipsOk);
}
