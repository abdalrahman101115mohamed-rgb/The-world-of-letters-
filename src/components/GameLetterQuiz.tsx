import React, { useState, useEffect } from 'react';
import { ARABIC_LETTERS } from '../data/curriculum';
import { LetterInfo } from '../types';
import { AudioButton } from './AudioButton';
import { RotateCcw, Sparkles, Volume2, Heart, Award } from 'lucide-react';
import { playPopSound, playSuccessSound, playOopsSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer, speakRetry } from '../utils/speech';

interface GameLetterQuizProps {
  onGameComplete: (starsEarned: number) => void;
  onRecordMistake?: (letter: string) => void;
  onLetterLearned?: (letter: string) => void;
  initialTargetLetter?: LetterInfo;
}

export const GameLetterQuiz: React.FC<GameLetterQuizProps> = ({
  onGameComplete,
  onRecordMistake,
  onLetterLearned,
  initialTargetLetter,
}) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [targetLetter, setTargetLetter] = useState<LetterInfo>(
    initialTargetLetter || ARABIC_LETTERS[0]
  );
  const [options, setOptions] = useState<LetterInfo[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const totalRounds = 5;

  // Generate question round
  const setupRound = (roundIdx: number) => {
    setSelectedOption(null);
    setFeedback(null);

    // Pick target letter
    let target: LetterInfo;
    if (roundIdx === 0 && initialTargetLetter) {
      target = initialTargetLetter;
    } else {
      const randomIdx = Math.floor(Math.random() * ARABIC_LETTERS.length);
      target = ARABIC_LETTERS[randomIdx];
    }
    setTargetLetter(target);

    // Pick 3 random distractor letters
    const distractors = ARABIC_LETTERS.filter((l) => l.letter !== target.letter)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const shuffled = [target, ...distractors].sort(() => Math.random() - 0.5);
    setOptions(shuffled);

    // Prompt child with voice
    const questionText = `أَيْنَ حَرْفُ ${target.name}؟`;
    speakArabic(questionText, { rate: 0.85 });
  };

  useEffect(() => {
    setupRound(0);
  }, []);

  const handleSelect = (chosen: LetterInfo) => {
    if (feedback !== null) return; // Wait for round transition
    setSelectedOption(chosen.letter);
    playPopSound();

    if (chosen.letter === targetLetter.letter) {
      // Correct!
      setFeedback('correct');
      playSuccessSound();
      playStarSound();
      setScore((prev) => prev + 1);
      if (onLetterLearned) onLetterLearned(chosen.letter);

      speakCheer(() => {
        setTimeout(() => {
          if (currentRound + 1 >= totalRounds) {
            onGameComplete(score + 1);
          } else {
            setCurrentRound((prev) => prev + 1);
            setupRound(currentRound + 1);
          }
        }, 800);
      });
    } else {
      // Wrong!
      setFeedback('wrong');
      playOopsSound();
      setLives((prev) => Math.max(0, prev - 1));
      if (onRecordMistake) onRecordMistake(targetLetter.letter);

      speakRetry(() => {
        setTimeout(() => {
          setFeedback(null);
          setSelectedOption(null);
        }, 1200);
      });
    }
  };

  const handleReplayPrompt = () => {
    playPopSound();
    speakArabic(`أَيْنَ حَرْفُ ${targetLetter.name}؟ ... ${targetLetter.letter}`, { rate: 0.85 });
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl p-6 shadow-xl border-4 border-indigo-200 space-y-6 text-center">
      {/* Top Game Bar */}
      <div className="flex items-center justify-between bg-indigo-50/80 p-3 rounded-2xl border border-indigo-100">
        <div className="flex items-center gap-1.5">
          {[...Array(3)].map((_, i) => (
            <Heart
              key={i}
              className={`w-6 h-6 transition-transform ${
                i < lives ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-slate-300 fill-slate-200'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-700">الجولة:</span>
          <span className="text-sm font-black text-indigo-950">
            {currentRound + 1} / {totalRounds}
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1 rounded-xl text-xs font-black shadow-xs">
          <Award className="w-4 h-4" />
          <span>{score} نجوم</span>
        </div>
      </div>

      {/* Target Question Box */}
      <div className="space-y-3 py-2">
        <span className="text-xs font-extrabold text-indigo-600 bg-indigo-100/70 px-3 py-1 rounded-full uppercase tracking-wider">
          لعبة اختيار الحرف الصحيح
        </span>

        <h3 className="text-2xl font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
          اسْتَمِعْ وَاخْتَرْ حَرْفَ ({targetLetter.name})
        </h3>

        {/* Big Audio Replay Button */}
        <div className="flex justify-center">
          <button
            onClick={handleReplayPrompt}
            className="cartoon-btn px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-base shadow-md flex items-center gap-2 hover:brightness-105"
          >
            <Volume2 className="w-6 h-6 animate-bounce" />
            أَعِدْ سَمَاعَ الحَرْف
          </button>
        </div>
      </div>

      {/* 4 Floating Letter Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {options.map((option) => {
          const isSelected = selectedOption === option.letter;
          const isTarget = option.letter === targetLetter.letter;

          let cardStyle = 'border-indigo-200 bg-white hover:border-indigo-400 hover:scale-105';
          if (feedback === 'correct' && isTarget) {
            cardStyle = 'border-emerald-500 bg-emerald-50 ring-4 ring-emerald-300 scale-110';
          } else if (feedback === 'wrong' && isSelected) {
            cardStyle = 'border-rose-500 bg-rose-50 ring-4 ring-rose-200 animate-wiggle';
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={`cartoon-btn rounded-3xl p-5 border-4 transition-all duration-150 flex flex-col items-center justify-center min-h-[120px] shadow-md cursor-pointer ${cardStyle}`}
            >
              <span className="text-5xl font-black text-slate-800 font-['Baloo_Bhaijaan_2'] mb-1">
                {option.letter}
              </span>
              <span className="text-xs font-bold text-slate-500">{option.name}</span>
            </button>
          );
        })}
      </div>

      {/* Encouragement Mascot hint */}
      <div className="pt-2 flex items-center justify-center gap-2 text-xs font-bold text-slate-500">
        <span className="text-2xl">🐰</span>
        <span>ركز جيداً يا بطل، يمكنك الضغط على زر الاستماع في أي وقت!</span>
      </div>
    </div>
  );
};
