export default function SiswaDetailPage({ params }){
  const { kelas } = params;
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Detail Kelas: {decodeURIComponent(kelas)}</h1>
      <p className="opacity-70 text-sm">TODO: daftar siswa, tambah/hapus, dsb.</p>
    </div>
  );
}
