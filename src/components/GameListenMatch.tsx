import React, { useState, useEffect } from 'react';
import { ARABIC_LETTERS } from '../data/curriculum';
import { LetterInfo } from '../types';
import { AudioButton } from './AudioButton';
import { Volume2, Trophy, Star, Sparkles } from 'lucide-react';
import { playPopSound, playSuccessSound, playOopsSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer, speakRetry } from '../utils/speech';

interface GameListenMatchProps {
  onGameComplete: (starsEarned: number) => void;
}

export const GameListenMatch: React.FC<GameListenMatchProps> = ({ onGameComplete }) => {
  const [round, setRound] = useState(0);
  const [targetItem, setTargetItem] = useState<LetterInfo>(ARABIC_LETTERS[0]);
  const [options, setOptions] = useState<LetterInfo[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const totalRounds = 5;

  const initRound = (rIndex: number) => {
    setSelectedId(null);
    setFeedback(null);

    // Pick a random target letter that has clear exampleWord and exampleEmoji
    const target = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
    setTargetItem(target);

    // Pick 3 distractors
    const distractors = ARABIC_LETTERS.filter((l) => l.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const shuffled = [target, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    // Pronounce the word
    speakArabic(`أَيْنَ صُورَةُ: ${target.exampleWord}؟`, { rate: 0.85 });
  };

  useEffect(() => {
    initRound(0);
  }, []);

  const handleChoose = (item: LetterInfo) => {
    if (feedback !== null) return;
    setSelectedId(item.id);
    playPopSound();

    if (item.id === targetItem.id) {
      setFeedback('correct');
      playSuccessSound();
      playStarSound();
      setScore((prev) => prev + 1);

      speakCheer(() => {
        setTimeout(() => {
          if (round + 1 >= totalRounds) {
            onGameComplete(score + 1);
          } else {
            setRound((prev) => prev + 1);
            initRound(round + 1);
          }
        }, 800);
      });
    } else {
      setFeedback('wrong');
      playOopsSound();
      speakRetry(() => {
        setTimeout(() => {
          setFeedback(null);
          setSelectedId(null);
        }, 1100);
      });
    }
  };

  const handleReplayPrompt = () => {
    playPopSound();
    speakArabic(`أَيْنَ صُورَةُ: ${targetItem.exampleWord}؟`, { rate: 0.85 });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-indigo-200 space-y-6 text-center">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
        <span className="text-xs font-black text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-xs">
          🎧 اسْتَمِعْ وَاخْتَرْ الصُّورَة
        </span>

        <span className="text-xs font-bold text-slate-600">
          السؤال: {round + 1} / {totalRounds}
        </span>

        <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1 rounded-xl text-xs font-black">
          <Trophy className="w-4 h-4" />
          <span>{score} نجوم</span>
        </div>
      </div>

      {/* Audio Playbox */}
      <div className="space-y-3 py-2">
        <h3 className="text-2xl font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
          اسْتَمِعْ إِلَى الكَلِمَةِ وَاضْغَطْ عَلَى الصُّورَةِ المُنَاسِبَة:
        </h3>

        <div className="flex justify-center">
          <button
            onClick={handleReplayPrompt}
            className="cartoon-btn px-6 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-black text-base shadow-md flex items-center gap-2 hover:brightness-105"
          >
            <Volume2 className="w-6 h-6 animate-bounce" />
            اسْتَمِعْ لِلْكَلِمَةِ مَرَّةً أُخْرَى
          </button>
        </div>
      </div>

      {/* 4 Picture Cards */}
      <div className="grid grid-cols-2 gap-4">
        {options.map((item) => {
          const isSelected = selectedId === item.id;
          const isTarget = item.id === targetItem.id;

          let cardStyle = 'border-indigo-100 bg-white hover:border-indigo-300 hover:scale-105';
          if (feedback === 'correct' && isTarget) {
            cardStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105';
          } else if (feedback === 'wrong' && isSelected) {
            cardStyle = 'border-rose-500 bg-rose-50 ring-4 ring-rose-200 animate-wiggle';
          }

          return (
            <button
              key={item.id}
              onClick={() => handleChoose(item)}
              className={`cartoon-btn rounded-3xl p-6 border-4 flex flex-col items-center justify-center min-h-[140px] shadow-sm cursor-pointer transition-all duration-150 ${cardStyle}`}
            >
              <span className="text-6xl mb-2 animate-float">{item.exampleEmoji}</span>
              <span className="text-base font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
                {item.exampleWord}
              </span>
            </button>
          );
        })}
      </div>

      {/* Cheerful Mascot Prompt */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
        <span className="text-2xl">🐘</span>
        <span>فرفور يستمع معك ويشجعك لاختيار الصورة الصحيحة!</span>
      </div>
    </div>
  );
};
