"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import AvatarCapture from "../../components/AvatarCapture";
import { db } from "../../lib/db";
import { loadIdentitas } from "../../lib/identitas-repo";
import { fetchTicker } from "../../lib/ticker";
import {
  ambilKelasHariIni,
  formatNamaGuru,
  namaHariSekarang,
  tryGetNipFromIdentitasSafe
} from "../../lib/menu-helpers";

const DRIVE_TICKER_FILE_ID = "1tP_62hac5i68vK6WZCNl0wqNZwma6c0s";

const MENU_PERSIAPAN = [
  { icon: "/ic_modul.png", label: "Modul", href: "/modul" },
  { icon: "/ic_presensi.png", label: "Presensi", href: "/presensi" },
  { icon: "/ic_penilaian.png", label: "Penilaian", href: "/penilaian" }
];

const MENU_ADMIN = [
  { icon: "/ic_administrasi.png", label: "Administrasi", href: "/login?next=/administrasi" },
  { icon: "/ic_jadwal.png", label: "Jadwal", href: "/jadwal" },
  { icon: "/ic_siswa.png", label: "Data Siswa", href: "/siswa_list" }
];

const MENU_LAPORAN = [
  { icon: "/ic_kepalasekolah.png", label: "Laporan Kepala Sekolah", href: "/laporan_kepala_sekolah" },
  { icon: "/ic_pengawas.png", label: "Laporan Pengawas", href: "/laporan_pengawas" }
];

export default function MenuPage() {
  // ======= state utama =======
  const [identitas, setIdentitas] = useState(null);
  const [nipAuto, setNipAuto] = useState("");
  const [jadwalMap, setJadwalMap] = useState(null);

  // ticker
  const [ticker, setTicker] = useState({
    text: "Memuat pengumuman...",
    textColor: null,
    backgroundColor: null,
    animationDurationPerCharMs: 40
  });

  // sync state (stub)
  const [syncing, setSyncing] = useState(false);

  // ======= load data awal =======
  useEffect(() => {
    let alive = true;
    (async () => {
      const idt = await loadIdentitas();
      const nip = tryGetNipFromIdentitasSafe(idt);
      const jadwalRows = await db.jadwal.toArray(); // bentuk bebas (jamKe -> hari -> string)
      // transformasi standar ke map { jamKe : { hari : isi } }
      const map = {};
      for (const r of jadwalRows) {
        if (!map[r.jamKe]) map[r.jamKe] = {};
        map[r.jamKe][r.hari] = r.isi || r.text || r.value || r.kelas || "";
      }
      if (!alive) return;
      setIdentitas(idt);
      setNipAuto(nip);
      setJadwalMap(map);
    })();
    return () => { alive = false; };
  }, []);

  // ======= ticker polling 30 detik =======
  useEffect(() => {
    let stop = false;
    async function poll() {
      const t = await fetchTicker(DRIVE_TICKER_FILE_ID);
      if (!stop) setTicker(t);
      setTimeout(() => { if (!stop) poll(); }, 30000);
    }
    poll();
    return () => { stop = true; };
  }, []);

  // ======= teks dinamis hari & kelas =======
  const hariNama = useMemo(() => namaHariSekarang(), []);
  const kelasHariIni = useMemo(() => ambilKelasHariIni(hariNama, jadwalMap), [hariNama, jadwalMap]);
  const teksPersiapan = useMemo(() => {
    if (kelasHariIni && kelasHariIni.length > 0) {
      return `Hari ${hariNama} mengajar di kelas ${kelasHariIni.join(", ")}`;
    }
    if (hariNama === "Sabtu" || hariNama === "Minggu") {
      return `Hari ${hariNama}, waktunya istirahat!`;
    }
    return `Hari ${hariNama} tidak ada jadwal mengajar`;
  }, [hariNama, kelasHariIni]);

  // ======= tap 5x untuk ke /identitas =======
  const [tapCount, setTapCount] = useState(0);
  const lastTapRef = useRef(0);
  function handleTapCard() {
    const now = Date.now();
    if (now - lastTapRef.current > 1200) {
      setTapCount(1);
    } else {
      setTapCount((c) => c + 1);
    }
    lastTapRef.current = now;
    if (tapCount + 1 >= 5) {
      setTapCount(0);
      window.location.href = "/identitas"; // langsung ganti halaman
    } else if (tapCount + 1 === 1 && !nipAuto) {
      alert("NIP belum diisi. Tap kartu identitas 5x untuk mengedit Identitas.");
    }
  }

  // ======== sinkron (stub – sambungkan ke backend kamu) ========
  async function doPull() {
    if (!nipAuto) {
      alert("NIP kosong. Tap kartu identitas 5x untuk mengisi.");
      return;
    }
    try {
      setSyncing(true);
      // TODO: panggil endpoint kamu untuk pull siswa/presensi/nilai
      // await fetch('/api/pull?nip=' + nipAuto)
      alert(`Pull Cloud OK (nip=${nipAuto})`);
    } catch (e) {
      alert("Pull gagal: " + (e?.message || "Unknown error"));
    } finally {
      setSyncing(false);
    }
  }

  async function doPush() {
    if (!nipAuto) {
      alert("NIP kosong. Tap kartu identitas 5x untuk mengisi.");
      return;
    }
    try {
      setSyncing(true);
      // TODO: panggil endpoint kamu untuk push siswa/presensi/nilai
      alert(`Push Cloud OK (nip=${nipAuto})`);
    } catch (e) {
      alert("Push gagal: " + (e?.message || "Unknown error"));
    } finally {
      setSyncing(false);
    }
  }

  // ======== UI ========
  return (
    <div
      className="min-h-[100dvh]"
      style={{ background: "linear-gradient(180deg, #B3E5FC 0%, #03A9F4 100%)" }}
    >
      <div className="max-w-5xl mx-auto px-3 py-3">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-2">
          <Image src="/logo_pjok.png" alt="Logo PJOK" width={50} height={50} />
          <div className="text-2xl font-extrabold text-black text-center">Aplikasi PJOK SD</div>
          <Image src="/logo_banjar.png" alt="Logo Banjar" width={50} height={50} />
        </div>

        <div className="h-4" />

        {/* LIST UTAMA */}
        <div className="flex flex-col gap-4">

          {/* KARTU IDENTITAS */}
          <div
            className="rounded-xl p-4"
            style={{ backgroundColor: "#0288D1", cursor: "pointer" }}
            onClick={handleTapCard}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-white text-[16px]">Selamat datang,</div>
                <div className="text-white font-bold text-[18px]">
                  {formatNamaGuru(identitas?.namaGuru || "") || "[Nama Guru Belum Diisi]"}
                </div>
                <div className="text-white text-[16px]">
                  {identitas?.namaSekolah || "[Nama Sekolah Belum Diisi]"}
                </div>
                {nipAuto ? (
                  <div className="text-white/90 text-[12px]">NIP: {nipAuto}</div>
                ) : (
                  <div className="text-yellow-300 text-[12px]">
                    NIP belum diisi • tap kartu 5x untuk edit
                  </div>
                )}
              </div>

              {/* AVATAR */}
              <AvatarCapture size={96} />
            </div>
          </div>

          {/* TOMBOL SYNC */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={doPull}
              disabled={syncing}
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: "#1B5E20", opacity: syncing ? 0.6 : 1 }}
            >
              {syncing ? "Menarik..." : "Pull Cloud"}
            </button>
            <button
              onClick={doPush}
              disabled={syncing}
              className="px-4 py-2 rounded text-white"
              style={{ backgroundColor: "#0D47A1", opacity: syncing ? 0.6 : 1 }}
            >
              {syncing ? "Mendorong..." : "Push Cloud"}
            </button>
          </div>

          {/* TICKER */}
          <div>
            <div className="font-bold text-[14px] text-white mb-1">
              Informasi / Pengumuman
            </div>
            <TickerBar ticker={ticker} />
          </div>

          {/* SEKSI MENU */}
          <SectionTitle title={teksPersiapan} />
          <MenuGrid items={MENU_PERSIAPAN} />

          <SectionTitle title="Administrasi Pembelajaran" />
          <MenuGrid items={MENU_ADMIN} />

          <SectionTitle title="Laporan" />
          <MenuGrid items={MENU_LAPORAN} />

          <div className="h-2" />
        </div>
      </div>
    </div>
  );
}

/* ===== sub-komponen ===== */

function SectionTitle({ title }) {
  return (
    <div className="text-[16px] font-bold text-white pt-2 pb-2">{title}</div>
  );
}

function MenuGrid({ items }) {
  // 3 kolom, tinggi dibatasi seperti Compose (tanpa scroll internal)
  return (
    <div className="grid grid-cols-3 gap-2">
      {items.map((it) => (
        <Link
          key={it.label}
          href={it.href || "#"}
          className="rounded-xl bg-white/25 size-[105px] p-2 hover:brightness-110 flex flex-col items-center justify-center"
        >
          <img src={it.icon} alt={it.label} width={32} height={32} />
          <div className="h-1.5" />
          <div className="text-white text-[12px] text-center leading-4">{it.label}</div>
        </Link>
      ))}
    </div>
  );
}

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
      className="px-4 h-10 overflow-hidden whitespace-nowrap flex items-center"
      style={{ color }}
    >
      <span className="text-[15px] font-medium leading-none">{displayText}</span>
    </div>
  </div>
  );
}

function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
function smoothScroll(el, to, duration) {
  return new Promise((resolve) => {
    const start = el.scrollLeft;
    const change = to - start;
    const startTime = performance.now();
    function animate(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      el.scrollLeft = start + change * t; // linear
      if (t < 1) requestAnimationFrame(animate);
      else resolve();
    }
    requestAnimationFrame(animate);
  });
}
