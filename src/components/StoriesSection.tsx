import React, { useState } from 'react';
import { STORIES } from '../data/stories';
import { Story } from '../types';
import { AudioButton } from './AudioButton';
import { BookOpen, ChevronRight, ChevronLeft, Volume2, Star, CheckCircle, Trophy, HelpCircle } from 'lucide-react';
import { playPopSound, playSuccessSound, playOopsSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer } from '../utils/speech';

interface StoriesSectionProps {
  completedStories: string[];
  onCompleteStory: (storyId: string) => void;
}

export const StoriesSection: React.FC<StoriesSectionProps> = ({
  completedStories,
  onCompleteStory,
}) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [quizScore, setQuizScore] = useState(0);

  const handleOpenStory = (story: Story) => {
    playPopSound();
    setSelectedStory(story);
    setCurrentPage(0);
    setIsQuizMode(false);
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setQuizFeedback(null);

    // Speak first page text
    speakArabic(story.pages[0].audioText || story.pages[0].text, { rate: 0.85 });
  };

  const handleNextPage = () => {
    if (!selectedStory) return;
    playPopSound();

    if (currentPage + 1 < selectedStory.pages.length) {
      setCurrentPage((prev) => prev + 1);
      speakArabic(
        selectedStory.pages[currentPage + 1].audioText || selectedStory.pages[currentPage + 1].text,
        { rate: 0.85 }
      );
    } else {
      // Reached end of story, enter comprehension quiz!
      setIsQuizMode(true);
      setQuizIndex(0);
      const q = selectedStory.questions[0];
      speakArabic(`سُؤَالُ الفَهْمِ القِرَائِيّ: ${q.question}`, { rate: 0.85 });
    }
  };

  const handlePrevPage = () => {
    if (!selectedStory || currentPage === 0) return;
    playPopSound();
    setCurrentPage((prev) => prev - 1);
    speakArabic(
      selectedStory.pages[currentPage - 1].audioText || selectedStory.pages[currentPage - 1].text,
      { rate: 0.85 }
    );
  };

  const handleAnswerQuestion = (optIdx: number) => {
    if (!selectedStory || quizFeedback !== null) return;
    setSelectedAnswer(optIdx);
    playPopSound();

    const q = selectedStory.questions[quizIndex];
    if (optIdx === q.correctIndex) {
      setQuizFeedback('correct');
      playSuccessSound();
      playStarSound();
      setQuizScore((prev) => prev + 1);

      speakCheer(() => {
        setTimeout(() => {
          if (quizIndex + 1 < selectedStory.questions.length) {
            setQuizIndex((prev) => prev + 1);
            setSelectedAnswer(null);
            setQuizFeedback(null);
            const nextQ = selectedStory.questions[quizIndex + 1];
            speakArabic(`السُّؤَالُ التَّالِي: ${nextQ.question}`, { rate: 0.85 });
          } else {
            // Story & Quiz completed!
            onCompleteStory(selectedStory.id);
          }
        }, 1200);
      });
    } else {
      setQuizFeedback('wrong');
      playOopsSound();
      speakArabic('إِجَابَةٌ غَيْرُ صَحِيحَةٍ، حَاوِلْ مَرَّةً أُخْرَى!', {
        rate: 0.85,
        onEnd: () => {
          setTimeout(() => {
            setQuizFeedback(null);
            setSelectedAnswer(null);
          }, 1000);
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* If reading a story */}
      {selectedStory ? (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-xl border-4 border-indigo-200 text-right space-y-6 animate-pop">
          {/* Story Reader Header */}
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{selectedStory.emoji}</span>
              <div>
                <h3 className="text-xl font-black text-indigo-950 font-['Baloo_Bhaijaan_2']">
                  {selectedStory.title}
                </h3>
                <span className="text-xs text-slate-500">
                  {isQuizMode
                    ? `أسئلة الفهم القرائي (${quizIndex + 1}/${selectedStory.questions.length})`
                    : `الصفحة ${currentPage + 1} من ${selectedStory.pages.length}`}
                </span>
              </div>
            </div>

            <button
              onClick={() => { playPopSound(); setSelectedStory(null); }}
              className="cartoon-btn px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              العودة للقصص
            </button>
          </div>

          {!isQuizMode ? (
            /* Story Pages */
            <div className="space-y-6">
              {/* Illustrated Visual Card */}
              <div className="h-56 sm:h-64 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100 flex flex-col items-center justify-center p-6 text-center shadow-inner relative overflow-hidden">
                <span className="text-7xl sm:text-8xl animate-float block mb-2">
                  {selectedStory.pages[currentPage].imageEmoji}
                </span>
                <div className="absolute bottom-3 left-3">
                  <AudioButton
                    textToSpeak={selectedStory.pages[currentPage].audioText || selectedStory.pages[currentPage].text}
                    size="sm"
                    label="استمع للصفحة"
                  />
                </div>
              </div>

              {/* Text with large cheerful Arabic typography */}
              <div className="p-5 bg-amber-50/50 rounded-2xl border border-amber-200/60 leading-loose">
                <p className="text-xl sm:text-2xl font-bold text-slate-800 text-center font-['Baloo_Bhaijaan_2']">
                  {selectedStory.pages[currentPage].text}
                </p>
              </div>

              {/* Pagination Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`cartoon-btn px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 ${
                    currentPage === 0
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                  الصفحة السابقة
                </button>

                <div className="flex gap-1.5">
                  {selectedStory.pages.map((_, i) => (
                    <span
                      key={i}
                      className={`h-2.5 rounded-full transition-all ${
                        i === currentPage ? 'w-8 bg-indigo-600' : 'w-2.5 bg-slate-300'
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  className="cartoon-btn px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-black shadow-md flex items-center gap-1.5 hover:brightness-105"
                >
                  {currentPage + 1 < selectedStory.pages.length ? 'الصفحة التالية' : 'بدء أسئلة الفهم! ✨'}
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Reading Comprehension Quiz */
            <div className="space-y-6">
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-bold text-purple-900">
                    اختبر فهمك للقصة واحصل على نجوم إضافية:
                  </span>
                </div>
                <AudioButton
                  textToSpeak={selectedStory.questions[quizIndex].question}
                  size="sm"
                />
              </div>

              <h4 className="text-xl font-black text-slate-800 text-center font-['Baloo_Bhaijaan_2'] py-2">
                {selectedStory.questions[quizIndex].question}
              </h4>

              {/* Options */}
              <div className="space-y-3">
                {selectedStory.questions[quizIndex].options.map((opt, optIdx) => {
                  const isSelected = selectedAnswer === optIdx;
                  const isCorrect = optIdx === selectedStory.questions[quizIndex].correctIndex;

                  let optClass = 'border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/30';
                  if (quizFeedback === 'correct' && isCorrect) {
                    optClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300';
                  } else if (quizFeedback === 'wrong' && isSelected) {
                    optClass = 'border-rose-500 bg-rose-50 text-rose-900 animate-wiggle';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleAnswerQuestion(optIdx)}
                      className={`w-full cartoon-btn text-right p-4 rounded-2xl border-2 font-bold text-base transition flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs text-slate-600 font-black">
                        {optIdx + 1}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Stories Showcase Grid */
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-indigo-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📚</span>
              <div>
                <h3 className="text-lg font-black text-slate-800 font-['Baloo_Bhaijaan_2']">
                  واحة القصص والقراءة الذكية
                </h3>
                <p className="text-xs text-slate-500">
                  قصص مصورة ممتعة مع قراءة صوتية وأسئلة فهم قرائي
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1.5 rounded-2xl text-xs font-black shadow-xs">
              <Trophy className="w-4 h-4" />
              <span>مكتمل: {completedStories.length} من {STORIES.length}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STORIES.map((story) => {
              const isDone = completedStories.includes(story.id);

              return (
                <div
                  key={story.id}
                  onClick={() => handleOpenStory(story)}
                  className="cartoon-card bg-white rounded-3xl overflow-hidden border-2 border-indigo-100 hover:border-indigo-400 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  {/* Card Cover Header */}
                  <div className={`p-6 bg-gradient-to-r ${story.coverColor} text-white flex items-center justify-between relative`}>
                    <span className="text-6xl animate-float">{story.emoji}</span>
                    {isDone && (
                      <span className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-sm font-black shadow-md">
                        ⭐
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 text-right flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-xl font-black text-slate-800 font-['Baloo_Bhaijaan_2'] mb-1">
                        {story.title}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" /> {story.pages.length} صفحات ممتعة
                      </span>
                      <button className="cartoon-btn px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-black text-xs">
                        اقرأ الآن
                      </button>
                    </div>
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
