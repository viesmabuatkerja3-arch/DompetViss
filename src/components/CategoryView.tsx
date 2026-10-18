import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Tags, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Calendar,
  Layers
} from 'lucide-react';
import { Category, Transaction, TransactionType } from '../types/finance';
import { formatRupiah, NAMA_BULAN, generateId } from '../utils/formatters';
import { ConfirmModal } from './ConfirmModal';

interface CategoryViewProps {
  categories: Category[];
  transactions: Transaction[];
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
  onAddCategory: (cat: Category) => void;
  onUpdateCategory: (cat: Category) => void;
  onDeleteCategory: (id: string) => void;
}

const PRESET_COLORS = [
  '#f97316', // Orange
  '#6366f1', // Indigo
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#eab308', // Amber
  '#14b8a6', // Teal
  '#64748b', // Slate
  '#84cc16', // Lime
];

export const CategoryView: React.FC<CategoryViewProps> = ({
  categories,
  transactions,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}) => {
  const [activeTypeTab, setActiveTypeTab] = useState<TransactionType>('expense');

  // Form Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nama, setNama] = useState('');
  const [tipe, setTipe] = useState<TransactionType>('expense');
  const [batasAnggaran, setBatasAnggaran] = useState<string>('');
  const [warna, setWarna] = useState<string>('#f97316');
  const [formError, setFormError] = useState('');

  // Delete Modal State
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Filter kategori berdasarkan tipe yang aktif
  const filteredCategories = categories.filter((c) => c.tipe === activeTypeTab);

  // Hitung pengeluaran per kategori untuk bulan dan tahun terpilih
  const monthlyExpensesByCategory: Record<string, number> = {};
  transactions
    .filter((t) => {
      if (t.tipe !== 'expense' || !t.tanggal) return false;
      const [y, m] = t.tanggal.split('-').map(Number);
      return y === selectedYear && m === selectedMonth;
    })
    .forEach((t) => {
      monthlyExpensesByCategory[t.categoryId] = (monthlyExpensesByCategory[t.categoryId] || 0) + t.nominal;
    });

  // Handler buka modal tambah
  const handleOpenAdd = () => {
    setEditingId(null);
    setNama('');
    setTipe(activeTypeTab);
    setBatasAnggaran('');
    setWarna(activeTypeTab === 'expense' ? '#f97316' : '#10b981');
    setFormError('');
    setShowModal(true);
  };

  // Handler buka modal edit
  const handleOpenEdit = (cat: Category) => {
    setEditingId(cat.id);
    setNama(cat.nama);
    setTipe(cat.tipe);
    setBatasAnggaran(cat.batasAnggaran ? cat.batasAnggaran.toString() : '');
    setWarna(cat.warna || '#64748b');
    setFormError('');
    setShowModal(true);
  };

  // Handler submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      setFormError('Nama kategori wajib diisi');
      return;
    }

    const budgetNum = batasAnggaran ? Number(batasAnggaran.replace(/[^0-9]/g, '')) : null;

    if (editingId) {
      onUpdateCategory({
        id: editingId,
        nama: nama.trim(),
        tipe,
        batasAnggaran: budgetNum && budgetNum > 0 ? budgetNum : null,
        warna,
      });
    } else {
      onAddCategory({
        id: 'cat_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 4),
        nama: nama.trim(),
        tipe,
        batasAnggaran: budgetNum && budgetNum > 0 ? budgetNum : null,
        warna,
      });
    }

    setShowModal(false);
  };

  // Cek apakah ada transaksi yang memakai kategori yang akan dihapus
  const categoryToDelete = categories.find((c) => c.id === deleteCatId);
  const txCountForCat = deleteCatId
    ? transactions.filter((t) => t.categoryId === deleteCatId).length
    : 0;

  const yearsList = [2024, 2025, 2026, 2027];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Tags className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Kategori & Batas Anggaran</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Atur pos pengeluaran, sumber pemasukan, serta limit batas anggaran bulanan
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </button>
      </div>

      {/* Tabs & Month selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Switcher Pengeluaran / Pemasukan */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-xs">
          <button
            onClick={() => setActiveTypeTab('expense')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
              activeTypeTab === 'expense'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kategori Pengeluaran ({categories.filter((c) => c.tipe === 'expense').length})
          </button>
          <button
            onClick={() => setActiveTypeTab('income')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
              activeTypeTab === 'income'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sumber Pemasukan ({categories.filter((c) => c.tipe === 'income').length})
          </button>
        </div>

        {/* Pemilih Periode untuk monitoring batas anggaran */}
        {activeTypeTab === 'expense' && (
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="text-xs text-slate-500 font-medium">Periode Budget:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
            >
              {NAMA_BULAN.map((bulan, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {bulan}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none border-l border-slate-200 pl-1.5 cursor-pointer"
            >
              {yearsList.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Grid Kategori Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const spent = monthlyExpensesByCategory[cat.id] || 0;
          const hasBudget = cat.tipe === 'expense' && cat.batasAnggaran && cat.batasAnggaran > 0;
          const budget = cat.batasAnggaran || 0;
          const percent = hasBudget ? Math.round((spent / budget) * 100) : 0;
          const isOver = hasBudget && spent > budget;
          const isWarning = hasBudget && percent >= 80 && !isOver;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-xl border p-4 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between ${
                isOver ? 'border-rose-300 ring-1 ring-rose-200' : isWarning ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Header Card */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0"
                      style={{ backgroundColor: cat.warna }}
                    >
                      {cat.nama.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{cat.nama}</h3>
                      <span className="text-[11px] text-slate-400">
                        {cat.tipe === 'expense' ? 'Kategori Pengeluaran' : 'Sumber Pemasukan'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                      title="Ubah Kategori"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCatId(cat.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                      title="Hapus Kategori"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Bagian Anggaran (Khusus Pengeluaran) */}
                {cat.tipe === 'expense' && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {hasBudget ? (
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-slate-500">
                            Pengeluaran: <strong className="text-slate-800">{formatRupiah(spent)}</strong>
                          </span>
                          <span
                            className={`font-bold ${
                              isOver ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-emerald-600'
                            }`}
                          >
                            {percent}%
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOver ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                          <span>Batas: {formatRupiah(budget)}</span>
                          <span>
                            {isOver
                              ? `Lebih ${formatRupiah(spent - budget)}`
                              : `Sisa ${formatRupiah(budget - spent)}`}
                          </span>
                        </div>

                        {/* Status Warning Alert */}
                        {isOver && (
                          <div className="mt-2.5 p-1.5 rounded bg-rose-50 border border-rose-200 flex items-center gap-1.5 text-[11px] text-rose-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Melebihi batas anggaran bulanan!</span>
                          </div>
                        )}
                        {isWarning && (
                          <div className="mt-2.5 p-1.5 rounded bg-amber-50 border border-amber-200 flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>Peringatan: Sudah mencapai {percent}% anggaran</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-400 py-1">
                        <span>Tidak ada batas anggaran</span>
                        <button
                          onClick={() => handleOpenEdit(cat)}
                          className="text-[11px] text-emerald-600 hover:underline font-medium"
                        >
                          + Pasang Batas
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Tambah / Edit Kategori */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Kategori' : 'Tambah Kategori Baru'}
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
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Tipe Kategori */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tipe Kategori
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTipe('expense')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      tipe === 'expense'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Pengeluaran
                  </button>
                  <button
                    type="button"
                    onClick={() => setTipe('income')}
                    className={`py-2 text-xs font-semibold rounded-lg border transition-colors ${
                      tipe === 'income'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Pemasukan
                  </button>
                </div>
              </div>

              {/* Nama Kategori */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kategori *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Belanja Bulanan, Fitness, Kopi"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Batas Anggaran (Opsional, khusus pengeluaran) */}
              {tipe === 'expense' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Batas Anggaran Bulanan (Opsional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Kosongkan jika tidak ada limit"
                      value={batasAnggaran}
                      onChange={(e) => setBatasAnggaran(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>
                  {batasAnggaran && Number(batasAnggaran) > 0 && (
                    <p className="text-[11px] text-emerald-600 mt-1">
                      Batas per bulan: {formatRupiah(Number(batasAnggaran))}
                    </p>
                  )}
                </div>
              )}

              {/* Warna Kategori */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warna Identitas
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setWarna(c)}
                      className={`w-7 h-7 rounded-full transition-transform ${
                        warna === c ? 'scale-115 ring-2 ring-slate-900 ring-offset-2' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={warna}
                    onChange={(e) => setWarna(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-300 p-0 cursor-pointer"
                  />
                  <span className="text-xs text-slate-500 font-mono">{warna}</span>
                </div>
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
                  {editingId ? 'Simpan Perubahan' : 'Tambah Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Kategori */}
      <ConfirmModal
        isOpen={deleteCatId !== null}
        title="Hapus Kategori?"
        message={
          txCountForCat > 0
            ? `Peringatan: Kategori "${categoryToDelete?.nama}" memiliki ${txCountForCat} transaksi yang terhubung. Apakah Anda tetap ingin menghapusnya?`
            : `Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.nama}"?`
        }
        confirmText="Ya, Hapus Kategori"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={() => {
          if (deleteCatId) {
            onDeleteCategory(deleteCatId);
            setDeleteCatId(null);
          }
        }}
        onCancel={() => setDeleteCatId(null)}
      />
    </div>
  );
};
