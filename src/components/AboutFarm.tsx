import React from 'react';
import { Leaf, Award, MapPin, Heart, ShieldCheck, Sprout, Sparkles } from 'lucide-react';
import { FarmMetadata } from '../types/produce';

interface AboutFarmProps {
  farm: FarmMetadata;
  heroImage: string;
  onOpenStudio: () => void;
}

export const AboutFarm: React.FC<AboutFarmProps> = ({ farm, heroImage, onOpenStudio }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero section */}
      <div className="bg-[#163022] rounded-3xl overflow-hidden text-white border border-[#2d5a3c] grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 sm:p-12 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d5a3c]/80 text-[#95d5b2] text-xs font-mono-clean font-bold uppercase">
              <Sprout className="w-3.5 h-3.5" />
              <span>Living Soil Stewardship</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold leading-tight">
              {farm.farmName}
            </h2>
            <p className="text-xs text-[#a3b899] font-mono-clean">
              Located in {farm.location} • Established {farm.establishedYear}
            </p>
          </div>

          <p className="text-sm sm:text-base text-[#d8dfd9] leading-relaxed">
            {farm.story}
          </p>

          <div className="pt-4 border-t border-white/10 flex flex-wrap gap-2">
            {farm.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1.5 rounded-xl bg-white/10 text-emerald-200 border border-white/15 font-medium"
              >
                ✓ {cert}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[300px] lg:min-h-full">
          <img
            src={heroImage}
            alt="Farm Fields"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#163022]/80 via-transparent to-transparent lg:hidden"></div>
        </div>
      </div>

      {/* 3 Pillars of Agricultural Integrity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f5e9] text-[#1b3a27] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#2d6a4f]" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-[#163022]">
            Regenerative Living Soil
          </h3>
          <p className="text-xs text-[#6e685f] leading-relaxed">
            We nourish mycorrhizal fungi and beneficial microbes with multi-species cover crops and organic compost, resulting in minerals and micronutrients far surpassing industrial farming.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] text-[#92400e] flex items-center justify-center">
            <Award className="w-6 h-6 text-[#d97706]" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-[#163022]">
            Rare Heirloom Genetics
          </h3>
          <p className="text-xs text-[#6e685f] leading-relaxed">
            By planting open-pollinated heritage seeds bred for nuanced flavor rather than shelf life, every tomato, carrot, and berry carries centuries of authentic culinary character.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#ede7dc] text-[#163022] flex items-center justify-center">
            <Heart className="w-6 h-6 text-[#2d6a4f]" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-[#163022]">
            Direct Farm-to-Consumer
          </h3>
          <p className="text-xs text-[#6e685f] leading-relaxed">
            Cutting out wholesale aggregators allows 100% fair pricing to farmers and guarantees you receive produce picked that very morning at peak natural sweetness.
          </p>
        </div>
      </div>

      {/* Producer Callout */}
      <div className="bg-[#faf8f5] rounded-3xl p-8 border border-[#ded5c5] text-center space-y-4 max-w-2xl mx-auto">
        <Sparkles className="w-8 h-8 text-[#d4a373] mx-auto" />
        <h3 className="font-serif-luxury text-2xl font-bold text-[#163022]">
          Are You a Local Agricultural Producer?
        </h3>
        <p className="text-xs text-[#6e685f] leading-relaxed">
          Upload your text-based menu to generate photorealistic produce catalogs across Rustic/Dark, Bright/Modern, and Social Media aesthetics in minutes.
        </p>
        <button
          onClick={onOpenStudio}
          className="px-6 py-3 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] text-white text-xs font-semibold shadow-md cursor-pointer"
        >
          Open Producer AI Studio
        </button>
      </div>
    </section>
  );
};
