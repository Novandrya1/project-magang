// File: app/services/[id]/OrderForm.js
"use client";

import { useState } from "react";
import { useParams } from "next/navigation"; // Import params untuk membaca ID dari URL langsung
import Link from "next/link"; // Pastikan Link di-import dengan benar

export default function OrderForm({ item }) {
  const params = useParams(); // Mengambil ID dari URL (misal: cuci-komplit, deep-cleaning-sepatu)
  const idLayanan = params?.id || "";

  const [errorValidasi, setErrorValidasi] = useState("");
  const [isSukses, setIsSukses] = useState(false);
  const [jumlahInput, setJumlahInput] = useState("");
  const [notaSukses, setNotaSukses] = useState({});

  // LOGIKA ABSOLUT: Tentukan harga & satuan berdasarkan ID layanan di URL secara aman
  let serviceNama = item?.nama || "Layanan Laundry";
  let hargaSatuan = 0;
  let satuan = "kg";

  if (idLayanan === "cuci-komplit") {
    serviceNama = "Cuci Komplit Reguler";
    hargaSatuan = 7000;
    satuan = "kg";
  } else if (idLayanan === "deep-cleaning-sepatu") {
    serviceNama = "Deep Cleaning Sepatu & Tas";
    hargaSatuan = 45000;
    satuan = "pasang";
  } else if (idLayanan === "executive-care") {
    serviceNama = "Executive Care (Butik)";
    hargaSatuan = 15000;
    satuan = "pcs";
  } else if (idLayanan === "langganan-member-30kg" || idLayanan.includes("family") || idLayanan.includes("sub")) {
    serviceNama = item?.nama || "Paket Langganan Bulanan";
    hargaSatuan = 150000; // Mengunci harga flat paket
    satuan = "paket";
  } else {
    // Fallback cadangan jika menggunakan ID lain
    hargaSatuan = 7000;
    satuan = "kg";
  }

  const apakahPaketKuota = satuan === "paket";

  // LOGIKA MATEMATIKA LIVE PREVIEW (Pasti Akurat, Real-time, & Anti Rp 0)
  const beratAngka = parseFloat(jumlahInput) || 0;
  const estimasiTotal = apakahPaketKuota ? hargaSatuan : beratAngka * hargaSatuan;

  const handleSubmitPesanan = (e) => {
    e.preventDefault();
    setErrorValidasi("");

    const formData = new FormData(e.target);
    const namaKontak = formData.get("namaKontak")?.trim();
    const noHpAktif = formData.get("noHpAktif")?.trim();
    const jumlahText = formData.get("jumlah");
    const alamat = formData.get("alamat")?.trim();
    const metode = formData.get("metode");

    const jumlahValid = parseFloat(jumlahText) || 0;

    // VALIDASI KEAMANAN (ANTI NAUGHTY USER)
    if (!namaKontak || namaKontak.length < 3) {
      setErrorValidasi("⚠️ Nama kontak penjemputan harus diisi dengan benar ya, Bang!");
      return;
    }

    if (!noHpAktif || noHpAktif.length < 10) {
      setErrorValidasi("⚠️ Nomor HP / WhatsApp aktif minimal harus 10 digit!");
      return;
    }

    if (jumlahValid <= 0) {
      setErrorValidasi(`⚠️ Jumlah perkiraan ${apakahPaketKuota ? "pencucian awal (Kg)" : satuan} harus lebih besar dari 0!`);
      return;
    }

    if (!alamat || alamat.length < 10) {
      setErrorValidasi("⚠️ Tolong masukkan alamat lengkap penjemputan Anda (minimal 10 karakter)!");
      return;
    }

    // Kunci nilai nominal final untuk struk resmi
    const totalBayarFinal = apakahPaketKuota ? hargaSatuan : jumlahValid * hargaSatuan;

    // ====================================================================
    // LOGIKA TITIPAN: REKAM DATA KE LOCALSTORAGE UNTUK DASHBOARD REAL-TIME
    // ====================================================================
    const pesananBaru = {
      notaId: `JL-${Math.floor(1000 + Math.random() * 9000)}`,
      layanan: serviceNama,
      jumlah: jumlahValid,
      satuan: apakahPaketKuota ? "Kg (Cicilan)" : satuan,
      totalBayar: totalBayarFinal,
      metode: metode.toUpperCase(),
      tanggal: new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'short', year: 'numeric' }),
      status: "Menunggu Kurir"
    };
    
    // Ambil riwayat lama dari memori browser, gabung, lalu timpa balik
    const riwayatLama = JSON.parse(localStorage.getItem("riwayat_laundry") || "[]");
    localStorage.setItem("riwayat_laundry", JSON.stringify([pesananBaru, ...riwayatLama]));
    // ====================================================================

    setNotaSukses({
      notaId: pesananBaru.notaId, // Samakan ID dengan data yang masuk dashboard
      layanan: serviceNama,
      namaKontak: namaKontak,
      noHp: noHpAktif,
      jumlah: jumlahValid,
      satuan: apakahPaketKuota ? "Kg (Cicilan)" : satuan,
      alamat: alamat,
      totalBayar: totalBayarFinal,
      metode: metode.toUpperCase(),
      apakahPaketKuota: apakahPaketKuota
    });

    setIsSukses(true);
    setJumlahInput("");
    e.target.reset();
  };

  // TAMPILAN 1: NOTA DIGITAL JIKA ORDER SUKSES
  if (isSukses) {
    return (
      <div className="text-center py-4 px-2 bg-white">
        <div className="w-11 h-11 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 border border-green-200">
          <span className="text-green-600 font-bold text-lg">✓</span>
        </div>
        <h3 className="text-sm font-bold text-slate-950 mb-0.5">Kurir Dijadwalkan!</h3>
        <p className="text-[11px] text-slate-500 font-light mb-5">
          Pesanan laundry Anda telah berhasil terekam di JasaLaundry.id
        </p>

        {/* NOTA PEMBAYARAN DIGITAL */}
        <div className="bg-slate-50 p-4 rounded-xl text-left text-xs space-y-2.5 border border-slate-100 mb-5">
          <div className="flex justify-between border-b border-dashed border-slate-200 pb-2 mb-1">
            <span className="font-semibold text-slate-700">Nota Pembayaran Resmi</span>
            <span className="text-blue-600 font-bold text-[10px]">{notaSukses.notaId}</span>
          </div>
          <div className="flex justify-between"><span className="text-slate-400 font-light">Layanan:</span> <span className="font-medium text-slate-800 text-right">{notaSukses.layanan}</span></div>
          <div className="flex justify-between"><span className="text-slate-400 font-light">Penerima Kontak:</span> <span className="font-medium text-slate-800">{notaSukses.namaKontak}</span></div>
          <div className="flex justify-between"><span className="text-slate-400 font-light">No. WhatsApp:</span> <span className="font-medium text-slate-800">{notaSukses.noHp}</span></div>
          <div className="flex justify-between"><span className="text-slate-400 font-light">Jumlah Order:</span> <span className="font-medium text-slate-800">{notaSukses.jumlah} {notaSukses.satuan}</span></div>
          
          <div className="flex justify-between items-start gap-4">
            <span className="text-slate-400 font-light shrink-0">Alamat Jemput:</span> 
            <span className="font-medium text-slate-800 text-right break-words max-w-[180px] leading-tight">{notaSukses.alamat}</span>
          </div>
          
          <div className="flex justify-between"><span className="text-slate-400 font-light">Metode Bayar:</span> <span className="font-medium text-slate-800">{notaSukses.metode}</span></div>
          
          <div className="flex justify-between border-t border-slate-200/80 pt-2.5 font-bold text-slate-900 text-[11px]">
            <span>TOTAL HARUS DIBAYAR:</span> 
            <span className="text-blue-600 text-xs">
              Rp {notaSukses.totalBayar ? notaSukses.totalBayar.toLocaleString("id-ID") : "0"}
            </span>
          </div>
        </div>

        <p className="text-[10px] text-amber-600 font-light leading-relaxed bg-amber-50/60 p-3 rounded-lg border border-amber-100 text-left mb-5">
          📌 {notaSukses.apakahPaketKuota 
            ? "Biaya Paket bersifat flat tetap. Saldo kuota bulanan Anda akan otomatis terpotong berkala sesuai berat timbangan murni setelah pakaian sampai di workshop." 
            : "Nominal di atas adalah biaya sementara berdasarkan input perkiraan Anda. Berat final yang sah akan dihitung ulang menggunakan timbangan digital Admin toko secara transparan."}
        </p>

        {/* LINK NAVIGASI BALIK KE LAYANAN */}
        <Link 
          href="/services"
          className="block w-full text-center bg-slate-100 text-slate-700 font-medium py-2 rounded-lg text-xs hover:bg-slate-200 transition-colors"
        >
          Buat Pesanan Lainnya
        </Link>
      </div>
    );
  }

  // TAMPILAN 2: FORM UTAMA INPUT DATA
  return (
    <div>
      <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-gray-50">
        Form Pemesanan
      </h2>
      
      {errorValidasi && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium mb-4 text-center border border-red-100">
          {errorValidasi}
        </div>
      )}

      <form onSubmit={handleSubmitPesanan} className="space-y-4 bg-white">
        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nama Kontak di Lokasi
          </label>
          <input 
            type="text" 
            name="namaKontak"
            required
            placeholder="Nama penerima baju..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Nomor HP / WhatsApp Aktif
          </label>
          <input 
            type="tel" 
            name="noHpAktif"
            required
            placeholder="Contoh: 08585448xxx"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {apakahPaketKuota ? "Jumlah Diambil Kurir Hari Ini (Kg)" : `Perkiraan Jumlah (${satuan})`}
          </label>
          <input 
            type="number" 
            name="jumlah"
            required
            value={jumlahInput}
            onChange={(e) => setJumlahInput(e.target.value)}
            placeholder={apakahPaketKuota ? "Misal: 5" : `Masukkan angka...`}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs"
          />
          <span className="block text-[10px] text-amber-600 font-light mt-1.5 leading-tight">
            {apakahPaketKuota 
              ? "*Kurir akan mencatat berat jemputan hari ini untuk memotong kuota saldo 30 Kg Anda."
              : `*Masukkan kisaran awal saja. Timbangan final sah dihitung oleh sistem digital Admin di toko.`}
          </span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Titik Alamat Penjemputan
          </label>
          <textarea 
            name="alamat"
            required
            rows="2" 
            placeholder="Tuliskan alamat lengkap penjemputan baju..."
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs resize-none"
          ></textarea>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Metode Pembayaran
          </label>
          <select 
            name="metode"
            className="w-full px-3 py-2 rounded-lg border border-gray-200 text-slate-800 bg-white focus:outline-none focus:border-blue-600 text-xs"
          >
            <option value="cod">COD (Bayar Tunai Saat Diantar)</option>
            <option value="transfer">Transfer Bank (QRIS / Manual)</option>
          </select>
        </div>

        {/* LIVE TOTAL ESTIMASI HARGA */}
        <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-light">
              {apakahPaketKuota ? "Harga Flat Paket:" : "Estimasi Total Biaya:"}
            </span>
            <span className="text-blue-600 font-bold text-xs">
              Rp {estimasiTotal.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg text-xs hover:bg-blue-700 transition-colors shadow-sm mt-1"
        >
          Pesan & Panggil Kurir Jemput
        </button>
      </form>
    </div>
  );
}