// File: app/login/page.js
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [errorPesan, setErrorPesan] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorPesan("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    // Proses login resmi mengecek ke database user Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorPesan("Email atau password salah!");
    } else {
      // AMAN & REAL: Ambil token access dari session Supabase untuk ditaruh di cookie Middleware
      const sessionToken = data.session.access_token;
      document.cookie = `auth_session=${sessionToken}; path=/; max-age=86400;`; // Berlaku 1 hari
      
      // Alihkan paksa ke dashboard agar layout membaca status baru
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white text-slate-800 px-6">
      <div className="max-w-md w-full border border-gray-100 p-8 rounded-2xl shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 text-center">Selamat Datang</h1>
        <p className="text-slate-500 font-light text-sm mb-6 text-center">
          Masuk ke panel pelanggan untuk melacak status laundry Anda.
        </p>

        {errorPesan && (
          <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm mb-6 font-medium text-center">
            {errorPesan}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 bg-white">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Email Pelanggan</label>
            <input 
              type="email" name="email" required placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Password</label>
            <input 
              type="password" name="password" required placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-sm"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:bg-slate-300 mt-2"
          >
            {loading ? "Memverifikasi Keamanan..." : "Masuk Aplikasi"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6 font-light">
          Belum punya akun laundry? <Link href="/register" className="text-blue-600 font-medium hover:underline">Daftar sekarang</Link>
        </p>
      </div>
    </div>
  );
}