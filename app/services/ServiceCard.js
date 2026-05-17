// File: app/services/ServiceCard.js
"use client";

import Link from 'next/link';

export default function ServiceCard({ item, sudahLogin }) {
  return (
    <Link 
      href={`/services/${item.id}`} 
      className="group block relative bg-white p-8 rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full"
    >
      {/* Badge Penanda Paket Eksklusif */}
      {item.eksklusif && (
        <span className="absolute -top-3 left-6 bg-amber-500 text-white font-semibold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm z-10">
          Eksklusif Member
        </span>
      )}

      <div>
        <div className="flex justify-between items-start mb-4 gap-4">
          <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
            {item.nama}
          </h2>
          <span className="bg-blue-50 text-blue-600 font-semibold text-sm px-3 py-1 rounded-full border border-blue-100 whitespace-nowrap">
            {item.harga}
          </span>
        </div>
        <p className="text-slate-500 font-light leading-relaxed text-sm">
          {item.deskripsi}
        </p>
      </div>

      {/* Tanda UX kecil di bawah pengganti tombol kosongan kemarin */}
      <div className="mt-6 border-t border-gray-50 pt-4 flex justify-between items-center text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
        <span>{sudahLogin ? "Pesan & Lihat Detail" : "Lihat Detail Layanan"}</span>
        <span>&rarr;</span>
      </div>
    </Link>
  );
}