const KEY = "pjok_identitas_v1";
export function getIdentitas(){ if(typeof window==="undefined") return {}; try{const r=localStorage.getItem(KEY); return r?JSON.parse(r):{};}catch{return{}}}
export function saveIdentitas(d){ if(typeof window==="undefined") return; localStorage.setItem(KEY, JSON.stringify(d)); }
export function hasIdentitas(){ const d=getIdentitas(); const f=["namaSekolah","namaGuru","nipGuru","namaKepsek","nipKepsek","namaPengawas","nipPengawas"]; return f.every(k=>d[k]&&String(d[k]).trim()!==""); }
