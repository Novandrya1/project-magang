"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavbarMenu({ isLoggedIn }) {
  // State untuk mengontrol buka/tutup menu di HP
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Hapus cookie simulasi
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    setIsOpen(false); // Tutup menu pas logout di HP
    
    // Alihkan user kembali ke halaman login
    window.location.href = "/login";
  };

  return (
    <>
      {/* ========================================= */}
      {/* 1. TAMPILAN DESKTOP (Sembunyi di HP)        */}
      {/* ========================================= */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 bg-white">
        {!isLoggedIn ? (
          <>
            <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
            <Link href="/about" className="hover:text-blue-600 transition-colors">Tentang</Link>
            <Link href="/services" className="hover:text-blue-600 transition-colors">Layanan</Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">Kontak</Link>
            <Link 
              href="/login" 
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm ml-2"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link href="/services" className="text-slate-600 hover:text-blue-600 transition-colors text-xs font-semibold">
              Katalog Layanan
            </Link>

            <Link href="/dashboard" className="text-blue-600 font-bold tracking-wide text-xs">
              Dashboard Pelanggan
            </Link>
            
            {/* AVATAR DESKTOP (Tetap dipertahankan untuk layar lebar) */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-blue-300 px-2.5 py-1.5 rounded-xl transition-all"
            >
              <div className="w-5 h-5 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold rounded-full flex items-center justify-center text-[10px]">
                N
              </div>
              <span className="text-[11px] text-slate-700 font-bold">Novandrya</span>
            </Link>

            <button 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700 font-medium transition-colors border border-red-100 bg-red-50 px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </>
        )}
      </div>

      {/* ========================================= */}
      {/* 2. TOMBOL HAMBURGER MOBILE (Sembunyi di PC) */}
      {/* ========================================= */}
      <button 
        className="md:hidden p-2 -mr-2 text-slate-600 hover:text-blue-600 focus:outline-none transition-transform"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        )}
      </button>

      {/* ========================================= */}
      {/* 3. MENU DROPDOWN MOBILE (Muncul pas diklik) */}
      {/* ========================================= */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-xl md:hidden flex flex-col px-6 py-5 gap-4 z-50">
          {!isLoggedIn ? (
            <>
              <Link href="/" onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-600 hover:text-blue-600 border-b border-gray-50 pb-2">Beranda</Link>
              <Link href="/about" onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-600 hover:text-blue-600 border-b border-gray-50 pb-2">Tentang</Link>
              <Link href="/services" onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-600 hover:text-blue-600 border-b border-gray-50 pb-2">Layanan</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="text-sm font-medium text-slate-600 hover:text-blue-600 border-b border-gray-50 pb-2">Kontak</Link>
              <Link 
                href="/login" 
                onClick={() => setIsOpen(false)}
                className="text-center bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-bold shadow-sm mt-2"
              >
                Login Akun
              </Link>
            </>
          ) : (
            <>
              {/* BAGIAN AVATAR MOBILE SUDAH DIHAPUS SEPENUHNYA AGAR TAMPILAN LEBIH LEGA */}
              <Link href="/services" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-slate-600 hover:text-blue-600 border-b border-gray-50 pb-3">
                Katalog Layanan
              </Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-bold text-blue-600 border-b border-gray-50 pb-3">
                Dashboard Pelanggan
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="flex justify-center items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-3 rounded-lg text-sm font-bold transition-transform mt-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Keluar Akun
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}