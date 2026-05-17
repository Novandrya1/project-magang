// File: middleware.js (Sejajar dengan folder app)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Ambil cookie bernama 'auth_session' (simulasi session login)
  const session = request.cookies.get('auth_session');

  // Jika user mencoba masuk ke rute /dashboard tapi cookie tidak ada
  if (!session) {
    // Alihkan (redirect) user ke halaman login buatan kita nanti
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika session ada, izinkan akses berlanjut
  return NextResponse.next();
}

// Konfigurasi matcher untuk mengunci semua halaman di bawah /dashboard
export const config = {
  matcher: ['/dashboard/:path*'],
};