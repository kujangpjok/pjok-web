import { NextResponse } from "next/server";

function driveDirect(fileId) {
  return `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;
}

function tryParseJsonLoose(text) {
  // strip anti-XSSI: )]}'
  const cleaned = text.replace(/^\)\]\}'\s*/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const fileId = searchParams.get("fileId");
    if (!fileId) {
      return NextResponse.json(
        { text: "fileId kosong.", animationDurationPerCharMs: 40 },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Fetch dari server (bukan browser) untuk hindari CORS/HTML redirect
    const res = await fetch(driveDirect(fileId), {
      cache: "no-store",
      redirect: "follow",
      headers: {
        // kadang berguna agar Drive langsung kasih konten
        "Accept": "application/json,text/plain,*/*",
      },
    });

    const raw = await res.text();

    // Kalau Drive balas HTML (belum public / butuh auth), kasih pesan jelas
    if (raw.trim().startsWith("<")) {
      return NextResponse.json(
        {
          text:
            "File Drive tidak mengembalikan JSON. Pastikan share: Anyone with the link (Viewer).",
          animationDurationPerCharMs: 40,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    const json = tryParseJsonLoose(raw);
    if (!json || typeof json !== "object") {
      return NextResponse.json(
        {
          text:
            "Format JSON tidak valid. Periksa isi ticker.json di Google Drive.",
          animationDurationPerCharMs: 40,
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Normalisasi bidang
    const out = {
      text: String(json.text || ""),
      textColor: json.textColor || null,
      backgroundColor: json.backgroundColor || null,
      animationDurationPerCharMs: Number(json.animationDurationPerCharMs || 40),
    };

    return NextResponse.json(out, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    return NextResponse.json(
      { text: "Gagal mengambil pengumuman (server).", animationDurationPerCharMs: 40 },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
