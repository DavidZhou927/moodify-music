import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Download, Music, Clock } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
  prompt?: string;
  duration?: number;
  color?: string;
  date?: string;
  type?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  src, 
  title, 
  prompt, 
  duration = 30, 
  color = '#6366f1',
  date,
  type = "Daily Clip"
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="group bg-slate-900/40 hover:bg-slate-800/60 border border-white/5 rounded-xl p-4 transition-all duration-300 flex items-center gap-4">
      <audio ref={audioRef} src={src} preload="metadata" />
      
      {/* Thumbnail */}
      <div 
        className="h-12 w-12 rounded-lg flex items-center justify-center shrink-0 relative overflow-hidden"
        style={{ backgroundColor: `${color}20` }}
      >
        <Music size={20} style={{ color: color }} className="z-10" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: color }} />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-slate-200 truncate">{title || "Generated Track"}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-500">
           {type && <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">{type}</span>}
           {date && <span>{date}</span>}
        </div>
      </div>

      {/* Duration */}
      <div className="hidden md:block text-xs text-slate-500 font-mono w-12 text-right">
        {formatTime(duration)}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="h-9 w-9 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 transition-transform"
        >
          {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
        </button>
        
        <a 
            href={src} 
            download={`moodify-${title || 'track'}.mp3`}
            className="p-2 text-slate-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
        >
            <Download size={18} />
        </a>
      </div>
    </div>
  );
};
