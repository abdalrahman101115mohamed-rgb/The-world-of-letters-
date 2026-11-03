import React, { useState, useEffect } from 'react';
import { DICTATION_ITEMS, DictationItem } from '../data/curriculum';
import { AudioButton } from './AudioButton';
import { Trophy, Sparkles, Volume2, HelpCircle, CheckCircle2 } from 'lucide-react';
import { playPopSound, playSuccessSound, playOopsSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer, speakRetry } from '../utils/speech';

interface GameSpellingDictationProps {
  onGameComplete: (starsEarned: number) => void;
}

export const GameSpellingDictation: React.FC<GameSpellingDictationProps> = ({ onGameComplete }) => {
  const [index, setIndex] = useState(0);
  const [currentItem, setCurrentItem] = useState<DictationItem>(DICTATION_ITEMS[0]);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const totalRounds = DICTATION_ITEMS.length;

  const initItem = (idx: number) => {
    setSelectedLetter(null);
    setFeedback(null);
    const item = DICTATION_ITEMS[idx % DICTATION_ITEMS.length];
    setCurrentItem(item);

    // Speak prompt
    speakArabic(`اسْتَمِعْ لِكَلِمَةِ ${item.word}... وَاخْتَرْ الحَرْفَ الصَّحِيحَ النَّاقِص`, { rate: 0.85 });
  };

  useEffect(() => {
    initItem(0);
  }, []);

  const handlePickOption = (letter: string) => {
    if (feedback !== null) return;
    setSelectedLetter(letter);
    playPopSound();

    const isCorrect = currentItem.word.includes(letter.replace('ـ', ''));

    if (isCorrect) {
      setFeedback('correct');
      playSuccessSound();
      playStarSound();
      setScore((prev) => prev + 2);

      speakCheer(() => {
        setTimeout(() => {
          if (index + 1 >= totalRounds) {
            onGameComplete(score + 2);
          } else {
            setIndex((prev) => prev + 1);
            initItem(index + 1);
          }
        }, 800);
      });
    } else {
      setFeedback('wrong');
      playOopsSound();
      speakRetry(() => {
        setTimeout(() => {
          setFeedback(null);
          setSelectedLetter(null);
        }, 1100);
      });
    }
  };

  const handleReplay = () => {
    playPopSound();
    speakArabic(`كَلِمَةُ ${currentItem.word}`, { rate: 0.85 });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-indigo-200 space-y-6 text-center">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
        <span className="text-xs font-black text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-xs">
          ✍️ مُخْتَبَرُ الإِمْلَاءِ الذَّكِيّ
        </span>

        <span className="text-xs font-bold text-slate-600">
          التحدي: {index + 1} / {totalRounds}
        </span>

        <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1 rounded-xl text-xs font-black">
          <Trophy className="w-4 h-4" />
          <span>{score} نجوم</span>
        </div>
      </div>

      {/* Clue and Audio prompt */}
      <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-3xl border border-purple-100 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-5xl">{currentItem.emoji}</span>
          <div className="text-right">
            <span className="text-xs font-bold text-purple-700">تلميح ذكي:</span>
            <p className="text-sm font-black text-slate-800">{currentItem.clue}</p>
          </div>
        </div>

        {/* Word Display with Missing Blank */}
        <div className="py-2">
          <div className="text-4xl sm:text-5xl font-black text-indigo-950 tracking-wide font-['Baloo_Bhaijaan_2']" dir="rtl">
            {feedback === 'correct' ? currentItem.word : currentItem.displayText}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReplay}
            className="cartoon-btn px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-sm shadow-md flex items-center gap-2 hover:brightness-105"
          >
            <Volume2 className="w-5 h-5 animate-bounce" />
            اسْتَمِعْ لِلْكَلِمَةِ بِوُضُوح
          </button>
        </div>
      </div>

      {/* Candidate Letters */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 text-right pr-2">
          اخْتَرْ الحَرْفَ الصَّحِيح لِمِلْءِ الفَرَاغ:
        </div>
        <div className="grid grid-cols-3 gap-3">
          {currentItem.options.map((opt, i) => {
            const isSelected = selectedLetter === opt;
            const isCorrect = currentItem.word.includes(opt.replace('ـ', ''));

            let btnStyle = 'border-slate-200 bg-white hover:border-indigo-400 hover:scale-105';
            if (feedback === 'correct' && isCorrect) {
              btnStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105';
            } else if (feedback === 'wrong' && isSelected) {
              btnStyle = 'border-rose-500 bg-rose-50 ring-4 ring-rose-200 animate-wiggle';
            }

            return (
              <button
                key={i}
                onClick={() => handlePickOption(opt)}
                className={`cartoon-btn rounded-3xl py-4 px-2 border-4 flex flex-col items-center justify-center min-h-[90px] shadow-sm transition-all cursor-pointer ${btnStyle}`}
              >
                <span className="text-4xl font-black text-indigo-950 font-['Baloo_Bhaijaan_2']">
                  {opt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper Note */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
        <span className="text-2xl">🐵</span>
        <span>ميز بين الحروف المتقاربة في الصوت مثل السين والصاد والتاء والطاء!</span>
      </div>
    </div>
  );
};
