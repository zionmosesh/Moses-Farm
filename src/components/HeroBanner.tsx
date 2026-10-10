import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Award, Leaf, Wand2 } from 'lucide-react';
import { FarmMetadata, StylePreset } from '../types/produce';

interface HeroBannerProps {
  farm: FarmMetadata;
  heroImage: string;
  onExploreClick: () => void;
  onOpenStudioClick: () => void;
  selectedAesthetic: StylePreset | 'all';
  onSelectAesthetic: (style: StylePreset | 'all') => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  farm,
  heroImage,
  onExploreClick,
  onOpenStudioClick,
  selectedAesthetic,
  onSelectAesthetic,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#163022] text-[#fbf9f5] border-b border-[#2d5a3c]">
      {/* Background Hero Image with atmospheric gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={farm.farmName}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35 scale-105 transform hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#11241a] via-[#163022]/85 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#163022] via-transparent to-black/20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="max-w-2xl space-y-6">
          {/* Farm Provenance Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2d5a3c]/80 border border-[#40916c]/40 text-[#b7e4c7] text-xs font-medium backdrop-blur-sm">
            <Leaf className="w-3.5 h-3.5 text-[#52b788]" />
            <span>{farm.location}</span>
            <span className="text-[#52b788]">•</span>
            <span>Est. {farm.establishedYear}</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            Regenerative Soil, <br />
            <span className="italic font-normal text-[#d4a373]">Exceptional Harvest.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#d8dfd9] leading-relaxed font-light">
            {farm.tagline} Upload any raw text menu to instantly generate realistic, high-end agricultural photography styled across our signature editorial aesthetics.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreClick}
              className="px-6 py-3.5 rounded-xl bg-[#d4a373] hover:bg-[#c29162] text-[#163022] font-semibold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Shop Current Harvest</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenStudioClick}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-[#95d5b2]" />
              <span>Upload Menu & AI Shoot</span>
            </button>
          </div>

          {/* Style Toggles Filter Strip */}
          <div className="pt-6 border-t border-white/15">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs uppercase tracking-wider text-[#a3b899] font-medium font-mono-clean">
                Browse Visual Aesthetics:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onSelectAesthetic('all')}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium cursor-pointer ${
                    selectedAesthetic === 'all'
                      ? 'bg-white text-[#163022] font-semibold shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  All Produce
                </button>
                <button
                  onClick={() => onSelectAesthetic('rustic')}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                    selectedAesthetic === 'rustic'
                      ? 'bg-[#d4a373] text-[#163022] font-semibold shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>🪵 Rustic / Dark</span>
                </button>
                <button
                  onClick={() => onSelectAesthetic('bright')}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                    selectedAesthetic === 'bright'
                      ? 'bg-[#52b788] text-[#163022] font-semibold shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>☀️ Bright / Modern</span>
                </button>
                <button
                  onClick={() => onSelectAesthetic('social')}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all font-medium flex items-center gap-1.5 cursor-pointer ${
                    selectedAesthetic === 'social'
                      ? 'bg-[#e76f51] text-white font-semibold shadow-xs'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>📸 Social Media (Flat-lay)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Bottom Banner */}
      <div className="relative z-10 bg-[#11241a]/95 border-t border-[#234230] py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#a3b899]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#52b788]" />
            <span>100% Certified Organic & Non-GMO</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#52b788]" />
            <span>Harvested & Chilled Within 6 Hours</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#52b788]" />
            <span>Direct Fair-Price Farmer Payout</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4a373]" />
            <span>AI Studio Powered by Gemini 3 Pro & Nano Banana</span>
          </div>
        </div>
      </div>
    </div>
  );
};
