/**
 * Utilitas pemformatan mata uang, tanggal, dan teks berbahasa Indonesia.
 */

// Daftar nama bulan dalam Bahasa Indonesia
export const NAMA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const NAMA_BULAN_PENDEK = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'
];

/**
 * Format angka menjadi Rupiah Indonesia
 * Contoh: 1500000 -> "Rp 1.500.000"
 */
export function formatRupiah(nominal: number): string {
  if (isNaN(nominal) || nominal === null || nominal === undefined) {
    return 'Rp 0';
  }
  const formatted = Math.round(nominal).toLocaleString('id-ID');
  return `Rp ${formatted}`;
}

/**
 * Format tanggal YYYY-MM-DD ke format Indonesia
 * Contoh: "2026-10-18" -> "18 Okt 2026"
 */
export function formatTanggalIndo(tanggalStr: string, panjang: boolean = false): string {
  if (!tanggalStr) return '-';
  try {
    const [year, month, day] = tanggalStr.split('-');
    const mIndex = parseInt(month, 10) - 1;
    const bulanNama = panjang ? NAMA_BULAN[mIndex] : NAMA_BULAN_PENDEK[mIndex];
    return `${parseInt(day, 10)} ${bulanNama || month} ${year}`;
  } catch {
    return tanggalStr;
  }
}

/**
 * Mendapatkan tanggal hari ini dalam format YYYY-MM-DD
 */
export function getTanggalHariIni(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Ekstrak tahun dan bulan dari tanggal YYYY-MM-DD
 */
export function getBulanTahun(tanggalStr: string): { bulan: number; tahun: number } {
  if (!tanggalStr) {
    const now = new Date();
    return { bulan: now.getMonth() + 1, tahun: now.getFullYear() };
  }
  const parts = tanggalStr.split('-');
  return {
    tahun: parseInt(parts[0], 10),
    bulan: parseInt(parts[1], 10),
  };
}

/**
 * Menghasilkan ID unik sederhana
 */
export function generateId(): string {
  return 'id_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
}
