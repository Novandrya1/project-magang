// File: app/contact/page.js
"use client";

import { useState } from "react";
import { submitContact } from "../actions/contactAction";

export default function Contact() {
  const [terkirim, setTerkirim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorFields, setErrorFields] = useState({}); // State untuk menampung error per kolom

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorFields({}); // Reset error setiap kali submit

    const formData = new FormData(e.target);
    const response = await submitContact(formData);

    setLoading(false);

    if (response.success) {
      setTerkirim(true);
    } else if (response.isValidationError) {
      // Jika error karena validasi Zod gagal, simpan ke state errorFields
      setErrorFields(response.errors);
    } else {
      alert("Maaf, terjadi kesalahan teknis.");
    }
  };

  return (
    <div className="min-h-[75vh] px-6 py-16 bg-white flex flex-col justify-center items-center text-slate-800">
      <div className="max-w-xl w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Hubungi Kami
          </h1>
          <p className="text-slate-500 font-light">
            Ada pertanyaan atau keluhan? Tim kami siap membantu Anda.
          </p>
        </div>
        
        {terkirim ? (
          <div className="bg-blue-50 text-blue-700 p-8 rounded-2xl text-center font-medium border border-blue-100 shadow-sm">
            Terima kasih! Pesan Anda sudah kami terima. <br />
            Tim JasaLaundry.id akan segera membalasnya.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  className={`w-full px-4 py-3 rounded-lg border text-slate-800 bg-white focus:outline-none text-sm transition-colors ${
                    errorFields.nama ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  placeholder="Masukkan nama"
                />
                {/* Tampilkan pesan error nama */}
                {errorFields.nama && <p className="text-xs text-red-500 mt-1.5">{errorFields.nama[0]}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                <input 
                  type="text" // Diubah ke text sementara biar browser tidak memvalidasi otomatis, agar Zod backend yang bekerja
                  name="email"
                  className={`w-full px-4 py-3 rounded-lg border text-slate-800 bg-white focus:outline-none text-sm transition-colors ${
                    errorFields.email ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  placeholder="nama@email.com"
                />
                {/* Tampilkan pesan error email */}
                {errorFields.email && <p className="text-xs text-red-500 mt-1.5">{errorFields.email[0]}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Pesan</label>
              <textarea 
                name="pesan"
                rows="5" 
                className={`w-full px-4 py-3 rounded-lg border text-slate-800 bg-white focus:outline-none text-sm resize-none transition-colors ${
                  errorFields.pesan ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
                placeholder="Tuliskan pesan Anda di sini..."
              ></textarea>
              {/* Tampilkan pesan error pesan */}
              {errorFields.pesan && <p className="text-xs text-red-500 mt-1.5">{errorFields.pesan[0]}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full text-white font-medium py-3.5 rounded-lg transition-colors shadow-sm ${
                loading ? "bg-slate-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Mengirim Pesan..." : "Kirim Pesan"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}