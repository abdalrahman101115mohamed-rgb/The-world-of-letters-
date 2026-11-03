import React, { useState } from 'react';
import { ARABIC_LETTERS } from '../data/curriculum';
import { LetterInfo } from '../types';
import { AudioButton } from './AudioButton';
import { Search, Star, Sparkles, AlertCircle, PenTool } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface AlphabetGridProps {
  completedLetters: string[];
  mistakeLetters: string[];
  onSelectLetter: (letter: LetterInfo) => void;
  onOpenTracing: (letter: LetterInfo) => void;
}

export const AlphabetGrid: React.FC<AlphabetGridProps> = ({
  completedLetters,
  mistakeLetters,
  onSelectLetter,
  onOpenTracing,
}) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'needsReview'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLetters = ARABIC_LETTERS.filter((letter) => {
    // Search query matching letter or name
    const matchesSearch =
      letter.letter.includes(searchQuery) ||
      letter.name.includes(searchQuery) ||
      letter.exampleWord.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filter === 'completed') {
      return completedLetters.includes(letter.letter);
    }
    if (filter === 'needsReview') {
      return mistakeLetters.includes(letter.letter);
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-3.5 rounded-3xl border border-indigo-100 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => { playPopSound(); setFilter('all'); }}
            className={`cartoon-btn px-4 py-2 rounded-2xl text-xs font-black transition ${
              filter === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            جميع الحروف ({ARABIC_LETTERS.length})
          </button>

          <button
            onClick={() => { playPopSound(); setFilter('completed'); }}
            className={`cartoon-btn px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
              filter === 'completed'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            الحروف المتقنة ({completedLetters.length})
          </button>

          {mistakeLetters.length > 0 && (
            <button
              onClick={() => { playPopSound(); setFilter('needsReview'); }}
              className={`cartoon-btn px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-1.5 ${
                filter === 'needsReview'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              تحتاج مراجعة ({mistakeLetters.length})
            </button>
          )}
        </div>

        {/* Quick Search */}
        <div className="relative w-full sm:w-56">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن حرف أو كلمة..."
            className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Grid of Alphabet Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-3 sm:gap-4">
        {filteredLetters.map((letter) => {
          const isDone = completedLetters.includes(letter.letter);
          const needsReview = mistakeLetters.includes(letter.letter);

          return (
            <div
              key={letter.id}
              onClick={() => { playPopSound(); onSelectLetter(letter); }}
              className={`cartoon-card group relative bg-white rounded-3xl p-3.5 border-2 transition-all duration-200 cursor-pointer hover:-translate-y-1 hover:shadow-lg flex flex-col items-center justify-between min-h-[160px] ${
                isDone
                  ? 'border-amber-300 ring-2 ring-amber-100'
                  : needsReview
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-indigo-100 hover:border-indigo-300'
              }`}
            >
              {/* Badges on card top */}
              <div className="w-full flex items-center justify-between">
                <span className="text-xl">{letter.exampleEmoji}</span>
                {isDone ? (
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-black shadow-xs">
                    ⭐
                  </span>
                ) : needsReview ? (
                  <span className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-black shadow-xs" title="تحتاج تدريب">
                    !
                  </span>
                ) : (
                  <span className="w-2 h-2 rounded-full bg-indigo-200" />
                )}
              </div>

              {/* Main Arabic Letter Display */}
              <div className="my-1 text-center">
                <span className="text-5xl font-black text-slate-800 group-hover:scale-110 transition-transform font-['Baloo_Bhaijaan_2'] block">
                  {letter.letter}
                </span>
                <span className="text-xs font-bold text-indigo-600 block mt-0.5">
                  {letter.name}
                </span>
              </div>

              {/* Card Footer Quick Actions */}
              <div className="w-full flex items-center justify-between pt-2 border-t border-slate-100 gap-1.5">
                <AudioButton
                  textToSpeak={`حَرْفُ ${letter.name}. ${letter.letter}`}
                  size="sm"
                  className="w-8 h-8 rounded-xl"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playPopSound();
                    onOpenTracing(letter);
                  }}
                  title="ارسم الحرف"
                  className="cartoon-btn w-8 h-8 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 flex items-center justify-center text-xs font-bold"
                >
                  <PenTool className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLetters.length === 0 && (
        <div className="text-center py-12 bg-white/70 rounded-3xl p-6 border border-dashed border-indigo-200">
          <span className="text-5xl block mb-2">🔍</span>
          <h4 className="text-lg font-bold text-slate-700">لم نجد حروفاً تطابق بحثك!</h4>
          <p className="text-xs text-slate-500 mt-1">جرب البحث بحرف آخر أو قم بإلغاء الفلتر.</p>
        </div>
      )}
    </div>
  );
};
