"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteKelas, getAllKelas } from "../../lib/siswa-repo";

export default function SiswaListPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setRows(await getAllKelas());
    setLoading(false);
  }
  useEffect(() => { refresh(); }, []);

  return (
    <div className="min-h-[100dvh]" style={{background:"linear-gradient(180deg,#B3E5FC 0%,#03A9F4 100%)"}}>
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Kelas</h1>
          <Link href="/siswa_tambah_kelas" className="px-3 py-2 rounded bg-blue-600 text-white">Tambah Kelas</Link>
        </div>

        {loading ? (
          <div>Memuat…</div>
        ) : rows.length === 0 ? (
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="font-medium mb-1">Belum ada data kelas</div>
            <div className="text-sm mb-3">Silakan isi data kelas terlebih dahulu.</div>
            <Link href="/siswa_tambah_kelas" className="px-3 py-2 rounded bg-blue-600 text-white inline-block">Isi Data Kelas</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {rows.map((r) => (
              <div key={r.kelas} className="rounded-xl bg-white/85 p-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold">{r.kelas}</div>
                  <div className="text-sm text-slate-600">{r.list?.length || 0} siswa</div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/siswa_detail/${encodeURIComponent(r.kelas)}`} className="px-3 py-2 rounded border">Lihat</Link>
                  <button
                    onClick={async () => { await deleteKelas(r.kelas); refresh(); }}
                    className="px-3 py-2 rounded bg-red-600 text-white"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
            <div className="h-10" />
          </div>
        )}
      </div>
    </div>
  );
}
