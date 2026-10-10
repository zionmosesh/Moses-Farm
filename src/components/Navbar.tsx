import React from 'react';
import { Sprout, ShoppingBag, Sparkles, UploadCloud, ClipboardList, Camera } from 'lucide-react';
import { FarmMetadata } from '../types/produce';

interface NavbarProps {
  currentTab: 'marketplace' | 'studio' | 'photolab' | 'about';
  onSelectTab: (tab: 'marketplace' | 'studio' | 'photolab' | 'about') => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  farm: FarmMetadata;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenOrders,
  farm,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/90 backdrop-blur-md border-b border-[#e7dfd1] transition-all">
      {/* Top Banner Notice */}
      <div className="bg-[#1b3a27] text-[#e8f5e9] text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-[#52b788] animate-pulse"></span>
        <span>Peak Harvest Season — Dawn-picked organic produce delivered locally within 24 hours</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Producer Brand */}
          <div
            onClick={() => onSelectTab('marketplace')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1b3a27] to-[#2d6a4f] text-[#fbf9f5] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 text-[#95d5b2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#163022]">
                  Verdant Harvest
                </span>
                <span className="text-[10px] font-mono-clean font-semibold uppercase bg-[#e8f0ea] text-[#1b3a27] px-2 py-0.5 rounded-full border border-[#c3dec9]">
                  Agro E-Com
                </span>
              </div>
              <p className="text-xs text-[#6e685f] line-clamp-1 max-w-[220px] sm:max-w-xs">
                Featuring <span className="font-medium text-[#2d6a4f]">{farm.farmName}</span>
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#ede7dc]/60 p-1.5 rounded-2xl border border-[#ded5c5]">
            <button
              onClick={() => onSelectTab('marketplace')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'marketplace'
                  ? 'bg-white text-[#163022] shadow-sm font-semibold'
                  : 'text-[#5f5950] hover:text-[#163022] hover:bg-white/50'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-[#2d6a4f]" />
              Marketplace
            </button>

            <button
              onClick={() => onSelectTab('studio')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 relative ${
                currentTab === 'studio'
                  ? 'bg-[#1b3a27] text-white shadow-sm font-semibold'
                  : 'text-[#5f5950] hover:text-[#163022] hover:bg-white/50'
              }`}
            >
              <UploadCloud className={`w-4 h-4 ${currentTab === 'studio' ? 'text-[#95d5b2]' : 'text-[#2d6a4f]'}`} />
              <span>Upload Menu & Shoot</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52b788] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#40916c]"></span>
              </span>
            </button>

            <button
              onClick={() => onSelectTab('photolab')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                currentTab === 'photolab'
                  ? 'bg-white text-[#163022] shadow-sm font-semibold'
                  : 'text-[#5f5950] hover:text-[#163022] hover:bg-white/50'
              }`}
            >
              <Camera className="w-4 h-4 text-[#d4a373]" />
              AI Photo Lab
            </button>

            <button
              onClick={() => onSelectTab('about')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentTab === 'about'
                  ? 'bg-white text-[#163022] shadow-sm font-semibold'
                  : 'text-[#5f5950] hover:text-[#163022] hover:bg-white/50'
              }`}
            >
              Farm Provenance
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Orders History Button */}
            <button
              onClick={onOpenOrders}
              title="Recent Orders"
              className="p-2.5 rounded-xl border border-[#ded5c5] bg-white hover:bg-[#f4efe6] text-[#4f483e] transition-colors relative"
            >
              <ClipboardList className="w-5 h-5" />
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] text-white shadow-sm transition-all group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#95d5b2]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#d4a373] text-stone-900 text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-emerald-200 uppercase tracking-wider font-semibold">Your Basket</span>
                <span className="text-sm font-bold">${cartTotal.toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#e7dfd1] text-xs">
          <button
            onClick={() => onSelectTab('marketplace')}
            className={`py-1 px-2 rounded-lg font-medium flex items-center gap-1.5 ${
              currentTab === 'marketplace' ? 'bg-[#1b3a27] text-white' : 'text-[#5f5950]'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Market
          </button>
          <button
            onClick={() => onSelectTab('studio')}
            className={`py-1 px-2 rounded-lg font-medium flex items-center gap-1.5 ${
              currentTab === 'studio' ? 'bg-[#1b3a27] text-white' : 'text-[#5f5950]'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Menu
          </button>
          <button
            onClick={() => onSelectTab('photolab')}
            className={`py-1 px-2 rounded-lg font-medium flex items-center gap-1.5 ${
              currentTab === 'photolab' ? 'bg-[#1b3a27] text-white' : 'text-[#5f5950]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            AI Lab
          </button>
          <button
            onClick={() => onSelectTab('about')}
            className={`py-1 px-2 rounded-lg font-medium ${
              currentTab === 'about' ? 'bg-[#1b3a27] text-white' : 'text-[#5f5950]'
            }`}
          >
            About Farm
          </button>
        </div>
      </div>
    </header>
  );
};
