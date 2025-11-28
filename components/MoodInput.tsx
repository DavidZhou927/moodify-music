import React, { useState } from 'react';
import { MOOD_PRESETS } from '../types';
import { Loader2, Mic, Sparkles } from 'lucide-react';

interface MoodInputProps {
  onGenerate: (text: string, color: string) => void;
  isGenerating: boolean;
}

export const MoodInput: React.FC<MoodInputProps> = ({ onGenerate, isGenerating }) => {
  const [text, setText] = useState('');
  const [selectedMood, setSelectedMood] = useState(MOOD_PRESETS[0]);

  const handleSubmit = () => {
    if (!text.trim() && !selectedMood) return;
    const promptText = text.trim() || selectedMood.label;
    onGenerate(promptText, selectedMood.color);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-[#1e293b]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -z-10" />

        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="text-white">How are you</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              feeling today?
            </span>
          </h1>
        </div>

        {/* Mood Chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {MOOD_PRESETS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border ${
                selectedMood.id === mood.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/25 scale-105'
                  : 'bg-slate-800/50 text-slate-400 border-white/5 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <span>{mood.icon}</span>
              {mood.label}
            </button>
          ))}
          <button className="w-10 h-10 rounded-full bg-slate-800/50 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors">
            <span className="text-lg">🎨</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl p-2 pl-6 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Describe your mood, we'll write lyrics about it..."
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500 h-12"
            disabled={isGenerating}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          
          <button className="p-3 text-slate-500 hover:text-slate-300 transition-colors">
            <Mic size={20} />
          </button>

          <button
            onClick={handleSubmit}
            disabled={isGenerating}
            className="bg-white hover:bg-slate-100 text-slate-900 font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isGenerating ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5 fill-indigo-500 stroke-indigo-500" />
            )}
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};
