"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { hasIdentitas } from "../lib/identitas";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      if (hasIdentitas()) router.replace("/menu");
      else router.replace("/identitas");
    }, 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gradient-to-b from-blue-700 to-slate-900">
      <div className="text-center">
        <div className="text-2xl font-bold tracking-wide">Aplikasi PJOK</div>
        <div className="text-sm opacity-80 mt-2">Memuat…</div>
      </div>
    </div>
  );
}
