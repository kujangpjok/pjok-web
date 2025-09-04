export default function LocalResultsCategoryPage({ params }){
  const { category } = params;
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Local Results: {decodeURIComponent(category)}</h1>
      <p className="opacity-70 text-sm">TODO: tampilkan file lokal untuk kategori ini.</p>
    </div>
  );
}
