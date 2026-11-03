import React, { useState } from 'react';
import { UserProgress, Badge, LetterInfo } from '../types';
import { BADGES } from '../utils/storage';
import { ARABIC_LETTERS } from '../data/curriculum';
import { Trophy, Star, Award, RotateCcw, AlertTriangle, CheckCircle, Edit3, Sparkles, Printer } from 'lucide-react';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';
import { speakArabic } from '../utils/speech';

interface ProgressDashboardProps {
  progress: UserProgress;
  onUpdateProgress: (updated: Partial<UserProgress>) => void;
  onPracticeLetter: (letter: LetterInfo) => void;
  onResetProgress: () => void;
}

const AVATAR_OPTIONS = ['👦', '👧', '🦁', '🐰', '🚀', '👑', '🐼', '🦊'];

export const ProgressDashboard: React.FC<ProgressDashboardProps> = ({
  progress,
  onUpdateProgress,
  onPracticeLetter,
  onResetProgress,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(progress.childName);
  const [showCertificate, setShowCertificate] = useState(false);

  const lettersPercent = Math.round((progress.completedLetters.length / ARABIC_LETTERS.length) * 100);

  const handleSaveName = () => {
    playPopSound();
    if (tempName.trim()) {
      onUpdateProgress({ childName: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSelectAvatar = (avatar: string) => {
    playPopSound();
    onUpdateProgress({ avatar });
  };

  const handleOpenCertificate = () => {
    playSuccessSound();
    speakArabic(`مُبَارَكٌ لَكَ يا ${progress.childName}! هَذِهِ شَهَادَةُ تَفَوُّقِكَ فِي عَالَمِ الحُرُوف!`, {
      rate: 0.9,
    });
    setShowCertificate(true);
  };

  return (
    <div className="space-y-6 text-right">
      {/* Profile & Main Stats Card */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Child Avatar & Name */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative group">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-300 to-yellow-500 flex items-center justify-center text-5xl shadow-md border-2 border-amber-200">
              {progress.avatar}
            </div>
          </div>

          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="border border-indigo-300 rounded-xl px-2 py-1 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveName}
                    className="cartoon-btn px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
                    {progress.childName}
                  </h3>
                  <button
                    onClick={() => { playPopSound(); setIsEditingName(true); }}
                    className="text-slate-400 hover:text-indigo-600"
                    title="تعديل الاسم"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            <p className="text-xs text-slate-500 font-bold">
              بطل القراءة والكتابة الصغير 🌟
            </p>

            {/* Avatar quick pills */}
            <div className="flex items-center gap-1 pt-1">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av}
                  onClick={() => handleSelectAvatar(av)}
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition ${
                    progress.avatar === av ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'hover:bg-slate-100'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-center">
            <Star className="w-6 h-6 text-amber-500 fill-amber-300 mx-auto mb-1 animate-spin" />
            <span className="text-xl font-black text-amber-950 block">{progress.totalStars}</span>
            <span className="text-[11px] font-bold text-amber-800">نجمة ذهبية</span>
          </div>

          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
            <CheckCircle className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
            <span className="text-xl font-black text-indigo-950 block">
              {progress.completedLetters.length}/{ARABIC_LETTERS.length}
            </span>
            <span className="text-[11px] font-bold text-indigo-800">حرفاً متقناً</span>
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
            <Trophy className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <span className="text-xl font-black text-emerald-950 block">
              {progress.completedGamesCount}
            </span>
            <span className="text-[11px] font-bold text-emerald-800">لعبة مكتملة</span>
          </div>
        </div>
      </div>

      {/* Progress Bars & Completion */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-100 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-black text-slate-800 font-['Baloo_Bhaijaan_2'] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            نسبة إتقان الحروف العربية: {lettersPercent}%
          </h4>

          <button
            onClick={handleOpenCertificate}
            className="cartoon-btn px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-amber-950 font-black text-xs shadow-md flex items-center gap-1.5 hover:brightness-105"
          >
            <Award className="w-4 h-4" />
            عرض شهادة التفوق 📜
          </button>
        </div>

        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div
            className="bg-gradient-to-r from-emerald-400 via-teal-500 to-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${lettersPercent}%` }}
          />
        </div>
      </div>

      {/* Focus Area: Tricky Letters needing review */}
      {progress.mistakeLetters.length > 0 && (
        <div className="bg-rose-50 border-2 border-rose-200 rounded-3xl p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h4 className="text-base font-black text-rose-900 font-['Baloo_Bhaijaan_2']">
                حروف تحتاج إلى مراجعة وتدريب إضافي ({progress.mistakeLetters.length}):
              </h4>
            </div>
            <span className="text-xs text-rose-700 font-bold">
              اضغط على أي حرف لبدء التدريب المباشر
            </span>
          </div>

          <p className="text-xs text-rose-600 leading-relaxed">
            لاحظنا أن البطل واجه بعض التردد في هذه الحروف أثناء الألعاب. تدرب عليها الآن لتتحول إلى حروف متقنة بنجوم ذهبية!
          </p>

          <div className="flex items-center gap-2.5 flex-wrap pt-1">
            {progress.mistakeLetters.map((char) => {
              const letterObj = ARABIC_LETTERS.find((l) => l.letter === char);
              if (!letterObj) return null;

              return (
                <button
                  key={char}
                  onClick={() => { playPopSound(); onPracticeLetter(letterObj); }}
                  className="cartoon-btn px-4 py-2 rounded-2xl bg-white border-2 border-rose-300 hover:border-rose-500 text-rose-900 font-black text-lg shadow-sm flex items-center gap-2"
                >
                  <span className="text-2xl font-['Baloo_Bhaijaan_2']">{char}</span>
                  <span className="text-xs font-bold text-slate-600">{letterObj.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Badges and Medals Showcase */}
      <div className="bg-white rounded-3xl p-6 shadow-md border-2 border-indigo-100 space-y-4">
        <h4 className="text-lg font-black text-slate-800 font-['Baloo_Bhaijaan_2'] flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          لوحة الشارات والأوسمة التكريمية:
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {BADGES.map((badge) => {
            const isUnlocked = progress.totalStars >= badge.requiredStars;

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[160px] ${
                  isUnlocked
                    ? 'border-amber-300 bg-gradient-to-b from-amber-50 to-white shadow-sm'
                    : 'border-slate-200 bg-slate-50/50 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-xs mb-2 ${
                    isUnlocked ? 'bg-amber-100 ring-2 ring-amber-300' : 'bg-slate-200 grayscale'
                  }`}
                >
                  {badge.icon}
                </div>

                <div>
                  <h5 className="font-black text-xs text-slate-800 font-['Baloo_Bhaijaan_2'] mb-0.5">
                    {badge.title}
                  </h5>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    {badge.description}
                  </p>
                </div>

                <span
                  className={`mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isUnlocked ? 'مكتسب ✨' : `${badge.requiredStars} نجمة`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Section */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
        <div className="text-right">
          <span className="text-xs font-bold text-slate-700 block">بدء رحلة جديدة أو إعادة التعيين</span>
          <span className="text-[11px] text-slate-500">يمسح بيانات النجوم والألعاب للبدء من الصفر</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm('هل تريد بالتأكيد إعادة تعيين نقاط ونجوم التطبيق للبدء من جديد؟')) {
              playPopSound();
              onResetProgress();
            }
          }}
          className="cartoon-btn px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          إعادة التعيين
        </button>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
          <div className="w-full max-w-lg bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-8 border-8 border-amber-300 shadow-2xl text-center space-y-4 relative">
            <span className="text-6xl block">🏆</span>
            <span className="text-xs font-black tracking-widest text-amber-800 uppercase block">
              شَهَادَةُ تَفَوُّقٍ وَإِبْدَاع
            </span>
            <h2 className="text-3xl font-black text-amber-950 font-['Baloo_Bhaijaan_2']">
              عَالَمُ الحُرُوفِ العَرَبِيَّة
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              تَمْنَحُ إِدَارَةُ عَالَمِ الحُرُوفِ هَذِهِ الشَّهَادَةَ التَّقْدِيرِيَّةَ لِلْبَطَل:
            </p>
            <div className="py-2">
              <span className="text-3xl font-black text-indigo-700 bg-white/80 px-6 py-2 rounded-2xl border-2 border-indigo-200 shadow-sm inline-block font-['Baloo_Bhaijaan_2']">
                {progress.childName}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              لِتَمَيُّزِهِ فِي تَعَلُّمِ حُرُوفِ وَكَلِمَاتِ اللُّغَةِ العَرَبِيَّةِ وَحُصُولِهِ عَلَى{' '}
              <strong className="text-amber-800">{progress.totalStars} نَجْمَةٍ ذَهَبِيَّة</strong>!
            </p>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="cartoon-btn px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                طباعة الشهادة
              </button>
              <button
                onClick={() => { playPopSound(); setShowCertificate(false); }}
                className="cartoon-btn px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
