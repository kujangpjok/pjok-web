"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadIdentitas, hasIdentitas } from "../../lib/identitas-repo";

const MENU = [
  { key:"jadwal", label:"Jadwal" },
  { key:"modul", label:"Modul" },
  { key:"presensi", label:"Presensi" },
  { key:"penilaian", label:"Penilaian" },
  { key:"administrasi", label:"Administrasi" },
  { key:"siswa", label:"Data Siswa" }
];

export default function MenuPage(){
  const router = useRouter();
  const [identitas, setIdentitas] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ok = await hasIdentitas();
      if (!ok) { router.replace("/identitas"); return; }
      const d = await loadIdentitas();
      if (mounted) setIdentitas(d);
    })();
    return () => { mounted = false; };
  }, [router]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <div className="text-sm text-slate-600">Selamat datang,</div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {(identitas?.namaGuru || "Guru")} – {(identitas?.namaSekolah || "Sekolah")}
          </h1>
          <div className="text-xs text-slate-600 mt-1">
            (Ubah di halaman Identitas)
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MENU.map(m => (
            <button key={m.key}
              className="rounded-2xl bg-white border border-slate-200 p-4 text-left hover:shadow"
              onClick={() => alert(`${m.label} (belum diimplementasi)`)}
            >
              <div className="text-lg font-medium text-slate-900">{m.label}</div>
              <div className="text-xs text-slate-600">Buka {m.label}</div>
            </button>
          ))}
        </section>
      </div>
    </div>
  );
}
