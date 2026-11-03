import { UserProgress, Badge } from '../types';

const STORAGE_KEY = 'alam_alhoroof_user_progress_v1';

export const INITIAL_PROGRESS: UserProgress = {
  childName: 'البطل الصغير',
  avatar: '👦',
  selectedCharacterId: 'rabbit',
  totalStars: 5,
  level: 'level1',
  completedLetters: ['أ', 'ب'],
  completedGamesCount: 0,
  completedStories: [],
  mistakeLetters: [],
  soundEnabled: true,
  voiceSpeed: 0.85,
};

export const BADGES: Badge[] = [
  {
    id: 'first_letter',
    title: 'نجم الحروف الأول',
    description: 'تعرفت على أول حرف بنجاح!',
    icon: '🌟',
    unlocked: true,
    requiredStars: 5,
  },
  {
    id: 'letter_master',
    title: 'صائد الحروف',
    description: 'تعرفت على 10 حروف عربية!',
    icon: '🎯',
    unlocked: false,
    requiredStars: 25,
  },
  {
    id: 'harakat_hero',
    title: 'بطل الحركات',
    description: 'أتقنت الفتحة والضمة والكسرة!',
    icon: '⚡',
    unlocked: false,
    requiredStars: 50,
  },
  {
    id: 'word_builder',
    title: 'مهندس الكلمات',
    description: 'قمت بتركيب وقراءة 15 كلمة!',
    icon: '🧩',
    unlocked: false,
    requiredStars: 80,
  },
  {
    id: 'spelling_champ',
    title: 'عبقري الإملاء',
    description: 'اجتزت تحديات الإملاء بدون أخطاء!',
    icon: '🏆',
    unlocked: false,
    requiredStars: 120,
  },
  {
    id: 'master_reader',
    title: 'أمير القراءة',
    description: 'قرأت القصص وأجبت عن أسئلة الفهم القرائي!',
    icon: '👑',
    unlocked: false,
    requiredStars: 160,
  },
];

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...INITIAL_PROGRESS, ...parsed };
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // LocalStorage quota or restricted
  }
}

export function addStars(count: number): UserProgress {
  const current = loadProgress();
  const updated: UserProgress = {
    ...current,
    totalStars: current.totalStars + count,
    completedGamesCount: current.completedGamesCount + 1,
  };
  saveProgress(updated);
  return updated;
}

export function markLetterComplete(letter: string): UserProgress {
  const current = loadProgress();
  if (current.completedLetters.includes(letter)) return current;
  const updated: UserProgress = {
    ...current,
    completedLetters: [...current.completedLetters, letter],
    totalStars: current.totalStars + 3,
  };
  saveProgress(updated);
  return updated;
}

export function recordLetterMistake(letter: string): UserProgress {
  const current = loadProgress();
  if (current.mistakeLetters.includes(letter)) return current;
  const updated: UserProgress = {
    ...current,
    mistakeLetters: [...current.mistakeLetters, letter],
  };
  saveProgress(updated);
  return updated;
}

export function clearLetterMistake(letter: string): UserProgress {
  const current = loadProgress();
  const updated: UserProgress = {
    ...current,
    mistakeLetters: current.mistakeLetters.filter(l => l !== letter),
  };
  saveProgress(updated);
  return updated;
}

export function markStoryComplete(storyId: string): UserProgress {
  const current = loadProgress();
  if (current.completedStories.includes(storyId)) return current;
  const updated: UserProgress = {
    ...current,
    completedStories: [...current.completedStories, storyId],
    totalStars: current.totalStars + 10,
  };
  saveProgress(updated);
  return updated;
}
