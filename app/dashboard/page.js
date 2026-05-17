// File: app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPelanggan() {
  const [activeTab, setActiveTab] = useState("riwayat");
  const [riwayat, setRiwayat] = useState([]);
  const [notifSukses, setNotifSukses] = useState("");

  // STATE REAL: Mengatur data profil yang dinamis membaca pembelian user
  const [profile, setProfile] = useState({
    nama: "Novandrya Ramadhan",
    email: "novandrya.r@gmail.com",
    noHp: "085854489000",
    alamatUtama: "Cerme, Kabupaten Gresik, East Java",
    tipe: "Akun Biasa",       // Standar default akun biasa dulu, Jir
    kuotaSisa: "0 Kg"         // Default awal 0 Kg sebelum beli paket
  });

  useEffect(() => {
    // 1. Ambil data riwayat orderan
    const dataLokalOrder = localStorage.getItem("riwayat_laundry");
    let listOrder = [];
    if (dataLokalOrder) {
      listOrder = JSON.parse(dataLokalOrder);
      setRiwayat(listOrder);
    }

    // 2. LOGIKA REAL-TIME: Cek apakah user pernah beli paket langganan bulanan di riwayatnya
    const pernahBeliPaket = listOrder.some(order => 
      order.layanan.toLowerCase().includes("paket") || 
      order.layanan.toLowerCase().includes("langganan")
    );

    // 3. Ambil data modifikasi profil dari form edit jika ada
    const dataLokalProfil = localStorage.getItem("profil_user_laundry");
    
    if (dataLokalProfil) {
      const profilTersimpan = JSON.parse(dataLokalProfil);
      // Update status tipe & kuota secara riil berdasarkan isi riwayat belanja
      setProfile({
        ...profilTersimpan,
        tipe: pernahBeliPaket ? "Premium Member" : "Akun Biasa",
        kuotaSisa: pernahBeliPaket ? "30 Kg" : "0 Kg"
      });
    } else {
      // Jika belum ada modifikasi form, gunakan default tapi tetep cek riwayat paket
      setProfile(prev => ({
        ...prev,
        tipe: pernahBeliPaket ? "Premium Member" : "Akun Biasa",
        kuotaSisa: pernahBeliPaket ? "30 Kg" : "0 Kg"
      }));
    }
  }, []);

  // Fungsi simpan perubahan form profil
  const handleSimpanProfil = (e) => {
    e.preventDefault();
    setNotifSukses("");

    const formData = new FormData(e.target);
    const profilDiperbarui = {
      ...profile,
      nama: formData.get("nama")?.trim() || profile.nama,
      noHp: formData.get("noHp")?.trim() || profile.noHp,
      alamatUtama: formData.get("alamatUtama")?.trim() || profile.alamatUtama,
    };

    setProfile(profilDiperbarui);
    localStorage.setItem("profil_user_laundry", JSON.stringify(profilDiperbarui));
    
    setNotifSukses("✓ Profil dan Alamat Utama penjemputan berhasil diperbarui!");
    setTimeout(() => setNotifSukses(""), 4000);
  };

  const hapusSemuaRiwayat = () => {
    if (confirm("Apakah Abang ingin membersihkan semua log simulasi riwayat orderan?")) {
      localStorage.removeItem("riwayat_laundry");
      setRiwayat([]);
      // Kembalikan status akun ke biasa karena belanjaan direset
      setProfile(prev => ({ ...prev, tipe: "Akun Biasa", kuotaSisa: "0 Kg" }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 relative">
      
      {/* BANNER HEADER DASHBOARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white pt-10 pb-24 px-6 border-b border-indigo-900/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center shadow-md border border-white/10">
              {profile.nama.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight">{profile.nama}</h1>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md border ${
                  profile.tipe === "Premium Member" 
                    ? "bg-amber-400/20 text-amber-400 border-amber-400/20" 
                    : "bg-slate-400/20 text-slate-300 border-slate-400/20"
                }`}>
                  {profile.tipe}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light mt-0.5">{profile.email}</p>
            </div>
          </div>
          
          {/* PERBAIKAN TOMBOL: Teks santai & umum sesuai standar UX */}
          <Link 
            href="/services" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-xl text-xs transition-all shadow-sm tracking-wide"
          >
            Pesan Sekarang
          </Link>
        </div>
      </div>

      {/* KARTU RINGKASAN DATA (RIAN/NYATA) */}
      <div className="max-w-5xl mx-auto px-6 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Kuota Saldo Member</p>
            <p className={`text-sm font-bold mt-1 ${profile.kuotaSisa !== "0 Kg" ? "text-blue-600" : "text-slate-700"}`}>
              {profile.kuotaSisa}
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Pesanan</p>
            <p className="text-sm font-bold text-slate-800 mt-1">{riwayat.length} Transaksi</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Alamat Jemput Default</p>
            <p className="text-sm font-bold text-slate-800 mt-1 truncate max-w-[240px]">{profile.alamatUtama}</p>
          </div>
        </div>

        {/* TABS MENU */}
        <div className="mt-8 flex border-b border-slate-200 gap-6 text-xs font-semibold">
          <button 
            onClick={() => setActiveTab("riwayat")}
            className={`pb-3 transition-all relative ${activeTab === "riwayat" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"}`}
          >
            Riwayat Pemesanan ({riwayat.length})
          </button>
          <button 
            onClick={() => setActiveTab("profil")}
            className={`pb-3 transition-all relative ${activeTab === "profil" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"}`}
          >
            Pengaturan Profil & Alamat Utama
          </button>
        </div>

        {notifSukses && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium rounded-xl text-center shadow-sm">
            {notifSukses}
          </div>
        )}

        {/* KONTEN TAB 1: RIWAYAT LAUNDRY */}
        {activeTab === "riwayat" && (
          <div className="mt-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Log Pelacakan Laundry</h3>
                <p className="text-[10px] text-slate-400 font-light">Status pengerjaan pakaian kotor Anda secara live.</p>
              </div>
              {riwayat.length > 0 && (
                <button 
                  onClick={hapusSemuaRiwayat}
                  className="text-[9px] text-red-500 hover:text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 font-medium"
                >
                  Reset Log
                </button>
              )}
            </div>

            {riwayat.length === 0 ? (
              <div className="text-center py-14 px-4">
                <p className="text-xs font-medium text-slate-500">Belum ada aktivitas penjemputan baju kotor.</p>
                <Link href="/services" className="inline-block bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-[11px] mt-4 hover:bg-blue-700 transition-colors shadow-sm">
                  Mulai Laundry Pertama
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-4">ID Nota</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Layanan</th>
                      <th className="py-3 px-4">Beban</th>
                      <th className="py-3 px-4">Total Biaya</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {riwayat.map((order, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-blue-600">{order.notaId}</td>
                        <td className="py-3 px-4 text-slate-400 font-light">{order.tanggal}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{order.layanan}</td>
                        <td className="py-3 px-4 font-light">{order.jumlah} {order.satuan}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {order.totalBayar > 0 ? `Rp ${order.totalBayar.toLocaleString("id-ID")}` : "Flat Paket Langganan"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full text-[10px] font-medium animate-pulse">
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* KONTEN TAB 2: EDIT PROFIL & KUNCI ALAMAT UTAMA */}
        {activeTab === "profil" && (
          <div className="mt-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-6">
            <div className="border-b border-slate-100 pb-4 mb-5">
              <h3 className="text-xs font-bold text-slate-900">Informasi Pribadi & Alamat Utama</h3>
              <p className="text-[10px] text-slate-400 font-light mt-0.5">Atur detail kontak Anda agar kurir tidak salah menjemput pakaian ke rumah.</p>
            </div>

            <form onSubmit={handleSimpanProfil} className="space-y-4 max-w-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nama Lengkap Anda</label>
                  <input 
                    type="text" 
                    name="nama"
                    defaultValue={profile.nama}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">No. WhatsApp Aktif</label>
                  <input 
                    type="tel" 
                    name="noHp"
                    defaultValue={profile.noHp}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Alamat Lengkap Rumah (Titik Penjemputan Default)</label>
                <textarea 
                  name="alamatUtama"
                  defaultValue={profile.alamatUtama}
                  required
                  rows="3"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs resize-none leading-relaxed"
                ></textarea>
              </div>

              <div className="pt-2 border-t border-slate-50 mt-5">
                <button 
                  type="submit"
                  className="bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Simpan Perubahan Data
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ==================================================================== */}
      {/* FITUR BARU: FLOATING CHAT ADMIN WHATSAPP (STANDARD UX EXCELLENCE)    */}
      {/* ==================================================================== */}
      <a 
        href={`https://wa.me/${profile.noHp}?text=Halo%20Admin%20JasaLaundry,%20saya%20ingin%20bertanya%20mengenai%20status%20penjemputan%20laundry%20saya.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group z-50"
        title="Hubungi Admin"
      >
        {/* Ikon Chat Balon Mewah */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.222 3.419.169l2.241 2.241c.401.402 1.054.166 1.054-.4V16.51c2.17-.412 3.931-2.022 4.417-4.146A9.761 9.761 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.761 9.761 0 00.75 3.76z" />
        </svg>
        {/* Teks kecil tooltip yang muncul pas di-hover */}
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-[11px] font-bold tracking-wide uppercase transition-all duration-300 whitespace-nowrap">
          Chat Admin
        </span>
      </a>
      {/* ==================================================================== */}

    </div>
  );
}