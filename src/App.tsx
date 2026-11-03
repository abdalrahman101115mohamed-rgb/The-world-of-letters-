/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MascotBanner } from './components/MascotBanner';
import { AlphabetGrid } from './components/AlphabetGrid';
import { LetterDetailModal } from './components/LetterDetailModal';
import { LetterTracingCanvas } from './components/LetterTracingCanvas';
import { GamesHub } from './components/GamesHub';
import { StoriesSection } from './components/StoriesSection';
import { ProgressDashboard } from './components/ProgressDashboard';
import { CelebrationModal } from './components/CelebrationModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { LetterInfo, AgeGroup, UserProgress } from './types';
import {
  loadProgress,
  saveProgress,
  addStars,
  markLetterComplete,
  recordLetterMistake,
  clearLetterMistake,
  markStoryComplete,
} from './utils/storage';
import { playSuccessSound } from './utils/soundEffects';
import { speakArabic } from './utils/speech';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [activeTab, setActiveTab] = useState<'alphabet' | 'games' | 'stories' | 'progress'>('alphabet');
  const [selectedLetter, setSelectedLetter] = useState<LetterInfo | null>(null);
  const [tracingLetter, setTracingLetter] = useState<LetterInfo | null>(null);
  const [practiceLetter, setPracticeLetter] = useState<LetterInfo | null>(null);
  const [showInstallModal, setShowInstallModal] = useState(false);

  // Celebration state
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    title: string;
    subtitle: string;
    stars: number;
  }>({
    isOpen: false,
    title: '',
    subtitle: '',
    stars: 0,
  });

  // Sync state changes with persistence
  const handleUpdateProgress = (partial: Partial<UserProgress>) => {
    setProgress((prev) => {
      const updated = { ...prev, ...partial };
      saveProgress(updated);
      return updated;
    });
  };

  const handleToggleSound = () => {
    handleUpdateProgress({ soundEnabled: !progress.soundEnabled });
  };

  const handleChangeLevel = (level: AgeGroup) => {
    handleUpdateProgress({ level });
    const levelText =
      level === 'level1'
        ? 'المُسْتَوَى الأَوَّل: الحُرُوفُ وَالأَصْوَات'
        : level === 'level2'
        ? 'المُسْتَوَى الثَّانِي: الحَرَكَاتُ وَالكَلِمَات'
        : 'المُسْتَوَى الثَّالِث: القِرَاءَةُ وَالإِمْلَاء';
    speakArabic(levelText, { rate: 0.9 });
  };

  const handleLetterLearned = (letter: string) => {
    const updated = markLetterComplete(letter);
    clearLetterMistake(letter);
    setProgress(updated);
  };

  const handleRecordMistake = (letter: string) => {
    const updated = recordLetterMistake(letter);
    setProgress(updated);
  };

  const handleCompleteTracing = () => {
    if (tracingLetter) {
      handleLetterLearned(tracingLetter.letter);
      setTracingLetter(null);
      setCelebration({
        isOpen: true,
        title: `بَرَاعَةٌ فِي رَسْمِ حَرْفِ (${tracingLetter.name})!`,
        subtitle: 'أتقنت رسم الحرف بإصبعك بطريقة صحيحة وفنية!',
        stars: 3,
      });
    }
  };

  const handleGameComplete = (starsEarned: number, gameName: string) => {
    const updated = addStars(starsEarned);
    setProgress(updated);
    setCelebration({
      isOpen: true,
      title: `فَوْزٌ رَائِعٌ فِي ${gameName}!`,
      subtitle: `أحسنت يا بطل! لقد حصلت على ${starsEarned} نجوم ذهبية!`,
      stars: starsEarned,
    });
  };

  const handleCompleteStory = (storyId: string) => {
    const updated = markStoryComplete(storyId);
    setProgress(updated);
    setCelebration({
      isOpen: true,
      title: 'بَطَلُ القِرَاءَةِ وَالفَهْمِ القِرَائِيّ!',
      subtitle: 'أتممت قراءة القصة وأجبت عن أسئلة الفهم بنجاح باهر!',
      stars: 10,
    });
  };

  const handlePracticeFromDashboard = (letter: LetterInfo) => {
    setPracticeLetter(letter);
    setActiveTab('games');
  };

  const handleResetProgress = () => {
    localStorage.removeItem('alam_alhoroof_user_progress_v1');
    setProgress(loadProgress());
  };

  return (
    <div className="min-h-screen bg-[#F0F4FF] flex flex-col font-['Baloo_Bhaijaan_2'] text-slate-800">
      {/* Top Application Navbar */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        stars={progress.totalStars}
        soundEnabled={progress.soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenInstallModal={() => setShowInstallModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 space-y-6">
        {/* Mascot Companion & Age Group Header */}
        <MascotBanner
          selectedCharacterId={progress.selectedCharacterId}
          onSelectCharacter={(id) => handleUpdateProgress({ selectedCharacterId: id })}
          level={progress.level}
          onChangeLevel={handleChangeLevel}
          stars={progress.totalStars}
        />

        {/* Tab 1: Alphabet Explorer */}
        {activeTab === 'alphabet' && (
          <AlphabetGrid
            completedLetters={progress.completedLetters}
            mistakeLetters={progress.mistakeLetters}
            onSelectLetter={(letter) => setSelectedLetter(letter)}
            onOpenTracing={(letter) => setTracingLetter(letter)}
          />
        )}

        {/* Tab 2: Games Arcade */}
        {activeTab === 'games' && (
          <GamesHub
            level={progress.level}
            onGameCompleted={handleGameComplete}
            onRecordMistake={handleRecordMistake}
            onLetterLearned={handleLetterLearned}
            practiceLetter={practiceLetter}
            onClearPracticeLetter={() => setPracticeLetter(null)}
          />
        )}

        {/* Tab 3: Stories & Reading */}
        {activeTab === 'stories' && (
          <StoriesSection
            completedStories={progress.completedStories}
            onCompleteStory={handleCompleteStory}
          />
        )}

        {/* Tab 4: Progress Dashboard & Badges */}
        {activeTab === 'progress' && (
          <ProgressDashboard
            progress={progress}
            onUpdateProgress={handleUpdateProgress}
            onPracticeLetter={handlePracticeFromDashboard}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 border-t border-indigo-100 py-3 text-center text-xs text-slate-500 font-bold">
        <span>عَالَمُ الحُرُوفِ © تطبيق تعليمي تفاعلي آمن ومجاني للأطفال باللغة العربية الفصحى</span>
      </footer>

      {/* Modals */}
      {selectedLetter && (
        <LetterDetailModal
          letter={selectedLetter}
          isOpen={!!selectedLetter}
          onClose={() => setSelectedLetter(null)}
          isCompleted={progress.completedLetters.includes(selectedLetter.letter)}
          onOpenTracing={(letter) => {
            setSelectedLetter(null);
            setTracingLetter(letter);
          }}
          onOpenQuiz={(letter) => {
            setSelectedLetter(null);
            setPracticeLetter(letter);
            setActiveTab('games');
          }}
        />
      )}

      {tracingLetter && (
        <LetterTracingCanvas
          letterInfo={tracingLetter}
          onClose={() => setTracingLetter(null)}
          onCompleted={handleCompleteTracing}
        />
      )}

      {/* Celebration Fanfare & Confetti Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        title={celebration.title}
        subtitle={celebration.subtitle}
        starsEarned={celebration.stars}
        onNext={() => setCelebration((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Android APK & PWA Install Modal */}
      <PWAInstallModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
