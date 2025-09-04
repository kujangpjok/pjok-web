"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasIdentitas } from "../lib/identitas-repo";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    let alive = true;
    (async () => {
      // jeda splash: 1200ms
      await new Promise((r) => setTimeout(r, 1200));

      // cek kelengkapan identitas dari IndexedDB
      const ok = await hasIdentitas();
      if (!alive) return;

      const target = ok ? "/menu" : "/identitas";
      router.replace(target);
    })();
    return () => {
      alive = false;
    };
  }, [router]);

  return (
    <div
      className="h-[100dvh] w-full flex items-center justify-center"
      style={{
        // Brush.verticalGradient(listOf(#B3E5FC, #03A9F4))
        background: "linear-gradient(180deg, #B3E5FC 0%, #03A9F4 100%)",
      }}
    >
      <div className="flex flex-col items-center">
        {/* Logo 180dp */}
        <div className="mb-6">
          <Image
            src="/logo_pjok.png"   // pastikan file ini ada di /public
            alt="Logo PJOK"
            width={180}
            height={180}
            priority
            style={{ objectFit: "contain" }}
          />
        </div>

        {/* Teks judul & subjudul & tahun */}
        <h1 className="text-[28px] font-bold text-white leading-none">
          Aplikasi PJOK
        </h1>
        <div className="text-[18px] font-semibold text-white">
          FKKG PJOK Kota Banjar
        </div>
        <div className="text-[16px] font-medium text-white">2025</div>

        {/* Spacer 40dp */}
        <div className="h-10" />

        {/* CircularProgressIndicator versi CSS */}
        <div className="w-9 h-9 border-4 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    </div>
  );
}
