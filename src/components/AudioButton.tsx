import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { speakArabic, stopArabicSpeech } from '../utils/speech';
import { playPopSound } from '../utils/soundEffects';

interface AudioButtonProps {
  textToSpeak: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  rate?: number;
  pitch?: number;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToSpeak,
  size = 'md',
  className = '',
  label,
  rate = 0.85,
  pitch = 1.1,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();

    if (isPlaying) {
      stopArabicSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speakArabic(textToSpeak, {
      rate,
      pitch,
      onStart: () => setIsPlaying(true),
      onEnd: () => setIsPlaying(false),
    });
  };

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm p-1.5',
    md: 'w-11 h-11 text-base p-2',
    lg: 'w-14 h-14 text-lg p-3',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <button
      onClick={handleClick}
      title="استمع إلى النطق"
      aria-label={label || 'استمع إلى النطق'}
      className={`cartoon-btn rounded-2xl flex items-center justify-center gap-2 font-bold cursor-pointer transition select-none ${
        isPlaying
          ? 'bg-amber-400 text-amber-950 scale-105 ring-4 ring-amber-200'
          : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-md'
      } ${sizeClasses[size]} ${className}`}
    >
      {isPlaying ? (
        <Volume2 className={`${iconSizes[size]} animate-bounce`} />
      ) : (
        <Volume2 className={iconSizes[size]} />
      )}
      {label && <span className="text-sm font-black">{label}</span>}
    </button>
  );
};
