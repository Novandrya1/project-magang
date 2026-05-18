// File: app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css"; // Tetap di-import di sini ya Bang!
import { cookies } from "next/headers"; // 1. Ambil fungsi membaca cookie dari Next.js
import NavbarMenu from "./NavbarMenu"; // 2. Kita import menu dinamis yang akan kita buat di bawah

// SOLUSI UTAMA FIX VERCEL 500: Memaksa Next.js memperlakukan seluruh rute sebagai Dynamic Server Rendered
export const dynamic = "force-dynamic";

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata = {
  title: "JasaLaundry.id",
  description: "Layanan Laundry Antar Jemput Terbaik",
};

export default async function RootLayout({ children }) {
  let isLoggedIn = false;

  try {
    const cookieStore = await cookies();
    isLoggedIn = cookieStore.has("auth_session");
  } catch (error) {
    console.error("Gagal membaca cookie di server production:", error);
    isLoggedIn = false; 
  }

  return (
    // Tambahkan scroll-smooth untuk UX yang lebih elegan
    <html lang="id" className="bg-white text-slate-800 scroll-smooth">
      {/* KUNCI RESPONSIVE: Tambahkan w-full dan overflow-x-hidden agar layar HP tidak bocor ke samping */}
      <body className={`${poppins.className} bg-white text-slate-800 min-h-screen flex flex-col w-full overflow-x-hidden`}>
        
        {/* NAVBAR: py-3 di HP, py-4 di Desktop biar pas */}
        <nav className="bg-white border-b border-gray-100 py-3 sm:py-4 sticky top-0 z-50 w-full">
          {/* Padding px-4 di HP, px-6 di Desktop */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 flex justify-between items-center bg-white w-full">
            
            {/* LOGIKA UTAMA: Teks ukuran lg di HP, xl di Desktop, truncate mencegah teks turun baris */}
            <a 
              href={isLoggedIn ? "/dashboard" : "/"} 
              className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 bg-white hover:opacity-80 transition-opacity truncate"
            >
              Jasa<span className="text-blue-600">Laundry</span>.
            </a>
            
            {/* 4. Panggil komponen menu dinamis dengan mengoper status login */}
            <NavbarMenu isLoggedIn={isLoggedIn} />
          </div>
        </nav>

        {/* KONTEN UTAMA: Dikunci w-full dan overflow-hidden juga */}
        <main className="flex-grow bg-white w-full overflow-x-hidden">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 py-8 bg-white w-full">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center text-xs sm:text-sm text-slate-400 font-light bg-white">
            <p>&copy; 2026 JasaLaundry.id. Hak cipta dilindungi.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}