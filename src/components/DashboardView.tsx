import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PiggyBank, 
  Coins, 
  Calendar, 
  Plus, 
  Minus, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Clock
} from 'lucide-react';
import { AppData, Transaction, Category } from '../types/finance';
import { formatRupiah, formatTanggalIndo, NAMA_BULAN } from '../utils/formatters';

interface DashboardViewProps {
  data: AppData;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
  onNavigateTab: (tab: any) => void;
  onOpenAddIncome: () => void;
  onOpenAddExpense: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  data,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  onNavigateTab,
  onOpenAddIncome,
  onOpenAddExpense,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Filter transaksi berdasarkan bulan dan tahun terpilih
  const monthlyTransactions = data.transactions.filter((t) => {
    if (!t.tanggal) return false;
    const [y, m] = t.tanggal.split('-').map(Number);
    return y === selectedYear && m === selectedMonth;
  });

  // Hitung total pemasukan dan pengeluaran bulan terpilih
  const totalIncome = monthlyTransactions
    .filter((t) => t.tipe === 'income')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalExpense = monthlyTransactions
    .filter((t) => t.tipe === 'expense')
    .reduce((sum, t) => sum + t.nominal, 0);

  // Rumus: Sisa saldo = total pemasukan - total pengeluaran
  const netBalance = totalIncome - totalExpense;

  // Nilai emas = total gram * harga emas hari ini
  const totalGoldGrams = data.goldPurchases.reduce((sum, p) => sum + p.gram, 0);
  const currentGoldPrice = data.goldPrice?.hargaPerGram || 0;
  const currentGoldValue = totalGoldGrams * currentGoldPrice;

  // Total tabungan (dari saldo tabungan saat ini)
  const totalSavings = data.savingsBalance || 0;

  // 5 Transaksi terakhir (diurutkan tanggal terbaru, lalu id)
  const recentTransactions = [...data.transactions]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 5);

  // Pengecekan batas anggaran kategori untuk bulan terpilih
  const categoryExpenses: Record<string, number> = {};
  monthlyTransactions
    .filter((t) => t.tipe === 'expense')
    .forEach((t) => {
      categoryExpenses[t.categoryId] = (categoryExpenses[t.categoryId] || 0) + t.nominal;
    });

  const budgetedCategories = data.categories
    .filter((c) => c.tipe === 'expense' && c.batasAnggaran && c.batasAnggaran > 0)
    .map((c) => {
      const spent = categoryExpenses[c.id] || 0;
      const budget = c.batasAnggaran!;
      const percent = Math.round((spent / budget) * 100);
      const isOver = spent > budget;
      const isWarning = percent >= 80 && !isOver;
      return {
        ...c,
        spent,
        budget,
        percent,
        isOver,
        isWarning,
      };
    });

  // Kategori yang melewati atau mendekati batas (alert)
  const alertCategories = budgetedCategories.filter((c) => c.percent >= 80);

  // Inisialisasi Chart.js singkat pemasukan vs pengeluaran
  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pemasukan', 'Pengeluaran', 'Sisa'],
        datasets: [
          {
            label: 'Nominal (Rp)',
            data: [totalIncome, totalExpense, Math.max(0, netBalance)],
            backgroundColor: [
              'rgba(16, 185, 129, 0.85)', // Emerald
              'rgba(244, 63, 94, 0.85)',   // Rose
              'rgba(59, 130, 246, 0.85)',  // Blue
            ],
            borderColor: [
              '#10b981',
              '#f43f5e',
              '#3b82f6',
            ],
            borderWidth: 1.5,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${formatRupiah(context.raw as number)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => {
                const num = Number(val);
                if (num >= 1000000) return `${(num / 1000000).toFixed(1)}jt`;
                if (num >= 1000) return `${(num / 1000).toFixed(0)}rb`;
                return num.toString();
              },
            },
            grid: {
              color: 'rgba(226, 232, 240, 0.6)',
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [totalIncome, totalExpense, netBalance]);

  // Cari nama kategori berdasarkan ID
  const getCategoryName = (categoryId: string, type: 'income' | 'expense') => {
    const found = data.categories.find((c) => c.id === categoryId);
    if (found) return found;
    return {
      id: categoryId,
      nama: categoryId.replace('cat_', ''),
      warna: type === 'income' ? '#10b981' : '#f43f5e',
      tipe: type,
      batasAnggaran: null,
    };
  };

  const yearsList = [2024, 2025, 2026, 2027];

  return (
    <div className="space-y-6">
      {/* Header Kontrol Bulan & Aksi Cepat */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Keuangan</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Laporan periode {NAMA_BULAN[selectedMonth - 1]} {selectedYear}
          </p>
        </div>

        {/* Pemilih Bulan dan Tahun */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
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
              className="text-sm font-medium text-slate-700 bg-transparent focus:outline-none border-l border-slate-200 pl-2 cursor-pointer"
            >
              {yearsList.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAddIncome}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Pemasukan</span>
            </button>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <Minus className="w-3.5 h-3.5" />
              <span>Pengeluaran</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Kartu Ringkasan Bulan Ini */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Pemasukan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Pemasukan</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-emerald-600 tracking-tight">
              {formatRupiah(totalIncome)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Bulan {NAMA_BULAN[selectedMonth - 1]}</p>
          </div>
        </div>

        {/* Total Pengeluaran */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Pengeluaran</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-rose-600 tracking-tight">
              {formatRupiah(totalExpense)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Bulan {NAMA_BULAN[selectedMonth - 1]}</p>
          </div>
        </div>

        {/* Sisa Saldo */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sisa Saldo</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${netBalance >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-lg font-bold tracking-tight ${netBalance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
              {formatRupiah(netBalance)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Pemasukan − Pengeluaran</p>
          </div>
        </div>

        {/* Total Tabungan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Tabungan</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-indigo-700 tracking-tight">
              {formatRupiah(totalSavings)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Saldo tabungan aktif</p>
          </div>
        </div>

        {/* Nilai Emas */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nilai Emas</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-amber-600 tracking-tight">
              {formatRupiah(currentGoldValue)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{totalGoldGrams.toFixed(2)} gram emas</p>
          </div>
        </div>
      </div>

      {/* Peringatan Anggaran Kategori jika ada yang mendekati / lewat batas */}
      {alertCategories.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/70">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="text-sm font-semibold text-amber-900">
              Peringatan Anggaran Kategori ({NAMA_BULAN[selectedMonth - 1]})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
            {alertCategories.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-800 font-semibold">{c.nama}</span>
                  <span className={c.isOver ? 'text-rose-600 font-bold' : 'text-amber-600 font-bold'}>
                    {c.percent}% ({c.isOver ? 'Melebihi batas!' : 'Mendekati limit'})
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      c.isOver ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(c.percent, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>Terpakai: {formatRupiah(c.spent)}</span>
                  <span>Batas: {formatRupiah(c.budget)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Grafik Singkat & 5 Transaksi Terakhir */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grafik Singkat Pemasukan vs Pengeluaran */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Perbandingan Arus Kas</h3>
              <p className="text-xs text-slate-500">{NAMA_BULAN[selectedMonth - 1]} {selectedYear}</p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              <span>Analisis Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="relative flex-1 min-h-[220px]">
            <canvas ref={chartRef} />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-50/50">
              <span className="text-slate-500 block text-[11px]">Rasio Simpanan</span>
              <span className="font-bold text-emerald-700">
                {totalIncome > 0 ? `${Math.max(0, Math.round((netBalance / totalIncome) * 100))}%` : '0%'}
              </span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50">
              <span className="text-slate-500 block text-[11px]">Rasio Belanja</span>
              <span className="font-bold text-slate-700">
                {totalIncome > 0 ? `${Math.min(100, Math.round((totalExpense / totalIncome) * 100))}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {/* 5 Transaksi Terakhir */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">5 Transaksi Terakhir</h3>
              <p className="text-xs text-slate-500">Catatan aktivitas keuangan terbaru</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateTab('income')}
                className="text-xs text-slate-600 hover:text-emerald-600 font-medium"
              >
                Semua Pemasukan
              </button>
              <span className="text-slate-300">·</span>
              <button
                onClick={() => onNavigateTab('expense')}
                className="text-xs text-slate-600 hover:text-rose-600 font-medium"
              >
                Semua Pengeluaran
              </button>
            </div>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-700">Belum ada transaksi</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Mulai catat pemasukan atau pengeluaran pertama Anda menggunakan tombol di atas.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 flex-1">
              {recentTransactions.map((tx) => {
                const isIncome = tx.tipe === 'income';
                const cat = getCategoryName(tx.categoryId, tx.tipe);

                return (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 px-2 rounded-lg transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-white shrink-0 text-xs font-bold shadow-2xs"
                        style={{ backgroundColor: cat.warna || (isIncome ? '#10b981' : '#f43f5e') }}
                      >
                        {cat.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {cat.nama}
                          </p>
                          <span className="text-[11px] text-slate-400">
                            {formatTanggalIndo(tx.tanggal)}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {tx.catatan || (isIncome ? 'Pemasukan' : 'Pengeluaran')}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-sm font-bold block ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIncome ? '+' : '-'}{formatRupiah(tx.nominal)}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                        {isIncome ? 'Pemasukan' : 'Pengeluaran'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
