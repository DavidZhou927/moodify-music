export interface MoodEntry {
  id: string;
  day: number; // 1 to 7
  timestamp: number;
  userInput: string;
  enhancedPrompt: string;
  audioUrl: string | null;
  duration: number;
  color?: string;
  isLoading: boolean;
  error?: string;
  genre?: string; // For UI display
}

export interface AppState {
  entries: MoodEntry[];
  currentDay: number;
  weeklyMix: MoodEntry | null;
  currentView: 'home' | 'library' | 'profile';
}

export const MOOD_COLORS = [
  { name: 'Energetic', value: '#F59E0B', label: 'Energetic' }, // Amber
  { name: 'Calm', value: '#3B82F6', label: 'Chill' }, // Blue
  { name: 'Dark', value: '#1E293B', label: 'Dark' }, // Slate
  { name: 'Passionate', value: '#EF4444', label: 'Party' }, // Red
  { name: 'Happy', value: '#10B981', label: 'Happy' }, // Emerald
  { name: 'Dreamy', value: '#8B5CF6', label: 'Dreamy' }, // Violet
  { name: 'Melancholic', value: '#64748B', label: 'Melancholic' }, // Gray
  { name: 'Focused', value: '#14B8A6', label: 'Focus' }, // Teal
];

export const MOOD_PRESETS = [
  { id: 'chill', label: 'Chill', icon: '☕', color: '#3B82F6' },
  { id: 'energetic', label: 'Energetic', icon: '⚡', color: '#F59E0B' },
  { id: 'melancholic', label: 'Melancholic', icon: '🌧️', color: '#64748B' },
  { id: 'focus', label: 'Focus', icon: '🎯', color: '#14B8A6' },
  { id: 'party', label: 'Party', icon: '🎉', color: '#EF4444' },
  { id: 'dreamy', label: 'Dreamy', icon: '🌙', color: '#8B5CF6' },
];
