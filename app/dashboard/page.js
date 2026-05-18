// File: app/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPelanggan() {
  // Default tab kita arahkan ke pesanan aktif ("aktif")
  const [activeTab, setActiveTab] = useState("aktif");
  const [riwayat, setRiwayat] = useState([]);
  const [notifSukses, setNotifSukses] = useState("");
  
  // STATE BARU: Untuk menyimpan data pesanan yang sedang di-klik detailnya
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [profile, setProfile] = useState({
    nama: "Memuat...",
    email: "-",
    noHp: "Belum diatur",
    alamatUtama: "Belum diatur",
    tipe: "Akun Biasa", 
    kuotaSisa: "0 Kg" 
  });

  useEffect(() => {
    // Ambil data riwayat orderan dengan Try-Catch biar anti-error JSON
    const dataLokalOrder = localStorage.getItem("riwayat_laundry");
    let listOrder = [];
    if (dataLokalOrder) {
      try {
        listOrder = JSON.parse(dataLokalOrder);
      } catch (error) {
        listOrder = [];
      }
      setRiwayat(listOrder);
    }

    const pernahBeliPaket = listOrder.some(order => 
      order.layanan.toLowerCase().includes("paket") || 
      order.layanan.toLowerCase().includes("langganan")
    );

    const namaDariLogin = localStorage.getItem("nama_lengkap") || "Pelanggan Baru";
    const emailDariLogin = localStorage.getItem("email_user") || "email@belum-diatur.com";
    const noHpDariLogin = localStorage.getItem("noHp_user") || "Belum diatur";
    const alamatDariLogin = localStorage.getItem("alamat_user") || "Belum diatur";

    const dataLokalProfil = localStorage.getItem("profil_user_laundry");
    
    if (dataLokalProfil) {
      const profilTersimpan = JSON.parse(dataLokalProfil);
      setProfile({
        ...profilTersimpan,
        nama: profilTersimpan.nama || namaDariLogin,
        email: emailDariLogin,
        noHp: profilTersimpan.noHp || noHpDariLogin,
        alamatUtama: profilTersimpan.alamatUtama || alamatDariLogin,
        tipe: pernahBeliPaket ? "Premium Member" : "Akun Biasa",
        kuotaSisa: pernahBeliPaket ? "30 Kg" : "0 Kg"
      });
    } else {
      setProfile({
        nama: namaDariLogin,
        email: emailDariLogin,
        noHp: noHpDariLogin,
        alamatUtama: alamatDariLogin,
        tipe: pernahBeliPaket ? "Premium Member" : "Akun Biasa",
        kuotaSisa: pernahBeliPaket ? "30 Kg" : "0 Kg"
      });
    }
  }, []);

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
    
    localStorage.setItem("nama_lengkap", profilDiperbarui.nama);
    localStorage.setItem("noHp_user", profilDiperbarui.noHp);
    localStorage.setItem("alamat_user", profilDiperbarui.alamatUtama);
    
    setNotifSukses("✓ Profil dan Alamat Utama penjemputan berhasil diperbarui!");
    setTimeout(() => setNotifSukses(""), 4000);
  };

  const hapusSemuaRiwayat = () => {
    if (confirm("Apakah Anda ingin membersihkan semua log pesanan?")) {
      localStorage.removeItem("riwayat_laundry");
      setRiwayat([]);
      setProfile(prev => ({ ...prev, tipe: "Akun Biasa", kuotaSisa: "0 Kg" }));
    }
  };

  const inisialAvatar = profile.nama && profile.nama !== "Memuat..." 
    ? profile.nama.charAt(0).toUpperCase() 
    : "U";

  // LOGIKA FILTERING PESANAN (Memisahkan yang Aktif dan yang Selesai)
  const pesananAktif = riwayat.filter(order => order.status.toLowerCase() !== "selesai");
  const pesananSelesai = riwayat.filter(order => order.status.toLowerCase() === "selesai");

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 relative">
      
      {/* BANNER HEADER DASHBOARD */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white pt-10 pb-24 px-6 border-b border-indigo-900/20">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-lg rounded-2xl flex items-center justify-center shadow-md border border-white/10">
              {inisialAvatar}
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
        </div>
      </div>

      {/* KARTU RINGKASAN DATA */}
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

        {/* TABS MENU BARU */}
        <div className="mt-8 flex overflow-x-auto no-scrollbar border-b border-slate-200 gap-6 text-xs font-semibold">
          <button 
            onClick={() => setActiveTab("pesan")}
            className={`pb-3 transition-all whitespace-nowrap relative flex items-center gap-1.5 ${activeTab === "pesan" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Pesan Layanan
          </button>
          <button 
            onClick={() => setActiveTab("aktif")}
            className={`pb-3 transition-all whitespace-nowrap relative ${activeTab === "aktif" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"}`}
          >
            Pesanan Saya <span className="bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-[10px] ml-1">{pesananAktif.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("riwayat")}
            className={`pb-3 transition-all whitespace-nowrap relative ${activeTab === "riwayat" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"}`}
          >
            Riwayat Selesai <span className="bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full text-[10px] ml-1">{pesananSelesai.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab("profil")}
            className={`pb-3 transition-all whitespace-nowrap relative ${activeTab === "profil" ? "text-blue-600 border-b-2 border-blue-600 font-bold" : "text-slate-400 hover:text-slate-600 font-medium"}`}
          >
            Pengaturan Profil
          </button>
        </div>

        {notifSukses && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-medium rounded-xl text-center shadow-sm">
            {notifSukses}
          </div>
        )}

        {/* ======================= KONTEN TAB ======================= */}

        {/* TAB 1: PESAN BARU */}
        {activeTab === "pesan" && (
          <div className="mt-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden p-8 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Pilih Layanan Laundry</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
              Jelajahi berbagai paket cuci komplit, setrika, hingga layanan cuci sepatu dan karpet. Kurir kami siap menjemput pakaian kotor Anda sekarang.
            </p>
            <Link 
              href="/services" 
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              Buka Katalog & Buat Pesanan
            </Link>
          </div>
        )}

        {/* TAB 2: PESANAN SAYA (Dengan Tombol Detail) */}
        {activeTab === "aktif" && (
          <div className="mt-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Pesanan Sedang Dikerjakan</h3>
                <p className="text-[10px] text-slate-400 font-light">Status pelacakan pakaian kotor Anda secara live.</p>
              </div>
            </div>

            {pesananAktif.length === 0 ? (
              <div className="text-center py-14 px-4">
                <p className="text-xs font-medium text-slate-500">Hore! Tidak ada tumpukan cucian kotor saat ini.</p>
                <button onClick={() => setActiveTab("pesan")} className="inline-block bg-blue-50 text-blue-600 font-bold px-4 py-2 rounded-xl text-[11px] mt-4 hover:bg-blue-100 transition-colors">
                  Buat Pesanan Baru
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-4">ID Nota</th>
                      <th className="py-3 px-4">Layanan</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pesananAktif.map((order, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-blue-600">{order.notaId}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{order.layanan}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full text-[10px] font-medium animate-pulse">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-lg text-[10px] font-bold transition-colors border border-slate-200"
                          >
                            Lihat Detail
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: RIWAYAT PEMESANAN */}
        {activeTab === "riwayat" && (
          <div className="mt-5 bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xs font-bold text-slate-900">Riwayat Pesanan Selesai</h3>
                <p className="text-[10px] text-slate-400 font-light">Daftar cucian yang sudah rampung dan dibayar.</p>
              </div>
              {pesananSelesai.length > 0 && (
                <button 
                  onClick={hapusSemuaRiwayat}
                  className="text-[9px] text-red-500 hover:text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 font-medium"
                >
                  Reset Log
                </button>
              )}
            </div>

            {pesananSelesai.length === 0 ? (
              <div className="text-center py-14 px-4">
                <p className="text-xs font-medium text-slate-400">Belum ada pesanan yang berstatus selesai.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-4">ID Nota</th>
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Layanan</th>
                      <th className="py-3 px-4">Total Biaya</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {pesananSelesai.map((order, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-500">{order.notaId}</td>
                        <td className="py-3 px-4 text-slate-400 font-light">{order.tanggal}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{order.layanan}</td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {order.totalBayar > 0 ? `Rp ${order.totalBayar.toLocaleString("id-ID")}` : "Flat Paket Langganan"}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
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

        {/* TAB 4: EDIT PROFIL */}
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
                  <input type="text" name="nama" defaultValue={profile.nama !== "Memuat..." ? profile.nama : ""} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">No. WhatsApp Aktif</label>
                  <input type="tel" name="noHp" defaultValue={profile.noHp !== "Belum diatur" ? profile.noHp : ""} required className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Alamat Lengkap Rumah (Titik Penjemputan)</label>
                <textarea name="alamatUtama" defaultValue={profile.alamatUtama !== "Belum diatur" ? profile.alamatUtama : ""} required rows="3" className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs resize-none leading-relaxed"></textarea>
              </div>

              <div className="pt-2 border-t border-slate-50 mt-5">
                <button type="submit" className="bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-700 transition-colors shadow-sm">
                  Simpan Perubahan Data
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* MODAL POPUP: DETAIL PESANAN & INFO KURIR */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header Modal */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-xs">Detail Transaksi Aktif</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-red-500 transition-colors font-bold text-sm">
                ✕
              </button>
            </div>
            
            {/* Konten Modal */}
            <div className="p-5 space-y-4">
              
              {/* Info Nota & Status */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide mb-0.5">ID Nota</p>
                  <p className="font-bold text-blue-600 text-sm">{selectedOrder.notaId}</p>
                </div>
                <span className="bg-amber-50 text-amber-600 border border-amber-100 px-2.5 py-1 rounded-full text-[10px] font-bold animate-pulse">
                  {selectedOrder.status}
                </span>
              </div>

              {/* Info Kurir */}
              <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl flex items-center gap-3">
                <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">🚚</div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kurir Penjemput</p>
                  <p className="font-bold text-slate-800 text-xs mt-0.5">{selectedOrder.kurir || "Budi Santoso"}</p>
                  <p className="text-[9px] text-slate-500 font-medium">Honda Beat — W 1234 XX</p>
                </div>
              </div>

              {/* Detail Rincian Hasil Form Order Terkini */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-xs space-y-2.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Layanan:</span> 
                  <span className="font-bold text-slate-800 text-right">{selectedOrder.layanan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kontak Penerima:</span> 
                  <span className="font-bold text-slate-800">{selectedOrder.namaKontak || profile.nama}</span>
                </div>
                <div className="flex justify-between">
                  <span>Jumlah Estimasi:</span> 
                  <span className="font-bold text-slate-800">{selectedOrder.jumlah} {selectedOrder.satuan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode Bayar:</span> 
                  <span className="font-bold text-blue-600 uppercase text-[10px]">{selectedOrder.metode || "COD"}</span>
                </div>
                
                {selectedOrder.alamatSpesifik && (
                  <div className="flex flex-col gap-1 pt-1.5 border-t border-slate-200/60">
                    <span className="text-slate-400">Alamat Lengkap Jemputan:</span>
                    <span className="font-medium text-slate-700 leading-normal break-words">{selectedOrder.alamatSpesifik}</span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-200/80 font-bold text-slate-900">
                  <span>Total Sementara:</span> 
                  <span className="text-blue-600 text-xs">
                    Rp {selectedOrder.totalBayar.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

            </div>
            
            {/* Footer Modal */}
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-[10px] hover:bg-slate-800 transition-colors">
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING CHAT ADMIN WHATSAPP */}
      <a 
        href="https://wa.me/6285854484333?text=Halo%20Admin%20JasaLaundry,%20saya%20ingin%20bertanya%20mengenai%20status%20penjemputan%20laundry%20saya."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-3.5 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center group z-50"
        title="Hubungi Admin"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.222 3.419.169l2.241 2.241c.401.402 1.054.166 1.054-.4V16.51c2.17-.412 3.931-2.022 4.417-4.146A9.761 9.761 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.761 9.761 0 00.75 3.76z" />
        </svg>
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 text-[11px] font-bold tracking-wide uppercase transition-all duration-300 whitespace-nowrap">
          Chat Admin
        </span>
      </a>
    </div>
  );
}