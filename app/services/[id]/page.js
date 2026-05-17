// File: app/services/[id]/page.js
import fs from 'fs/promises';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import OrderForm from './OrderForm'; // 1. Import komponen form client buatan kita

async function getSingleService(id) {
  const filePath = path.join(process.cwd(), 'data', 'services.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const services = JSON.parse(fileContents);
  return services.find(service => service.id === id);
}

export default async function ServiceDetail({ params }) {
  const resolvedParams = await params;
  const service = await getSingleService(resolvedParams.id);

  if (!service) {
    notFound();
  }

  const cookieStore = await cookies();
  const sudahLogin = cookieStore.has("auth_session");

  return (
    <div className="min-h-[85vh] px-6 py-16 bg-white text-slate-800">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* KOLOM KIRI: Detail Info */}
        <div className="md:col-span-2 border border-gray-100 p-8 rounded-3xl bg-white shadow-sm">
          <Link 
            href="/services" 
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-blue-600 transition-colors mb-6"
          >
            &larr; Kembali ke Daftar Layanan
          </Link>

          <div className="border-b border-gray-100 pb-6 mb-6">
            {service.eksklusif && (
              <span className="inline-block bg-amber-500 text-white font-semibold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md mb-3 shadow-sm">
                Eksklusif Member
              </span>
            )}
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{service.nama}</h1>
            <p className="text-blue-600 font-bold text-lg">{service.harga}</p>
          </div>

          <div className="space-y-6 bg-white">
            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Deskripsi Lengkap</h3>
              <p className="text-slate-600 font-light leading-relaxed text-sm">
                {service.deskripsi}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">SOP Pengerjaan Premium</h3>
              <ul className="space-y-2.5 text-xs text-slate-600 font-light">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Pemeriksaan awal material kain dan noda pakaian.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Pencucian higienis (1 mesin 1 pelanggan).
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Proses pengeringan maksimal bebas bau apek.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                  Setrika uap presisi tinggi & packing plastik tebal bersegel.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Form Order Interaktif */}
        <div className="border border-gray-100 p-6 rounded-3xl bg-white shadow-sm h-fit">
          {sudahLogin ? (
            /* 2. Panggil komponen OrderForm Client di sini secara aman */
            <OrderForm serviceNama={service.nama} />
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-slate-500 font-light mb-4">
                Anda harus masuk ke akun pelanggan untuk memesan layanan penjemputan ini.
              </p>
              <Link 
                href="/login" 
                className="block w-full bg-blue-600 text-white font-medium py-2 rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm"
              >
                Login untuk Memesan
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}