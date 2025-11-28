import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';

interface MusicCardProps {
  src: string;
  title: string;
  genre: string;
  color: string;
  duration?: number;
}

export const MusicCard: React.FC<MusicCardProps> = ({ src, title, genre, color }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Pause all other audios (simple hack for this demo)
      document.querySelectorAll('audio').forEach(a => {
        if (a !== audioRef.current) a.pause();
      });
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-[#1e293b] rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all group hover:bg-[#253045]">
      <audio ref={audioRef} src={src} />
      
      {/* Cover Art Area */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
        {/* Generative Gradient Background */}
        <div 
           className="w-full h-full bg-gradient-to-br"
           style={{ 
             backgroundImage: `linear-gradient(135deg, ${color} 0%, #0f172a 100%)`
           }}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
           <button 
             onClick={togglePlay}
             className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-all hover:bg-indigo-500"
           >
             {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
           </button>
        </div>
        
        {/* Visualizer Effect (Static for now) */}
        {isPlaying && (
           <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 h-4 items-end">
              <div className="w-1 bg-white/80 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-1 bg-white/80 animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-white/80 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 bg-white/80 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
           </div>
        )}
      </div>

      {/* Info */}
      <div>
        <h3 className="font-bold text-slate-100 text-lg mb-1 truncate">{title}</h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2 min-h-[40px]">{genre}</p>
        
        <div className="flex gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-slate-800 text-slate-400">
                {color === '#F59E0B' ? 'Energetic' : 'Ambient'}
            </span>
            <div className="flex-1" />
            <button className="text-slate-500 hover:text-white">
                <MoreHorizontal size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};
