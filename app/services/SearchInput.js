// File: app/services/SearchInput.js
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchInput({ defaultValue }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      params.set("search", term); // Tambah ?search=keyword ke URL
    } else {
      params.delete("search"); // Hapus parameter kalau kolom kosong
    }
    
    // Perbarui URL di browser secara instan tanpa reload halaman penuh (sesuai instruksi PDF)
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Cari layanan laundry... (misal: Kilat)"
        defaultValue={defaultValue}
        onChange={(e) => handleSearch(e.target.value)}
        className="w-full px-5 py-3 pl-11 rounded-xl border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors text-sm shadow-sm"
      />
      {/* Ikon Kaca Pembesar Minimalis */}
      <div className="absolute left-4 top-3.5 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.604 10.604z" />
        </svg>
      </div>
    </div>
  );
}