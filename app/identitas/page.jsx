"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { loadIdentitas, saveIdentitas } from "../../lib/identitas-repo";

const FIELDS = [
  { key: "namaSekolah", label: "Nama Sekolah", required: true },
  { key: "namaGuru", label: "Nama Guru", required: true },
  { key: "nipGuru", label: "NIP Guru (Opsional)", digitsOnly: true },
  { key: "namaKepalaSekolah", label: "Nama Kepala Sekolah", required: true },
  { key: "nipKepalaSekolah", label: "NIP Kepala Sekolah (Opsional)", digitsOnly: true },
  { key: "namaPengawas", label: "Nama Pengawas", required: true },
  { key: "nipPengawas", label: "NIP Pengawas (Opsional)", digitsOnly: true },
  // { key: "kotaSekolah", label: "Kota Sekolah", required: true }, // aktifkan jika wajib
];

export default function IdentitasPage() {
  const router = useRouter();

  const [data, setData] = useState(null);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedOk, setLastSavedOk] = useState(true);

  const debounceTimer = useRef(null);

  // load awal dari IndexedDB
  useEffect(() => {
    let alive = true;
    (async () => {
      const d = await loadIdentitas();
      if (!alive) return;
      setData(d);
      setInitialLoaded(true);
    })();
    return () => {
      alive = false;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const errors = useMemo(() => {
    if (!data) return {};
    const err = {};
    for (const f of FIELDS) {
      if (f.required && !String(data[f.key] || "").trim()) err[f.key] = "Wajib diisi";
      if (f.digitsOnly && data[f.key] && !/^\d+$/.test(String(data[f.key]).trim()))
        err[f.key] = "Hanya angka";
    }
    return err;
  }, [data]);

  const anyError = useMemo(() => Object.keys(errors).length > 0, [errors]);

  function updateField(key, val) {
    setData((prev) => ({ ...(prev || {}), [key]: val }));
  }

  // auto-save debounce 800ms (jalan hanya setelah initialLoaded)
  useEffect(() => {
    if (!initialLoaded || !data) return;
    // gabungkan semua field supaya perubahan terdeteksi
    const signature = FIELDS.map((f) => String(data[f.key] ?? "")).join("¦");

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      // validasi minimum (wajib + NIP angka jika diisi)
      const formHasBlockingError = FIELDS.some((f) => {
        const v = String(data[f.key] ?? "");
        if (f.required && v.trim() === "") return true;
        if (f.digitsOnly && v.trim() !== "" && !/^\d+$/.test(v)) return true;
        return false;
      });
      if (formHasBlockingError) return;

      try {
        setIsSaving(true);
        await saveIdentitas(data);
        setLastSavedOk(true);
      } catch (e) {
        setLastSavedOk(false);
        // optionally console.error(e);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLoaded, data && FIELDS.map((f) => data[f.key]).join("¦")]); // depend on signature

  const manualSave = async () => {
    // validasi penuh
    const blocking =
      FIELDS.some((f) => f.required && !String(data?.[f.key] ?? "").trim()) ||
      FIELDS.some(
        (f) => f.digitsOnly && data?.[f.key] && !/^\d+$/.test(String(data[f.key]).trim())
      );

    if (blocking) {
      alert("Periksa kembali isian yang belum valid.");
      return;
    }
    try {
      setIsSaving(true);
      await saveIdentitas(data);
      setIsSaving(false);
      alert("Data berhasil disimpan!");
      // replace agar tidak bisa back ke /identitas
      router.replace("/menu");
    } catch (e) {
      setIsSaving(false);
      alert("Gagal menyimpan data.");
    }
  };

  if (!data) {
    return (
      <div className="min-h-[100dvh] grid place-items-center">
        <div>Memuat…</div>
      </div>
    );
  }

  const statusText = isSaving
    ? "Menyimpan…"
    : initialLoaded && lastSavedOk
    ? "Tersimpan otomatis"
    : initialLoaded && !lastSavedOk
    ? "Gagal menyimpan otomatis"
    : "";

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-xl mx-auto p-4">
        {/* Logo */}
        <div className="flex items-center justify-center pt-4 pb-2">
          <Image src="/logo_pjok.png" alt="Logo PJOK" width={100} height={100} />
        </div>

        <h1 className="text-xl font-semibold text-slate-900 text-center">
          Isi Identitas Guru PJOK
        </h1>

        <div className="h-4" />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            manualSave();
          }}
          className="space-y-3"
        >
          {FIELDS.map((f) => {
            const val = data[f.key] ?? "";
            const err = errors[f.key];
            return (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-sm text-slate-700">{f.label}</label>
                <input
                  className={`px-3 py-2 rounded border ${err ? "border-red-400" : "border-slate-300"} bg-white text-slate-900 outline-none`}
                  value={val}
                  onChange={(e) => {
                    let v = e.target.value;
                    if (f.digitsOnly) v = v.replace(/[^\d]/g, "");
                    updateField(f.key, v);
                  }}
                  inputMode={f.digitsOnly ? "numeric" : undefined}
                />
                {err && <div className="text-xs text-red-500">{err}</div>}
              </div>
            );
          })}

          {/* Contoh mengaktifkan Kota Sekolah:
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-700">Kota Sekolah</label>
            <input
              className={`px-3 py-2 rounded border ${errors.kotaSekolah ? "border-red-400" : "border-slate-300"} bg-white text-slate-900 outline-none`}
              value={data.kotaSekolah || ""}
              onChange={(e) => updateField("kotaSekolah", e.target.value)}
            />
            {errors.kotaSekolah && <div className="text-xs text-red-500">{errors.kotaSekolah}</div>}
          </div> */}

          <div className="text-center text-xs text-slate-600">
            Tips: Harap diisi baik-baik. Karena data tidak bisa diganti.
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="text-xs text-slate-600">{statusText}</div>
            <button
              type="submit"
              disabled={isSaving || !initialLoaded}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:brightness-110 disabled:opacity-60"
            >
              {isSaving ? "Menyimpan…" : "Simpan & Selesai"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
