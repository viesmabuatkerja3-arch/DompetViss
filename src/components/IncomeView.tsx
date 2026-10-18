import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  Edit3, 
  ArrowDownLeft, 
  TrendingUp, 
  Check, 
  X,
  AlertCircle
} from 'lucide-react';
import { Transaction, Category } from '../types/finance';
import { formatRupiah, formatTanggalIndo, getTanggalHariIni, NAMA_BULAN, generateId } from '../utils/formatters';
import { ConfirmModal } from './ConfirmModal';

interface IncomeViewProps {
  transactions: Transaction[];
  categories: Category[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
  onAddTransaction: (tx: Transaction) => void;
  onUpdateTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const IncomeView: React.FC<IncomeViewProps> = ({
  transactions,
  categories,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  // Filter kategori bertipe income
  const incomeCategories = categories.filter((c) => c.tipe === 'income');

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nominal, setNominal] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(incomeCategories[0]?.id || 'cat_gaji');
  const [tanggal, setTanggal] = useState<string>(getTanggalHariIni());
  const [catatan, setCatatan] = useState<string>('');
  const [formError, setFormError] = useState<string>('');

  // Delete modal state
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transaksi pemasukan
  const incomeTransactions = transactions.filter((t) => {
    if (t.tipe !== 'income') return false;
    if (!t.tanggal) return false;
    const [y, m] = t.tanggal.split('-').map(Number);
    const matchesMonth = selectedMonth === 0 || (y === selectedYear && m === selectedMonth);
    const matchesSearch = 
      t.catatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.nominal.toString().includes(searchTerm);
    return matchesMonth && matchesSearch;
  });

  const totalFilteredIncome = incomeTransactions.reduce((sum, t) => sum + t.nominal, 0);

  // Handler buka form tambah
  const handleOpenAdd = () => {
    setEditingId(null);
    setNominal('');
    setCategoryId(incomeCategories[0]?.id || 'cat_gaji');
    setTanggal(getTanggalHariIni());
    setCatatan('');
    setFormError('');
    setShowModal(true);
  };

  // Handler buka form edit
  const handleOpenEdit = (tx: Transaction) => {
    setEditingId(tx.id);
    setNominal(tx.nominal.toString());
    setCategoryId(tx.categoryId);
    setTanggal(tx.tanggal);
    setCatatan(tx.catatan);
    setFormError('');
    setShowModal(true);
  };

  // Handler simpan transaksi
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNominal = Number(nominal.replace(/[^0-9]/g, ''));

    if (!cleanNominal || cleanNominal <= 0) {
      setFormError('Nominal harus lebih dari Rp 0');
      return;
    }
    if (!tanggal) {
      setFormError('Tanggal transaksi wajib diisi');
      return;
    }

    if (editingId) {
      onUpdateTransaction({
        id: editingId,
        tipe: 'income',
        nominal: cleanNominal,
        categoryId,
        tanggal,
        catatan: catatan.trim(),
      });
    } else {
      onAddTransaction({
        id: generateId(),
        tipe: 'income',
        nominal: cleanNominal,
        categoryId,
        tanggal,
        catatan: catatan.trim(),
      });
    }

    setShowModal(false);
  };

  const getCategoryDetails = (catId: string) => {
    const cat = categories.find((c) => c.id === catId);
    return cat || { nama: 'Lainnya', warna: '#10b981' };
  };

  const yearsList = [2024, 2025, 2026, 2027];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Catatan Pemasukan</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Pantau dan kelola seluruh sumber pendapatan finansial Anda
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pemasukan</span>
        </button>
      </div>

      {/* Filter Toolbar & Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Ringkasan Akumulasi */}
        <div className="md:col-span-4 bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">
              Total Pemasukan {selectedMonth === 0 ? `Tahun ${selectedYear}` : NAMA_BULAN[selectedMonth - 1]}
            </span>
            <span className="text-xl font-bold text-emerald-700 mt-0.5 block">
              {formatRupiah(totalFilteredIncome)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-emerald-600 font-medium">
              {incomeTransactions.length} Transaksi
            </span>
          </div>
        </div>

        {/* Filter Bulan, Tahun & Search */}
        <div className="md:col-span-8 flex flex-wrap items-center gap-3 justify-end">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari catatan atau nominal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Month & Year Select */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-3 py-2 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value={0}>Semua Bulan</option>
              {NAMA_BULAN.map((bulan, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {bulan}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none border-l border-slate-200 pl-2 cursor-pointer"
            >
              {yearsList.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabel Daftar Pemasukan */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        {incomeTransactions.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">Belum ada catatan pemasukan</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Tidak ada pemasukan ditemukan untuk filter ini. Catat gaji, freelance, atau bonus Anda sekarang.
            </p>
            <button
              onClick={handleOpenAdd}
              className="mt-4 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors border border-emerald-200"
            >
              + Tambah Pemasukan
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Sumber Pemasukan</th>
                  <th className="py-3 px-4">Catatan</th>
                  <th className="py-3 px-4 text-right">Nominal</th>
                  <th className="py-3 px-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {incomeTransactions.map((tx) => {
                  const cat = getCategoryDetails(tx.categoryId);

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                        {formatTanggalIndo(tx.tanggal)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.warna }}
                          />
                          <span className="font-medium text-slate-800">{cat.nama}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {tx.catatan || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-600 whitespace-nowrap">
                        +{formatRupiah(tx.nominal)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={() => handleOpenEdit(tx)}
                            className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                            title="Edit transaksi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteId(tx.id)}
                            className="p-1 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Hapus transaksi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tambah / Edit Pemasukan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Catatan Pemasukan' : 'Tambah Pemasukan Baru'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Tanggal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Transaksi *
                </label>
                <input
                  type="date"
                  required
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Nominal */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nominal (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Contoh: 5000000"
                    required
                    value={nominal}
                    onChange={(e) => setNominal(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                {nominal && Number(nominal) > 0 && (
                  <p className="text-[11px] text-emerald-600 mt-1">
                    Terbaca: {formatRupiah(Number(nominal))}
                  </p>
                )}
              </div>

              {/* Sumber Pemasukan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sumber Pemasukan *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  {incomeCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Catatan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Keterangan
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Gaji pokok bulan Oktober, bonus kinerja"
                  value={catatan}
                  onChange={(e) => setCatatan(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Aksi Form */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                >
                  {editingId ? 'Simpan Perubahan' : 'Tambah Pemasukan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Hapus Catatan Pemasukan?"
        message="Apakah Anda yakin ingin menghapus catatan pemasukan ini? Data yang dihapus tidak dapat dipulihkan."
        confirmText="Ya, Hapus"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={() => {
          if (deleteId) {
            onDeleteTransaction(deleteId);
            setDeleteId(null);
          }
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
