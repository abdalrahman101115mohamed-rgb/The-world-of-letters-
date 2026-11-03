import React, { useState } from 'react';
import { GameLetterQuiz } from './GameLetterQuiz';
import { GameWordBuilder } from './GameWordBuilder';
import { GameListenMatch } from './GameListenMatch';
import { GameHarakatChallenge } from './GameHarakatChallenge';
import { GameSpellingDictation } from './GameSpellingDictation';
import { LetterInfo, AgeGroup } from '../types';
import { Trophy, Sparkles, ArrowRight, Star } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface GamesHubProps {
  level: AgeGroup;
  onGameCompleted: (stars: number, gameName: string) => void;
  onRecordMistake: (letter: string) => void;
  onLetterLearned: (letter: string) => void;
  practiceLetter?: LetterInfo | null;
  onClearPracticeLetter: () => void;
}

type GameKey = 'letterQuiz' | 'wordBuilder' | 'listenMatch' | 'harakat' | 'spelling' | null;

interface GameItem {
  id: GameKey;
  title: string;
  desc: string;
  emoji: string;
  color: string;
  levelBadge: string;
  recommendedFor: AgeGroup;
}

const GAMES_LIST: GameItem[] = [
  {
    id: 'letterQuiz',
    title: 'اخْتِيَارُ الحَرْفِ الصَّحِيح',
    desc: 'اسْتَمِعْ لِصَوْتِ الحَرْفِ وَاخْتَرْ البَالُونَ الصَّحِيح!',
    emoji: '🎈',
    color: 'from-amber-400 to-orange-500',
    levelBadge: 'المستوى 1 (4-5 سنوات)',
    recommendedFor: 'level1',
  },
  {
    id: 'listenMatch',
    title: 'اسْتَمِعْ وَاخْتَرْ الصُّورَة',
    desc: 'اسْتَمِعْ لِاسْمِ الحَيَوَانِ أَوِ الشَّيْءِ وَاخْتَرْ صُورَتَهُ!',
    emoji: '🦁',
    color: 'from-sky-400 to-blue-600',
    levelBadge: 'المستوى 1 و 2',
    recommendedFor: 'level1',
  },
  {
    id: 'harakat',
    title: 'تَحَدِّي الحَرَكَاتِ الثَّلَاث',
    desc: 'تَعَلَّم الفَتْحَةَ وَالضَّمَّةَ وَالكَسْرَةَ وَالسُّكُون!',
    emoji: '⚡',
    color: 'from-pink-400 to-rose-500',
    levelBadge: 'المستوى 2 (6-7 سنوات)',
    recommendedFor: 'level2',
  },
  {
    id: 'wordBuilder',
    title: 'تَرْكِيبُ وَتَرْتِيبُ الكَلِمَات',
    desc: 'رَتِّبْ قِطَعَ الحُرُوفِ لِتَبْنِيَ كَلِمَاتٍ عَرَبِيَّةً جَمِيلَة!',
    emoji: '🧩',
    color: 'from-emerald-400 to-teal-600',
    levelBadge: 'المستوى 2 و 3',
    recommendedFor: 'level2',
  },
  {
    id: 'spelling',
    title: 'مُخْتَبَرُ الإِمْلَاءِ الذَّكِيّ',
    desc: 'تَدَرَّبْ عَلَى كِتَابَةِ الكَلِمَاتِ وَالتَّمْيِيزِ بَيْنَ الحُرُوفِ الصَّعْبَة!',
    emoji: '✍️',
    color: 'from-purple-500 to-indigo-600',
    levelBadge: 'المستوى 3 (8-10 سنوات)',
    recommendedFor: 'level3',
  },
];

export const GamesHub: React.FC<GamesHubProps> = ({
  level,
  onGameCompleted,
  onRecordMistake,
  onLetterLearned,
  practiceLetter,
  onClearPracticeLetter,
}) => {
  const [activeGame, setActiveGame] = useState<GameKey>(
    practiceLetter ? 'letterQuiz' : null
  );

  const handleSelectGame = (gameKey: GameKey) => {
    playPopSound();
    setActiveGame(gameKey);
  };

  const handleBackToArcade = () => {
    playPopSound();
    setActiveGame(null);
    onClearPracticeLetter();
  };

  return (
    <div className="space-y-6">
      {activeGame ? (
        <div className="space-y-4">
          {/* Back button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToArcade}
              className="cartoon-btn px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 hover:bg-slate-50"
            >
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              العودة إلى صالة الألعاب
            </button>
          </div>

          {/* Active Game Component */}
          {activeGame === 'letterQuiz' && (
            <GameLetterQuiz
              initialTargetLetter={practiceLetter || undefined}
              onGameComplete={(stars) => {
                onGameCompleted(stars, 'اختيار الحرف الصحيح');
                setActiveGame(null);
              }}
              onRecordMistake={onRecordMistake}
              onLetterLearned={onLetterLearned}
            />
          )}

          {activeGame === 'wordBuilder' && (
            <GameWordBuilder
              onGameComplete={(stars) => {
                onGameCompleted(stars, 'تركيب الكلمات');
                setActiveGame(null);
              }}
            />
          )}

          {activeGame === 'listenMatch' && (
            <GameListenMatch
              onGameComplete={(stars) => {
                onGameCompleted(stars, 'استمع واختر الصورة');
                setActiveGame(null);
              }}
            />
          )}

          {activeGame === 'harakat' && (
            <GameHarakatChallenge
              onGameComplete={(stars) => {
                onGameCompleted(stars, 'تحدي الحركات');
                setActiveGame(null);
              }}
            />
          )}

          {activeGame === 'spelling' && (
            <GameSpellingDictation
              onGameComplete={(stars) => {
                onGameCompleted(stars, 'مختبر الإملاء الذكي');
                setActiveGame(null);
              }}
            />
          )}
        </div>
      ) : (
        /* Arcade Games Showcase */
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎮</span>
              <div>
                <h3 className="text-lg font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
                  صالة ألعاب الحروف والكلمات
                </h3>
                <p className="text-xs text-slate-500">
                  اختر لعبة ممتعة واجمع النجوم الذهبية والأوسمة!
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GAMES_LIST.map((game) => {
              const isRecommended = game.recommendedFor === level;

              return (
                <div
                  key={game.id}
                  onClick={() => handleSelectGame(game.id)}
                  className={`cartoon-card bg-white rounded-3xl p-5 border-2 transition-all duration-200 cursor-pointer hover:-translate-y-1.5 flex flex-col justify-between text-right relative overflow-hidden ${
                    isRecommended
                      ? 'border-indigo-400 ring-2 ring-indigo-100'
                      : 'border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  {isRecommended && (
                    <div className="absolute top-3 left-3 bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 shadow-xs">
                      <Sparkles className="w-3 h-3" /> موصى به لعمرك
                    </div>
                  )}

                  <div className="space-y-3">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${game.color} text-white flex items-center justify-center text-3xl shadow-sm`}
                    >
                      {game.emoji}
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-indigo-600 block mb-1">
                        {game.levelBadge}
                      </span>
                      <h4 className="text-xl font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
                        {game.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {game.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" /> اكسب نجوم
                    </span>
                    <button className="cartoon-btn px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs">
                      العب الآن 🎯
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
