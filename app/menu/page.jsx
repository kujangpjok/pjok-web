"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdentitas, isIdentitasComplete } from "../../lib/user-prefs";

// Paksa CSR supaya aman dari prerender mismatch
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

function formatNamaGuru(fullName = "") {
  const s = (fullName || "").trim();
  if (!s) return "";
  const [namePart, titles = ""] = s.split(",", 2).map((x) => x.trim());
  const w = namePart.split(/\s+/).filter(Boolean);
  let formatted = "";
  if (w.length === 1) formatted = w[0];
  else if (w.length === 2) formatted = `${w[0]} ${w[1]}`;
  else formatted = `${w[0]} ${w[1]} ${w[2][0]}.`;
  return titles ? `${formatted}, ${titles}` : formatted;
}

export default function MenuPage() {
  const router = useRouter();

  // ===== Identitas dari localStorage
  const [identitas, setIdentitas] = useState({
    namaSekolah: "",
    namaGuru: "",
    nipGuru: "",
    namaKepalaSekolah: "",
    nipKepalaSekolah: "",
    namaPengawas: "",
    nipPengawas: "",
    kotaSekolah: "",
  });

  useEffect(() => {
    // load awal
    try {
      const cur = getIdentitas();
      if (cur && typeof cur === "object") setIdentitas((p) => ({ ...p, ...cur }));
    } catch {}
    // sync antar tab
    const onStorage = (e) => {
      if (e.key === "pjok_identitas_json") {
        try {
          const cur = e.newValue ? JSON.parse(e.newValue) : null;
          if (cur && typeof cur === "object") setIdentitas((p) => ({ ...p, ...cur }));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // ===== Tap 5x untuk masuk Identitas
  const tapCountRef = useRef(0);
  const tapResetTimer = useRef(null);
  const onCardTap = () => {
    tapCountRef.current += 1;
    // hint jika NIP kosong saat tap pertama
    if (tapCountRef.current === 1 && !(identitas.nipGuru || "").trim()) {
      // boleh pakai toast lib, sekarang cukup alert ringan
      // eslint-disable-next-line no-alert
      console.log("NIP belum diisi. Tap kartu 5x untuk mengedit Identitas.");
    }
    if (tapResetTimer.current) clearTimeout(tapResetTimer.current);
    tapResetTimer.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 1200);
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      router.push("/identitas");
    }
  };

  // ===== Avatar upload (web)
  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);
  const onPickAvatar = () => fileInputRef.current?.click();
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }
  };
  useEffect(() => {
    return () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  // ===== Nama & NIP
  const namaGuruFmt = useMemo(() => formatNamaGuru(identitas.namaGuru || ""), [identitas.namaGuru]);
  const nipAuto = useMemo(() => (identitas.nipGuru || "").replace(/\D+/g, ""), [identitas.nipGuru]);

  // ===== Teks persiapan (placeholder sederhana)
  const hariNama = useMemo(() => {
    const map = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return map[new Date().getDay()] || "";
  }, []);
  const teksPersiapan = useMemo(() => {
    if (hariNama === "Sabtu" || hariNama === "Minggu") return `Hari ${hariNama}, waktunya istirahat!`;
    return `Hari ${hariNama} tidak ada jadwal mengajar`; // nanti bisa dihubungkan ke jadwalMap
  }, [hariNama]);

  // ===== Guard ringan (kalau belum isi identitas, arahkan)
  useEffect(() => {
    try {
      if (!isIdentitasComplete()) {
        // Jangan paksa saat user baru selesai isi & redirect
        // Tapi kalau datang langsung ke /menu tanpa identitas, arahkan
        // Optional: komentari baris ini kalau mau tetap boleh buka /menu
        // router.replace("/identitas");
      }
    } catch {}
  }, []);

  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: "linear-gradient(180deg,#B3E5FC 0%,#03A9F4 100%)" }}
    >
      <div className="max-w-3xl mx-auto p-3">
        {/* Header */}
        <div className="flex items-center gap-3 p-4">
          <Image src="/logo_pjok.png" alt="Logo PJOK" width={50} height={50} />
          <div className="text-center text-black font-extrabold text-2xl flex-1">
            Aplikasi PJOK SD
          </div>
          <Image src="/logo_banjar.png" alt="Logo Banjar" width={50} height={50} />
        </div>

        {/* Kartu identitas (tap 5x) */}
        <div
          className="rounded-xl bg-[#0288D1] text-white p-4 cursor-pointer select-none"
          onClick={onCardTap}
        >
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-white/95">Selamat datang,</div>
              <div className="font-bold text-lg">
                {namaGuruFmt || "[Nama Guru Belum Diisi]"}
              </div>
              <div className="text-white/95">
                {identitas.namaSekolah?.trim() || "[Nama Sekolah Belum Diisi]"}
              </div>
              <div className="text-xs mt-1">
                {nipAuto ? `NIP: ${nipAuto}` : "NIP belum diisi • tap kartu 5x untuk edit"}
              </div>
            </div>

            {/* Avatar */}
            <div className="shrink-0">
              <div
                className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-white/70 grid place-items-center bg-white/10"
                onClick={(e) => {
                  e.stopPropagation(); // cegah ikut hitung tap
                  onPickAvatar();
                }}
              >
                {avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src="/icons/user.svg"
                    alt="User"
                    width={40}
                    height={40}
                    className="opacity-90"
                  />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onFile}
              />
            </div>
          </div>
        </div>

        <div className="h-4" />

        {/* Tombol singkat ke fitur (sesuaikan rute yang sudah ada) */}
        <SectionTitle title={teksPersiapan} />

        <MenuGrid
          items={[
            { icon: "/icons/ic_modul.svg", label: "Modul", route: "/modul" },
            { icon: "/icons/ic_presensi.svg", label: "Presensi", route: "/presensi" },
            { icon: "/icons/ic_penilaian.svg", label: "Penilaian", route: "/penilaian" },
          ]}
          onItem={(r) => router.push(r)}
        />

        <div className="h-2" />
        <SectionTitle title="Administrasi Pembelajaran" />

        <MenuGrid
          items={[
            // Login+next kalau memang kamu pakai gate; sementara langsung rute admin
            { icon: "/icons/ic_administrasi.svg", label: "Administrasi", route: "/administrasi" },
            { icon: "/icons/ic_jadwal.svg", label: "Jadwal", route: "/jadwal" },
            { icon: "/icons/ic_siswa.svg", label: "Data Siswa", route: "/siswa_list" },
          ]}
          onItem={(r) => router.push(r)}
        />

        <div className="h-2" />
        <SectionTitle title="Laporan" />

        <MenuGrid
          items={[
            { icon: "/icons/ic_kepalasekolah.svg", label: "Laporan Kepala Sekolah", route: "/laporan_kepala_sekolah" },
            { icon: "/icons/ic_pengawas.svg", label: "Laporan Pengawas", route: "/laporan_pengawas" },
          ]}
          onItem={(r) => router.push(r)}
        />

        <div className="h-4" />
      </div>
    </div>
  );
}

function SectionTitle({ title }) {
  return (
    <div className="text-white font-bold text-base mt-2 mb-2">{title}</div>
  );
}

function MenuGrid({ items, onItem }) {
  // 3 kolom, tinggi tetap seperti versi Android
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => (
        <button
          key={it.label}
          onClick={() => onItem?.(it.route)}
          className="h-[105px] rounded-xl bg-white/25 text-white flex flex-col items-center justify-center"
        >
          <Image src={it.icon} alt={it.label} width={32} height={32} />
          <div className="mt-1 text-xs text-center leading-4">{it.label}</div>
        </button>
      ))}
    </div>
  );
}
