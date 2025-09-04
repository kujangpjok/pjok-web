"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasIdentitas } from "../lib/identitas-repo"; // pakai repo IndexedDB versi sebelumnya
import { Routes } from "../lib/routes";

export default function Splash(){
  const router = useRouter();
  useEffect(()=>{
    let alive = true;
    (async ()=>{
      await new Promise(r=>setTimeout(r, 2000));
      const ok = await hasIdentitas();
      if(!alive) return;
      router.replace(ok ? Routes.MENU : Routes.IDENTITAS);
    })();
    return ()=>{ alive = false; };
  },[router]);
  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gradient-to-b from-blue-600 to-blue-100">
      <div className="text-center">
        <div className="text-2xl font-bold text-slate-900">Aplikasi PJOK</div>
        <div className="text-sm text-slate-700 mt-2">Memuat…</div>
      </div>
    </div>
  );
}
