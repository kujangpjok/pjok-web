"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import AvatarCapture from "../../components/AvatarCapture";
import { fetchTicker } from "../../lib/ticker"; // frontend fetch -> /api/ticker
import { db } from "../../lib/db";              // pastikan file db.js sudah ada
import Link from "next/link";

/* =================== Utils =================== */

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
function smoothScroll(el, to, duration) {
  if (!el) return Promise.resolve();
  const start = el.scrollLeft;
  const change = to - start;
  const startTime = performance.now();
  return new Promise((resolve) => {
    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      el.scrollLeft = start + change * t;
      if (t < 1) requestAnimationFrame(animate);
      else resolve();
    }
    requestAnimationFrame(animate);
  });
}

/* =================== Ticker =================== */

function TickerBar({ ticker }) {
  const defaultBg = "#01579B";
  const defaultText = "Memuat pengumuman...";
  const bg = ticker.backgroundColor || defaultBg;
  const color = ticker.textColor || "#ffffff";
  const text = (ticker.text || "").trim() || defaultText;
  const durationPerChar = Math.max(10, Number(ticker.animationDurationPerCharMs || 40));
  const duration = Math.max(3000, text.length * durationPerChar);

  const scrollerRef = useRef(null);
  useEffect(() => {
    let alive = true;
    async function loop() {
      const el = scrollerRef.current;
      if (!el) return;
      while (alive && text && text !== defaultText) {
        el.scrollLeft = 0;
        await wait(1200);
        await smoothScroll(el, el.scrollWidth, duration);
        await wait(1200);
      }
    }
    loop();
    return () => { alive = false; };
  }, [text, duration]);

  const displayText = text.length < 40 && text !== defaultText
    ? `${text}                    ${text}`
    : text;

  return (
    <div className="rounded-xl" style={{ backgroundColor: bg }}>
      <div
        ref={scrollerRef}
        className="px-4 h-12 overflow-hidden whitespace-nowrap flex items-center"
        style={{ color }}
      >
        <span className="text-[16px] font-medium leading-none">{displayText}</span>
      </div>
    </div>
  );
}

/* =================== Jadwal helpers (untuk teks “Hari ini…”) =================== */

const HARI_LIST = ["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"];

function parseKelasTokens(teks) {
  const lower = (teks || "").toLowerCase().trim();
  if (!lower) return [];
  if (lower.includes("libur") || lower.startsWith("pembiasaan")) return [];
  const regex = /\bkelas\s*([1-9]|1[0-2])\s*([a-z])?\b|\b([1-9]|1[0-2])\s*([a-z])\b|\b([1-9]|1[0-2])\b/gi;
  const out = [];
  for (const m of teks.matchAll(regex)) {
    const g1 = m[1], g2 = m[2], g3 = m[3], g4 = m[4], g5 = m[5];
    if (g1) {
      const n = Number(g1);
      const letter = g2 ? g2.toUpperCase() : null;
      out.push([n, letter]);
    } else if (g3) {
      const n = Number(g3);
      const letter = g4 ? g4.toUpperCase() : null;
      out.push([n, letter]);
    } else if (g5) {
      const n = Number(g5);
      out.push([n, null]);
    }
  }
  return out;
}

function ambilKelasHariIni(hari, jadwalMap) {
  if (!jadwalMap || typeof jadwalMap !== "object") return [];
  // jadwalMap: { jamKe: { [hari]: isi } }
  const isiHari = Object.values(jadwalMap)
    .map((m) => (m && typeof m === "object" ? m[hari] : ""))
    .filter(Boolean);

  const rombelPerTingkat = new Map();
  const angkaPolos = new Set();

  for (const baris of isiHari) {
    const toks = parseKelasTokens(baris);
    for (const [tingkat, rombel] of toks) {
      if (rombel == null) angkaPolos.add(tingkat);
      else {
        if (!rombelPerTingkat.has(tingkat)) rombelPerTingkat.set(tingkat, new Set());
        rombelPerTingkat.get(tingkat).add(rombel);
      }
    }
  }

  const all = Array.from(new Set([...angkaPolos, ...rombelPerTingkat.keys()])).sort((a,b)=>a-b);
  const result = [];
  for (const tingkat of all) {
    const letters = rombelPerTingkat.get(tingkat);
    if (letters && letters.size) {
      Array.from(letters).sort().forEach((ch) => result.push(`${tingkat}${ch}`));
    } else if (angkaPolos.has(tingkat)) {
      result.push(String(tingkat));
    }
  }
  return Array.from(new Set(result));
}

/* =================== Page =================== */

export default function MenuPage() {
  // force portrait (tidak perlu di web, skip)

  // IDENTITAS (placeholder – kalau kamu sudah punya repo identitas di web, inject di sini)
  const identitas = { namaGuru: "", namaSekolah: "" };

  // TICKER
  const driveFileId = "1tP_62hac5i68vK6WZCNl0wqNZwma6c0s"; // ID yang sama seperti Androidmu
  const [ticker, setTicker] = useState({
    text: "Memuat pengumuman...",
    textColor: null,
    backgroundColor: null,
    animationDurationPerCharMs: 40,
  });
  useEffect(() => {
    let alive = true;
    async function poll() {
      while (alive) {
        try {
          const t = await fetchTicker(driveFileId);
          if (alive) setTicker(t);
        } catch {}
        await wait(30000);
      }
    }
    poll();
    return () => { alive = false; };
  }, []);

  // JADWAL MAP dari IndexedDB jadwal table
  const [jadwalMap, setJadwalMap] = useState({});
  useEffect(() => {
    (async () => {
      const rows = await db.jadwal.toArray(); // {id, jamKe, hari, isi}
      const map = {};
      for (const r of rows) {
        if (!map[r.jamKe]) map[r.jamKe] = {};
        map[r.jamKe][r.hari] = r.isi || "";
      }
      setJadwalMap(map);
    })();
  }, []);

  function namaHari() {
    const d = new Date();
    const js = d.getDay(); // 0 Minggu .. 6 Sabtu
    const map = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
    return map[js] || "Hari";
  }
  const hariNama = useMemo(() => namaHari(), []);
  const kelasHariIni = useMemo(() => ambilKelasHariIni(hariNama, jadwalMap), [hariNama, jadwalMap]);

  const teksPersiapan = useMemo(() => {
    if (kelasHariIni.length) return `Hari ${hariNama} mengajar di kelas ${kelasHariIni.join(", ")}`;
    if (hariNama === "Sabtu" || hariNama === "Minggu") return `Hari ${hariNama}, waktunya istirahat!`;
    return `Hari ${hariNama} tidak ada jadwal mengajar`;
  }, [kelasHariIni, hariNama]);

  // MENU DATA
  const persiapanMengajar = [
    { icon: "/ic_modul.png", label: "Modul", route: "/modul" },
    { icon: "/ic_presensi.png", label: "Presensi", route: "/presensi" },
    { icon: "/ic_penilaian.png", label: "Penilaian", route: "/penilaian" },
  ];

  // 👉 Di sini yang kamu minta: link Jadwal & Data Siswa
  const administrasiPembelajaran = [
    { icon: "/ic_administrasi.png", label: "Administrasi", route: "/login?next=" + encodeURIComponent("/administrasi") },
    { icon: "/ic_jadwal.png", label: "Jadwal", route: "/jadwal" },          // <- LINKED
    { icon: "/ic_siswa.png", label: "Data Siswa", route: "/siswa_list" },   // <- LINKED
  ];

  const laporan = [
    { icon: "/ic_kepalasekolah.png", label: "Laporan Kepala Sekolah", route: "/laporan_kepala_sekolah" },
    { icon: "/ic_pengawas.png", label: "Laporan Pengawas", route: "/laporan_pengawas" },
  ];

  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: "linear-gradient(180deg, #B3E5FC 0%, #03A9F4 100%)" }}
    >
      <div className="max-w-xl mx-auto p-4">
        {/* Header logos */}
        <div className="flex items-center gap-3 py-4">
          <Image src="/logo_pjok.png" alt="Logo PJOK" width={50} height={50} />
          <div className="text-center font-extrabold text-2xl text-black flex-1">
            Aplikasi PJOK SD
          </div>
          <Image src="/logo_banjar.png" alt="Logo Banjar" width={50} height={50} />
        </div>

        {/* Kartu identitas + avatar */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: "#0288D1" }}>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-white/95">Selamat datang,</div>
              <div className="text-white font-bold text-lg">{identitas?.namaGuru || "[Nama Guru Belum Diisi]"}</div>
              <div className="text-white/95">{identitas?.namaSekolah || "[Nama Sekolah Belum Diisi]"}</div>
              {/* NIP kalau nanti kamu simpan di IndexedDB bisa ditampilkan di sini */}
            </div>
            <AvatarCapture size={96} />
          </div>
        </div>

        <div className="h-3" />

        {/* Tombol Pull/Push Cloud (placeholder, biar layout tetap sama) */}
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 rounded bg-green-800 text-white">Pull Cloud</button>
          <button className="flex-1 px-3 py-2 rounded bg-blue-900 text-white">Push Cloud</button>
        </div>

        <div className="h-3" />

        {/* Ticker */}
        <div>
          <div className="text-white font-bold text-sm mb-1">Informasi / Pengumuman</div>
          <TickerBar ticker={ticker} />
        </div>

        <div className="h-4" />

        {/* Seksi Persiapan */}
        <SectionTitle title={teksPersiapan} />
        <MenuGridBounded items={persiapanMengajar} />

        <SectionTitle title="Administrasi Pembelajaran" />
        <MenuGridBounded items={administrasiPembelajaran} />

        <SectionTitle title="Laporan" />
        <MenuGridBounded items={laporan} />

        <div className="h-4" />
      </div>
    </div>
  );
}

/* =================== Sub-UI =================== */

function SectionTitle({ title }) {
  return (
    <div className="text-white font-bold text-[16px] my-2">{title}</div>
  );
}

function MenuGridBounded({ items }) {
  const columns = 3;
  const itemSize = 105;
  const spacing = 10;
  const rows = items.length ? Math.ceil(items.length / columns) : 0;
  const totalHeight = rows > 0 ? (itemSize * rows) + (spacing * Math.max(0, rows - 1)) : 0;

  return items.length ? (
    <div
      className="w-full"
      style={{ height: totalHeight }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          gap: `${spacing}px`,
        }}
      >
        {items.map((it) => (
          <Link
            key={it.label}
            href={it.route || "#"}
            className="rounded-xl bg-white/25 hover:bg-white/30"
            style={{ width: itemSize, height: itemSize }}
          >
            <div className="p-1 w-full h-full flex flex-col items-center justify-center">
              <Image src={it.icon} alt={it.label} width={32} height={32} />
              <div className="h-1" />
              <div className="text-white text-[12px] leading-[14px] text-center">{it.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  ) : null;
}
