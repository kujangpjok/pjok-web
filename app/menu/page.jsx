"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getIdentitas, hasIdentitas } from "../../lib/identitas";
import { useRouter } from "next/navigation";

const MENU = [
  { key: "jadwal", label: "Jadwal" },
  { key: "modul", label: "Modul" },
  { key: "presensi", label: "Presensi" },
  { key: "penilaian", label: "Penilaian" },
  { key: "administrasi", label: "Administrasi" },
  { key: "siswa", label: "Data Siswa" }
];

export default function MenuPage() {
  const router = useRouter();
  const [identitas, setIdentitas] = useState(null);

  useEffect(() => {
    if (!hasIdentitas()) {
      router.replace("/identitas");
      return;
    }
    setIdentitas(getIdentitas());
  }, [router]);

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-blue-800/40 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <div className="text-sm opacity-80">Selamat datang,</div>
          <h1 className="text-2xl font-semibold">
            {identitas?.namaGuru || "Guru"} – {identitas?.namaSekolah || "Sekolah"}
          </h1>
          <div className="text-xs opacity-70 mt-1">
            (Edit identitas di <Link href="/identitas" className="underline">halaman Identitas</Link>)
          </div>
        </header>

        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MENU.map((m) => (
            <div
              key={m.key}
              className="rounded-2xl bg-slate-800/70 border border-white/10 p-4 hover:brightness-110 cursor-pointer select-none"
              onClick={() => alert(`${m.label} (belum diimplementasi)`)}
            >
              <div className="text-lg font-medium">{m.label}</div>
              <div className="text-xs opacity-70">Buka {m.label}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
