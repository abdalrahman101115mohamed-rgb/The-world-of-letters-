import React, { useState, useEffect } from 'react';
import { WORD_PUZZLES, WordPuzzleItem } from '../data/curriculum';
import { AudioButton } from './AudioButton';
import { RotateCcw, Sparkles, Volume2, Trophy, HelpCircle } from 'lucide-react';
import { playPopSound, playSuccessSound, playOopsSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer } from '../utils/speech';

interface GameWordBuilderProps {
  onGameComplete: (starsEarned: number) => void;
}

export const GameWordBuilder: React.FC<GameWordBuilderProps> = ({ onGameComplete }) => {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<WordPuzzleItem>(WORD_PUZZLES[0]);
  const [scrambledPool, setScrambledPool] = useState<{ id: string; letter: string }[]>([]);
  const [placedSlots, setPlacedSlots] = useState<(string | null)[]>([]);
  const [isWordComplete, setIsWordComplete] = useState(false);
  const [score, setScore] = useState(0);

  const initPuzzle = (idx: number) => {
    const puzzle = WORD_PUZZLES[idx % WORD_PUZZLES.length];
    setCurrentPuzzle(puzzle);
    setIsWordComplete(false);

    // Initialize empty slots
    setPlacedSlots(new Array(puzzle.letters.length).fill(null));

    // Scramble letters pool with unique IDs so duplicates don't conflict
    const pool = puzzle.letters.map((letter, i) => ({
      id: `${letter}-${i}-${Math.random()}`,
      letter,
    })).sort(() => Math.random() - 0.5);

    setScrambledPool(pool);

    // Speak word
    speakArabic(`كَوِّْنْ كَلِمَةَ ${puzzle.audioPronunciation}`, { rate: 0.85 });
  };

  useEffect(() => {
    initPuzzle(0);
  }, []);

  const handlePickLetter = (item: { id: string; letter: string }) => {
    if (isWordComplete) return;
    playPopSound();

    // Find first empty slot
    const emptyIndex = placedSlots.findIndex((slot) => slot === null);
    if (emptyIndex === -1) return;

    const newPlaced = [...placedSlots];
    newPlaced[emptyIndex] = item.letter;
    setPlacedSlots(newPlaced);

    // Remove from pool
    setScrambledPool((prev) => prev.filter((p) => p.id !== item.id));

    // Check if full
    if (emptyIndex === currentPuzzle.letters.length - 1) {
      checkCompletedWord(newPlaced);
    }
  };

  const handleRemoveFromSlot = (slotIdx: number) => {
    if (isWordComplete) return;
    const letter = placedSlots[slotIdx];
    if (!letter) return;

    playPopSound();
    const newPlaced = [...placedSlots];
    newPlaced[slotIdx] = null;
    setPlacedSlots(newPlaced);

    // Add back to pool
    setScrambledPool((prev) => [...prev, { id: `${letter}-${Math.random()}`, letter }]);
  };

  const checkCompletedWord = (slots: (string | null)[]) => {
    const assembled = slots.join('');
    const target = currentPuzzle.letters.join('');

    if (assembled === target) {
      // Success!
      setIsWordComplete(true);
      playSuccessSound();
      playStarSound();
      setScore((prev) => prev + 2);

      speakArabic(`مُمْتَاز! كَلِمَةُ ${currentPuzzle.audioPronunciation}`, {
        rate: 0.85,
        onEnd: () => {
          setTimeout(() => {
            if (puzzleIndex + 1 >= 5) {
              onGameComplete(score + 2);
            } else {
              setPuzzleIndex((prev) => prev + 1);
              initPuzzle(puzzleIndex + 1);
            }
          }, 1000);
        },
      });
    } else {
      // Mismatch
      playOopsSound();
      speakArabic('حاوِلْ تَرْتِيبَ الحُرُوفِ مَرَّةً أُخْرى!', { rate: 0.85 });
    }
  };

  const handleResetPuzzle = () => {
    playPopSound();
    initPuzzle(puzzleIndex);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-indigo-200 space-y-6 text-center">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
        <span className="text-xs font-black text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-xs">
          🧩 رتب الحروف لتكوين الكلمة
        </span>

        <span className="text-xs font-bold text-slate-600">
          الكلمة: {puzzleIndex + 1} / 5
        </span>

        <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1 rounded-xl text-xs font-black">
          <Trophy className="w-4 h-4" />
          <span>{score} نجوم</span>
        </div>
      </div>

      {/* Target Picture & Hint Box */}
      <div className="p-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl border border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-6xl animate-float">{currentPuzzle.emoji}</span>
          <div className="text-right">
            <h4 className="text-xl font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
              {currentPuzzle.hint}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              اضغط على الحروف بالترتيب الصحيح
            </p>
          </div>
        </div>

        <AudioButton
          textToSpeak={`كَلِمَةُ ${currentPuzzle.audioPronunciation}. ${currentPuzzle.hint}`}
          size="md"
        />
      </div>

      {/* Ordered Target Slots */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 text-right pr-2">
          مربعات الكلمة (اضغط على أي حرف لإعادته):
        </div>
        <div className="flex items-center justify-center gap-3 py-2 flex-wrap" dir="rtl">
          {placedSlots.map((letter, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveFromSlot(idx)}
              className={`cartoon-btn w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-3xl font-black transition-all ${
                letter
                  ? isWordComplete
                    ? 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-4 ring-emerald-200 scale-105'
                    : 'border-indigo-400 bg-indigo-50 text-indigo-950 shadow-md'
                  : 'border-dashed border-slate-300 bg-white/70 text-slate-300'
              }`}
            >
              {letter || idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Scrambled Letters Pool */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-bold text-slate-500 text-right pr-2">
          الحروف المتاحة (اضغط لاختيار الحرف):
        </div>
        <div className="flex items-center justify-center gap-3 py-1 flex-wrap min-h-[70px]">
          {scrambledPool.map((item) => (
            <button
              key={item.id}
              onClick={() => handlePickLetter(item)}
              className="cartoon-btn w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-amber-950 border-2 border-amber-300 text-2xl font-black shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition"
            >
              {item.letter}
            </button>
          ))}

          {scrambledPool.length === 0 && !isWordComplete && (
            <button
              onClick={handleResetPuzzle}
              className="cartoon-btn px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة ترتيب الحروف
            </button>
          )}
        </div>
      </div>

      {/* Bottom Status / Cheerful Message */}
      {isWordComplete && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 font-black text-base flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          رَائِعٌ جِدّاً! كَوَّنْتَ كَلِمَةَ ({currentPuzzle.displayWord})
        </div>
      )}
    </div>
  );
};
