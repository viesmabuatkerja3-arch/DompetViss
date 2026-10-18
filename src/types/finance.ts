/**
 * Tipe data untuk Aplikasi Pengelolaan Keuangan Pribadi (DompetKu)
 * Sesuai dengan spesifikasi struktur data yang rapi dan terstandar.
 */

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  tipe: TransactionType;
  nominal: number;
  categoryId: string; // ID kategori atau nama sumber
  tanggal: string; // Format: YYYY-MM-DD
  catatan: string;
}

export interface Category {
  id: string;
  nama: string;
  tipe: TransactionType;
  batasAnggaran: number | null; // null jika tidak ada batas anggaran
  warna: string; // Kode hex warna, contoh: '#10b981'
}

export interface GoldPurchase {
  id: string;
  tanggal: string;
  gram: number;
  hargaPerGram: number;
  jenis: string; // contoh: Antam, UBS, Digital Tokopedia, dll.
  catatan: string;
}

export interface GoldPrice {
  hargaPerGram: number;
  tanggalUpdate: string;
}

export interface SavingsGoal {
  id: string;
  namaTarget: string;
  targetNominal: number;
  terkumpul: number;
  deadline: string;
}

export interface AppData {
  transactions: Transaction[];
  categories: Category[];
  goldPurchases: GoldPurchase[];
  goldPrice: GoldPrice;
  savingsGoals: SavingsGoal[];
  savingsBalance: number;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'income' 
  | 'expense' 
  | 'categories' 
  | 'analytics' 
  | 'gold' 
  | 'savings' 
  | 'settings';
