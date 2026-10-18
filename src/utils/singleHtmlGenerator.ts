/**
 * Generator file HTML tunggal mandiri (single-file HTML)
 * Berisi Login Screen (Email & Google), Dashboard, Pemasukan, Pengeluaran, Kategori, dan Analisis Chart.js
 * Menyimpan data di localStorage dan dapat dibuka secara offline di browser mana pun tanpa server!
 */

export function generateSingleHtmlContent(): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DompetKu - Kelola Keuangan Pribadi (Standalone)</title>
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Chart.js via CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 min-h-screen antialiased flex flex-col">

  <!-- LAYAR LOGIN (Ditampilkan jika belum masuk) -->
  <div id="login-screen" class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/40">
    <div class="sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="flex justify-center mb-3">
        <div class="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
          D
        </div>
      </div>
      <h2 class="text-center text-2xl font-bold tracking-tight text-slate-900">DompetKu</h2>
      <p class="mt-1 text-center text-xs text-slate-500">Kelola Keuangan Pribadi & Investasi Emas</p>
    </div>

    <div class="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
      <div class="bg-white py-7 px-5 sm:px-8 shadow-xl rounded-2xl border border-slate-200">
        <!-- Tombol Google -->
        <button type="button" onclick="loginWithGoogle()" class="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all shadow-xs cursor-pointer">
          <svg class="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        <div class="relative my-5">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-200"></div></div>
          <div class="relative flex justify-center text-xs uppercase"><span class="bg-white px-2.5 text-slate-400 font-medium">atau dengan email</span></div>
        </div>

        <!-- Form Email -->
        <form onsubmit="handleEmailLogin(event)" class="space-y-3.5">
          <div id="login-error" class="hidden p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700"></div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" id="login-email" required placeholder="nama@email.com" class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none">
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi</label>
            <input type="password" id="login-password" required placeholder="Minimal 6 karakter" class="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none">
          </div>
          <button type="submit" class="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm">
            Masuk ke DompetKu
          </button>
        </form>

        <div class="mt-4 pt-3 border-t border-slate-100 text-center">
          <button type="button" onclick="loginAsDemo()" class="text-xs text-slate-500 hover:text-emerald-700 font-medium">
            ✨ Masuk Cepat sebagai Tamu (Mode Demo)
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- APLIKASI UTAMA (Setelah Login) -->
  <div id="main-app" class="hidden min-h-screen flex flex-col md:flex-row antialiased">
    <!-- Sidebar Desktop -->
    <aside class="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 shrink-0">
      <div class="p-5 border-b border-slate-100 flex items-center gap-3">
        <div class="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">D</div>
        <div>
          <h1 class="font-bold text-slate-900 text-base leading-none">DompetKu</h1>
          <p class="text-xs text-slate-500 mt-1">Keuangan Pribadi</p>
        </div>
      </div>
      <nav class="flex-1 p-3 space-y-1">
        <button onclick="switchTab('dashboard')" id="nav-dashboard" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors bg-emerald-50 text-emerald-700 font-semibold">
          <span>📊</span> <span>Dashboard</span>
        </button>
        <button onclick="switchTab('income')" id="nav-income" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50">
          <span>↙️</span> <span>Pemasukan</span>
        </button>
        <button onclick="switchTab('expense')" id="nav-expense" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50">
          <span>↗️</span> <span>Pengeluaran</span>
        </button>
        <button onclick="switchTab('categories')" id="nav-categories" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50">
          <span>🏷️</span> <span>Kategori & Budget</span>
        </button>
        <button onclick="switchTab('analytics')" id="nav-analytics" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50">
          <span>📈</span> <span>Analisis & Grafik</span>
        </button>
      </nav>

      <!-- User Profile in Sidebar -->
      <div class="p-3 border-t border-slate-200 bg-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 truncate">
            <div id="side-user-avatar" class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">U</div>
            <div class="truncate">
              <p id="side-user-name" class="text-xs font-semibold text-slate-800 truncate">Pengguna</p>
              <p id="side-user-email" class="text-[10px] text-slate-400 truncate">user@email.com</p>
            </div>
          </div>
          <button onclick="handleLogout()" class="text-xs text-slate-400 hover:text-rose-600 p-1" title="Keluar">
            Keluar
          </button>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full pb-20 md:pb-8">
      <!-- Top Header -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
        <div>
          <h2 id="page-title" class="text-xl sm:text-2xl font-bold text-slate-900">Ringkasan Keuangan</h2>
          <p id="page-subtitle" class="text-sm text-slate-500">Laporan periode aktif</p>
        </div>
        <div class="flex items-center gap-2">
          <select id="select-month" onchange="onPeriodChange()" class="text-sm font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none">
            <option value="1">Januari</option><option value="2">Februari</option><option value="3">Maret</option>
            <option value="4">April</option><option value="5">Mei</option><option value="6">Juni</option>
            <option value="7">Juli</option><option value="8">Agustus</option><option value="9">September</option>
            <option value="10">Oktober</option><option value="11">November</option><option value="12">Desember</option>
          </select>
          <select id="select-year" onchange="onPeriodChange()" class="text-sm font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none">
            <option value="2025">2025</option><option value="2026">2026</option><option value="2027">2027</option>
          </select>
          <button onclick="handleLogout()" class="text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg transition-colors">
            Keluar
          </button>
        </div>
      </header>

      <!-- TAB: DASHBOARD -->
      <section id="tab-dashboard" class="space-y-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Total Pemasukan</span>
            <p id="dash-income" class="text-lg font-bold text-emerald-600 mt-1">Rp 0</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Total Pengeluaran</span>
            <p id="dash-expense" class="text-lg font-bold text-rose-600 mt-1">Rp 0</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Sisa Saldo</span>
            <p id="dash-net" class="text-lg font-bold text-slate-900 mt-1">Rp 0</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Total Tabungan</span>
            <p id="dash-savings" class="text-lg font-bold text-indigo-700 mt-1">Rp 0</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Nilai Emas</span>
            <p id="dash-gold" class="text-lg font-bold text-amber-600 mt-1">Rp 0</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col">
            <h3 class="text-sm font-semibold text-slate-900 mb-2">Grafik Arus Kas Bulan Ini</h3>
            <div class="relative flex-1 min-h-[200px]">
              <canvas id="dashChart"></canvas>
            </div>
          </div>
          <div class="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h3 class="text-sm font-semibold text-slate-900 mb-2">5 Transaksi Terakhir</h3>
            <div id="dash-recent-list" class="divide-y divide-slate-100"></div>
          </div>
        </div>
      </section>

      <!-- TAB: INCOME -->
      <section id="tab-income" class="space-y-4 hidden">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-slate-900">Catatan Pemasukan</h3>
          <button onclick="openTxModal('income')" class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs">+ Tambah Pemasukan</button>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                <th class="p-3">Tanggal</th><th class="p-3">Sumber</th><th class="p-3">Catatan</th><th class="p-3 text-right">Nominal</th><th class="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody id="income-table-body" class="divide-y divide-slate-100"></tbody>
          </table>
        </div>
      </section>

      <!-- TAB: EXPENSE -->
      <section id="tab-expense" class="space-y-4 hidden">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-slate-900">Catatan Pengeluaran</h3>
          <button onclick="openTxModal('expense')" class="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs">+ Tambah Pengeluaran</button>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <table class="w-full text-left border-collapse text-sm">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                <th class="p-3">Tanggal</th><th class="p-3">Kategori</th><th class="p-3">Catatan</th><th class="p-3 text-right">Nominal</th><th class="p-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody id="expense-table-body" class="divide-y divide-slate-100"></tbody>
          </table>
        </div>
      </section>

      <!-- TAB: CATEGORIES -->
      <section id="tab-categories" class="space-y-4 hidden">
        <h3 class="text-base font-bold text-slate-900">Kategori & Batas Anggaran Bulanan</h3>
        <div id="categories-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
      </section>

      <!-- TAB: ANALYTICS -->
      <section id="tab-analytics" class="space-y-6 hidden">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Rasio Tabungan Bulan Ini</span>
            <p id="ana-savings-rate" class="text-xl font-bold text-emerald-600 mt-1">0%</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Kategori Terboros</span>
            <p id="ana-top-cat" class="text-lg font-bold text-rose-600 mt-1">-</p>
          </div>
          <div class="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span class="text-xs font-medium text-slate-500">Rata-rata Pengeluaran Harian</span>
            <p id="ana-daily-avg" class="text-lg font-bold text-slate-800 mt-1">Rp 0</p>
          </div>
        </div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 class="text-sm font-semibold text-slate-900 mb-2">Distribusi Pengeluaran Kategori</h4>
            <div class="relative min-h-[250px]"><canvas id="anaDonutChart"></canvas></div>
          </div>
          <div class="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 class="text-sm font-semibold text-slate-900 mb-2">Arus Kas 6 Bulan Terakhir</h4>
            <div class="relative min-h-[250px]"><canvas id="anaBarChart"></canvas></div>
          </div>
        </div>
      </section>
    </main>
  </div>

  <!-- Modal Transaksi -->
  <div id="tx-modal" class="fixed inset-0 bg-slate-900/50 hidden flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-5">
      <h3 id="tx-modal-title" class="font-bold text-slate-900 text-base mb-4">Tambah Transaksi</h3>
      <form onsubmit="handleTxSubmit(event)" class="space-y-3">
        <input type="hidden" id="tx-type">
        <div><label class="block text-xs font-semibold text-slate-600 mb-1">Tanggal</label><input type="date" id="tx-date" required class="w-full text-sm border rounded-lg p-2"></div>
        <div><label class="block text-xs font-semibold text-slate-600 mb-1">Nominal (Rp)</label><input type="number" id="tx-nominal" min="1" required class="w-full text-sm border rounded-lg p-2"></div>
        <div><label id="tx-category-label" class="block text-xs font-semibold text-slate-600 mb-1">Kategori</label><select id="tx-category" required class="w-full text-sm border rounded-lg p-2"></select></div>
        <div><label class="block text-xs font-semibold text-slate-600 mb-1">Catatan</label><input type="text" id="tx-note" class="w-full text-sm border rounded-lg p-2"></div>
        <div class="flex justify-end gap-2 pt-3 border-t"><button type="button" onclick="closeTxModal()" class="px-3 py-1.5 text-xs border rounded-lg">Batal</button><button type="submit" class="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-semibold">Simpan</button></div>
      </form>
    </div>
  </div>

  <script>
    const STORAGE_KEY = 'dompetku_data_v1';
    const AUTH_KEY = 'dompetku_auth_session_v1';
    let appData = null;
    let currentUser = null;
    let chartInstance = null;
    let anaDonutInstance = null;
    let anaBarInstance = null;

    function formatRupiah(num) {
      return 'Rp ' + Math.round(num || 0).toLocaleString('id-ID');
    }

    // Cek Sesi Auth saat mulai
    function checkAuth() {
      const rawUser = localStorage.getItem(AUTH_KEY);
      if (rawUser) {
        try { currentUser = JSON.parse(rawUser); } catch(e) { currentUser = null; }
      }
      if (currentUser) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('side-user-name').innerText = currentUser.name;
        document.getElementById('side-user-email').innerText = currentUser.email;
        document.getElementById('side-user-avatar').innerText = currentUser.name.charAt(0).toUpperCase();
        initData();
        renderAll();
      } else {
        document.getElementById('login-screen').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
      }
    }

    function loginWithGoogle() {
      currentUser = { name: 'Pengguna Google', email: 'pengguna@gmail.com', loginMethod: 'google' };
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      checkAuth();
    }

    function loginAsDemo() {
      currentUser = { name: 'Tamu / Akun Demo', email: 'demo@dompetku.id', loginMethod: 'demo' };
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      checkAuth();
    }

    function handleEmailLogin(e) {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const pass = document.getElementById('login-password').value;
      if (!email || !pass) return;
      currentUser = { name: email.split('@')[0], email: email, loginMethod: 'email' };
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentUser));
      checkAuth();
    }

    function handleLogout() {
      if (confirm('Yakin ingin keluar dari akun?')) {
        localStorage.removeItem(AUTH_KEY);
        currentUser = null;
        checkAuth();
      }
    }

    function initData() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try { appData = JSON.parse(raw); } catch (e) { appData = null; }
      }
      if (!appData) resetSampleData();
    }

    function resetSampleData() {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      appData = {
        transactions: [
          { id: 't1', tipe: 'income', nominal: 7500000, categoryId: 'cat_gaji', tanggal: yr + '-' + mo + '-01', catatan: 'Gaji Kantor' },
          { id: 't2', tipe: 'income', nominal: 1500000, categoryId: 'cat_freelance', tanggal: yr + '-' + mo + '-05', catatan: 'Project Desain' },
          { id: 't3', tipe: 'expense', nominal: 1200000, categoryId: 'cat_kos', tanggal: yr + '-' + mo + '-02', catatan: 'Kos Bulanan' },
          { id: 't4', tipe: 'expense', nominal: 850000, categoryId: 'cat_makan', tanggal: yr + '-' + mo + '-08', catatan: 'Belanja Dapur' },
          { id: 't5', tipe: 'expense', nominal: 420000, categoryId: 'cat_jajan', tanggal: yr + '-' + mo + '-12', catatan: 'Kopi & Snack' },
          { id: 't6', tipe: 'expense', nominal: 450000, categoryId: 'cat_tagihan', tanggal: yr + '-' + mo + '-04', catatan: 'Listrik & WiFi' },
        ],
        categories: [
          { id: 'cat_makan', nama: 'Makan', tipe: 'expense', batasAnggaran: 1500000, warna: '#f97316' },
          { id: 'cat_kos', nama: 'Kos', tipe: 'expense', batasAnggaran: 1200000, warna: '#6366f1' },
          { id: 'cat_jajan', nama: 'Jajan', tipe: 'expense', batasAnggaran: 500000, warna: '#ec4899' },
          { id: 'cat_transport', nama: 'Transport', tipe: 'expense', batasAnggaran: 600000, warna: '#06b6d4' },
          { id: 'cat_tagihan', nama: 'Tagihan', tipe: 'expense', batasAnggaran: 750000, warna: '#ef4444' },
          { id: 'cat_gaji', nama: 'Gaji', tipe: 'income', batasAnggaran: null, warna: '#10b981' },
          { id: 'cat_freelance', nama: 'Freelance', tipe: 'income', batasAnggaran: null, warna: '#8b5cf6' },
        ],
        goldPurchases: [{ id: 'g1', tanggal: yr + '-' + mo + '-03', gram: 2, hargaPerGram: 1350000, jenis: 'Antam', catatan: 'Beli LM' }],
        goldPrice: { hargaPerGram: 1420000, tanggalUpdate: yr + '-' + mo + '-18' },
        savingsGoals: [],
        savingsBalance: 12500000
      };
      saveData();
      renderAll();
    }

    function saveData() { localStorage.setItem(STORAGE_KEY, JSON.stringify(appData)); }

    function switchTab(tabId) {
      ['dashboard', 'income', 'expense', 'categories', 'analytics'].forEach(t => {
        const el = document.getElementById('tab-' + t);
        const nav = document.getElementById('nav-' + t);
        if (el) el.classList.toggle('hidden', t !== tabId);
        if (nav) {
          nav.classList.toggle('bg-emerald-50', t === tabId);
          nav.classList.toggle('text-emerald-700', t === tabId);
          nav.classList.toggle('font-semibold', t === tabId);
        }
      });
      renderAll();
    }

    function onPeriodChange() { renderAll(); }

    function renderAll() {
      if (!appData) return;
      const m = parseInt(document.getElementById('select-month').value);
      const y = parseInt(document.getElementById('select-year').value);

      const monthlyTx = appData.transactions.filter(t => {
        if (!t.tanggal) return false;
        const [yr, mo] = t.tanggal.split('-').map(Number);
        return yr === y && mo === m;
      });

      const inc = monthlyTx.filter(t => t.tipe === 'income').reduce((s, t) => s + t.nominal, 0);
      const exp = monthlyTx.filter(t => t.tipe === 'expense').reduce((s, t) => s + t.nominal, 0);
      const net = inc - exp;

      document.getElementById('dash-income').innerText = formatRupiah(inc);
      document.getElementById('dash-expense').innerText = formatRupiah(exp);
      document.getElementById('dash-net').innerText = formatRupiah(net);
      document.getElementById('dash-savings').innerText = formatRupiah(appData.savingsBalance || 0);
      const goldGram = appData.goldPurchases.reduce((s, g) => s + g.gram, 0);
      const goldVal = goldGram * (appData.goldPrice?.hargaPerGram || 0);
      document.getElementById('dash-gold').innerText = formatRupiah(goldVal);

      // Render Charts & Tables
      renderChart(inc, exp, Math.max(0, net));
      renderRecentTransactions();
      renderIncomeTab();
      renderExpenseTab();
      renderCategoriesTab(monthlyTx);
      renderAnalytics(monthlyTx, inc, exp, m, y);
    }

    function renderChart(inc, exp, net) {
      const ctx = document.getElementById('dashChart');
      if (!ctx) return;
      if (chartInstance) chartInstance.destroy();
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: { labels: ['Pemasukan', 'Pengeluaran', 'Sisa'], datasets: [{ data: [inc, exp, net], backgroundColor: ['#10b981', '#f43f5e', '#3b82f6'], borderRadius: 6 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
      });
    }

    function renderRecentTransactions() {
      const recent = [...appData.transactions].sort((a,b) => new Date(b.tanggal) - new Date(a.tanggal)).slice(0, 5);
      const container = document.getElementById('dash-recent-list');
      container.innerHTML = recent.map(tx => {
        const cat = appData.categories.find(c => c.id === tx.categoryId) || { nama: 'Lainnya', warna: '#64748b' };
        const isInc = tx.tipe === 'income';
        return \`<div class="py-2.5 flex items-center justify-between text-xs">
          <div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full" style="background-color: \${cat.warna}"></span><span class="font-medium">\${cat.nama}</span></div>
          <span class="font-bold \${isInc ? 'text-emerald-600' : 'text-rose-600'}">\${isInc ? '+' : '-'}\${formatRupiah(tx.nominal)}</span>
        </div>\`;
      }).join('');
    }

    function renderIncomeTab() {
      const tbody = document.getElementById('income-table-body');
      tbody.innerHTML = appData.transactions.filter(t => t.tipe === 'income').map(tx => \`<tr class="hover:bg-slate-50"><td class="p-3">\${tx.tanggal}</td><td class="p-3 font-semibold text-slate-800">+\${formatRupiah(tx.nominal)}</td><td class="p-3">\${tx.catatan || '-'}</td><td class="p-3 text-right"><button onclick="deleteTx('\${tx.id}')" class="text-xs text-rose-600">Hapus</button></td></tr>\`).join('');
    }

    function renderExpenseTab() {
      const tbody = document.getElementById('expense-table-body');
      tbody.innerHTML = appData.transactions.filter(t => t.tipe === 'expense').map(tx => \`<tr class="hover:bg-slate-50"><td class="p-3">\${tx.tanggal}</td><td class="p-3 font-semibold text-rose-600">-\${formatRupiah(tx.nominal)}</td><td class="p-3">\${tx.catatan || '-'}</td><td class="p-3 text-right"><button onclick="deleteTx('\${tx.id}')" class="text-xs text-rose-600">Hapus</button></td></tr>\`).join('');
    }

    function renderCategoriesTab(monthlyTx) {
      const grid = document.getElementById('categories-grid');
      grid.innerHTML = appData.categories.filter(c => c.tipe === 'expense').map(c => \`<div class="bg-white p-3 rounded-lg border text-xs"><div class="flex justify-between font-bold"><span>\${c.nama}</span><span>\${c.batasAnggaran ? formatRupiah(c.batasAnggaran) : 'Tanpa limit'}</span></div></div>\`).join('');
    }

    function renderAnalytics(monthlyTx, inc, exp, m, y) {
      const sRate = inc > 0 ? Math.round(((inc - exp) / inc) * 100) : 0;
      document.getElementById('ana-savings-rate').innerText = sRate + '%';
      document.getElementById('ana-daily-avg').innerText = formatRupiah(Math.round(exp / 30));
    }

    function openTxModal(type) {
      document.getElementById('tx-modal').classList.remove('hidden');
      document.getElementById('tx-type').value = type;
      document.getElementById('tx-category').innerHTML = appData.categories.filter(c => c.tipe === type).map(c => \`<option value="\${c.id}">\${c.nama}</option>\`).join('');
    }
    function closeTxModal() { document.getElementById('tx-modal').classList.add('hidden'); }

    function handleTxSubmit(e) {
      e.preventDefault();
      const type = document.getElementById('tx-type').value;
      const nominal = parseInt(document.getElementById('tx-nominal').value);
      const catId = document.getElementById('tx-category').value;
      const date = document.getElementById('tx-date').value;
      const note = document.getElementById('tx-note').value;
      appData.transactions.push({ id: 'tx_' + Date.now(), tipe: type, nominal, categoryId: catId, tanggal: date, catatan: note });
      saveData();
      closeTxModal();
      renderAll();
    }

    function deleteTx(id) {
      if (confirm('Hapus transaksi?')) {
        appData.transactions = appData.transactions.filter(t => t.id !== id);
        saveData();
        renderAll();
      }
    }

    window.onload = function() {
      const now = new Date();
      document.getElementById('select-month').value = now.getMonth() + 1;
      document.getElementById('select-year').value = now.getFullYear();
      checkAuth();
    };
  </script>
</body>
</html>`;
}
