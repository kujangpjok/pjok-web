"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Opsional: paksa halaman ini jadi dinamis (hindari pre-render error)
export const dynamic = "force-dynamic";

function LoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/identitas";

  const [nip, setNip] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!nip.trim()) {
      alert("NIP wajib diisi");
      return;
    }
    // TODO: validasi NIP ke backend/GAS jika ada
    router.replace(next);
  };

  return (
    <div className="min-h-[100dvh] grid place-items-center bg-white">
      <form onSubmit={submit} className="w-full max-w-sm space-y-3 p-4 border rounded">
        <h1 className="text-lg font-semibold">Login</h1>
        <input
          value={nip}
          onChange={(e) => setNip(e.target.value)}
          placeholder="Masukkan NIP"
          className="w-full px-3 py-2 border rounded"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Masuk</button>
        <div className="text-xs text-slate-600">
          Setelah login akan ke: <code>{next}</code>
        </div>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-4">Memuat…</div>}>
      <LoginInner />
    </Suspense>
  );
}
