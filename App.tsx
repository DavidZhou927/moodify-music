import React, { useState, useEffect } from 'react';
import { MoodEntry, AppState } from './types';
import { enhanceMoodPrompt, generateWeeklyMixPrompt } from './services/geminiService';
import { generateAudio } from './services/stabilityService';
import { MoodInput } from './components/MoodInput';
import { AudioPlayer } from './components/AudioPlayer';
import { MusicCard } from './components/MusicCard';
import { 
  Music4, Disc3, Sparkles, Home, Library, User, LogOut, 
  Settings, ExternalLink, ArrowRight, Wand2, Save, Clock, Loader2 
} from 'lucide-react';

const STORAGE_KEY = 'mood_melody_data_v2';

export default function App() {
  const [apiKey, setApiKey] = useState<string>('');
  // Initialize from LocalStorage or Default
  const [state, setState] = useState<AppState>(() => {
     const saved = localStorage.getItem(STORAGE_KEY);
     if (saved) {
        try { return JSON.parse(saved); } catch (e) { console.error(e); }
     }
     return { entries: [], currentDay: 1, weeklyMix: null, currentView: 'home' };
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const handleGenerateDay = async (text: string, color: string) => {
    if (!apiKey) {
      setState(s => ({ ...s, currentView: 'profile' }));
      setError("Please add your Stability API Key in Profile settings first.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);

    try {
      const enhancedPrompt = await enhanceMoodPrompt(text, color);
      const audioBlob = await generateAudio(enhancedPrompt, 30, apiKey);
      
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        const newEntry: MoodEntry = {
          id: Date.now().toString(),
          day: state.entries.length + 1,
          timestamp: Date.now(),
          userInput: text,
          enhancedPrompt,
          audioUrl: base64Audio,
          duration: 30,
          color,
          isLoading: false,
          genre: enhancedPrompt.split('|')[0] || 'Ambient'
        };

        setState(prev => ({
          ...prev,
          entries: [...prev.entries, newEntry],
          currentDay: prev.entries.length + 2,
          currentView: 'library' // Redirect to library to see result
        }));
        setIsGenerating(false);
      };
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Generation failed.");
      setIsGenerating(false);
    }
  };

  const handleGenerateWeeklyMix = async () => {
    if (!apiKey) {
        setState(s => ({ ...s, currentView: 'profile' }));
        setError("Please add your Stability API Key to generate the Weekly Mix.");
        return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const allPrompts = state.entries.map(e => e.enhancedPrompt);
      const mixPrompt = await generateWeeklyMixPrompt(allPrompts);
      const audioBlob = await generateAudio(mixPrompt, 90, apiKey);
      
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        const mixEntry: MoodEntry = {
          id: 'weekly-mix-' + Date.now(),
          day: 8,
          timestamp: Date.now(),
          userInput: 'Weekly Mix',
          enhancedPrompt: mixPrompt,
          audioUrl: base64Audio,
          duration: 90,
          color: '#8b5cf6',
          isLoading: false,
          genre: 'Weekly Fusion'
        };
        setState(prev => ({ ...prev, weeklyMix: mixEntry }));
        setIsGenerating(false);
      };
    } catch (err: any) {
      setError(err.message);
      setIsGenerating(false);
    }
  };

  const navItemClass = (view: string) => `
    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer
    ${state.currentView === view 
      ? 'bg-indigo-600/10 text-indigo-400 border-l-2 border-indigo-500' 
      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}
  `;

  // --- Views ---

  const renderHome = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-5xl mx-auto">
        <MoodInput 
            onGenerate={handleGenerateDay} 
            isGenerating={isGenerating} 
        />
        
        {/* Latest Clips Mini Section */}
        {state.entries.length > 0 && (
            <div className="w-full mt-12 px-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles size={20} className="text-indigo-400" />
                        Latest Clips
                    </h3>
                    <button 
                        onClick={() => setState(s => ({...s, currentView: 'library'}))}
                        className="text-sm text-slate-400 hover:text-white flex items-center gap-1"
                    >
                        View Library <ArrowRight size={14} />
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {state.entries.slice(-3).reverse().map(entry => (
                        <MusicCard 
                            key={entry.id}
                            title={entry.userInput}
                            genre={entry.genre || "Ambient"}
                            src={entry.audioUrl!}
                            color={entry.color || "#6366f1"}
                        />
                    ))}
                </div>
            </div>
        )}
    </div>
  );

  const renderLibrary = () => (
    <div className="max-w-6xl mx-auto pt-4">
        {/* Weekly Header */}
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-2xl font-bold text-white mb-1">Week of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h2>
                <p className="text-slate-400 text-sm">{state.entries.length} Clips Created</p>
            </div>
            {state.entries.length >= 7 ? (
                <button 
                    onClick={handleGenerateWeeklyMix}
                    disabled={isGenerating}
                    className={`
                        px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                        ${isGenerating 
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'}
                    `}
                >
                    {isGenerating ? (
                        <>
                            <Loader2 size={16} className="animate-spin" />
                            Compiling...
                        </>
                    ) : (
                        <>
                            <Wand2 size={16} />
                            Compile Weekly Single
                        </>
                    )}
                </button>
            ) : (
                <div className="px-4 py-2 rounded-lg bg-slate-800/50 text-slate-500 text-sm border border-slate-700">
                    {Math.max(0, 7 - state.entries.length)} clips until Weekly Mix
                </div>
            )}
        </div>

        {/* Weekly Mix Showcase */}
        {state.weeklyMix && (
            <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/30 rounded-2xl flex items-center gap-6">
                 <div className="h-24 w-24 rounded-xl bg-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-purple-900/50">
                    <Disc3 size={40} className="text-white animate-spin-slow" />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">Your Weekly Compilation</h3>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-1">{state.weeklyMix.enhancedPrompt}</p>
                    <div className="max-w-md">
                        <AudioPlayer src={state.weeklyMix.audioUrl!} title="Weekly Mix" type="Compilation" color="#8b5cf6" />
                    </div>
                 </div>
            </div>
        )}

        {/* Grid View */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {state.entries.map((entry) => (
                <MusicCard 
                    key={entry.id}
                    title={entry.userInput}
                    genre={entry.enhancedPrompt.split('|')[0] || "Ambient"}
                    color={entry.color || "#6366f1"}
                    src={entry.audioUrl!}
                />
            ))}
            {/* Empty States for grid */}
            {Array.from({ length: Math.max(0, 7 - state.entries.length) }).map((_, i) => (
                <div key={i} className="aspect-square rounded-2xl border-2 border-dashed border-slate-800 flex items-center justify-center text-slate-700">
                    <span className="text-sm font-medium">Day {state.entries.length + i + 1}</span>
                </div>
            ))}
        </div>

        {/* Full History List */}
        <div className="mt-12">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Clock size={18} className="text-slate-500" /> Full History
            </h3>
            <div className="space-y-3 bg-[#0f172a] rounded-xl p-4 border border-slate-800">
                 {/* Table Header */}
                 <div className="grid grid-cols-12 text-xs text-slate-500 font-medium px-4 pb-2 uppercase tracking-wider">
                    <div className="col-span-12 md:col-span-6">Title</div>
                    <div className="hidden md:block col-span-2">Type</div>
                    <div className="hidden md:block col-span-3 text-right">Date</div>
                    <div className="hidden md:block col-span-1 text-right">Dur</div>
                 </div>
                 
                 {state.entries.length === 0 && (
                    <div className="text-center py-8 text-slate-500 italic">No history yet. Start your journey!</div>
                 )}

                 {state.entries.slice().reverse().map(entry => (
                    <div key={entry.id} className="grid grid-cols-12 items-center gap-4 py-1">
                        <div className="col-span-12 md:col-span-6">
                            <AudioPlayer 
                                src={entry.audioUrl!} 
                                title={entry.userInput} 
                                type="Daily Clip" 
                                color={entry.color} 
                                duration={30}
                            />
                        </div>
                        <div className="hidden md:block col-span-2">
                            <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400 border border-slate-700">Daily Clip</span>
                        </div>
                        <div className="hidden md:block col-span-3 text-right text-sm text-slate-400">
                            {new Date(entry.timestamp).toLocaleDateString()}
                        </div>
                        <div className="hidden md:block col-span-1 text-right text-sm text-slate-500 font-mono">
                            0:30
                        </div>
                    </div>
                 ))}
            </div>
        </div>
    </div>
  );

  const renderProfile = () => (
    <div className="max-w-3xl mx-auto pt-8">
        <div className="bg-[#1e293b] border border-slate-700/50 rounded-2xl overflow-hidden mb-8">
            <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <User size={20} className="text-indigo-400" /> Public Profile
                </h2>
            </div>
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Display Name</label>
                    <input type="text" value="Music Enthusiast" disabled className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-slate-300" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                    <textarea value="Music enthusiast & AI explorer" disabled className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-3 text-slate-300 h-24 resize-none" />
                </div>
            </div>
        </div>

        <div className="bg-[#1e293b] border border-indigo-500/30 rounded-2xl overflow-hidden shadow-lg shadow-indigo-500/5">
            <div className="p-6 border-b border-indigo-500/20 bg-indigo-500/5">
                <h2 className="text-xl font-bold text-indigo-100 flex items-center gap-2">
                    <Settings size={20} className="text-indigo-400" /> Integration Settings
                </h2>
            </div>
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-slate-200">Stability AI API Key</label>
                    <a href="https://platform.stability.ai/" target="_blank" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                        Get Key <ExternalLink size={10} />
                    </a>
                </div>
                <div className="relative">
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..." 
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-4 text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
                <p className="mt-3 text-xs text-slate-500">
                    This key is used locally to generate music via Stability AI. It is not stored on our servers.
                </p>
                <div className="mt-6 flex justify-end">
                    <button className="bg-white text-slate-900 px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
  );

  // --- Main Layout ---

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col z-50">
        <div className="p-8 flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg">
                <Music4 className="text-white h-6 w-6" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Moodify</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            <div onClick={() => setState(s => ({...s, currentView: 'home'}))} className={navItemClass('home')}>
                <Home size={20} /> <span className="font-medium">Home</span>
            </div>
            <div onClick={() => setState(s => ({...s, currentView: 'library'}))} className={navItemClass('library')}>
                <Library size={20} /> <span className="font-medium">My Library</span>
            </div>
            <div onClick={() => setState(s => ({...s, currentView: 'profile'}))} className={navItemClass('profile')}>
                <User size={20} /> <span className="font-medium">Profile</span>
            </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <LogOut size={20} /> <span className="font-medium">Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 relative overflow-hidden min-h-screen">
         {/* Top Bar / Status */}
         <div className="absolute top-8 right-8 flex items-center gap-4 z-40">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-xs text-slate-400">
                 <span className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                 {apiKey ? 'Device Connected' : 'Simulated Mode'}
             </div>
             <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 p-0.5">
                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="rounded-full bg-slate-900" />
             </div>
         </div>

         {/* Error Toast */}
         {error && (
            <div className="absolute top-24 right-8 bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl max-w-sm z-50 animate-bounce">
                {error}
            </div>
         )}

         {/* View Router */}
         <div className="mt-12 animate-fade-in">
             {state.currentView === 'home' && renderHome()}
             {state.currentView === 'library' && renderLibrary()}
             {state.currentView === 'profile' && renderProfile()}
         </div>
      </main>

    </div>
  );
}