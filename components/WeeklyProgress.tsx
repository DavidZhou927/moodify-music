import React from 'react';
import { MoodEntry } from '../types';
import { Check, Lock } from 'lucide-react';

interface WeeklyProgressProps {
  entries: MoodEntry[];
  currentDay: number;
}

export const WeeklyProgress: React.FC<WeeklyProgressProps> = ({ entries, currentDay }) => {
  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 rounded-full" />
        
        {/* Active Progress Bar */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 -z-10 rounded-full transition-all duration-500"
          style={{ width: `${((entries.length) / 6) * 100}%` }}
        />

        {days.map((day) => {
          const entry = entries.find(e => e.day === day);
          const isCompleted = !!entry;
          const isCurrent = day === entries.length + 1;
          const isLocked = day > entries.length + 1;

          return (
            <div key={day} className="flex flex-col items-center gap-2">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                  isCompleted 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                    : isCurrent 
                    ? 'bg-slate-900 border-indigo-500 text-indigo-400 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-600'
                }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={3} />
                ) : isLocked ? (
                  <Lock size={14} />
                ) : (
                  <span className="text-xs md:text-sm font-bold">{day}</span>
                )}
              </div>
              <span className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${
                isCompleted ? 'text-indigo-400' : 'text-slate-600'
              }`}>
                Day {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};