// File: app/layout.js
import { Poppins } from "next/font/google";
import "./globals.css"; // Tetap di-import di sini ya Bang!
import { cookies } from "next/headers"; // 1. Ambil fungsi membaca cookie dari Next.js
import NavbarMenu from "./NavbarMenu"; // 2. Kita import menu dinamis yang akan kita buat di bawah

const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"] 
});

export const metadata = {
  title: "JasaLaundry.id",
  description: "Layanan Laundry Antar Jemput Terbaik",
};

export default async function RootLayout({ children }) {
  // 3. Cek apakah ada cookie session aktif di browser
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("auth_session");

  return (
    <html lang="id" className="bg-white text-slate-800">
      <body className={`${poppins.className} bg-white text-slate-800 min-h-screen flex flex-col`}>
        
        {/* NAVBAR */}
        <nav className="bg-white border-b border-gray-100 py-4 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-6 flex justify-between items-center bg-white">
            
            {/* PERBAIKAN LOGIKA UTAMA: Jika sudah login arahkan ke /dashboard, jika belum lari ke / */}
            <a 
              href={isLoggedIn ? "/dashboard" : "/"} 
              className="text-xl font-bold tracking-tight text-slate-900 bg-white hover:opacity-80 transition-opacity"
            >
              Jasa<span className="text-blue-600">Laundry</span>.
            </a>
            
            {/* 4. Panggil komponen menu dinamis dengan mengoper status login */}
            <NavbarMenu isLoggedIn={isLoggedIn} />
          </div>
        </nav>

        {/* KONTEN UTAMA */}
        <main className="flex-grow bg-white">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="border-t border-gray-100 py-8 bg-white">
          <div className="max-w-5xl mx-auto px-6 text-center text-sm text-slate-400 font-light bg-white">
            <p>&copy; 2026 JasaLaundry.id. Hak cipta dilindungi.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}