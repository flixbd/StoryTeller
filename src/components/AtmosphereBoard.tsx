import React from 'react';
import { Volume2, CloudRain, Sunrise, Wind, Building2, Bell, Radio, Sparkles } from 'lucide-react';
import { AmbientMood, SFXType, storyAudio } from '../utils/audioEngine';

interface AtmosphereBoardProps {
  currentAmbient: AmbientMood;
  onSelectAmbient: (mood: AmbientMood) => void;
  onTriggerSFX: (type: SFXType) => void;
  vintageWarmth: boolean;
  onToggleVintageWarmth: (val: boolean) => void;
}

export const AtmosphereBoard: React.FC<AtmosphereBoardProps> = ({
  currentAmbient,
  onSelectAmbient,
  onTriggerSFX,
  vintageWarmth,
  onToggleVintageWarmth,
}) => {
  const ambientPresets: { id: AmbientMood; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'dawn_mist',
      label: 'ভোরের কুহেলিকা',
      icon: <Sunrise className="w-4 h-4 text-amber-400" />,
      desc: 'বাঁশপাতার খসখস ও ধীর তানপুরা',
    },
    {
      id: 'monsoon_rain',
      label: 'শ্রাবণের বৃষ্টি',
      icon: <CloudRain className="w-4 h-4 text-blue-400" />,
      desc: 'মুষলধারে বৃষ্টি ও দূরবর্তী মেঘ',
    },
    {
      id: 'peaceful_village',
      label: 'পল্লীর সকাল',
      icon: <Wind className="w-4 h-4 text-emerald-400" />,
      desc: 'শান্ত পুকুরঘাট ও স্নিগ্ধ বাঁশি',
    },
    {
      id: 'calcutta_alley',
      label: 'কলকাতার অলিগলি',
      icon: <Building2 className="w-4 h-4 text-stone-400" />,
      desc: 'স্যাঁতসেঁতে গলি ও বিষাদময় আবহ',
    },
  ];

  const sfxList: { id: SFXType; label: string }[] = [
    { id: 'bird_chirp', label: 'পাখির করুণ ডাক' },
    { id: 'thunder', label: 'বিজলি ও মেঘের ডাক' },
    { id: 'tram_bell', label: 'ট্রামলাইনের ঘণ্টা' },
    { id: 'door_creak', label: 'পুরনো কবাটের ক্যাঁচক্যাঁচ' },
    { id: 'door_bang', label: 'সশব্দে দরজা বন্ধ (BANG!)' },
    { id: 'paper_tear', label: 'নোট কুটি-কুটি করে ছেঁড়া' },
    { id: 'flute_chord', label: 'বিষাদময় বাঁশি' },
    { id: 'sitar_strum', label: 'সেতারের সুর' },
  ];

  return (
    <div className="border border-[#2C241E] bg-[#161210] rounded-lg p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#2C241E]">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-[#D97706]" />
          <h3 className="font-serif text-sm font-semibold text-[#F5EFE6]">
            আবহ ও ধ্বনি পরিকল্পনা (Soundscapes & SFX)
          </h3>
        </div>
        <button
          onClick={() => onToggleVintageWarmth(!vintageWarmth)}
          className={`px-2.5 py-1 text-xs rounded border transition-colors flex items-center gap-1.5 ${
            vintageWarmth
              ? 'border-[#B45309]/50 bg-[#B45309]/20 text-[#F59E0B]'
              : 'border-[#2C241E] bg-[#120F0D] text-[#8C8275]'
          }`}
          title="ভিন্টেজ অ্যানালগ স্টুডিও রিবন মাইক্রোফোন ও টিউব ওয়ার্মথ ফিল্টার"
        >
          <Sparkles className="w-3 h-3" />
          <span>অ্যানালগ টেপ ওয়ার্মথ: {vintageWarmth ? 'অন' : 'অফ'}</span>
        </button>
      </div>

      {/* Ambient Mood Presets */}
      <div>
        <div className="text-xs text-[#8C8275] mb-2 font-sans">প্রকৃতির সজীব আবহ (Ambient Drone)</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ambientPresets.map((item) => {
            const isActive = currentAmbient === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectAmbient(isActive ? 'none' : item.id)}
                className={`p-2.5 rounded text-left border transition-all ${
                  isActive
                    ? 'border-[#D97706] bg-[#241A14] text-[#F5EFE6] shadow-sm'
                    : 'border-[#2C241E] bg-[#120F0D]/60 hover:bg-[#1C1713] text-[#A89F91]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {item.icon}
                  <span className="font-serif text-xs font-medium text-[#F5EFE6]">
                    {item.label}
                  </span>
                </div>
                <div className="text-[11px] text-[#7C7265] leading-tight line-clamp-1">
                  {item.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SFX Quick triggers */}
      <div>
        <div className="text-xs text-[#8C8275] mb-2 font-sans flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-[#D97706]" />
          <span>নাট্য মুহূর্তের শব্দ সংকেত (Instant SFX Cues)</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sfxList.map((sfx) => (
            <button
              key={sfx.id}
              onClick={() => onTriggerSFX(sfx.id)}
              className="px-2.5 py-1 text-xs rounded border border-[#2C241E] bg-[#120F0D] hover:bg-[#201A16] hover:border-[#D97706]/40 text-[#C2B7A3] transition-colors"
            >
              {sfx.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
