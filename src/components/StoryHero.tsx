import React from 'react';
import { StoryData } from '../data/stories';
import { Play, Pause, RotateCcw, Volume2, Mic } from 'lucide-react';

interface StoryHeroProps {
  story: StoryData;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  currentActIndex: number;
}

export const StoryHero: React.FC<StoryHeroProps> = ({
  story,
  isPlaying,
  onTogglePlay,
  onRestart,
  currentActIndex,
}) => {
  return (
    <div className="relative rounded-xl border border-[#2C241E] bg-[#161210] overflow-hidden">
      {/* Background Hero Banner with soft dark scrim */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img
          src={story.heroImage}
          alt={story.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-60 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#161210] via-[#161210]/60 to-transparent" />

        {/* Floating Top Info */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-sans text-[#E0D5C1] bg-[#120F0D]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#2C241E]">
            <span className="text-[#D97706] font-medium">মূল রচনা: {story.originalAuthor}</span>
            <span aria-hidden="true" className="text-[#594F45]">·</span>
            <span>{story.durationEst}</span>
            <span aria-hidden="true" className="text-[#594F45]">·</span>
            <span>৬ পর্বের পূর্ণাঙ্গ অডিও ড্রামা</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#E0D5C1] bg-[#120F0D]/80 backdrop-blur-md px-3 py-1.5 rounded border border-[#2C241E]">
            <Mic className="w-3.5 h-3.5 text-[#D97706]" />
            <span>@BengaliClassicsByArnab শৈলী</span>
          </div>
        </div>

        {/* Hero Title & Philosophical Subtitle */}
        <div className="absolute bottom-6 left-6 right-6 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FDFBF7] tracking-tight mb-2 drop-shadow-md">
            {story.title}
          </h1>
          <p className="text-sm sm:text-base font-serif italic text-[#C2B7A3] leading-relaxed drop-shadow line-clamp-2">
            “{story.philosophicalOpening}”
          </p>
        </div>
      </div>

      {/* Story Meta & Quick Actions Bar */}
      <div className="p-4 sm:p-6 border-t border-[#2C241E] bg-[#14100E] flex flex-wrap items-center justify-between gap-4">
        {/* Story Theme & Act Progress */}
        <div className="space-y-1">
          <div className="text-xs text-[#8C8275] font-sans">
            <span>গল্পের মূলসুর:</span>{' '}
            <span className="text-[#C2B7A3] font-medium">{story.theme}</span>
          </div>
          <div className="text-xs font-serif text-[#D97706]">
            চলমান: {story.acts[currentActIndex]?.actTitle || 'পর্ব সমাপ্ত'}
          </div>
        </div>

        {/* Master Play Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRestart}
            className="p-2.5 rounded-lg border border-[#2C241E] bg-[#1A1411] hover:bg-[#261E1A] text-[#A89F91] hover:text-[#F5EFE6] transition-colors"
            title="গল্পের শুরুতে ফিরে যান"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className="px-5 py-2.5 rounded-lg bg-[#D97706] hover:bg-[#F59E0B] text-[#120F0D] font-sans font-semibold text-sm transition-all shadow-md flex items-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>স্থগিত রাখুন (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>শুনুন পুরো গল্প (Play Solo Drama)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
