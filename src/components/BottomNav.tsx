import React from 'react';
import { 
  LayoutDashboard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Tags, 
  MoreHorizontal 
} from 'lucide-react';
import { ActiveTab } from '../types/finance';

interface BottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenMore: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, onOpenMore }) => {
  const isMoreActive = ['analytics', 'gold', 'savings', 'settings'].includes(activeTab);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] rounded-lg transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-600 font-medium' : 'text-slate-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('income')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] rounded-lg transition-colors ${
            activeTab === 'income' ? 'text-emerald-600 font-medium' : 'text-slate-500'
          }`}
        >
          <ArrowDownLeft className="w-5 h-5 mb-0.5 text-emerald-500" />
          <span className="text-[10px]">Pemasukan</span>
        </button>

        <button
          onClick={() => setActiveTab('expense')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[60px] rounded-lg transition-colors ${
            activeTab === 'expense' ? 'text-rose-600 font-medium' : 'text-slate-500'
          }`}
        >
          <ArrowUpRight className="w-5 h-5 mb-0.5 text-rose-500" />
          <span className="text-[10px]">Pengeluaran</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[55px] rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'text-emerald-600 font-medium' : 'text-slate-500'
          }`}
        >
          <span className="text-base leading-none mb-0.5">📈</span>
          <span className="text-[10px]">Analisis</span>
        </button>

        <button
          onClick={onOpenMore}
          className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[55px] rounded-lg transition-colors ${
            isMoreActive ? 'text-emerald-600 font-medium' : 'text-slate-500'
          }`}
        >
          <MoreHorizontal className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </nav>
  );
};
