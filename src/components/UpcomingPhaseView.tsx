import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ActiveTab } from '../types/finance';

interface UpcomingPhaseViewProps {
  tab: ActiveTab;
  onGoToDashboard: () => void;
}

export const UpcomingPhaseView: React.FC<UpcomingPhaseViewProps> = ({ tab, onGoToDashboard }) => {
  const phaseInfo: Record<string, { title: string; phase: string; features: string[] }> = {
    analytics: {
      title: 'Analisis & Grafik Keuangan',
      phase: 'Tahap 2',
      features: [
        'Donut/Pie Chart pengeluaran per kategori',
        'Bar chart perbandingan pemasukan vs pengeluaran 6 bulan terakhir',
        'Line chart tren pengeluaran harian dan bulanan',
        'Insight otomatis (kategori terboros, persentase kenaikan dari bulan lalu)',
        'Rasio tabungan = (pemasukan − pengeluaran) ÷ pemasukan × 100%',
      ],
    },
    gold: {
      title: 'Tabungan & Investasi Emas',
      phase: 'Tahap 3',
      features: [
        'Form pembelian emas (gram, harga beli, jenis emas, tanggal)',
        'Input & update harga emas hari ini secara manual',
        'Kalkulasi otomatis total gram, modal, nilai terkini, dan untung/rugi (Rp & %)',
        'Riwayat pembelian dengan edit dan hapus',
        'Grafik pertumbuhan aset emas',
      ],
    },
    savings: {
      title: 'Total Tabungan & Target Finansial',
      phase: 'Tahap 3',
      features: [
        'Saldo tabungan manual (bisa ditambah/dikurangi)',
        'Target tabungan dengan progress bar dan deadline (contoh: Dana Darurat, Liburan)',
        'Kalkulasi Total Kekayaan Bersih = Saldo Tabungan + Nilai Emas + Tabungan Lain',
      ],
    },
    settings: {
      title: 'Pengaturan, Ekspor & Impor Data',
      phase: 'Tahap 4',
      features: [
        'Ekspor data transaksi dan kategori ke file CSV dan JSON',
        'Impor data cadangan (backup JSON)',
        'Reset semua data dengan konfirmasi aman',
        'Mode Gelap (Dark Mode)',
        'Penyempurnaan tampilan mobile penuh',
      ],
    },
  };

  const current = phaseInfo[tab] || {
    title: 'Fitur Berikutnya',
    phase: 'Tahap Lanjutan',
    features: ['Fitur akan aktif setelah konfirmasi pengerjaan tahap.'],
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-2xs max-w-2xl mx-auto text-center my-8">
      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
        <Sparkles className="w-6 h-6" />
      </div>

      <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 mb-2">
        {current.phase} Siap Dikerjakan
      </span>

      <h2 className="text-xl font-bold text-slate-900">{current.title}</h2>
      <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
        Fitur Tahap 1 (Dashboard, Pemasukan, Pengeluaran, dan Kategori) telah selesai dibangun dan siap Anda uji.
      </p>

      <div className="mt-6 text-left bg-slate-50 p-4 rounded-xl border border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          Rencana Fitur di {current.phase}:
        </h4>
        <ul className="space-y-2 text-xs text-slate-600">
          {current.features.map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onGoToDashboard}
          className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>Kembali ke Dashboard (Tahap 1)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
