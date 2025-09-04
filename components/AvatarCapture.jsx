"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { db } from "../lib/db";

async function saveAvatarDataUrl(dataUrl) {
  await db.files.put({ id: "avatar_self", dataUrl });
}
async function loadAvatarDataUrl() {
  const row = await db.files.get("avatar_self");
  return row?.dataUrl || null;
}

export default function AvatarCapture({ size = 96 }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => setDataUrl(await loadAvatarDataUrl()))();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-full overflow-hidden border border-white/50"
        style={{ width: size, height: size }}
        aria-label="Ambil/ubah foto profil"
      >
        {dataUrl ? (
          // pakai <img> biasa agar aman untuk data URL besar
          <img src={dataUrl} alt="Foto Profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <Image
            src="/ic_user.png" // siapkan ikon fallback di /public/ic_user.png
            alt="User"
            width={size}
            height={size}
          />
        )}
      </button>

      {open && <CameraModal onClose={() => setOpen(false)} onShot={async (url) => {
        await saveAvatarDataUrl(url);
        setDataUrl(url);
        setOpen(false);
        alert("Foto profil diperbarui.");
      }} />}
    </>
  );
}

function CameraModal({ onClose, onShot }) {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(s);
        if (videoRef.current) videoRef.current.srcObject = s;
      } catch {
        alert("Tidak bisa akses kamera.");
        onClose();
      }
    })();
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, [onClose, stream]);

  function takePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth || 640;
    c.height = video.videoHeight || 480;
    const ctx = c.getContext("2d");
    ctx.drawImage(video, 0, 0);
    const url = c.toDataURL("image/jpeg", 0.92);
    onShot(url);
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-4 w-full max-w-sm">
        <div className="text-sm font-semibold mb-2">Ambil Foto</div>
        <video ref={videoRef} autoPlay playsInline className="w-full rounded border" />
        <div className="flex gap-2 mt-3">
          <button onClick={takePhoto} className="px-3 py-2 rounded bg-blue-600 text-white">Ambil</button>
          <button onClick={onClose} className="px-3 py-2 rounded border">Batal</button>
        </div>
      </div>
    </div>
  );
}
