// File: app/dashboard/loading.js

export default function DashboardLoading() {
  return (
    <div className="min-h-[80vh] px-6 py-12 bg-white text-slate-800 animate-pulse">
      <div className="max-w-5xl mx-auto">
        
        {/* 1. Skeleton Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="space-y-3 w-full max-w-sm">
            <div className="h-8 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
          </div>
          <div className="h-10 bg-gray-100 rounded-lg w-36 shrink-0"></div>
        </div>

        {/* 2. Skeleton Banner Promo */}
        <div className="h-40 bg-gray-100 rounded-2xl mb-10 w-full"></div>

        {/* 3. Skeleton Grid Bawah */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Kolom Kiri (Tracking Pesanan) */}
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 bg-gray-100 rounded-lg w-1/3"></div>
            <div className="h-64 bg-gray-100 rounded-2xl w-full"></div>
          </div>

          {/* Kolom Kanan (Poin & CS) */}
          <div className="space-y-6">
            <div className="h-32 bg-gray-100 rounded-2xl w-full"></div>
            <div className="h-32 bg-gray-100 rounded-2xl w-full"></div>
          </div>

        </div>

      </div>
    </div>
  );
}