"use client";

import Image from "next/image";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getIdentitas,
  saveIdentitas,
  setIdentitasComplete,
} from "../../lib/user-prefs";

// Paksa CSR / non-prerender supaya aman
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function IdentitasPage() {
  return (
    <Suspense fallback={<SkeletonIdentitas />}>
      <IdentitasInner />
    </Suspense>
  );
}

function SkeletonIdentitas() {
  return (
    <div
      className="min-h-[100dvh] grid place-items-center"
      style={{ background: "linear-gradient(180deg,#B3E5FC 0%,#03A9F4 100%)" }}
    >
      <div className="text-white/90">Memuat…</div>
    </div>
  );
}

const INITIAL = {
  namaSekolah: "",
  namaGuru: "",
  nipGuru: "",
  namaKepalaSekolah: "",
  nipKepalaSekolah: "",
  namaPengawas: "",
  nipPengawas: "",
  kotaSekolah: "",
};

function onlyDigits(s) {
  return (s || "").split("").filter((c) => /[0-9]/.test(c)).join("");
}

function IdentitasInner() {
  const router = useRouter();
  const search = useSearchParams();
  const nextTarget = decodeURIComponent(search.get("next") || "/menu");

  const [form, setForm] = useState(INITIAL);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedOk, setLastSavedOk] = useState(true);

  useEffect(() => {
    try {
      const cur = getIdentitas();
      if (cur && typeof cur === "object") setForm({ ...INITIAL, ...cur });
    } catch {}
    setInitialLoaded(true);
  }, []);

  const errs = useMemo(() => {
    const isDigitsOnly = (v) => v && /^[0-9]+$/.test(v);
    return {
      namaSekolah: !form.namaSekolah?.trim(),
      namaGuru: !form.namaGuru?.trim(),
      namaKepalaSekolah: !form.namaKepalaSekolah?.trim(),
      namaPengawas: !form.namaPengawas?.trim(),
      nipGuru: !!form.nipGuru?.trim() && !isDigitsOnly(form.nipGuru?.trim()),
      nipKepalaSekolah:
        !!form.nipKepalaSekolah?.trim() &&
        !isDigitsOnly(form.nipKepalaSekolah?.trim()),
      nipPengawas:
        !!form.nipPengawas?.trim() &&
        !isDigitsOnly(form.nipPengawas?.trim()),
    };
  }, [form]);

  const hasHardError =
    errs.namaSekolah ||
    errs.namaGuru ||
    errs.namaKepalaSekolah ||
    errs.namaPengawas ||
    errs.nipGuru ||
    errs.nipKepalaSekolah ||
    errs.nipPengawas;

  const debounceRef = useRef(null);
  useEffect(() => {
    if (!initialLoaded) return;

    const okMinimal =
      form.namaSekolah?.trim() &&
      form.namaGuru?.trim() &&
      form.namaKepalaSekolah?.trim() &&
      form.namaPengawas?.trim() &&
      !errs.nipGuru &&
      !errs.nipKepalaSekolah &&
      !errs.nipPengawas;

    if (!okMinimal) return;

    setIsSaving(true);
    setLastSavedOk(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        saveIdentitas(form);
        setLastSavedOk(true);
      } catch (e) {
        console.error("Auto-save error:", e);
        setLastSavedOk(false);
      } finally {
        setIsSaving(false);
      }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [form, initialLoaded, errs.nipGuru, errs.nipKepalaSekolah, errs.nipPengawas]);

  function update(key, val, enforceDigits = false) {
    setForm((prev) => ({
      ...prev,
      [key]: enforceDigits ? onlyDigits(val) : val,
    }));
  }

  async function onSimpan() {
    if (hasHardError) {
      alert("Periksa kembali isian yang belum valid.");
      return;
    }
    try {
      setIsSaving(true);
      saveIdentitas(form);
      setIdentitasComplete(true);
      setIsSaving(false);
      router.replace(nextTarget || "/menu");
    } catch (e) {
      setIsSaving(false);
      alert("Gagal menyimpan data.");
      console.error(e);
    }
  }

  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: "linear-gradient(180deg,#B3E5FC 0%,#03A9F4 100%)" }}
    >
      <div className="max-w-xl mx-auto p-4">
        <div className="flex justify-center pt-4">
          <Image src="/logo_pjok.png" alt="Logo PJOK" width={100} height={100} priority />
        </div>

        <div className="h-3" />
        <div className="text-center text-black font-bold text-xl">Isi Identitas Guru PJOK</div>
        <div className="h-4" />

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <Field
            label="Nama Sekolah"
            value={form.namaSekolah}
            onChange={(v) => update("namaSekolah", v)}
            error={errs.namaSekolah ? "Wajib diisi" : ""}
          />
          <Field
            label="Nama Guru"
            value={form.namaGuru}
            onChange={(v) => update("namaGuru", v)}
            error={errs.namaGuru ? "Wajib diisi" : ""}
          />
          <Field
            label="NIP Guru (Opsional)"
            value={form.nipGuru}
            onChange={(v) => update("nipGuru", v, true)}
            error={errs.nipGuru ? "Hanya angka" : ""}
            inputMode="numeric"
          />
          <Field
            label="Nama Kepala Sekolah"
            value={form.namaKepalaSekolah}
            onChange={(v) => update("namaKepalaSekolah", v)}
            error={errs.namaKepalaSekolah ? "Wajib diisi" : ""}
          />
          <Field
            label="NIP Kepala Sekolah (Opsional)"
            value={form.nipKepalaSekolah}
            onChange={(v) => update("nipKepalaSekolah", v, true)}
            error={errs.nipKepalaSekolah ? "Hanya angka" : ""}
            inputMode="numeric"
          />
          <Field
            label="Nama Pengawas"
            value={form.namaPengawas}
            onChange={(v) => update("namaPengawas", v)}
            error={errs.namaPengawas ? "Wajib diisi" : ""}
          />
          <Field
            label="NIP Pengawas (Opsional)"
            value={form.nipPengawas}
            onChange={(v) => update("nipPengawas", v, true)}
            error={errs.nipPengawas ? "Hanya angka" : ""}
            inputMode="numeric"
          />
          {/* <Field
            label="Kota Sekolah"
            value={form.kotaSekolah}
            onChange={(v) => update("kotaSekolah", v)}
          /> */}

          <div className="h-2" />
          <div className="text-sm text-center text-slate-600 italic">
            Tips: Harap diisi baik-baik. Karena data tidak bisa diganti.
          </div>

          <div className="h-3" />
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-slate-600">
              {isSaving
                ? "Menyimpan…"
                : initialLoaded && lastSavedOk
                ? "Tersimpan otomatis"
                : initialLoaded && !lastSavedOk
                ? "Gagal menyimpan otomatis"
                : ""}
            </div>

            <button
              onClick={onSimpan}
              disabled={isSaving || !initialLoaded}
              className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            >
              Simpan &amp; Selesai
            </button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
}

function Field({ label, value, onChange, error = "", inputMode = "text" }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        className={`w-full border rounded px-3 py-2 outline-none ${
          error ? "border-red-500" : "border-slate-300"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode}
      />
      {error ? <div className="text-xs text-red-600 mt-1">{error}</div> : null}
    </div>
  );
}
