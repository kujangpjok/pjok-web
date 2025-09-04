const KEY = "pjok_identitas_v1";

export function getIdentitas() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

export function saveIdentitas(data) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function hasIdentitas() {
  const d = getIdentitas();
  const fields = ["namaSekolah","namaGuru","nipGuru","namaKepsek","nipKepsek","namaPengawas","nipPengawas"];
  return fields.every(k => d[k] && String(d[k]).trim() !== "");
}
