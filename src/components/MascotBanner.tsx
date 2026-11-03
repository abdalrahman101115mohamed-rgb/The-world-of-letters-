import React, { useState } from 'react';
import { CHARACTERS } from '../data/characters';
import { CharacterMascot, AgeGroup } from '../types';
import { Sparkles, Volume2, UserCheck, ChevronDown } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';
import { speakArabic } from '../utils/speech';

interface MascotBannerProps {
  selectedCharacterId: string;
  onSelectCharacter: (id: string) => void;
  level: AgeGroup;
  onChangeLevel: (level: AgeGroup) => void;
  stars: number;
}

const LEVEL_NAMES: Record<AgeGroup, { title: string; age: string; color: string }> = {
  level1: { title: 'المستوى الأول', age: '4 - 5 سنوات', color: 'from-amber-400 to-orange-500' },
  level2: { title: 'المستوى الثاني', age: '6 - 7 سنوات', color: 'from-blue-400 to-indigo-500' },
  level3: { title: 'المستوى الثالث', age: '8 - 10 سنوات', color: 'from-purple-500 to-pink-500' },
};

export const MascotBanner: React.FC<MascotBannerProps> = ({
  selectedCharacterId,
  onSelectCharacter,
  level,
  onChangeLevel,
  stars,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const activeMascot = CHARACTERS.find((c) => c.id === selectedCharacterId) || CHARACTERS[0];

  const handleSpeakGreeting = () => {
    playPopSound();
    speakArabic(`${activeMascot.greeting} ${activeMascot.cheerPhrase}`, { rate: 0.9, pitch: 1.2 });
  };

  return (
    <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-4 sm:p-6 text-white shadow-xl overflow-hidden border-4 border-indigo-200/50">
      {/* Background Playful Bubbles */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Mascot & Dialogue */}
        <div className="flex items-center gap-4 text-right w-full md:w-auto">
          {/* Avatar with tap-to-cheer */}
          <div
            onClick={handleSpeakGreeting}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/20 backdrop-blur-md p-1.5 shadow-lg border-2 border-white/40 flex items-center justify-center text-5xl sm:text-6xl cursor-pointer hover:scale-105 transition-transform shrink-0 animate-bounce"
            title="اضغط للتحدث مع صديقك"
          >
            {activeMascot.avatar}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black bg-white/25 px-3 py-0.5 rounded-full">
                {activeMascot.name}
              </span>
              <button
                onClick={handleSpeakGreeting}
                className="w-7 h-7 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center hover:scale-110 transition shadow-xs"
                title="تحدث"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs sm:text-sm font-bold text-indigo-100 max-w-sm leading-relaxed">
              "{activeMascot.greeting}"
            </p>

            <button
              onClick={() => { playPopSound(); setShowPicker(!showPicker); }}
              className="text-xs text-amber-200 hover:text-white underline font-bold flex items-center gap-1 mt-1 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              تغيير الصديق الكرتوني
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Level Switcher Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
          {(['level1', 'level2', 'level3'] as AgeGroup[]).map((lvl) => {
            const isCurrent = level === lvl;
            const lvlInfo = LEVEL_NAMES[lvl];

            return (
              <button
                key={lvl}
                onClick={() => { playPopSound(); onChangeLevel(lvl); }}
                className={`cartoon-btn w-full sm:w-auto px-4 py-2.5 rounded-2xl text-right transition-all flex flex-col justify-center ${
                  isCurrent
                    ? 'bg-amber-400 text-amber-950 ring-4 ring-amber-200/60 shadow-lg scale-105'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                <span className="text-xs font-black">{lvlInfo.title}</span>
                <span className="text-[10px] font-bold opacity-80">{lvlInfo.age}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mascot Picker Dropdown Tray */}
      {showPicker && (
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 animate-pop">
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => {
                playPopSound();
                onSelectCharacter(char.id);
                setShowPicker(false);
                speakArabic(`أَهْلاً بِكَ! أَنَا ${char.name}!`, { rate: 0.9, pitch: 1.15 });
              }}
              className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-3 text-right ${
                char.id === selectedCharacterId
                  ? 'bg-white text-indigo-950 border-amber-400 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              <span className="text-3xl">{char.avatar}</span>
              <div>
                <span className="text-xs font-black block">{char.name}</span>
                <span className="text-[10px] opacity-80 block">{char.title}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
