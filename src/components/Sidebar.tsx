import React from 'react';
import { 
  LayoutDashboard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Tags, 
  PieChart, 
  Coins, 
  PiggyBank, 
  Settings,
  Sparkles,
  Download,
  LogOut,
  User
} from 'lucide-react';
import { ActiveTab } from '../types/finance';
import { UserProfile } from '../types/auth';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onDownloadHtml: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  onDownloadHtml,
  currentUser,
  onLogout
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard, stage: 'Tahap 1' },
    { id: 'income' as ActiveTab, label: 'Pemasukan', icon: ArrowDownLeft, stage: 'Tahap 1' },
    { id: 'expense' as ActiveTab, label: 'Pengeluaran', icon: ArrowUpRight, stage: 'Tahap 1' },
    { id: 'categories' as ActiveTab, label: 'Kategori & Budget', icon: Tags, stage: 'Tahap 1' },
    { id: 'analytics' as ActiveTab, label: 'Analisis & Grafik', icon: PieChart, stage: 'Tahap 2' },
    { id: 'gold' as ActiveTab, label: 'Tabungan Emas', icon: Coins, stage: 'Tahap 3' },
    { id: 'savings' as ActiveTab, label: 'Total Tabungan', icon: PiggyBank, stage: 'Tahap 3' },
    { id: 'settings' as ActiveTab, label: 'Pengaturan & Backup', icon: Settings, stage: 'Tahap 4' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
            D
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">DompetKu</h1>
            <p className="text-[11px] text-slate-500 mt-1">Keuangan Pribadi</p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
          Navigasi Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const isFinished = item.stage === 'Tahap 1' || item.stage === 'Tahap 2';

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {!isFinished && (
                <span className="text-[9px] px-1 py-0.2 rounded-xs bg-slate-100 text-slate-400 font-normal">
                  {item.stage}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Single HTML Export Card */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/70">
        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-800 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px]">Versi Mandiri (HTML)</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">
            Jalankan offline tanpa backend & server.
          </p>
          <button
            onClick={onDownloadHtml}
            className="w-full flex items-center justify-center gap-1.5 py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors text-[11px]"
          >
            <Download className="w-3 h-3" />
            <span>Unduh File .html</span>
          </button>
        </div>
      </div>

      {/* User Profile & Logout Widget */}
      {currentUser && (
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200">
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  currentUser.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                  {currentUser.name}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                    {currentUser.email}
                  </span>
                  <span className="text-[9px] px-1 rounded-xs bg-slate-100 text-slate-500 shrink-0 capitalize">
                    {currentUser.loginMethod}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
              title="Keluar / Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};
