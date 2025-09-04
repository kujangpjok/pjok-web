"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasIdentitas } from "../lib/identitas-repo";

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    const go = async () => {
      await new Promise(r => setTimeout(r, 2000));
      const ok = await hasIdentitas();
      if (!mounted) return;
      router.replace(ok ? "/menu" : "/identitas");
    };
    go();
    return () => { mounted = false; };
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gradient-to-b from-blue-600 to-blue-100">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-wide text-slate-900">Aplikasi PJOK</div>
        <div className="text-sm text-slate-700 mt-2">Memuat…</div>
      </div>
    </div>
  );
}
