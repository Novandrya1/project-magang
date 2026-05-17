// File: app/register/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [pesanError, setPesanError] = useState("");

  const handleRegisterDanAutoLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPesanError("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const nama = formData.get("nama");
    const noHp = formData.get("noHp");
    const alamat = formData.get("alamat");

    // 1. Daftarkan user baru ke Supabase Auth dengan metadata lengkap
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          display_name: nama,
          phone_number: noHp,
          address: alamat
        } 
      }
    });

    if (signUpError) {
      setLoading(false);
      setPesanError(signUpError.message);
      return;
    }

    // 2. LOGIKA AUTO-LOGIN: Jika pendaftaran sukses, langsung panggil signInWithPassword
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      // Jika auto-login gagal (jarang terjadi kalau regis sukses), arahkan manual ke login biasa
      window.location.href = "/login";
    } else {
      // 3. Pasang token akses asli dari Supabase ke cookie agar lolos dari Middleware rute /dashboard
      const sessionToken = signInData.session.access_token;
      document.cookie = `auth_session=${sessionToken}; path=/; max-age=86400;`; // Berlaku 1 hari
      
      // 4. Langsung tembus masukkan user ke dashboard pelanggan secara instan!
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center bg-white text-slate-800 py-12 px-6">
      <div className="max-w-md w-full border border-gray-100 p-8 rounded-2xl shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Daftar Akun</h1>
        <p className="text-slate-500 font-light text-sm mb-6 text-center">
          Bergabung bersama JasaLaundry.id untuk kemudahan mencuci pakaian.
        </p>

        {pesanError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-6 font-medium text-center">
            {pesanError}
          </div>
        )}

        <form onSubmit={handleRegisterDanAutoLogin} className="space-y-4 bg-white">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Nama Lengkap</label>
            <input 
              type="text" name="nama" required placeholder="Nama Anda"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Nomor HP / WhatsApp</label>
            <input 
              type="tel" name="noHp" required placeholder="Contoh: 08123456789"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Email</label>
            <input 
              type="email" name="email" required placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Alamat Lengkap (Untuk Antar Jemput)</label>
            <textarea 
              name="alamat" required rows="3" placeholder="Tuliskan alamat rumah lengkap Anda..."
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm resize-none"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Password</label>
            <input 
              type="password" name="password" required placeholder="••••••••" minLength={6}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-300 mt-2"
          >
            {loading ? "Mendaftarkan & Membuka Dashboard..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-light">
          Sudah punya akun? <Link href="/login" className="text-blue-600 font-medium hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
}