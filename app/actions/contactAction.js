// File: app/actions/contactAction.js
"use server";

import { createClient } from '@supabase/supabase-js';
import { z } from 'zod'; // 1. Import Zod

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Definisikan aturan validasi (Schema) sesuai instruksi PDF
const contactSchema = z.object({
  nama: z.string().min(3, { message: "Nama minimal harus 3 karakter" }),
  email: z.string().email({ message: "Format email tidak valid (harus ada @)" }),
  pesan: z.string().min(10, { message: "Pesan terlalu pendek, minimal 10 karakter" }),
});

export async function submitContact(formData) {
  // Ambil data dari form input
  const rawData = {
    nama: formData.get("nama"),
    email: formData.get("email"),
    pesan: formData.get("pesan"),
  };

  // 3. Validasi input menggunakan safeParse()
  const validation = contactSchema.safeParse(rawData);

  // Jika validasi gagal, kirim objek error kembali ke komponen UI
  if (!validation.success) {
    // Ambil semua pesan error dari Zod
    const formErrors = validation.error.flatten().fieldErrors;
    return { 
      success: false, 
      isValidationError: true, 
      errors: formErrors 
    };
  }

  // Jika lolos validasi, baru masukkan data yang bersih ke Supabase
  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([validation.data]); // Menggunakan data hasil validasi Zod yang sudah bersih

    if (error) {
      console.error("Error Supabase:", error);
      return { success: false, message: "Gagal menyimpan ke database." };
    }

    return { success: true, message: "Pesan berhasil terkirim!" };
  } catch (error) {
    console.error("Error Server:", error);
    return { success: false, message: "Terjadi kesalahan sistem." };
  }
}