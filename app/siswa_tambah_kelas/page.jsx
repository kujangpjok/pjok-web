"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { addKelas, deleteKelas, getAllKelas } from "../../lib/siswa-repo";

export default function SiswaFormPage() {
  const [kelasBaru, setKelasBaru] = useState("");
  const [rows, setRows] = useState([]);

  async function refresh(){ setRows(await getAllKelas()); }
  useEffect(()=>{ refresh(); }, []);

  async function onSave() {
    const v = kelasBaru.trim();
    if (!v) return;
    await addKelas(v);
    setKelasBaru("");
    refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-xl font-bold mb-3">Kelola Kelas</h1>

        {rows.length > 0 && (
          <>
            <div className="font-medium mb-2">Kelas Tersedia</div>
            <div className="space-y-2 mb-5">
              {rows.map((r)=>(
                <div key={r.kelas} className="rounded-xl bg-slate-50 p-3 flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{r.kelas}</div>
                    <div className="text-sm text-slate-600">{r.list?.length || 0} siswa</div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/siswa_detail/${encodeURIComponent(r.kelas)}`} className="px-3 py-2 rounded border">Lihat</Link>
                    <button onClick={async()=>{ await deleteKelas(r.kelas); refresh(); }} className="px-3 py-2 rounded bg-red-600 text-white">Hapus</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="font-medium mb-2">Tambah Kelas</div>
        <input
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Contoh: Kelas 1A"
          value={kelasBaru}
          onChange={(e)=>setKelasBaru(e.target.value)}
        />
        <div className="text-sm text-red-600 italic mb-3">Gunakan penamaan konsisten, misal: Kelas 1A, Kelas 5B.</div>
        <button onClick={onSave} disabled={!kelasBaru.trim()} className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">
          Simpan Kelas
        </button>
      </div>
    </div>
  );
}
