import React from 'react';
import { LetterInfo } from '../types';
import { AudioButton } from './AudioButton';
import { X, PenTool, Sparkles, Volume2, Star } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

interface LetterDetailModalProps {
  letter: LetterInfo;
  isOpen: boolean;
  onClose: () => void;
  onOpenTracing: (letter: LetterInfo) => void;
  onOpenQuiz: (letter: LetterInfo) => void;
  isCompleted?: boolean;
}

export const LetterDetailModal: React.FC<LetterDetailModalProps> = ({
  letter,
  isOpen,
  onClose,
  onOpenTracing,
  onOpenQuiz,
  isCompleted,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col max-h-[92vh] text-right">
        {/* Header */}
        <div className={`p-6 bg-gradient-to-r ${letter.color} text-white relative`}>
          <button
            onClick={() => { playPopSound(); onClose(); }}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center transition text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-6xl font-black shadow-inner border border-white/30 animate-float">
              {letter.letter}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/30 font-bold">
                  {letter.transliteration}
                </span>
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-950" /> متقن
                  </span>
                )}
              </div>
              <h2 className="text-3xl font-black font-['Baloo_Bhaijaan_2']">
                حَرْفُ {letter.name}
              </h2>
              <div className="mt-2 flex items-center gap-2">
                <AudioButton
                  textToSpeak={`حَرْفُ ${letter.name}. ${letter.letter}`}
                  size="sm"
                  label="استمع للحرف"
                  className="bg-white/25 hover:bg-white/35 text-white shadow-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Example Word & Sentence */}
          <div className="p-4 bg-amber-50/70 border-2 border-amber-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-5xl">{letter.exampleEmoji}</span>
              <div>
                <span className="text-xs text-amber-800 font-bold">كَلِمَةٌ تَبْدَأُ بِالحَرْف:</span>
                <h3 className="text-2xl font-black text-amber-950">{letter.exampleWord}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{letter.exampleSentence}</p>
              </div>
            </div>
            <AudioButton
              textToSpeak={`${letter.exampleWord}. ${letter.exampleSentence}`}
              size="md"
              className="bg-amber-500 hover:bg-amber-600"
            />
          </div>

          {/* Letter Shapes across word positions */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              أَشْكَالُ الحَرْفِ فِي الكَلِمَة:
            </h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <span className="text-xs font-bold text-indigo-700 block mb-1">مُنْفَصِل</span>
                <span className="text-2xl font-black text-indigo-950 font-['Baloo_Bhaijaan_2']">{letter.shapes.isolated}</span>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <span className="text-xs font-bold text-indigo-700 block mb-1">أَوَّل الكَلِمَة</span>
                <span className="text-2xl font-black text-indigo-950 font-['Baloo_Bhaijaan_2']">{letter.shapes.initial}</span>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <span className="text-xs font-bold text-indigo-700 block mb-1">وَسَط الكَلِمَة</span>
                <span className="text-2xl font-black text-indigo-950 font-['Baloo_Bhaijaan_2']">{letter.shapes.medial}</span>
              </div>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-2xl">
                <span className="text-xs font-bold text-indigo-700 block mb-1">آخِر الكَلِمَة</span>
                <span className="text-2xl font-black text-indigo-950 font-['Baloo_Bhaijaan_2']">{letter.shapes.final}</span>
              </div>
            </div>
          </div>

          {/* Harakat Section (Short Vowels) */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-pink-500" />
              الحَرْفُ مَعَ الحَرَكَاتِ القَصِيرَة:
            </h4>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Fatha */}
              <div className="p-3 bg-pink-50 border border-pink-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-black text-pink-600 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-xs">
                    {letter.harakat.fatha.text}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-pink-700 block">فَتْحَة (َ)</span>
                    <span className="text-sm font-bold text-slate-800">{letter.harakat.fatha.example}</span>
                  </div>
                </div>
                <AudioButton
                  textToSpeak={`${letter.harakat.fatha.text}. ${letter.harakat.fatha.example}`}
                  size="sm"
                  className="bg-pink-500 hover:bg-pink-600"
                />
              </div>

              {/* Damma */}
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-black text-blue-600 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-xs">
                    {letter.harakat.damma.text}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-blue-700 block">ضَمَّة (ُ)</span>
                    <span className="text-sm font-bold text-slate-800">{letter.harakat.damma.example}</span>
                  </div>
                </div>
                <AudioButton
                  textToSpeak={`${letter.harakat.damma.text}. ${letter.harakat.damma.example}`}
                  size="sm"
                  className="bg-blue-500 hover:bg-blue-600"
                />
              </div>

              {/* Kasra */}
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-black text-emerald-600 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-xs">
                    {letter.harakat.kasra.text}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-emerald-700 block">كَسْرَة (ِ)</span>
                    <span className="text-sm font-bold text-slate-800">{letter.harakat.kasra.example}</span>
                  </div>
                </div>
                <AudioButton
                  textToSpeak={`${letter.harakat.kasra.text}. ${letter.harakat.kasra.example}`}
                  size="sm"
                  className="bg-emerald-500 hover:bg-emerald-600"
                />
              </div>

              {/* Sukun */}
              <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-black text-purple-600 bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-xs">
                    {letter.harakat.sukun.text}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-purple-700 block">سُكُون (ْ)</span>
                    <span className="text-sm font-bold text-slate-800">{letter.harakat.sukun.example}</span>
                  </div>
                </div>
                <AudioButton
                  textToSpeak={`${letter.harakat.sukun.text}. ${letter.harakat.sukun.example}`}
                  size="sm"
                  className="bg-purple-500 hover:bg-purple-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={() => { playPopSound(); onOpenTracing(letter); }}
            className="flex-1 cartoon-btn py-3 px-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2"
          >
            <PenTool className="w-4 h-4" />
            تَعَلَّم رَسْمَ الحَرْف
          </button>

          <button
            onClick={() => { playPopSound(); onOpenQuiz(letter); }}
            className="flex-1 cartoon-btn py-3 px-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md hover:brightness-105 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            اخْتَبِرْ مَعْرِفَتَك
          </button>
        </div>
      </div>
    </div>
  );
};
