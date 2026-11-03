export type AgeGroup = 'level1' | 'level2' | 'level3';

export interface LetterInfo {
  id: string;
  letter: string;
  name: string;
  transliteration: string;
  shapes: {
    isolated: string;
    initial: string;
    medial: string;
    final: string;
  };
  harakat: {
    fatha: { text: string; example: string; exampleMeaning: string; emoji: string };
    damma: { text: string; example: string; exampleMeaning: string; emoji: string };
    kasra: { text: string; example: string; exampleMeaning: string; emoji: string };
    sukun: { text: string; example: string; exampleMeaning: string; emoji: string };
  };
  exampleWord: string;
  exampleEmoji: string;
  exampleSentence: string;
  color: string;
  tracingPoints?: { x: number; y: number }[][];
}

export interface CharacterMascot {
  id: string;
  name: string;
  title: string;
  avatar: string;
  color: string;
  greeting: string;
  cheerPhrase: string;
}

export interface Story {
  id: string;
  title: string;
  level: AgeGroup;
  emoji: string;
  coverColor: string;
  summary: string;
  pages: {
    text: string;
    imageEmoji: string;
    audioText?: string;
  }[];
  questions: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredStars: number;
}

export interface UserProgress {
  childName: string;
  avatar: string;
  selectedCharacterId: string;
  totalStars: number;
  level: AgeGroup;
  completedLetters: string[];
  completedGamesCount: number;
  completedStories: string[];
  mistakeLetters: string[]; // Letters that need review
  soundEnabled: boolean;
  voiceSpeed: number; // 0.8 - 1.1
}
