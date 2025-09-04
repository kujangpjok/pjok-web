"use client";

import { useEffect, useMemo, useState } from "react";
import { HARI_LIST, generateJamPelajaran } from "../../lib/jadwal-helpers";
import { loadJadwalMap } from "../../lib/jadwal-repo";

export default function LihatJadwalPage() {
  const jamList = useMemo(() => generateJamPelajaran(), []);
  const [map, setMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const m = await loadJadwalMap();
      setMap(m);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="min-h-[100dvh] grid place-items-center">Memuat…</div>;
  }
  const kosong = !map || Object.keys(map).length === 0;

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-bold text-center mb-2">Lihat Jadwal Pelajaran</h1>

        {kosong ? (
          <div className="text-center text-slate-600">Tidak ada jadwal pelajaran yang tersimpan.</div>
        ) : (
          <div className="space-y-6">
            {HARI_LIST.map((hari) => (
              <div key={hari}>
                <div className="text-[20px] font-bold text-blue-700 mb-2">📅 {hari}</div>
                {jamList.map((jam, idx) => {
                  const pel = map?.[jam.jamKe]?.[hari] || "-";
                  return (
                    <div key={`${hari}-${jam.jamKe}`}>
                      <div className="flex items-center gap-2 py-1">
                        <div className="w-[170px] text-sm font-medium">{jam.waktu} (Jam ke-{jam.jamKe})</div>
                        <div className="flex-1 text-sm">{pel}</div>
                      </div>
                      {idx < jamList.length - 1 && <hr className="border-slate-200 ml-[170px]" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
