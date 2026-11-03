import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { playFanfareSound, playPopSound } from '../utils/soundEffects';
import { speakCheer } from '../utils/speech';

interface CelebrationModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  starsEarned: number;
  mascotEmoji?: string;
  onNext: () => void;
  onReplay?: () => void;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  isOpen,
  title,
  subtitle,
  starsEarned,
  mascotEmoji = '🐰',
  onNext,
  onReplay,
}) => {
  useEffect(() => {
    if (isOpen) {
      playFanfareSound();
      speakCheer();

      // Launch multi-burst confetti
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-3xl shadow-2xl border-4 border-amber-300 p-6 text-center space-y-4">
        {/* Floating Mascot & Crown */}
        <div className="relative inline-block mx-auto">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-yellow-500 p-2 shadow-xl flex items-center justify-center text-5xl animate-bounce">
            {mascotEmoji}
          </div>
          <span className="absolute -top-3 -right-2 text-3xl">👑</span>
        </div>

        {/* Victory Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-amber-900 font-['Baloo_Bhaijaan_2']">
            {title}
          </h2>
          <p className="text-sm text-slate-600 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Stars Earned Badge */}
        <div className="p-4 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-2xl shadow-inner text-amber-950 flex items-center justify-center gap-3">
          <Star className="w-8 h-8 fill-amber-200 stroke-amber-800 animate-spin" />
          <div className="text-right">
            <span className="text-2xl font-black">+{starsEarned}</span>
            <span className="text-sm font-bold mr-1">نجوم ذهبية!</span>
          </div>
          <Trophy className="w-8 h-8 text-amber-900" />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col gap-2">
          <button
            onClick={() => { playPopSound(); onNext(); }}
            className="w-full cartoon-btn py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-base shadow-md hover:brightness-105 flex items-center justify-center gap-2"
          >
            متابعة البهجة
            <ArrowRight className="w-5 h-5 rtl:rotate-180" />
          </button>

          {onReplay && (
            <button
              onClick={() => { playPopSound(); onReplay(); }}
              className="w-full cartoon-btn py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              إعادة اللعبة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
