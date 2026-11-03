import React, { useState, useEffect } from 'react';
import { ARABIC_LETTERS } from '../data/curriculum';
import { LetterInfo } from '../types';
import { Volume2, Trophy, Star, Sparkles } from 'lucide-react';
import { playPopSound, playSuccessSound, playOopsSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer, speakRetry } from '../utils/speech';

type HarakahType = 'fatha' | 'damma' | 'kasra' | 'sukun';

interface HarakahOption {
  type: HarakahType;
  name: string;
  symbol: string;
  color: string;
}

const HARAKAT_LIST: HarakahOption[] = [
  { type: 'fatha', name: 'الفَتْحَة', symbol: 'َ', color: 'from-pink-400 to-rose-500' },
  { type: 'damma', name: 'الضَّمَّة', symbol: 'ُ', color: 'from-blue-400 to-indigo-500' },
  { type: 'kasra', name: 'الكَسْرَة', symbol: 'ِ', color: 'from-emerald-400 to-teal-600' },
  { type: 'sukun', name: 'السُّكُون', symbol: 'ْ', color: 'from-purple-400 to-violet-600' },
];

interface GameHarakatChallengeProps {
  onGameComplete: (starsEarned: number) => void;
}

export const GameHarakatChallenge: React.FC<GameHarakatChallengeProps> = ({ onGameComplete }) => {
  const [round, setRound] = useState(0);
  const [targetLetter, setTargetLetter] = useState<LetterInfo>(ARABIC_LETTERS[0]);
  const [targetHarakah, setTargetHarakah] = useState<HarakahType>('fatha');
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedType, setSelectedType] = useState<HarakahType | null>(null);
  const [score, setScore] = useState(0);
  const totalRounds = 5;

  const initRound = (rIdx: number) => {
    setSelectedType(null);
    setFeedback(null);

    // Pick random letter and random harakah
    const letter = ARABIC_LETTERS[Math.floor(Math.random() * ARABIC_LETTERS.length)];
    const types: HarakahType[] = ['fatha', 'damma', 'kasra', 'sukun'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    setTargetLetter(letter);
    setTargetHarakah(chosenType);

    const soundItem = letter.harakat[chosenType];
    const harakahObj = HARAKAT_LIST.find((h) => h.type === chosenType)!;

    // Speak the target sound
    speakArabic(`${soundItem.text}... ما هِيَ الحَرَكَةُ الَّتِي تَسْمَعُها؟`, { rate: 0.85 });
  };

  useEffect(() => {
    initRound(0);
  }, []);

  const handlePickHarakah = (option: HarakahOption) => {
    if (feedback !== null) return;
    setSelectedType(option.type);
    playPopSound();

    if (option.type === targetHarakah) {
      setFeedback('correct');
      playSuccessSound();
      playStarSound();
      setScore((prev) => prev + 1);

      const harakahObj = HARAKAT_LIST.find((h) => h.type === targetHarakah)!;
      speakArabic(`صَحِيح! إِنَّهَا ${harakahObj.name}!`, {
        rate: 0.9,
        onEnd: () => {
          setTimeout(() => {
            if (round + 1 >= totalRounds) {
              onGameComplete(score + 1);
            } else {
              setRound((prev) => prev + 1);
              initRound(round + 1);
            }
          }, 800);
        },
      });
    } else {
      setFeedback('wrong');
      playOopsSound();
      speakRetry(() => {
        setTimeout(() => {
          setFeedback(null);
          setSelectedType(null);
        }, 1100);
      });
    }
  };

  const handleReplay = () => {
    playPopSound();
    const soundItem = targetLetter.harakat[targetHarakah];
    speakArabic(`${soundItem.text}... ${soundItem.example}`, { rate: 0.85 });
  };

  const currentSoundItem = targetLetter.harakat[targetHarakah];

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-indigo-200 space-y-6 text-center">
      {/* Header */}
      <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
        <span className="text-xs font-black text-indigo-700 bg-white px-3 py-1 rounded-xl shadow-xs">
          ⚡ تحدي حركات الحروف
        </span>

        <span className="text-xs font-bold text-slate-600">
          السؤال: {round + 1} / {totalRounds}
        </span>

        <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1 rounded-xl text-xs font-black">
          <Trophy className="w-4 h-4" />
          <span>{score} نجوم</span>
        </div>
      </div>

      {/* Target Sound Display */}
      <div className="space-y-4 py-2">
        <h3 className="text-xl font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
          مَا هِيَ الحَرَكَةُ المَوْجُودَةُ فَوْقَ أَوْ تَحْتَ الحَرْف؟
        </h3>

        {/* Big Letter Card with Harakah */}
        <div className="inline-flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl border-2 border-indigo-200 shadow-inner">
          <span className="text-7xl font-black text-indigo-900 font-['Baloo_Bhaijaan_2'] animate-float">
            {currentSoundItem.text}
          </span>
          <span className="text-sm font-bold text-slate-600 mt-2">
            مِثْلَ: {currentSoundItem.example} {currentSoundItem.emoji}
          </span>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleReplay}
            className="cartoon-btn px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black text-sm shadow-md flex items-center gap-2 hover:brightness-105"
          >
            <Volume2 className="w-5 h-5 animate-bounce" />
            اسْتَمِعْ لِصَوْتِ الحَرْف
          </button>
        </div>
      </div>

      {/* 4 Harakat Choices */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {HARAKAT_LIST.map((h) => {
          const isSelected = selectedType === h.type;
          const isTarget = h.type === targetHarakah;

          let btnStyle = 'border-slate-200 bg-white hover:border-indigo-300 hover:scale-105';
          if (feedback === 'correct' && isTarget) {
            btnStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-105';
          } else if (feedback === 'wrong' && isSelected) {
            btnStyle = 'border-rose-500 bg-rose-50 ring-4 ring-rose-200 animate-wiggle';
          }

          return (
            <button
              key={h.type}
              onClick={() => handlePickHarakah(h)}
              className={`cartoon-btn rounded-3xl p-4 border-4 flex items-center justify-between shadow-sm cursor-pointer transition-all ${btnStyle}`}
            >
              <div className="text-right">
                <span className="text-base font-black text-slate-800 block font-['Baloo_Bhaijaan_2']">
                  {h.name}
                </span>
                <span className="text-xs text-slate-500 font-bold">حركة {h.symbol}</span>
              </div>

              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${h.color} text-white font-black text-2xl flex items-center justify-center shadow-xs font-['Baloo_Bhaijaan_2']`}
              >
                {h.symbol}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
