export default function PenilaianFormPage({ params }){
  const { kelas, materiEncoded, pertemuan } = params;
  const materi = decodeURIComponent(materiEncoded);
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Form Nilai</h1>
      <div className="text-sm opacity-80">Kelas: {decodeURIComponent(kelas)}</div>
      <div className="text-sm opacity-80">Materi: {materi}</div>
      <div className="text-sm opacity-80">Pertemuan: {pertemuan}</div>
      <div className="mt-4 text-sm">TODO: input Kognitif, Psikomotorik, Afektif, Nilai Harian.</div>
    </div>
  );
}
