"use client";
import { useEffect, useRef, useState } from "react";

export default function CameraCapture(){
  const videoRef = useRef(null);
  const [shot, setShot] = useState(null);

  useEffect(()=>{
    let stream;
    (async ()=>{
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video:true });
        if(videoRef.current) videoRef.current.srcObject = stream;
      } catch {}
    })();
    return ()=>{ if(stream) stream.getTracks().forEach(t=>t.stop()); };
  },[]);

  function takePhoto(){
    const video = videoRef.current;
    if(!video) return;
    const c = document.createElement("canvas");
    c.width = video.videoWidth; c.height = video.videoHeight;
    const ctx = c.getContext("2d");
    ctx.drawImage(video, 0, 0);
    setShot(c.toDataURL("image/png"));
  }

  return (
    <div className="space-y-2">
      <video ref={videoRef} autoPlay playsInline className="w-full rounded border border-slate-300" />
      <button onClick={takePhoto} className="px-3 py-2 rounded bg-blue-600 text-white">Ambil Foto</button>
      {shot && <img src={shot} alt="preview" className="rounded border border-slate-300" />}
    </div>
  );
}
