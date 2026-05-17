"use client"; // Wajib Client Component untuk handle fungsi klik tombol logout

import Link from "next/link";

export default function NavbarMenu({ isLoggedIn }) {
  
  const handleLogout = () => {
    // Hapus cookie simulasi tugas 9 dengan memundurkan tanggal kadaluarsanya
    document.cookie = "auth_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
    
    // Alihkan user kembali ke halaman login dan paksa refresh status layout
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center gap-6 text-sm font-medium text-slate-500 bg-white">
      {/* JIKA USER BELUM LOGIN: Munculkan menu publik harian */}
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
        /* JIKA USER SUDAH LOGIN: Tampilkan menu interaktif premium */
        <>
          {/* Tambahkan menu Layanan agar user tidak tersesat saat di dashboard */}
          <Link href="/services" className="text-slate-600 hover:text-blue-600 transition-colors text-xs font-semibold">
            Katalog Layanan
          </Link>

          <Link href="/dashboard" className="text-blue-600 font-bold tracking-wide text-xs">
            Dashboard Pelanggan
          </Link>
          
          {/* TOMBOL AVATAR PROFIL PREMIUM BARU */}
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:border-blue-300 px-2.5 py-1.5 rounded-xl transition-all"
          >
            <div className="w-4.5 h-4.5 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold rounded-full flex items-center justify-center text-[9px]">
              N
            </div>
            <span className="text-[11px] text-slate-700 font-bold hidden sm:inline">Novandrya</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-medium transition-colors border border-red-100 bg-red-50 px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1"
          >
            {/* Ikon Logout Minimalis */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            Logout
          </button>
        </>
      )}
    </div>
  );
}