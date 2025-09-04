"use client";

import { useEffect, useState } from "react";
import { addSiswa, downloadTemplateCSV, getKelas, importCSVToKelas, removeSiswaAt, saveKelas } from "../../../lib/siswa-repo";

export default function SiswaDetailPage({ params }) {
  const kelasParam = decodeURIComponent(params.kelas || "");
  const [list, setList] = useState([]);
  const [nama, setNama] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    setList(await getKelas(kelasParam));
    setLoading(false);
  }
  useEffect(()=>{ refresh(); }, [kelasParam]);

  async function onTambah() {
    const v = nama.trim();
    if (!v) return;
    await addSiswa(kelasParam, v);
    setNama("");
    refresh();
  }

  async function onHapus(i) {
    await removeSiswaAt(kelasParam, i);
    refresh();
  }

  async function onImportCSV(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const n = await importCSVToKelas(kelasParam, f);
    alert(n ? `Import ${n} nama berhasil.` : "Berkas tidak berisi nama yang valid.");
    e.target.value = "";
    refresh();
  }

  function onDownloadTemplate() {
    downloadTemplateCSV(kelasParam);
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{kelasParam}</h1>
          <div className="flex gap-2">
            <button onClick={onDownloadTemplate} className="px-3 py-2 rounded border">Download Format</button>
            <label className="px-3 py-2 rounded bg-blue-600 text-white cursor-pointer">
              Import CSV
              <input type="file" accept=".csv,text/csv" onChange={onImportCSV} className="hidden"/>
            </label>
          </div>
        </div>

        <div className="mt-4">
          <div className="font-medium mb-1">Tambah Siswa</div>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Nama Siswa"
            value={nama}
            onChange={(e)=>setNama(e.target.value)}
          />
          <div className="text-sm text-red-600 italic my-2">Masukkan nama lengkap siswa lalu tekan Tambah.</div>
          <button onClick={onTambah} disabled={!nama.trim()} className="w-full px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60">
            Tambah
          </button>
        </div>

        <div className="mt-6">
          <div className="font-medium mb-2">Daftar Siswa</div>
          {loading ? (
            <div>Memuat…</div>
          ) : list.length === 0 ? (
            <div>Belum ada siswa di kelas ini.</div>
          ) : (
            <ul>
              {list.map((s, idx)=>(
                <li key={`${s}-${idx}`} className="flex items-center justify-between py-2 border-b">
                  <div>{idx+1}. {s}</div>
                  <button onClick={()=>onHapus(idx)} className="px-3 py-1 rounded bg-red-600 text-white">Hapus</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
