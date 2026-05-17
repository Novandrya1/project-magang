// File: app/services/page.js
import fs from 'fs/promises';
import path from 'path';
import { cookies } from 'next/headers';
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

  const dataTerfilterStatus = sudahLogin 
    ? dataLayanan 
    : dataLayanan.filter(item => item.eksklusif === false);

  const dataFinal = dataTerfilterStatus.filter((item) =>
    item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
    item.deskripsi.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="min-h-[75vh] px-6 py-16 bg-white text-slate-800">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-2 block">
            {sudahLogin ? "Panel Layanan Pelanggan" : "Katalog Layanan"}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {sudahLogin ? "Selamat Datang! Pilih Paket Eksklusif Anda" : "Pilih layanan sesuai kebutuhan"}
          </h1>
          <p className="text-slate-500 font-light">
            {sudahLogin 
              ? "Sebagai member aktif, Anda berhak menikmati paket subscription dan layanan premium kami." 
              : "Harga transparan, hasil maksimal. Silakan login untuk membuka paket hemat bulanan."}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <SearchInput defaultValue={keyword} />
        </div>

        {/* Daftar Kartu Layanan */}
        {dataFinal.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-slate-400 font-light">Layanan "{keyword}" tidak ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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