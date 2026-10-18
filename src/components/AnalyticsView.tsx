import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Lightbulb, 
  Calendar, 
  Percent, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Layers
} from 'lucide-react';
import { AppData, Transaction, Category } from '../types/finance';
import { formatRupiah, NAMA_BULAN, NAMA_BULAN_PENDEK } from '../utils/formatters';

interface AnalyticsViewProps {
  data: AppData;
  selectedMonth: number;
  selectedYear: number;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  data,
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
}) => {
  // Chart Canvas References
  const donutChartRef = useRef<HTMLCanvasElement | null>(null);
  const barChartRef = useRef<HTMLCanvasElement | null>(null);
  const lineChartRef = useRef<HTMLCanvasElement | null>(null);

  // Chart Instances
  const donutInstance = useRef<Chart | null>(null);
  const barInstance = useRef<Chart | null>(null);
  const lineInstance = useRef<Chart | null>(null);

  // State untuk mode Line Chart (harian bulan ini vs tren 6 bulan)
  const [lineViewMode, setLineViewMode] = useState<'daily' | 'monthly'>('daily');

  // Filter transaksi bulan ini
  const currentMonthTransactions = data.transactions.filter((t) => {
    if (!t.tanggal) return false;
    const [y, m] = t.tanggal.split('-').map(Number);
    return y === selectedYear && m === selectedMonth;
  });

  const totalIncome = currentMonthTransactions
    .filter((t) => t.tipe === 'income')
    .reduce((sum, t) => sum + t.nominal, 0);

  const totalExpense = currentMonthTransactions
    .filter((t) => t.tipe === 'expense')
    .reduce((sum, t) => sum + t.nominal, 0);

  // Rumus: Rasio Tabungan = (pemasukan - pengeluaran) / pemasukan * 100%
  const savingsRate = totalIncome > 0
    ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100)
    : 0;

  // Hitung bulan sebelumnya untuk komparasi pertumbuhan
  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const prevYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;

  const prevMonthTransactions = data.transactions.filter((t) => {
    if (!t.tanggal) return false;
    const [y, m] = t.tanggal.split('-').map(Number);
    return y === prevYear && m === prevMonth;
  });

  const prevTotalExpense = prevMonthTransactions
    .filter((t) => t.tipe === 'expense')
    .reduce((sum, t) => sum + t.nominal, 0);

  const prevTotalIncome = prevMonthTransactions
    .filter((t) => t.tipe === 'income')
    .reduce((sum, t) => sum + t.nominal, 0);

  // Persentase perubahan pengeluaran dari bulan lalu
  const expenseChangePercent = prevTotalExpense > 0
    ? Math.round(((totalExpense - prevTotalExpense) / prevTotalExpense) * 100)
    : null;

  // Distribusi pengeluaran per kategori bulan ini
  const categoryExpenses: Record<string, number> = {};
  currentMonthTransactions
    .filter((t) => t.tipe === 'expense')
    .forEach((t) => {
      categoryExpenses[t.categoryId] = (categoryExpenses[t.categoryId] || 0) + t.nominal;
    });

  const categoryBreakdown = Object.entries(categoryExpenses)
    .map(([catId, amount]) => {
      const cat = data.categories.find((c) => c.id === catId) || {
        id: catId,
        nama: catId.replace('cat_', ''),
        warna: '#64748b',
        batasAnggaran: null,
      };
      const percentage = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0;
      return {
        ...cat,
        amount,
        percentage,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  // Kategori terboros bulan ini
  const topExpenseCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  // Insight otomatis
  const insights: { text: string; type: 'info' | 'warning' | 'success' }[] = [];

  if (topExpenseCategory && totalExpense > 0) {
    insights.push({
      text: `Kategori terboros bulan ini: ${topExpenseCategory.nama} dengan total ${formatRupiah(topExpenseCategory.amount)} (${topExpenseCategory.percentage}% dari seluruh pengeluaran).`,
      type: 'info',
    });
  }

  if (expenseChangePercent !== null) {
    if (expenseChangePercent > 0) {
      insights.push({
        text: `Total pengeluaran naik ${expenseChangePercent}% dibandingkan bulan lalu (${formatRupiah(totalExpense)} vs ${formatRupiah(prevTotalExpense)}).`,
        type: expenseChangePercent > 20 ? 'warning' : 'info',
      });
    } else if (expenseChangePercent < 0) {
      insights.push({
        text: `Pengeluaran berhasil ditekan hemat ${Math.abs(expenseChangePercent)}% dibanding bulan lalu. Kerja bagus!`,
        type: 'success',
      });
    }
  }

  if (totalIncome > 0) {
    if (savingsRate >= 30) {
      insights.push({
        text: `Rasio tabungan Anda sangat sehat (${savingsRate}%). Anda menyisihkan lebih dari sepertiga penghasilan bulan ini.`,
        type: 'success',
      });
    } else if (savingsRate >= 10) {
      insights.push({
        text: `Rasio tabungan ${savingsRate}%. Pertahankan disiplin alokasi minimal 20% untuk pos tabungan dan investasi.`,
        type: 'info',
      });
    } else if (savingsRate < 0) {
      insights.push({
        text: `Arus kas defisit! Pengeluaran melampaui pemasukan sebesar ${formatRupiah(totalExpense - totalIncome)}. Segera evaluasi kategori primer.`,
        type: 'warning',
      });
    }
  }

  // Cek perbandingan per kategori dari bulan lalu untuk insight spesifik
  const prevCatExpenses: Record<string, number> = {};
  prevMonthTransactions
    .filter((t) => t.tipe === 'expense')
    .forEach((t) => {
      prevCatExpenses[t.categoryId] = (prevCatExpenses[t.categoryId] || 0) + t.nominal;
    });

  Object.entries(categoryExpenses).forEach(([catId, currentAmt]) => {
    const prevAmt = prevCatExpenses[catId] || 0;
    if (prevAmt > 0 && currentAmt > prevAmt * 1.2) {
      const catObj = data.categories.find((c) => c.id === catId);
      const incPct = Math.round(((currentAmt - prevAmt) / prevAmt) * 100);
      insights.push({
        text: `Pengeluaran ${catObj?.nama || catId} naik ${incPct}% dari bulan lalu (${formatRupiah(currentAmt)} vs ${formatRupiah(prevAmt)}).`,
        type: 'warning',
      });
    }
  });

  // Siapkan data 6 bulan terakhir untuk Bar Chart
  const last6Months: { month: number; year: number; label: string; income: number; expense: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    let m = selectedMonth - i;
    let y = selectedYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    const label = `${NAMA_BULAN_PENDEK[m - 1]} ${y.toString().slice(-2)}`;
    const txs = data.transactions.filter((t) => {
      if (!t.tanggal) return false;
      const [ty, tm] = t.tanggal.split('-').map(Number);
      return ty === y && tm === m;
    });
    const inc = txs.filter((t) => t.tipe === 'income').reduce((s, t) => s + t.nominal, 0);
    const exp = txs.filter((t) => t.tipe === 'expense').reduce((s, t) => s + t.nominal, 0);

    last6Months.push({ month: m, year: y, label, income: inc, expense: exp });
  }

  // Siapkan data pengeluaran harian bulan ini untuk Line Chart
  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const dailyExpenses: number[] = Array(daysInMonth).fill(0);
  const dailyLabels: string[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    dailyLabels.push(`${d}`);
    const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTotal = currentMonthTransactions
      .filter((t) => t.tipe === 'expense' && t.tanggal === dateStr)
      .reduce((sum, t) => sum + t.nominal, 0);
    dailyExpenses[d - 1] = dayTotal;
  }

  // 1. Inisialisasi Donut Chart (Distribusi Pengeluaran)
  useEffect(() => {
    if (!donutChartRef.current) return;
    if (donutInstance.current) donutInstance.current.destroy();

    const ctx = donutChartRef.current.getContext('2d');
    if (!ctx) return;

    if (categoryBreakdown.length === 0) {
      // Empty state donut
      donutInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Belum Ada Pengeluaran'],
          datasets: [{ data: [1], backgroundColor: ['#e2e8f0'], borderWidth: 0 }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
          cutout: '70%',
        },
      });
      return;
    }

    donutInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryBreakdown.map((c) => c.nama),
        datasets: [
          {
            data: categoryBreakdown.map((c) => c.amount),
            backgroundColor: categoryBreakdown.map((c) => c.warna || '#64748b'),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { size: 11 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const val = context.raw as number;
                const pct = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
                return ` ${label}: ${formatRupiah(val)} (${pct}%)`;
              },
            },
          },
        },
        cutout: '68%',
      },
    });

    return () => {
      if (donutInstance.current) donutInstance.current.destroy();
    };
  }, [categoryBreakdown, totalExpense]);

  // 2. Inisialisasi Bar Chart (Pemasukan vs Pengeluaran 6 Bulan)
  useEffect(() => {
    if (!barChartRef.current) return;
    if (barInstance.current) barInstance.current.destroy();

    const ctx = barChartRef.current.getContext('2d');
    if (!ctx) return;

    barInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: last6Months.map((m) => m.label),
        datasets: [
          {
            label: 'Pemasukan',
            data: last6Months.map((m) => m.income),
            backgroundColor: 'rgba(16, 185, 129, 0.85)',
            borderColor: '#10b981',
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: 'Pengeluaran',
            data: last6Months.map((m) => m.expense),
            backgroundColor: 'rgba(244, 63, 94, 0.85)',
            borderColor: '#f43f5e',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { size: 11 },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.dataset.label}: ${formatRupiah(context.raw as number)}`,
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
              font: { size: 10 },
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 } },
          },
        },
      },
    });

    return () => {
      if (barInstance.current) barInstance.current.destroy();
    };
  }, [last6Months]);

  // 3. Inisialisasi Line Chart (Tren Pengeluaran Harian / Bulanan)
  useEffect(() => {
    if (!lineChartRef.current) return;
    if (lineInstance.current) lineInstance.current.destroy();

    const ctx = lineChartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = lineViewMode === 'daily' ? dailyLabels : last6Months.map((m) => m.label);
    const dataPoints = lineViewMode === 'daily' ? dailyExpenses : last6Months.map((m) => m.expense);

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, 240);
    gradient.addColorStop(0, 'rgba(244, 63, 94, 0.25)');
    gradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

    lineInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: lineViewMode === 'daily' ? 'Pengeluaran Harian (Rp)' : 'Pengeluaran Bulanan (Rp)',
            data: dataPoints,
            borderColor: '#f43f5e',
            borderWidth: 2.5,
            pointBackgroundColor: '#f43f5e',
            pointRadius: lineViewMode === 'daily' ? 3 : 5,
            pointHoverRadius: 6,
            tension: 0.35,
            fill: true,
            backgroundColor: gradient,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => ` Pengeluaran: ${formatRupiah(context.raw as number)}`,
              title: (items) => {
                if (lineViewMode === 'daily') {
                  return `Tgl ${items[0].label} ${NAMA_BULAN[selectedMonth - 1]}`;
                }
                return items[0].label;
              },
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
              font: { size: 10 },
            },
            grid: { color: 'rgba(226, 232, 240, 0.6)' },
          },
          x: {
            grid: { display: false },
            ticks: {
              font: { size: 10 },
              maxTicksLimit: 15,
            },
          },
        },
      },
    });

    return () => {
      if (lineInstance.current) lineInstance.current.destroy();
    };
  }, [lineViewMode, dailyExpenses, dailyLabels, last6Months, selectedMonth]);

  const yearsList = [2024, 2025, 2026, 2027];

  return (
    <div className="space-y-6">
      {/* Header & Filter Periode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieIcon className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Analisis & Grafik Keuangan</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Visualisasi distribusi pengeluaran, perbandingan arus kas, dan insight otomatis
          </p>
        </div>

        {/* Pemilih Periode */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer"
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
            className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none border-l border-slate-200 pl-1.5 cursor-pointer"
          >
            {yearsList.map((yr) => (
              <option key={yr} value={yr}>
                {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Kartu Metrik Analisis Finansial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rasio Tabungan */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rasio Tabungan</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${savingsRate >= 20 ? 'bg-emerald-50 text-emerald-600' : savingsRate >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-xl font-bold tracking-tight ${savingsRate >= 20 ? 'text-emerald-600' : savingsRate >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              {savingsRate}%
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              (Pemasukan − Pengeluaran) ÷ Pemasukan
            </p>
          </div>
        </div>

        {/* Kategori Terboros */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kategori Terboros</span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-slate-900 tracking-tight truncate">
              {topExpenseCategory ? topExpenseCategory.nama : '-'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {topExpenseCategory ? `${formatRupiah(topExpenseCategory.amount)} (${topExpenseCategory.percentage}%)` : 'Tidak ada pengeluaran'}
            </p>
          </div>
        </div>

        {/* Perubahan dari Bulan Lalu */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">vs Bulan Lalu</span>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${expenseChangePercent !== null && expenseChangePercent <= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {expenseChangePercent !== null && expenseChangePercent <= 0 ? (
                <ArrowDownRight className="w-4 h-4" />
              ) : (
                <ArrowUpRight className="w-4 h-4" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <p className={`text-xl font-bold tracking-tight ${expenseChangePercent !== null && expenseChangePercent <= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {expenseChangePercent === null ? '0%' : `${expenseChangePercent > 0 ? '+' : ''}${expenseChangePercent}%`}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Lalu: {formatRupiah(prevTotalExpense)}
            </p>
          </div>
        </div>

        {/* Rata-rata Pengeluaran Harian */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Rata-rata Harian</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <p className="text-lg font-bold text-slate-900 tracking-tight">
              {formatRupiah(daysInMonth > 0 ? Math.round(totalExpense / daysInMonth) : 0)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Berdasarkan {daysInMonth} hari bulan ini
            </p>
          </div>
        </div>
      </div>

      {/* Kotak Insight Otomatis Cerdas */}
      {insights.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50/90 to-teal-50/70 p-4 rounded-xl border border-emerald-200/80 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-emerald-700 shrink-0" />
            <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Insight Finansial Otomatis ({NAMA_BULAN[selectedMonth - 1]} {selectedYear})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2">
            {insights.map((ins, idx) => (
              <div
                key={idx}
                className="bg-white/90 p-3 rounded-lg border border-emerald-100 flex items-start gap-2.5 text-xs text-slate-700 shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <p className="leading-relaxed">{ins.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Grafik: Donut Chart & Bar Chart 6 Bulan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart: Pengeluaran per Kategori */}
        <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Distribusi Kategori Pengeluaran</h3>
              <p className="text-xs text-slate-500">Proporsi alokasi belanja bulan ini</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
              {formatRupiah(totalExpense)}
            </span>
          </div>

          <div className="relative flex-1 min-h-[260px] flex items-center justify-center my-2">
            <canvas ref={donutChartRef} />
          </div>

          {/* Mini Table List */}
          {categoryBreakdown.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {categoryBreakdown.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.warna }} />
                    <span className="font-medium text-slate-700 truncate">{c.nama}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-semibold text-slate-800">{formatRupiah(c.amount)}</span>
                    <span className="text-slate-400 text-[11px] w-8 text-right font-mono">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bar Chart: Pemasukan vs Pengeluaran 6 Bulan Terakhir */}
        <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Pemasukan vs Pengeluaran</h3>
              <p className="text-xs text-slate-500">Tren arus kas 6 bulan terakhir</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" /> Masuk
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" /> Keluar
              </span>
            </div>
          </div>

          <div className="relative flex-1 min-h-[280px]">
            <canvas ref={barChartRef} />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Rata-rata 6 Bulan:</span>
            <span>
              Masuk: <strong className="text-emerald-700">{formatRupiah(Math.round(last6Months.reduce((s, m) => s + m.income, 0) / 6))}</strong> · 
              Keluar: <strong className="text-rose-700">{formatRupiah(Math.round(last6Months.reduce((s, m) => s + m.expense, 0) / 6))}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Line Chart: Tren Pengeluaran */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Tren Pengeluaran</h3>
            <p className="text-xs text-slate-500">
              {lineViewMode === 'daily'
                ? `Pola belanja harian periode ${NAMA_BULAN[selectedMonth - 1]} ${selectedYear}`
                : 'Pola pengeluaran bulanan 6 bulan terakhir'}
            </p>
          </div>

          {/* Toggle Daily vs Monthly */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
            <button
              onClick={() => setLineViewMode('daily')}
              className={`py-1 px-2.5 text-xs font-semibold rounded-md transition-colors ${
                lineViewMode === 'daily' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Harian ({NAMA_BULAN_PENDEK[selectedMonth - 1]})
            </button>
            <button
              onClick={() => setLineViewMode('monthly')}
              className={`py-1 px-2.5 text-xs font-semibold rounded-md transition-colors ${
                lineViewMode === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bulanan (6 Bulan)
            </button>
          </div>
        </div>

        <div className="relative min-h-[220px]">
          <canvas ref={lineChartRef} />
        </div>
      </div>
    </div>
  );
};
