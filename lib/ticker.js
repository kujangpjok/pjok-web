// lib/ticker.js
// Pakai endpoint uc?export=download biar langsung "raw file"
const DRIVE_DIRECT = (fileId) =>
  `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;

export async function fetchTicker(fileId) {
  try {
    const res = await fetch(DRIVE_DIRECT(fileId), { cache: "no-store" });
    const text = await res.text();

    // Kalau Drive balas HTML (belum public / butuh auth), tampilkan fallback
    if (text.trim().startsWith("<")) {
      return {
        text: "Pengumuman belum tersedia (periksa sharing file Drive).",
        textColor: null,
        backgroundColor: null,
        animationDurationPerCharMs: 40
      };
    }

    const json = JSON.parse(text);
    return {
      text: String(json.text || ""),
      textColor: json.textColor || null,
      backgroundColor: json.backgroundColor || null,
      animationDurationPerCharMs: Number(json.animationDurationPerCharMs || 40)
    };
  } catch {
    return {
      text: "Gagal mengambil pengumuman.",
      textColor: null,
      backgroundColor: null,
      animationDurationPerCharMs: 40
    };
  }
}
