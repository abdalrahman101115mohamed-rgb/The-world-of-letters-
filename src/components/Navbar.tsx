import React from 'react';
import { Star, Smartphone, Volume2, VolumeX, Sparkles, Trophy, Download } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface NavbarProps {
  currentTab: 'alphabet' | 'games' | 'stories' | 'progress';
  onSelectTab: (tab: 'alphabet' | 'games' | 'stories' | 'progress') => void;
  stars: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenInstallModal: () => void;
}

import { OfflineBadge } from './OfflineBadge';

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  stars,
  soundEnabled,
  onToggleSound,
  onOpenInstallModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-indigo-200 shadow-sm px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand Logo & Offline Indicator */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => { playPopSound(); onSelectTab('alphabet'); }}
            className="flex items-center gap-2 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform text-2xl">
              🐰
            </div>
            <div className="text-right">
              <h1 className="text-xl sm:text-2xl font-black text-indigo-900 font-['Baloo_Bhaijaan_2'] leading-none">
                عَالَمُ الحُرُوفِ
              </h1>
              <span className="text-[10px] sm:text-xs font-bold text-pink-500">
                تعليم القراءة والكتابة للأطفال
              </span>
            </div>
          </div>

          <div className="hidden lg:block">
            <OfflineBadge />
          </div>
        </div>

        {/* Navigation Tabs (Big & Colorful for kids) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => { playPopSound(); onSelectTab('alphabet'); }}
            className={`cartoon-btn px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              currentTab === 'alphabet'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔤 الحروف العربية
          </button>

          <button
            onClick={() => { playPopSound(); onSelectTab('games'); }}
            className={`cartoon-btn px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              currentTab === 'games'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎮 صالة الألعاب
          </button>

          <button
            onClick={() => { playPopSound(); onSelectTab('stories'); }}
            className={`cartoon-btn px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              currentTab === 'stories'
                ? 'bg-pink-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            📚 واحة القصص
          </button>

          <button
            onClick={() => { playPopSound(); onSelectTab('progress'); }}
            className={`cartoon-btn px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
              currentTab === 'progress'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏆 لوحة الإنجازات
          </button>
        </nav>

        {/* Action Controls & Stars */}
        <div className="flex items-center gap-2">
          <div className="block lg:hidden">
            <OfflineBadge />
          </div>

          {/* APK / PWA Install Button */}
          <button
            onClick={() => { playPopSound(); onOpenInstallModal(); }}
            className="cartoon-btn px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs shadow-md hover:brightness-105 flex items-center gap-1.5"
            title="تثبيت التطبيق على جهاز أندرويد"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">تثبيت التطبيق (APK)</span>
            <span className="sm:hidden">تثبيت</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => { playPopSound(); onToggleSound(); }}
            className={`w-10 h-10 rounded-2xl flex items-center justify-center transition shadow-xs ${
              soundEnabled ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' : 'bg-slate-100 text-slate-400'
            }`}
            title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          {/* Star Counter */}
          <div
            onClick={() => { playPopSound(); onSelectTab('progress'); }}
            className="cartoon-btn px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 font-black text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer hover:scale-105 transition"
            title="مجموع النجوم"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-300 stroke-amber-900" />
            <span>{stars}</span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around pt-2 mt-2 border-t border-slate-100 text-[11px] font-bold">
        <button
          onClick={() => { playPopSound(); onSelectTab('alphabet'); }}
          className={`flex-1 py-1 flex flex-col items-center gap-0.5 ${
            currentTab === 'alphabet' ? 'text-indigo-600 font-black' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">🔤</span>
          <span>الحروف</span>
        </button>

        <button
          onClick={() => { playPopSound(); onSelectTab('games'); }}
          className={`flex-1 py-1 flex flex-col items-center gap-0.5 ${
            currentTab === 'games' ? 'text-purple-600 font-black' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">🎮</span>
          <span>الألعاب</span>
        </button>

        <button
          onClick={() => { playPopSound(); onSelectTab('stories'); }}
          className={`flex-1 py-1 flex flex-col items-center gap-0.5 ${
            currentTab === 'stories' ? 'text-pink-600 font-black' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">📚</span>
          <span>القصص</span>
        </button>

        <button
          onClick={() => { playPopSound(); onSelectTab('progress'); }}
          className={`flex-1 py-1 flex flex-col items-center gap-0.5 ${
            currentTab === 'progress' ? 'text-amber-600 font-black' : 'text-slate-500'
          }`}
        >
          <span className="text-lg">🏆</span>
          <span>إنجازاتي</span>
        </button>
      </div>
    </header>
  );
};
