import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center bg-white text-slate-800">
      
      <div className="max-w-3xl flex flex-col items-center bg-white">
        
        {/* Badge - Biru Lembut */}
        <span className="mb-6 px-4 py-1.5 rounded-full border border-blue-100 text-xs font-medium text-blue-600 bg-blue-50/50">
          Layanan Antar-Jemput
        </span>

        {/* JUDUL UTAMA */}
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight leading-tight bg-white">
          Pakaian bersih, <br className="hidden md:block" />
          tanpa perlu repot mencuci.
        </h1>
        
        {/* DESKRIPSI */}
        <p className="text-base md:text-lg text-slate-500 max-w-xl mb-10 leading-relaxed font-light bg-white">
          JasaLaundry.id merawat pakaian Anda dengan standar profesional. Kami jemput kotor, kami antar bersih.
        </p>

        {/* TOMBOL AKSI */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white">
          <Link 
            href="/services" 
            className="bg-blue-600 text-white px-7 py-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm text-center"
          >
            Lihat Layanan
          </Link>
          <Link 
            href="/contact" 
            className="bg-white text-blue-600 border border-blue-600 px-7 py-3 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors text-center"
          >
            Hubungi CS
          </Link>
        </div>
      </div>
    </div>
  );
}