/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppData, ActiveTab, Transaction, Category } from './types/finance';
import { UserProfile } from './types/auth';
import { getActiveSession, clearActiveSession } from './utils/auth';
import { 
  loadAppData, 
  saveAppData, 
  getSampleData, 
  getInitialEmptyData 
} from './utils/storage';
import { generateSingleHtmlContent } from './utils/singleHtmlGenerator';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { IncomeView } from './components/IncomeView';
import { ExpenseView } from './components/ExpenseView';
import { CategoryView } from './components/CategoryView';
import { AnalyticsView } from './components/AnalyticsView';
import { UpcomingPhaseView } from './components/UpcomingPhaseView';
import { LoginView } from './components/LoginView';
import { ConfirmModal } from './components/ConfirmModal';
import { 
  Sparkles, 
  RotateCcw, 
  Download, 
  CheckCircle, 
  Menu, 
  X,
  FileCode2,
  PieChart,
  Coins,
  PiggyBank,
  Settings,
  LogOut,
  User
} from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => getActiveSession());
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [data, setData] = useState<AppData>(() => loadAppData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Periode bulan dan tahun aktif
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());

  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Quick Add modal trigger from dashboard
  const [showIncomeAddTrigger, setShowIncomeAddTrigger] = useState(false);
  const [showExpenseAddTrigger, setShowExpenseAddTrigger] = useState(false);

  // Reset modal confirmation
  const [showResetModal, setShowResetModal] = useState(false);

  // Simpan data setiap kali data berubah
  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleConfirmLogout = () => {
    clearActiveSession();
    setCurrentUser(null);
    setShowLogoutModal(false);
    showToast('Anda telah berhasil keluar dari akun.');
  };

  // Handler Transaksi
  const handleAddTransaction = (tx: Transaction) => {
    setData((prev) => ({
      ...prev,
      transactions: [tx, ...prev.transactions],
    }));
    showToast(tx.tipe === 'income' ? 'Pemasukan berhasil ditambahkan' : 'Pengeluaran berhasil dicatat');
  };

  const handleUpdateTransaction = (tx: Transaction) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) => (t.id === tx.id ? tx : t)),
    }));
    showToast('Transaksi berhasil diperbarui');
  };

  const handleDeleteTransaction = (id: string) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
    showToast('Transaksi telah dihapus');
  };

  // Handler Kategori
  const handleAddCategory = (cat: Category) => {
    setData((prev) => ({
      ...prev,
      categories: [...prev.categories, cat],
    }));
    showToast(`Kategori "${cat.nama}" berhasil dibuat`);
  };

  const handleUpdateCategory = (cat: Category) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.map((c) => (c.id === cat.id ? cat : c)),
    }));
    showToast(`Kategori "${cat.nama}" diperbarui`);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = data.categories.find((c) => c.id === id);
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== id),
    }));
    showToast(`Kategori "${cat?.nama || ''}" telah dihapus`);
  };

  // Handler Muat Data Contoh
  const handleLoadSample = () => {
    const sample = getSampleData();
    setData(sample);
    saveAppData(sample);
    showToast('Data contoh berhasil dimuat ulang!');
  };

  // Handler Reset Semua Data
  const handleConfirmReset = () => {
    const empty = getInitialEmptyData();
    setData(empty);
    saveAppData(empty);
    setShowResetModal(false);
    showToast('Seluruh data berhasil dikosongkan.');
  };

  // Handler Unduh Single File HTML
  const handleDownloadSingleHtml = () => {
    const htmlContent = generateSingleHtmlContent();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'keuangan-pribadi.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('File "keuangan-pribadi.html" berhasil diunduh!');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <LoginView
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Selamat datang kembali, ${user.name}!`);
          }}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-150">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row antialiased">
      {/* Sidebar Desktop */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onDownloadHtml={handleDownloadSingleHtml}
        currentUser={currentUser}
        onLogout={() => setShowLogoutModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        {/* Top Announcement Bar (Tahap 2 Active Status) */}
        <div className="bg-slate-900 text-slate-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-emerald-300">Tahap 2:</span>
            <span className="text-slate-300">
              Analisis Keuangan & Otentikasi Akun Aktif.
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded transition-colors"
              title="Isi ulang data contoh transaksi"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Muat Data Contoh</span>
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="text-slate-400 hover:text-rose-300 px-2 py-0.5 rounded transition-colors"
            >
              Kosongkan Data
            </button>
            <button
              onClick={handleDownloadSingleHtml}
              className="hidden sm:flex items-center gap-1 text-emerald-300 hover:text-emerald-200 bg-emerald-950/80 border border-emerald-800/80 hover:bg-emerald-900 px-2 py-0.5 rounded transition-colors font-medium"
              title="Unduh single file HTML mandiri"
            >
              <FileCode2 className="w-3 h-3" />
              <span>Unduh .html</span>
            </button>

            {currentUser && (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
                <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-slate-300 font-medium hidden sm:inline max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                  title="Keluar / Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              data={data}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              onNavigateTab={setActiveTab}
              onOpenAddIncome={() => setActiveTab('income')}
              onOpenAddExpense={() => setActiveTab('expense')}
            />
          )}

          {activeTab === 'income' && (
            <IncomeView
              transactions={data.transactions}
              categories={data.categories}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'expense' && (
            <ExpenseView
              transactions={data.transactions}
              categories={data.categories}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'categories' && (
            <CategoryView
              categories={data.categories}
              transactions={data.transactions}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
              onAddCategory={handleAddCategory}
              onUpdateCategory={handleUpdateCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              data={data}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              setSelectedMonth={setSelectedMonth}
              setSelectedYear={setSelectedYear}
            />
          )}

          {['gold', 'savings', 'settings'].includes(activeTab) && (
            <UpcomingPhaseView
              tab={activeTab}
              onGoToDashboard={() => setActiveTab('dashboard')}
            />
          )}
        </main>
      </div>

      {/* Bottom Nav for Mobile */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMore={() => setMobileMenuOpen(true)}
      />

      {/* Mobile Menu Drawer Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex flex-col justify-end">
          <div className="bg-white rounded-t-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-xs">
                  D
                </div>
                <span className="font-bold text-slate-900">Menu & Fitur DompetKu</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className={`p-3 rounded-lg text-left font-medium border ${activeTab === 'dashboard' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                📊 Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('income'); setMobileMenuOpen(false); }}
                className={`p-3 rounded-lg text-left font-medium border ${activeTab === 'income' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                ↙️ Pemasukan
              </button>
              <button
                onClick={() => { setActiveTab('expense'); setMobileMenuOpen(false); }}
                className={`p-3 rounded-lg text-left font-medium border ${activeTab === 'expense' ? 'bg-rose-50 border-rose-300 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                ↗️ Pengeluaran
              </button>
              <button
                onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                className={`p-3 rounded-lg text-left font-medium border ${activeTab === 'categories' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
              >
                🏷️ Kategori & Budget
              </button>
              <button
                onClick={() => { setActiveTab('analytics'); setMobileMenuOpen(false); }}
                className="p-3 rounded-lg text-left font-medium border bg-slate-50 border-slate-200 text-slate-600"
              >
                📈 Analisis (Tahap 2)
              </button>
              <button
                onClick={() => { setActiveTab('gold'); setMobileMenuOpen(false); }}
                className="p-3 rounded-lg text-left font-medium border bg-slate-50 border-slate-200 text-slate-600"
              >
                🪙 Tabungan Emas (Tahap 3)
              </button>
              <button
                onClick={() => { setActiveTab('savings'); setMobileMenuOpen(false); }}
                className="p-3 rounded-lg text-left font-medium border bg-slate-50 border-slate-200 text-slate-600"
              >
                🐖 Total Tabungan (Tahap 3)
              </button>
              <button
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }}
                className="p-3 rounded-lg text-left font-medium border bg-slate-50 border-slate-200 text-slate-600"
              >
                ⚙️ Pengaturan (Tahap 4)
              </button>
            </div>

            {/* Quick Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => { handleLoadSample(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Muat Ulang Data Contoh</span>
              </button>
              <button
                onClick={() => { handleDownloadSingleHtml(); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File HTML Tunggal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-16 md:bottom-6 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modal Konfirmasi Reset Data */}
      <ConfirmModal
        isOpen={showResetModal}
        title="Kosongkan Semua Data?"
        message="Tindakan ini akan menghapus semua riwayat transaksi Anda. Anda selalu dapat menekan tombol 'Muat Data Contoh' untuk memuat ulang data latihan."
        confirmText="Ya, Kosongkan"
        cancelText="Batal"
        isDestructive={true}
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetModal(false)}
      />

      {/* Modal Konfirmasi Logout */}
      <ConfirmModal
        isOpen={showLogoutModal}
        title="Keluar dari Akun?"
        message={`Apakah Anda yakin ingin keluar dari akun "${currentUser?.name}"? Sesi Anda akan ditutup dan Anda akan kembali ke layar masuk.`}
        confirmText="Ya, Keluar"
        cancelText="Batal"
        isDestructive={false}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
}
