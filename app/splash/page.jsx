"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isIdentitasComplete } from "../../lib/user-prefs";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    let t = setTimeout(() => {
      // Aman: kalau gagal baca apa pun, default ke /identitas
      const complete = safeIsComplete();
      router.replace(complete ? "/menu" : "/identitas");
    }, 1200);
    return () => clearTimeout(t);
  }, [router]);

  function safeIsComplete() {
    try { return isIdentitasComplete(); } catch { return false; }
  }

  return (
    <div className="min-h-[100dvh] grid place-items-center"
         style={{background:"linear-gradient(180deg,#B3E5FC 0%,#03A9F4 100%)"}}>
      <div className="flex flex-col items-center">
        <Image src="/logo_pjok.png" alt="Logo PJOK" width={180} height={180}/>
        <div className="h-4"/>
        <div className="text-white font-extrabold text-2xl">Aplikasi PJOK</div>
        <div className="text-white/90 text-lg">FKKG PJOK Kota Banjar</div>
        <div className="text-white/80">2025</div>
        <div className="h-8"/>
        <div className="w-9 h-9 rounded-full border-4 border-white/40 border-t-white animate-spin" />
      </div>
    </div>
  );
}
