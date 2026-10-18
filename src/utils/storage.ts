/**
 * Penyimpanan data menggunakan localStorage browser.
 * Menyediakan inisialisasi kategori bawaan dan data contoh (dummy).
 */

import { AppData, Category, Transaction, GoldPurchase, SavingsGoal } from '../types/finance';

const STORAGE_KEY = 'dompetku_data_v1';

// Kategori bawaan sesuai spesifikasi
export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_makan', nama: 'Makan', tipe: 'expense', batasAnggaran: 1500000, warna: '#f97316' },     // Orange
  { id: 'cat_kos', nama: 'Kos', tipe: 'expense', batasAnggaran: 1200000, warna: '#6366f1' },       // Indigo
  { id: 'cat_jajan', nama: 'Jajan', tipe: 'expense', batasAnggaran: 500000, warna: '#ec4899' },      // Pink
  { id: 'cat_transport', nama: 'Transport', tipe: 'expense', batasAnggaran: 600000, warna: '#06b6d4' }, // Cyan
  { id: 'cat_tagihan', nama: 'Tagihan', tipe: 'expense', batasAnggaran: 750000, warna: '#ef4444' },    // Red
  { id: 'cat_hiburan', nama: 'Hiburan', tipe: 'expense', batasAnggaran: 400000, warna: '#8b5cf6' },    // Violet
  { id: 'cat_kesehatan', nama: 'Kesehatan', tipe: 'expense', batasAnggaran: 300000, warna: '#10b981' }, // Emerald
  { id: 'cat_lainnya', nama: 'Lainnya', tipe: 'expense', batasAnggaran: null, warna: '#64748b' },      // Slate
  // Sumber Pemasukan
  { id: 'cat_gaji', nama: 'Gaji', tipe: 'income', batasAnggaran: null, warna: '#10b981' },
  { id: 'cat_bonus', nama: 'Bonus', tipe: 'income', batasAnggaran: null, warna: '#3b82f6' },
  { id: 'cat_freelance', nama: 'Freelance', tipe: 'income', batasAnggaran: null, warna: '#8b5cf6' },
  { id: 'cat_inc_lainnya', nama: 'Lainnya', tipe: 'income', batasAnggaran: null, warna: '#14b8a6' },
];

/**
 * Data contoh (dummy) lengkap untuk bulan berjalan
 */
export function getSampleData(): AppData {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');

  const transactions: Transaction[] = [
    {
      id: 'tx_sample_1',
      tipe: 'income',
      nominal: 7500000,
      categoryId: 'cat_gaji',
      tanggal: `${year}-${month}-01`,
      catatan: 'Gaji bulanan kantor',
    },
    {
      id: 'tx_sample_2',
      tipe: 'income',
      nominal: 1200000,
      categoryId: 'cat_freelance',
      tanggal: `${year}-${month}-05`,
      catatan: 'Desain web klien',
    },
    {
      id: 'tx_sample_3',
      tipe: 'expense',
      nominal: 1200000,
      categoryId: 'cat_kos',
      tanggal: `${year}-${month}-02`,
      catatan: 'Bayar sewa kos bulanan',
    },
    {
      id: 'tx_sample_4',
      tipe: 'expense',
      nominal: 450000,
      categoryId: 'cat_tagihan',
      tanggal: `${year}-${month}-04`,
      catatan: 'Listrik & Wifi Indihome',
    },
    {
      id: 'tx_sample_5',
      tipe: 'expense',
      nominal: 850000,
      categoryId: 'cat_makan',
      tanggal: `${year}-${month}-08`,
      catatan: 'Belanja bahan dapur & makan siang',
    },
    {
      id: 'tx_sample_6',
      tipe: 'expense',
      nominal: 250000,
      categoryId: 'cat_transport',
      tanggal: `${year}-${month}-10`,
      catatan: 'Bensin & isi e-toll',
    },
    {
      id: 'tx_sample_7',
      tipe: 'expense',
      nominal: 380000,
      categoryId: 'cat_jajan',
      tanggal: `${year}-${month}-12`,
      catatan: 'Nongkrong & kopi mingguan',
    },
    {
      id: 'tx_sample_8',
      tipe: 'expense',
      nominal: 150000,
      categoryId: 'cat_hiburan',
      tanggal: `${year}-${month}-14`,
      catatan: 'Langganan Netflix & Spotify',
    },
  ];

  const goldPurchases: GoldPurchase[] = [
    {
      id: 'gp_1',
      tanggal: `${year}-${month}-03`,
      gram: 2.0,
      hargaPerGram: 1350000,
      jenis: 'Antam Logam Mulia',
      catatan: 'Beli di Butik Emas Antam',
    },
    {
      id: 'gp_2',
      tanggal: `${year}-${month}-09`,
      gram: 1.5,
      hargaPerGram: 1380000,
      jenis: 'Emas Digital Pegadaian',
      catatan: 'Nabung rutin via aplikasi',
    },
  ];

  const savingsGoals: SavingsGoal[] = [
    {
      id: 'sg_1',
      namaTarget: 'Dana Darurat 6 Bulan',
      targetNominal: 25000000,
      terkumpul: 16500000,
      deadline: `${year}-12-31`,
    },
    {
      id: 'sg_2',
      namaTarget: 'Liburan Akhir Tahun',
      targetNominal: 6000000,
      terkumpul: 4200000,
      deadline: `${year}-12-15`,
    },
  ];

  return {
    transactions,
    categories: [...DEFAULT_CATEGORIES],
    goldPurchases,
    goldPrice: {
      hargaPerGram: 1420000,
      tanggalUpdate: `${year}-${month}-18`,
    },
    savingsGoals,
    savingsBalance: 12500000,
  };
}

/**
 * Data kosong inisial (hanya kategori bawaan)
 */
export function getInitialEmptyData(): AppData {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return {
    transactions: [],
    categories: [...DEFAULT_CATEGORIES],
    goldPurchases: [],
    goldPrice: {
      hargaPerGram: 1400000,
      tanggalUpdate: `${year}-${month}-${day}`,
    },
    savingsGoals: [],
    savingsBalance: 0,
  };
}

/**
 * Memuat data dari localStorage. Jika kosong, isi dengan data contoh agar tampilan langsung terlihat.
 */
export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const sample = getSampleData();
      saveAppData(sample);
      return sample;
    }
    const parsed = JSON.parse(raw);
    // Validasi struktur minimal
    return {
      transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
      categories: Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : [...DEFAULT_CATEGORIES],
      goldPurchases: Array.isArray(parsed.goldPurchases) ? parsed.goldPurchases : [],
      goldPrice: parsed.goldPrice || { hargaPerGram: 1400000, tanggalUpdate: getSampleData().goldPrice.tanggalUpdate },
      savingsGoals: Array.isArray(parsed.savingsGoals) ? parsed.savingsGoals : [],
      savingsBalance: typeof parsed.savingsBalance === 'number' ? parsed.savingsBalance : 0,
    };
  } catch (err) {
    console.error('Gagal memuat data dari localStorage:', err);
    return getSampleData();
  }
}

/**
 * Menyimpan data ke localStorage
 */
export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Gagal menyimpan data ke localStorage:', err);
  }
}
