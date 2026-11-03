// Arabic Text-to-Speech Engine with child-friendly phonetic pronunciation

export const CHEER_PHRASES = [
  'أحْسَنْتَ يا بَطَل!',
  'رائِعٌ جِدّاً، إِجابَةٌ صَحيحَة!',
  'مُمْتاز! أَنْتَ ذَكِيٌّ جِدّاً!',
  'ما شاءَ الله! عَمَلٌ مُتَمَيِّز!',
  'بَطَلُ القِراءَةِ الصَّغير!'
];

export const RETRY_PHRASES = [
  'حاوِلْ مَرَّةً أُخْرى يا بَطَل!',
  'قَريبٌ جِدّاً! فكِّرْ مَرَّةً ثانِيَة.',
  'لا بَأْس، أَنْتَ تَسْتَطيع!'
];

let arabicVoiceCache: SpeechSynthesisVoice | null = null;

export function getArabicVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }
  if (arabicVoiceCache) return arabicVoiceCache;

  const voices = window.speechSynthesis.getVoices();
  // Find highest quality Arabic voice
  const arVoice = voices.find(v => v.lang.startsWith('ar') || v.lang.includes('ar-SA') || v.lang.includes('ar-EG')) ||
                  voices.find(v => v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('maged') || v.name.toLowerCase().includes('tariq') || v.name.toLowerCase().includes('layla'));

  if (arVoice) {
    arabicVoiceCache = arVoice;
  }
  return arVoice || null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    arabicVoiceCache = null;
    getArabicVoice();
  };
}

import { playLetterMelody } from './soundEffects';

export function speakArabic(
  text: string,
  options?: {
    rate?: number;
    pitch?: number;
    onEnd?: () => void;
    onStart?: () => void;
  }
) {
  // If text is short (like a single letter), trigger the offline synth melody as well
  if (text.length <= 4) {
    playLetterMelody(text);
  }

  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (options?.onEnd) options.onEnd();
    return;
  }

  try {
    // Cancel any ongoing speech to avoid overlap
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = options?.rate ?? 0.85; // slightly slower for clear comprehension by children
    utterance.pitch = options?.pitch ?? 1.1; // warm and slightly cheerful

    const voice = getArabicVoice();
    if (voice) {
      utterance.voice = voice;
    }

    let ended = false;
    const finish = () => {
      if (!ended) {
        ended = true;
        if (options?.onEnd) options.onEnd();
      }
    };

    // Safety timeout in case offline device speech synthesis hangs
    const safetyTimer = setTimeout(finish, Math.min(8000, Math.max(1500, text.length * 150)));

    if (options?.onStart) {
      utterance.onstart = options.onStart;
    }

    utterance.onend = () => {
      clearTimeout(safetyTimer);
      finish();
    };

    utterance.onerror = () => {
      clearTimeout(safetyTimer);
      finish();
    };

    window.speechSynthesis.speak(utterance);
  } catch {
    if (options?.onEnd) options.onEnd();
  }
}

export function stopArabicSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Speak letter with clear phonetic phrasing for young kids
export function speakLetterPhonetic(letter: string, letterName: string) {
  const phrase = `حَرْفُ ${letterName} ... ${letter}`;
  speakArabic(phrase, { rate: 0.8, pitch: 1.15 });
}

export function speakCheer(onEnd?: () => void) {
  const randomCheer = CHEER_PHRASES[Math.floor(Math.random() * CHEER_PHRASES.length)];
  speakArabic(randomCheer, { rate: 0.9, pitch: 1.2, onEnd });
}

export function speakRetry(onEnd?: () => void) {
  const randomRetry = RETRY_PHRASES[Math.floor(Math.random() * RETRY_PHRASES.length)];
  speakArabic(randomRetry, { rate: 0.85, pitch: 1.05, onEnd });
}
