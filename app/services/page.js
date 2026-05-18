// File: app/services/page.js
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
import Link from 'next/link'; 
import SearchInput from './SearchInput';
import ServiceCard from './ServiceCard'; // 1. Import komponen kartu buatan kita

async function getServices() {
  const filePath = path.join(process.cwd(), 'data', 'services.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export default async function Services({ searchParams }) {
  const dataLayanan = await getServices();
  
  const cookieStore = await cookies();
  const sudahLogin = cookieStore.has("auth_session");

  const resolvedSearchParams = await searchParams;
  const keyword = resolvedSearchParams.search || "";

  // Filter berdasarkan status login pelanggan (Eksklusif vs Umum)
  const dataTerfilterStatus = sudahLogin 
    ? dataLayanan 
    : dataLayanan.filter(item => item.eksklusif === false);

  // Filter berdasarkan keyword pencarian sesuai tugas Abang
  const dataFinal = dataTerfilterStatus.filter((item) =>
    item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-white px-4 sm:px-6 py-10 text-slate-800 relative overflow-hidden">
      
      {/* Elemen Dekorasi Background Bulat Estetik Ala Aplikasi Modern */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 left-0 -ml-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* TOMBOL KEMBALI DINAMIS (UI Glassmorphism Minimalis) */}
        <div className="mb-10 flex justify-start">
          <Link 
            href={sudahLogin ? "/dashboard" : "/"} 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-blue-600 bg-white/80 hover:bg-white backdrop-blur-md px-4 py-2.5 rounded-2xl transition-all border border-slate-200/60 shadow-sm shadow-slate-100/50 hover:shadow-md hover:scale-[1.02] duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            {sudahLogin ? "Kembali ke Dashboard" : "Kembali ke Beranda"}
          </Link>
        </div>
        
        {/* Section Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className="inline-flex items-center bg-blue-50 border border-blue-100 text-blue-600 font-bold tracking-wider text-[10px] uppercase px-3 py-1 rounded-full mb-4 shadow-sm shadow-blue-50">
            {sudahLogin ? "⚡ Panel Layanan Pelanggan" : "🧺 Katalog Layanan Kami"}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
            {sudahLogin ? (
              <>Selamat Datang! <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Pilih Paket Eksklusif</span> Anda</>
            ) : (
              <>Pilih Layanan Terbaik <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Sesuai Kebutuhan</span> Anda</>
            )}
          </h1>
          
          <p className="text-slate-500 font-light text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
            {sudahLogin 
              ? "Sebagai member aktif, Anda berhak menikmati keuntungan penuh dari paket subscription bulanan, flat rate, dan penanganan laundry premium kami." 
              : "Nikmati kemudahan cuci baju tanpa keluar rumah. Harga transparan, hasil maksimal. Silakan login untuk membuka katalog paket hemat bulanan."}
          </p>
        </div>

        {/* Search Bar Container (Bikin Lebih Padat & Menarik) */}
        <div className="max-w-md mx-auto mb-14 bg-white/40 p-1.5 rounded-2xl border border-slate-200/50 backdrop-blur-sm shadow-sm">
          <SearchInput defaultValue={keyword} />
        </div>

        {/* Daftar Kartu Layanan Grid System */}
        {dataFinal.length === 0 ? (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-3xl shadow-sm max-w-md mx-auto animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 border border-slate-100">🔍</div>
            <p className="text-slate-700 font-bold text-sm mb-0.5">Layanan Tidak Ditemukan</p>
            <p className="text-slate-400 font-light text-xs">Kata kunci "{keyword}" tidak cocok dengan paket apa pun.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {dataFinal.map((item) => (
              /* 2. Panggil komponen ServiceCard secara bersih di sini */
              <ServiceCard key={item.id} item={item} sudahLogin={sudahLogin} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}