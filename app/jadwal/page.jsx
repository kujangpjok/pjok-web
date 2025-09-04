"use client";

import Link from "next/link";

export default function JadwalPage() {
  return (
    <div className="min-h-[100dvh]" style={{background:"linear-gradient(180deg,#B3E5FC 0%,#03A9F4 100%)"}}>
      <div className="max-w-xl mx-auto p-4 flex flex-col items-center justify-center min-h-[100dvh]">
        <h1 className="text-[26px] font-extrabold text-black text-center mb-10">
          Manajemen Jadwal Pelajaran
        </h1>

        <ChoiceItem
          label="Edit Jadwal Pelajaran"
          desc="Ubah atau buat jadwal pelajaran baru."
          href="/edit_jadwal"
          emoji="🗓️"
        />

        <div className="h-6" />

        <ChoiceItem
          label="Lihat Jadwal Tersimpan"
          desc="Tampilkan jadwal pelajaran yang sudah ada."
          href="/lihat_jadwal"
          emoji="📘"
        />
      </div>
    </div>
  );
}

function ChoiceItem({ label, desc, href, emoji }) {
  return (
    <Link
      href={href}
      className="w-full rounded-2xl bg-white/80 hover:bg-white shadow px-4 py-5 block"
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{emoji}</div>
        <div>
          <div className="text-lg font-bold text-slate-800">{label}</div>
          <div className="text-sm text-slate-600">{desc}</div>
        </div>
      </div>
    </Link>
  );
}
