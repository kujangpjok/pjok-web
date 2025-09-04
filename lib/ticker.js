// Ambil JSON dari Google Drive (harus public). Format contoh:
// { "text": "Pengumuman...", "textColor": "#ffffff", "backgroundColor": "#01579B", "animationDurationPerCharMs": 40 }
const DRIVE_DIRECT = (fileId) => `https://drive.google.com/uc?id=${encodeURIComponent(fileId)}`;

export async function fetchTicker(fileId) {
  const url = DRIVE_DIRECT(fileId);
  const res = await fetch(url, { cache: "no-store" });
  // Drive kadang balas HTML kalau tidak public → tangani aman
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return {
      text: String(json.text || ""),
      textColor: json.textColor || null,
      backgroundColor: json.backgroundColor || null,
      animationDurationPerCharMs: Number(json.animationDurationPerCharMs || 40)
    };
  } catch {
    // fallback jika bukan JSON
    return {
      text: "Memuat pengumuman...",
      textColor: null,
      backgroundColor: null,
      animationDurationPerCharMs: 40
    };
  }
}
