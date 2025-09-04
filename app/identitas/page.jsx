"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadIdentitas, saveIdentitas } from "../../lib/identitas-repo";

const FIELDS = [
  { key:"namaSekolah", label:"Nama Sekolah" },
  { key:"namaGuru", label:"Nama Guru" },
  { key:"nipGuru", label:"NIP Guru" },
  { key:"namaKepsek", label:"Nama Kepala Sekolah" },
  { key:"nipKepsek", label:"NIP Kepala Sekolah" },
  { key:"namaPengawas", label:"Nama Pengawas" },
  { key:"nipPengawas", label:"NIP Pengawas" }
];

export default function IdentitasPage(){
  const router = useRouter();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { (async () => setData(await loadIdentitas()))(); }, []);

  if (!data) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div>Memuat...</div>
      </div>
    );
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    for (const f of FIELDS) {
      if (!data[f.key] || String(data[f.key]).trim() === "") {
        alert(`${f.label} wajib diisi`); return;
      }
    }
    setSaving(true);
    await saveIdentitas(data);
    setSaving(false);
    router.push("/menu");
  };

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold text-slate-900 mb-3">Isi Identitas</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {FIELDS.map(f => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-sm text-slate-700">{f.label}</label>
              <input
                className="px-3 py-2 rounded border border-slate-300 bg-white text-slate-900 outline-none"
                value={data[f.key] || ""}
                onChange={e => setData({ ...data, [f.key]: e.target.value })}
                required
              />
            </div>
          ))}
          <div className="flex gap-2">
            <button
              disabled={saving}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:brightness-110 disabled:opacity-60"
              type="submit"
            >
              {saving ? "Menyimpan..." : "Simpan & Lanjut"}
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded border border-slate-300 text-slate-700"
              onClick={() => setData({
                namaSekolah:"", namaGuru:"", nipGuru:"",
                namaKepsek:"", nipKepsek:"", namaPengawas:"", nipPengawas:""
              })}
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
