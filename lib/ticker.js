export async function fetchTicker(fileId) {
  try {
    const res = await fetch(`/api/ticker?fileId=${encodeURIComponent(fileId)}`, {
      cache: "no-store",
    });
    // tetap aman kalau server balas non-200
    const data = await res.json().catch(() => ({}));
    return {
      text: String(data.text || ""),
      textColor: data.textColor || null,
      backgroundColor: data.backgroundColor || null,
      animationDurationPerCharMs: Number(data.animationDurationPerCharMs || 40),
    };
  } catch {
    return {
      text: "Gagal memuat pengumuman.",
      textColor: null,
      backgroundColor: null,
      animationDurationPerCharMs: 40,
    };
  }
}
