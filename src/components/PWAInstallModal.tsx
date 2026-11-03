import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, CheckCircle2, X, Sparkles, HelpCircle } from 'lucide-react';
import { playPopSound, playSuccessSound } from '../utils/soundEffects';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'direct' | 'steps' | 'builder'>('direct');
  const [installSuccess, setInstallSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    playPopSound();
    const success = await install();
    if (success) {
      playSuccessSound();
      setInstallSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden text-right">
        {/* Header with mascot icon */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 p-1 flex items-center justify-center shadow-inner text-2xl">
              📱
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Baloo_Bhaijaan_2']">تثبيت التطبيق على الأندرويد</h3>
              <p className="text-xs text-indigo-100">تثبيت مباشر APK / WebAPK بدون متجر</p>
            </div>
          </div>
          <button
            onClick={() => { playPopSound(); onClose(); }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-slate-50 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => { playPopSound(); setActiveTab('direct'); }}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'direct' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            التثبيت المباشر
          </button>
          <button
            onClick={() => { playPopSound(); setActiveTab('steps'); }}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'steps' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            خطوات الهاتف
          </button>
          <button
            onClick={() => { playPopSound(); setActiveTab('builder'); }}
            className={`flex-1 py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'builder' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            تحويل إلى ملف APK
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {activeTab === 'direct' && (
            <div className="space-y-4 text-center">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border-2 border-indigo-200 p-2 shadow-sm flex items-center justify-center text-4xl">
                🐰✨
              </div>

              {isInstalled ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800">
                  <div className="flex items-center justify-center gap-2 font-bold text-lg mb-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    التطبيق مثبت بالفعل على جهازك!
                  </div>
                  <p className="text-sm">يمكنك فتحه الآن من شاشة هاتفك الرئيسية كأي تطبيق أندرويد أصلي يعمل بدون إنترنت.</p>
                </div>
              ) : isInstallable ? (
                <div className="space-y-3">
                  <p className="text-slate-700 font-medium text-sm leading-relaxed">
                    اضغط الزر بالأسفل لتثبيت <span className="font-bold text-indigo-600">عالم الحروف</span> فوراً على هاتفك كـ <strong className="text-purple-600">WebAPK أصلي</strong> بدون الحاجة لمتجر Google Play!
                  </p>
                  <button
                    onClick={handleInstallClick}
                    className="w-full cartoon-btn py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 hover:brightness-105"
                  >
                    <Download className="w-6 h-6 animate-bounce" />
                    تثبيت التطبيق على جهازي الآن (مجاناً)
                  </button>
                  <p className="text-xs text-slate-500">يعمل بكامل طاقته ومؤثراته الصوتية بدون إنترنت</p>
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-right">
                  <div className="flex items-center gap-2 font-bold">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    التثبيت المباشر بنقرة واحدة متاح عبر متصفح الهاتف (Chrome):
                  </div>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
                    <li>افتح الرابط في متصفح <strong className="text-indigo-600">Google Chrome</strong> على هاتف أندرويد.</li>
                    <li>اضغط على زر الخيارات (<strong>الثلاث نقاط ⋮</strong>) أعلى المتصفح.</li>
                    <li>اختر <strong className="text-emerald-700">"تثبيت التطبيق"</strong> أو <strong>"الإضافة إلى الشاشة الرئيسية"</strong>.</li>
                    <li>سيقوم نظام أندرويد فوراً بإنشاء أيقونة التطبيق الرسمية وحزمة APK تلقائياً.</li>
                  </ol>
                </div>
              )}

              {installSuccess && (
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-sm">
                  🎉 تم بدء التثبيت! تفقد شاشة هاتفك الرئيسية.
                </div>
              )}
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="space-y-4 text-slate-700 text-sm">
              <h4 className="font-bold text-base text-indigo-700 flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                كيف يعمل تطبيق WebAPK على نظام أندرويد؟
              </h4>
              <p className="leading-relaxed">
                يقوم نظام <strong>Android</strong> بدعم تقنية <strong>WebAPK</strong> الرسمية من Google. عندما تضغط على "تثبيت التطبيق"، يُنشئ الهاتف حزمة APK داخلية حقيقية تتصرف تماماً كتطبيق تم تنزيله من Google Play:
              </p>
              
              <div className="grid grid-cols-1 gap-2 pt-2">
                <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-indigo-900">أيقونة مستقلة وشاشة كاملة</h5>
                    <p className="text-xs text-slate-600">يفتح التطبيق بشاشة كاملة دون أشرطة تصفح أو روابط، كأي لعبة أندرويد أصلية.</p>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-purple-900">يعمل بدون إنترنت (Offline)</h5>
                    <p className="text-xs text-slate-600">بفضل Service Worker المدمج، يتم تخزين الحروف والرسوم والألعاب لتعمل دائماً حتى عند انقطاع الشبكة.</p>
                  </div>
                </div>

                <div className="p-3 bg-pink-50/70 border border-pink-100 rounded-xl flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-pink-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-pink-900">سريع وخفيف جداً</h5>
                    <p className="text-xs text-slate-600">لا يستهلك مساحة تخزين كبيرة مثل ملفات APK الضخمة، وسريع الاستجابة للطفل.</p>
                  </div>
                </div>
              </div>

              {isIOS && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                  <strong>ملاحظة لأجهزة iPhone / iPad:</strong> اضغط على زر المشاركة (Share) في Safari ثم اختر "إضافة إلى الشاشة الرئيسية (Add to Home Screen)".
                </div>
              )}
            </div>
          )}

          {activeTab === 'builder' && (
            <div className="space-y-4 text-slate-700 text-sm">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-indigo-700 text-base">
                  توليد ملف .APK مستقل (موقع PWABuilder أو Capacitor):
                </h4>
                <p className="text-xs leading-relaxed text-slate-600">
                  إذا أردت الحصول على ملف <strong>.apk</strong> بصيغة خام لتوزيعه عبر بلوتوث أو رفعه على Google Play، التطبيق مجهز بالكامل بملف الـ <code>manifest.json</code> وأيقونات 512x512 متوافقة تماماً مع المعايير:
                </p>
                <div className="bg-slate-900 text-emerald-400 p-3 rounded-xl font-mono text-xs overflow-x-auto text-left" dir="ltr">
                  <div># طريقة 1: استخدام PWABuilder المجاني من Microsoft</div>
                  <div>1. افتح https://www.pwabuilder.com</div>
                  <div>2. ضع رابط هذا التطبيق</div>
                  <div>3. اضغط "Package for Android" لتحميل الـ APK فوراً</div>
                  <br />
                  <div># طريقة 2: عبر Bubblewrap CLI</div>
                  <div>npm i -g @bubblewrap/cli</div>
                  <div>bubblewrap init --manifest=manifest.webmanifest</div>
                  <div>bubblewrap build</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => { playPopSound(); onClose(); }}
            className="cartoon-btn px-6 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-800 text-sm"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
