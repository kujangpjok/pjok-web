// Format nama guru "Nama Depan Nama Tengah InisialBelakang., , Gelar"
export function formatNamaGuru(fullName = "") {
  if (!fullName || !fullName.trim()) return "";
  const [namePartStringRaw, titlesPartRaw] = fullName.split(",", 2);
  const namePartString = (namePartStringRaw || "").trim();
  const titlesPartString = titlesPartRaw ? `, ${titlesPartRaw.trim()}` : "";
  const nameWords = namePartString.split(" ").filter(Boolean);
  let formatted = "";
  if (nameWords.length === 1) formatted = nameWords[0];
  else if (nameWords.length === 2) formatted = `${nameWords[0]} ${nameWords[1]}`;
  else formatted = `${nameWords[0]} ${nameWords[1]} ${nameWords[2][0]}.`;
  return formatted + titlesPartString;
}

// Ambil NIP dari objek identitas (beberapa kemungkinan field)
export function tryGetNipFromIdentitasSafe(identitas = {}) {
  const candidates = ["nipGuru", "nip", "nuptk", "nik"];
  for (const key of candidates) {
    const v = (identitas?.[key] || "").toString();
    if (v.trim()) {
      const digits = v.replace(/\D/g, "");
      if (digits) return digits;
    }
  }
  return "";
}

// ==== Parser rombel dari string jadwal ("kelas 4a", "4 b", "4" ...)

const kelasRegex = /\bkelas\s*([1-9]|1[0-2])\s*([a-z])\b|\b([1-9]|1[0-2])\s*([a-z])\b|\b([1-9]|1[0-2])\b/gi;

export function parseKelasTokens(teks = "") {
  const lower = teks.toLowerCase().trim();
  if (lower.includes("libur") || lower.startsWith("pembiasaan")) return [];
  const out = [];
  let m;
  while ((m = kelasRegex.exec(teks))) {
    const g1 = m[1], g2 = m[2], g3 = m[3], g4 = m[4], g5 = m[5];
    if (g1) {
      const n = parseInt(g1, 10);
      const letter = g2 ? g2.toUpperCase() : null;
      out.push([n, letter]);
    } else if (g3) {
      const n = parseInt(g3, 10);
      const letter = g4 ? g4.toUpperCase() : null;
      out.push([n, letter]);
    } else if (g5) {
      const n = parseInt(g5, 10);
      out.push([n, null]);
    }
  }
  return out;
}

export function ambilKelasHariIni(hari, jadwalMapLike) {
  const mapJamKe = jadwalMapLike && typeof jadwalMapLike === "object" ? jadwalMapLike : {};
  const semuaIsiHari = Object.values(mapJamKe)
    .map((inner) => (inner && typeof inner === "object" ? inner[hari] : null))
    .filter(Boolean);

  const rombelPerTingkat = new Map(); // tingkat => Set(letter)
  const angkaPolos = new Set(); // tingkat tanpa huruf

  for (const baris of semuaIsiHari) {
    const tokens = parseKelasTokens(baris);
    for (const [tingkat, rombel] of tokens) {
      if (!rombel) angkaPolos.add(tingkat);
      else {
        if (!rombelPerTingkat.has(tingkat)) rombelPerTingkat.set(tingkat, new Set());
        rombelPerTingkat.get(tingkat).add(rombel);
      }
    }
  }

  const semuaTingkat = new Set([...angkaPolos, ...rombelPerTingkat.keys()]);
  const result = [];
  [...semuaTingkat].sort((a, b) => a - b).forEach((tingkat) => {
    const letters = rombelPerTingkat.get(tingkat);
    if (letters && letters.size > 0) {
      [...letters].sort().forEach((ch) => result.push(`${tingkat}${ch}`));
    } else if (angkaPolos.has(tingkat)) {
      result.push(String(tingkat));
    }
  });
  return [...new Set(result)];
}

export function namaHariSekarang() {
  const d = new Date();
  const id = d.getDay(); // 0=Min
  return ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"][id] || "Hari tidak valid";
}
