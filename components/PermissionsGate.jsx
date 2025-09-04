"use client";
export default function PermissionsGate(){
  async function askLocation(){
    try {
      await new Promise((resolve,reject)=>{
        if(!navigator.geolocation) return reject(new Error("Geolocation tidak didukung"));
        navigator.geolocation.getCurrentPosition(()=>resolve(), e=>reject(e), {enableHighAccuracy:true,timeout:5000});
      });
      alert("Lokasi: diizinkan");
    } catch(e){ alert("Lokasi ditolak / gagal"); }
  }

  async function askNotifications(){
    if(!("Notification" in window)) return alert("Notifications tidak didukung");
    const res = await Notification.requestPermission();
    alert("Status notifikasi: " + res);
  }

  async function askCamera(){
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video:true });
      s.getTracks().forEach(t=>t.stop());
      alert("Kamera: diizinkan");
    } catch { alert("Kamera ditolak / gagal"); }
  }

  return (
    <div className="flex gap-2">
      <button className="px-3 py-2 rounded bg-slate-800 text-white" onClick={askLocation}>Izin Lokasi</button>
      <button className="px-3 py-2 rounded bg-slate-800 text-white" onClick={askNotifications}>Izin Notifikasi</button>
      <button className="px-3 py-2 rounded bg-slate-800 text-white" onClick={askCamera}>Izin Kamera</button>
    </div>
  );
}
