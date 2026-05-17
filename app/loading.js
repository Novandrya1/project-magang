// File: app/loading.js
export default function GlobalLoading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-white">
      {/* Animasi Spinner Putar Biru Estetik */}
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
      <p className="text-xs font-medium text-slate-500 tracking-wide animate-pulse">
        Memuat JasaLaundry.id...
      </p>
    </div>
  );
}