import React, { useState } from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Wifi, WifiOff, CheckCircle2, ShieldCheck, X, Zap } from 'lucide-react';
import { playPopSound } from '../utils/soundEffects';

export const OfflineBadge: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      {/* Pill Badge */}
      <button
        onClick={() => { playPopSound(); setShowInfo(true); }}
        className={`cartoon-btn flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black transition cursor-pointer select-none ${
          !isOnline
            ? 'bg-emerald-500 text-white shadow-sm ring-2 ring-emerald-300'
            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
        }`}
        title="انقر لمعرفة تفاصيل العمل بدون إنترنت"
      >
        {!isOnline ? (
          <>
            <WifiOff className="w-3.5 h-3.5" />
            <span>يعمل بدون إنترنت 100% ⚡</span>
          </>
        ) : (
          <>
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>جاهز للعمل بدون نت (Offline Ready)</span>
          </>
        )}
      </button>

      {/* Reassurance Modal for Parents */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop text-right">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border-4 border-indigo-200 space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-lg">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span>تطبيق أوفلاين 100% بدون إنترنت</span>
              </div>
              <button
                onClick={() => { playPopSound(); setShowInfo(false); }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-bold">
              تطبيق <strong className="text-indigo-600">عالم الحروف</strong> صُمم ليكون تطبيقاً مستقلاً تماماً ومحفوظاً على جهازك؛ حتى يتمكن طفلك من اللعب والتعلم في أي وقت وفي أي مكان دون الحاجة لاتصال بالإنترنت:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-950 block">جميع الحروف والكلمات (28 حرفاً):</strong>
                  <span className="text-slate-600">محفوظة بالكامل داخل كود التطبيق دون أي تحميل خارجي.</span>
                </div>
              </div>

              <div className="p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-950 block">صالة الألعاب الخمسة ومرسم التتبع:</strong>
                  <span className="text-slate-600">تعمل جميع الألعاب بدون إنترنت وتتحقق من الإجابات محلياً.</span>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-950 block">المؤثرات الصوتية التفاعلية:</strong>
                  <span className="text-slate-600">تتولد عبر تقنية Web Audio المدمجة في المتصفح دون ملفات صوت خارجية.</span>
                </div>
              </div>

              <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-purple-950 block">حفظ النجوم والتقدم:</strong>
                  <span className="text-slate-600">يُحفظ تلقائياً في ذاكرة الهاتف المحلية (LocalStorage) بأمان تام.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => { playPopSound(); setShowInfo(false); }}
              className="w-full cartoon-btn py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm shadow-md"
            >
              فهمت، استمتع بالتعلم! ✨
            </button>
          </div>
        </div>
      )}
    </>
  );
};
