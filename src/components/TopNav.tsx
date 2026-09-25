import React from 'react';
import { Volume2, Sparkles, Sliders, BookOpen } from 'lucide-react';

interface TopNavProps {
  onOpenVoiceStudio: () => void;
  onOpenGenerator: () => void;
  onOpenAnalysis: () => void;
  activeStoryTitle: string;
  speechEngineMode: 'gemini_neural' | 'browser_native';
  geminiVoicePersona: string;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenVoiceStudio,
  onOpenGenerator,
  onOpenAnalysis,
  activeStoryTitle,
  speechEngineMode,
  geminiVoicePersona,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2C241E] bg-[#120F0D]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[#B45309]/20 border border-[#B45309]/40 flex items-center justify-center text-[#D97706]">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif text-lg tracking-tight text-[#F5EFE6] font-semibold block leading-none">
              বাংলা অডিও ক্লাসিক্স
            </span>
            <span className="text-[11px] font-sans text-[#A89F91] tracking-wide block mt-1">
              Bengali Classics by Arnab শৈলীতে একক কথকের আলেখ্য
            </span>
          </div>
        </div>

        {/* Zone 2: Clean nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-sans text-[#C2B7A3]">
          <span className="text-[#D97706] font-medium">
            এখন শুনছেন: {activeStoryTitle}
          </span>
          <button
            onClick={onOpenAnalysis}
            className="hover:text-[#F5EFE6] transition-colors flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4 text-[#A89F91]" />
            সাহিত্যিক বিশ্লেষণ
          </button>
          <button
            onClick={onOpenVoiceStudio}
            className="hover:text-[#F5EFE6] transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#201813] border border-[#B45309]/40"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="text-xs text-[#F5EFE6]">
              {speechEngineMode === 'gemini_neural'
                ? `এআই নিউরাল কণ্ঠ (${geminiVoicePersona})`
                : 'ডিফল্ট ব্রাউজার কণ্ঠ'}
            </span>
          </button>
        </nav>

        {/* Zone 3: Primary action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenGenerator}
            className="px-3.5 py-1.5 text-xs font-sans font-medium text-[#120F0D] bg-[#D97706] hover:bg-[#F59E0B] transition-colors rounded shadow-sm flex items-center gap-1.5 whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>নতুন গল্প ও নাট্যরূপ তৈরি</span>
          </button>
        </div>
      </div>
    </header>
  );
};
