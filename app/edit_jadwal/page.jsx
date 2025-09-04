"use client";

import { useEffect, useMemo, useState } from "react";
import { HARI_LIST, generateJamPelajaran } from "../../lib/jadwal-helpers";
import { loadJadwalMap, saveJadwalMap } from "../../lib/jadwal-repo";

export default function EditJadwalPage() {
  const jamList = useMemo(() => generateJamPelajaran(), []);
  const [map, setMap] = useState({});        // { jamKe: { hari: isi } }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // init state
  useEffect(() => {
    (async () => {
      const loaded = await loadJadwalMap();
      // default Sabtu/Minggu
      for (const { jamKe } of jamList) {
        if (!loaded[jamKe]) loaded[jamKe] = {};
        if (loaded[jamKe]["Sabtu"] == null) loaded[jamKe]["Sabtu"] = "Pembiasaan: membantu orang tua, ibadah, bersih-bersih...";
        if (loaded[jamKe]["Minggu"] == null) loaded[jamKe]["Minggu"] = "Libur";
        for (const h of HARI_LIST) if (loaded[jamKe][h] == null) loaded[jamKe][h] = "";
      }
      setMap(loaded);
      setLoading(false);
    })();
  }, [jamList]);

  function setCell(jamKe, hari, val) {
    setMap((prev) => ({ ...prev, [jamKe]: { ...(prev[jamKe] || {}), [hari]: val } }));
  }

  async function onSave() {
    try {
      setSaving(true);
      await saveJadwalMap(map);
      alert("Jadwal berhasil disimpan");
    } catch (e) {
      alert("Gagal menyimpan jadwal");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="min-h-[100dvh] grid place-items-center">Memuat…</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-white">
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-xl font-bold text-center">Edit Jadwal Mengajar PJOK</h1>
        <div className="h-2" />

        {/* daftar hari */}
        <div className="space-y-6">
          {HARI_LIST.map((hari) => {
            const isEditable = hari !== "Sabtu" && hari !== "Minggu";
            return (
              <div key={hari}>
                <div className="text-lg font-semibold text-blue-700 mb-2">{hari}</div>
                {jamList.map((jam) => {
                  const val = map?.[jam.jamKe]?.[hari] ?? "";
                  return (
                    <div key={`${hari}-${jam.jamKe}`} className="flex items-center gap-2 mb-2">
                      <div className="w-[120px] text-center text-sm">
                        Jam {jam.jamKe}<br/>{jam.waktu}
                      </div>
                      {isEditable ? (
                        <input
                          className="flex-1 px-3 py-2 border rounded text-sm"
                          placeholder="Isi pelajaran"
                          value={val}
                          onChange={(e) => setCell(jam.jamKe, hari, e.target.value)}
                        />
                      ) : (
                        <div className="flex-1 text-sm italic text-slate-600">
                          {val || (hari === "Sabtu"
                            ? "Pembiasaan: membantu orang tua, ibadah, bersih-bersih..."
                            : "Libur")}
                        </div>
                      )}
                    </div>
                  );
                })}
                <hr className="my-3 border-slate-200" />
              </div>
            );
          })}
        </div>

        <button
          onClick={onSave}
          disabled={saving}
          className="mt-4 w-full px-4 py-2 rounded bg-blue-600 text-white hover:brightness-110 disabled:opacity-60"
        >
          {saving ? "Menyimpan…" : "Simpan Jadwal"}
        </button>
      </div>
    </div>
  );
}
