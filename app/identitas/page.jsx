"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdentitas, saveIdentitas } from "../../lib/identitas";

const FIELDS = [
  { key: "namaSekolah", label: "Nama Sekolah" },
  { key: "namaGuru", label: "Nama Guru" },
  { key: "nipGuru", label: "NIP Guru" },
  { key: "namaKepsek", label: "Nama Kepala Sekolah" },
  { key: "nipKepsek", label: "NIP Kepala Sekolah" },
  { key: "namaPengawas", label: "Nama Pengawas" },
  { key: "nipPengawas", label: "NIP Pengawas" }
];

export default function IdentitasPage() {
  const router = useRouter();
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => { setData(getIdentitas()); }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    // validasi simple: semua wajib isi
    for (const f of FIELDS) {
      if (!data[f.key] || String(data[f.key]).trim() === "") {
        alert(`${f.label} wajib diisi`);
        return;
      }
    }
    setSaving(true);
    saveIdentitas(data);
    setOk(true);
    setSaving(false);
    router.push("/menu");
  };

  return (
    <div className="min-h-[100dvh] bg-slate-900">
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-xl font-semibold mb-3">Isi Identitas</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          {FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-1">
              <label className="text-sm">{f.label}</label>
              <input
                className="px-3 py-2 rounded border border-white/10 bg-slate-800 outline-none"
                value={data[f.key] || ""}
                onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
                required
              />
            </div>
          ))}
          <button
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 hover:brightness-110 disabled:opacity-60"
            type="submit"
          >
            {saving ? "Menyimpan..." : "Simpan & Lanjut"}
          </button>
          {ok && <div className="text-green-400 text-sm">Tersimpan.</div>}
        </form>
      </div>
    </div>
  );
}
