import React, { useRef, useState, useEffect } from 'react';
import { LetterInfo } from '../types';
import { AudioButton } from './AudioButton';
import { RotateCcw, Sparkles, Check, Palette, Volume2 } from 'lucide-react';
import { playPopSound, playSuccessSound, playStarSound } from '../utils/soundEffects';
import { speakArabic, speakCheer } from '../utils/speech';

interface LetterTracingCanvasProps {
  letterInfo: LetterInfo;
  onCompleted: () => void;
  onClose: () => void;
}

const PEN_COLORS = [
  { name: 'وردي لطيف', color: '#EC4899' },
  { name: 'أزرق سماوي', color: '#0284C7' },
  { name: 'أخضر زمردي', color: '#10B981' },
  { name: 'ذهبي لامع', color: '#F59E0B' },
  { name: 'بنفسجي سحري', color: '#8B5CF6' },
];

export const LetterTracingCanvas: React.FC<LetterTracingCanvasProps> = ({
  letterInfo,
  onCompleted,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PEN_COLORS[0].color);
  const [brushSize, setBrushSize] = useState(20);
  const [drawnStrokesCount, setDrawnStrokesCount] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Initialize and draw the faint guide letter in the background
  const drawGuideLetter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    // Subtle playful grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.lineTo(width, height * 0.7); // Baseline guide
    ctx.stroke();

    // Draw dotted Arabic guide letter
    ctx.save();
    ctx.font = `bold ${Math.floor(height * 0.58)}px 'Baloo Bhaijaan 2', 'Tajawal', sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Faint fill
    ctx.fillStyle = '#EEF2FF';
    ctx.fillText(letterInfo.letter, width / 2, height / 2);

    // Dotted stroke outline for tracing
    ctx.strokeStyle = '#A5B4FC';
    ctx.lineWidth = 5;
    ctx.setLineDash([10, 10]);
    ctx.strokeText(letterInfo.letter, width / 2, height / 2);

    // Draw arrow/dots starting hint
    ctx.setLineDash([]);
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(width / 2 + 15, height * 0.28, 9, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set actual canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    drawGuideLetter(ctx, rect.width, rect.height);
    setDrawnStrokesCount(0);
    setIsDone(false);

    // Speak initial instruction
    speakArabic(`ارْسُمْ حَرْفَ ${letterInfo.name} بَإِصْبَعِكَ الرَّائِع!`, { rate: 0.85 });
  }, [letterInfo]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else if ('clientX' in e) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
    return { x: 0, y: 0 };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    setIsDrawing(true);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = brushSize;
    ctx.setLineDash([]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();

    setDrawnStrokesCount((prev) => prev + 1);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    // If child traced enough strokes, trigger completion check
    if (drawnStrokesCount > 35 && !isDone) {
      setIsDone(true);
      playStarSound();
    }
  };

  const handleClear = () => {
    playPopSound();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    drawGuideLetter(ctx, rect.width, rect.height);
    setDrawnStrokesCount(0);
    setIsDone(false);
  };

  const handleDone = () => {
    playSuccessSound();
    speakCheer();
    onCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-pop">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black">
              {letterInfo.letter}
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Baloo_Bhaijaan_2']">
                مرسم حرف ({letterInfo.name})
              </h3>
              <p className="text-xs text-indigo-100">ارسم الحرف بإصبعك باتباع النقاط</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AudioButton textToSpeak={`حَرْفُ ${letterInfo.name}`} size="sm" />
            <button
              onClick={() => { playPopSound(); onClose(); }}
              className="cartoon-btn px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs"
            >
              خروج
            </button>
          </div>
        </div>

        {/* Color Palette & Brush Toolbar */}
        <div className="bg-slate-50 p-2 border-b border-slate-200 flex items-center justify-between px-4 gap-2">
          {/* Colors */}
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-slate-500" />
            {PEN_COLORS.map((item) => (
              <button
                key={item.color}
                onClick={() => { playPopSound(); setSelectedColor(item.color); }}
                style={{ backgroundColor: item.color }}
                className={`w-7 h-7 rounded-full transition-transform ${
                  selectedColor === item.color ? 'ring-4 ring-offset-2 ring-indigo-400 scale-110' : 'hover:scale-105'
                }`}
                title={item.name}
              />
            ))}
          </div>

          {/* Reset button */}
          <button
            onClick={handleClear}
            className="cartoon-btn px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            مسح
          </button>
        </div>

        {/* Interactive Tracing Canvas Area */}
        <div className="flex-1 relative bg-gradient-to-b from-indigo-50/40 to-white min-h-[300px] touch-none">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full cursor-crosshair block"
          />

          {/* Little encouragement mascot note */}
          <div className="absolute bottom-3 right-3 bg-white/85 backdrop-blur-sm border border-indigo-100 rounded-2xl px-3 py-1.5 shadow-sm flex items-center gap-2 text-xs font-bold text-indigo-900 pointer-events-none">
            <span className="text-xl">🐱</span>
            <span>ابدأ من النقطة الصفراء وتتبع الخط!</span>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-bold">
            {drawnStrokesCount > 35 ? (
              <span className="text-emerald-600 flex items-center gap-1">
                <Check className="w-4 h-4" /> رائع! خطك جميل جداً!
              </span>
            ) : (
              <span>واصل الرسم لتكتمل اللوحة ✨</span>
            )}
          </div>

          <button
            onClick={handleDone}
            className="cartoon-btn px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm shadow-md hover:brightness-105 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            أنهيت الرسم! احصل على النجوم
          </button>
        </div>
      </div>
    </div>
  );
};
