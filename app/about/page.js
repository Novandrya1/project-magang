export default function About() {
  return (
    <div className="min-h-[75vh] px-6 py-16 bg-white">
      <div className="max-w-5xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Kolom Kiri: Teks Cerita */}
          <div>
            <span className="text-blue-600 font-semibold tracking-wider text-sm uppercase mb-4 block">
              Tentang Kami
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Merawat pakaian Anda, <br />
              menghargai waktu Anda.
            </h1>
            <div className="space-y-4 text-slate-500 font-light leading-relaxed text-base">
              <p>
                Berawal dari keresahan masyarakat dan pekerja kantoran yang sibuk, 
                <strong className="text-slate-900 font-medium"> JasaLaundry.id</strong> hadir sebagai solusi kebersihan pakaian Anda yang instan dan tepercaya.
              </p>
              <p>
                Kami menggunakan deterjen ramah lingkungan dan teknik penyetrikaan uap berstandar tinggi. Tujuan kami sederhana: memastikan pakaian Anda kembali dalam kondisi sempurna, bersih, wangi, dan rapi, tanpa Anda perlu repot keluar rumah.
              </p>
            </div>
          </div>

          {/* Kolom Kanan: Kotak Keunggulan */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">24 Jam</h3>
              <p className="text-sm text-slate-500">Layanan kilat selesai di hari yang sama.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-xl font-bold text-blue-700 mb-2">Gratis</h3>
              <p className="text-sm text-blue-600/80">Antar-jemput untuk radius tertentu.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Eco-Friendly</h3>
              <p className="text-sm text-slate-500">Deterjen ramah lingkungan yang aman.</p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Garansi</h3>
              <p className="text-sm text-slate-500">Cuci ulang jika hasilnya kurang bersih.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}