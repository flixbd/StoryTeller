import React, { useState } from 'react';
import { X, Sparkles, BookOpen, Loader2 } from 'lucide-react';
import { StoryData } from '../data/stories';

interface StoryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryGenerated: (newStory: StoryData) => void;
}

export const StoryGeneratorModal: React.FC<StoryGeneratorModalProps> = ({
  isOpen,
  onClose,
  onStoryGenerated,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [theme, setTheme] = useState('');
  const [contextPrompt, setContextPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const presets = [
    {
      title: 'মহেশ',
      author: 'শরৎচন্দ্র চট্টোপাধ্যায়',
      theme: 'দারিদ্র্য, অবোলা জীবের ভালোবাসা ও সমাজের নিষ্ঠুরতা',
      contextPrompt:
        'বৈশাখ মাসের প্রখর রৌদ্রে ফাটল ধরা শুকনো মাটির সাথে নিরুপায় কৃষক গফুরের বক্ষের রক্তক্ষরণের মিল রেখে শুরু হবে।',
    },
    {
      title: 'পোস্টমাস্টার',
      author: 'রবীন্দ্রনাথ ঠাকুর',
      theme: 'নির্জন প্রবাস, অনাথ বালিকা রতনের নিঃশব্দ ভালোবাসা ও বিচ্ছেদ',
      contextPrompt:
        'বর্ষায় ভরা নদীর ঘূর্ণিজল আর বৃষ্টির অবিরাম ধারায় রতনের স্তব্ধ নিঃসঙ্গ চোখের জলের রূপক তুলে ধরা।',
    },
    {
      title: 'মেঘমল্লার',
      author: 'বিভূতিভূষণ বন্দ্যোপাধ্যায়',
      theme: 'ভারতীয় উচ্চাঙ্গ সঙ্গীতের আধ্যাত্মিক শক্তি ও প্রকৃতির মেলবন্ধন',
      contextPrompt:
        'প্রাচীন তপোবনের সায়াহ্নে মেঘমল্লার রাগের ধীর আলাপ এবং আকাশে পুঞ্জীভূত মেঘের গর্জন।',
    },
  ];

  const handleApplyPreset = (p: (typeof presets)[0]) => {
    setTitle(p.title);
    setAuthor(p.author);
    setTheme(p.theme);
    setContextPrompt(p.contextPrompt);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          theme,
          contextPrompt,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.story) {
        throw new Error(data.error || 'চিত্রনাট্য তৈরি করা সম্ভব হয়নি');
      }

      const generated = data.story;
      // Convert to StoryData interface format
      const formattedStory: StoryData = {
        id: 'gen-' + Date.now(),
        title: generated.title || title,
        subtitle: 'Bengali Classics by Arnab শৈলীতে একক কথকের অডিও ড্রামা',
        originalAuthor: generated.author || author || 'অজ্ঞাতনামা কথাশিল্পী',
        dramatizationStyle: 'Versatile Audio Storyteller Solo Performance',
        theme: generated.theme || theme,
        durationEst: '১২ - ১৫ মিনিট',
        heroImage: '/src/assets/images/misty_pond_dawn_1790306582395.jpg',
        characters: (generated.characters || []).map((c: any, idx: number) => ({
          name: c.name,
          role: c.name,
          voiceDescription: c.voiceDescription || 'বহুমুখী স্বর',
          characterKey: idx === 0 ? 'narrator' : idx === 1 ? 'nishith' : 'other',
        })),
        acts: (generated.acts || []).map((act: any) => ({
          actNumber: act.actNumber || 1,
          actTitle: act.actTitle || 'পর্ব',
          sfx: act.sfx || '',
          bgm: act.bgm || '',
          narratorTone: act.narratorTone || 'গম্ভীর ও প্রজ্ঞাপূর্ণ',
          ambientType: 'dawn_mist',
          scenes: (act.scenes || []).map((sc: any, scIdx: number) => ({
            id: `gen-sc-${act.actNumber}-${scIdx}`,
            speaker: sc.speaker || 'কথক',
            emotion: sc.emotion || 'স্বগত ভাষণ',
            text: sc.text || '',
            sfxCue: sc.sfxCue,
            characterKey:
              sc.speaker?.includes('কথক')
                ? 'narrator'
                : 'other',
          })),
        })),
        philosophicalOpening:
          generated.acts?.[0]?.scenes?.[0]?.text ||
          'মানুষের জীবনে কিছু স্মৃতি চিরকাল নদীর জলের মতো নিঃশব্দে বয়ে চলে...',
        literaryEpilogue: {
          analysis:
            generated.epilogue?.literaryAnalysis ||
            'গল্পের প্রতিটি উপমা পাঠকের হৃদয়কে ছুঁয়ে যায়...',
          quote: generated.title + ' — অমর বাংলা ক্লাসিক',
        },
      };

      onStoryGenerated(formattedStory);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'চিত্রনাট্য তৈরি ব্যর্থ হয়েছে');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#161210] border border-[#2C241E] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2C241E] bg-[#14100E] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-[#D97706]" />
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#FDFBF7]">
                আর্নব স্টাইলে নতুন অডিও চিত্রনাট্য তৈরি
              </h2>
              <p className="text-xs text-[#8C8275]">
                Gemini 3.8 Flash দিয়ে যেকোনো ধ্রুপদী গল্পের দার্শনিক সূচনা, উপমা ও চরিত্র তৈরি করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#8C8275] hover:text-[#FDFBF7] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Form */}
        <form onSubmit={handleGenerate} className="p-5 overflow-y-auto space-y-4">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-sans text-[#A89F91] mb-1.5 block">
              জনপ্রিয় ধ্রুপদী গল্প থেকে বেছে নিন (Quick Presets):
            </label>
            <div className="grid grid-cols-3 gap-2">
              {presets.map((p) => (
                <button
                  type="button"
                  key={p.title}
                  onClick={() => handleApplyPreset(p)}
                  className="p-2 rounded border border-[#2C241E] bg-[#120F0D] hover:bg-[#1C1713] hover:border-[#D97706]/40 text-left text-xs transition-colors"
                >
                  <div className="font-serif font-bold text-[#FDFBF7]">{p.title}</div>
                  <div className="text-[11px] text-[#7C7265] truncate">{p.author}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title and Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-sans text-[#A89F91] block mb-1">
                গল্পের শিরোনাম *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="যেমন: মহেশ"
                className="w-full px-3 py-2 rounded border border-[#2C241E] bg-[#120F0D] text-sm text-[#FDFBF7] font-serif focus:outline-none focus:border-[#D97706]"
              />
            </div>
            <div>
              <label className="text-xs font-sans text-[#A89F91] block mb-1">
                মূল লেখক
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="যেমন: শরৎচন্দ্র চট্টোপাধ্যায়"
                className="w-full px-3 py-2 rounded border border-[#2C241E] bg-[#120F0D] text-sm text-[#FDFBF7] font-serif focus:outline-none focus:border-[#D97706]"
              />
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="text-xs font-sans text-[#A89F91] block mb-1">
              গল্পের মূলসুর / থিম
            </label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="যেমন: প্রেম, দারিদ্র্য ও অনমনীয় আত্মমর্যাদা"
              className="w-full px-3 py-2 rounded border border-[#2C241E] bg-[#120F0D] text-sm text-[#FDFBF7] font-serif focus:outline-none focus:border-[#D97706]"
            />
          </div>

          {/* Opening scene simile / metaphor prompt */}
          <div>
            <label className="text-xs font-sans text-[#A89F91] block mb-1">
              সূচনার মনস্তাত্ত্বিক ভাবনা ও প্রাকৃতিক উপমা (Arnab's Signature Intro):
            </label>
            <textarea
              value={contextPrompt}
              onChange={(e) => setContextPrompt(e.target.value)}
              rows={3}
              placeholder="কথক কীভাবে কোনো দৃশ্য (যেমন কুয়াশা, ঝরা পাতা, ট্রামলাইন বা শান্ত পুকুর) দিয়ে লেখকের মনের গভীর ভাবনা মিলিয়ে শুরু করবেন..."
              className="w-full p-3 rounded border border-[#2C241E] bg-[#120F0D] text-sm text-[#FDFBF7] font-serif focus:outline-none focus:border-[#D97706] resize-none"
            />
          </div>

          {errorMsg && (
            <div className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded border border-red-900/50">
              {errorMsg}
            </div>
          )}

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#2C241E]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded border border-[#2C241E] text-xs text-[#A89F91] hover:text-[#FDFBF7]"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isGenerating || !title}
              className="px-4 py-2 rounded bg-[#D97706] hover:bg-[#F59E0B] text-[#120F0D] font-sans font-semibold text-xs transition-colors flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>চিত্রনাট্য লেখা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>চিত্রনাট্য তৈরি করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
