import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, Wand2, Sparkles, Check, Info } from 'lucide-react';
import { ProduceItem, StylePreset } from '../types/produce';

interface ProduceCardProps {
  item: ProduceItem;
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onOpenDetails: (item: ProduceItem) => void;
  onQuickRestyle: (item: ProduceItem, newStyle: StylePreset) => void;
  isRestyling?: boolean;
}

const STYLE_BADGES: Record<
  StylePreset,
  { label: string; icon: string; bg: string; text: string; border: string }
> = {
  rustic: {
    label: 'Rustic / Dark',
    icon: '🪵',
    bg: 'bg-amber-950/80',
    text: 'text-amber-200',
    border: 'border-amber-700/40',
  },
  bright: {
    label: 'Bright / Modern',
    icon: '☀️',
    bg: 'bg-emerald-900/80',
    text: 'text-emerald-200',
    border: 'border-emerald-600/40',
  },
  social: {
    label: 'Social Flat-lay',
    icon: '📸',
    bg: 'bg-rose-950/80',
    text: 'text-rose-200',
    border: 'border-rose-700/40',
  },
};

export const ProduceCard: React.FC<ProduceCardProps> = ({
  item,
  onAddToCart,
  onOpenDetails,
  onQuickRestyle,
  isRestyling = false,
}) => {
  const [qty, setQty] = useState(1);
  const [showStyleMenu, setShowStyleMenu] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const badge = STYLE_BADGES[item.stylePreset] || STYLE_BADGES.rustic;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(item, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onOpenDetails(item)}
      className="group bg-white rounded-2xl border border-[#e4dcce] hover:border-[#2d6a4f]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Produce Image Container */}
      <div className="relative aspect-[4/3] w-full bg-[#f4efe6] overflow-hidden">
        <img
          src={item.imageUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Loading Overlay when re-styling */}
        {isRestyling && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4 text-center z-20">
            <Sparkles className="w-8 h-8 text-[#95d5b2] animate-spin mb-2" />
            <p className="text-xs font-semibold">Generating realistic photo...</p>
            <p className="text-[10px] text-emerald-200 mt-1">Applying aesthetic lighting & terroir</p>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
          {/* Aesthetic Style Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            <span>{badge.icon}</span>
            <span>{badge.label}</span>
          </div>

          {/* Resolution Badge */}
          {item.imageSize && (
            <div className="bg-black/65 backdrop-blur-md text-white text-[10px] font-mono-clean font-bold px-2 py-0.5 rounded-md border border-white/20">
              {item.imageSize}
            </div>
          )}
        </div>

        {/* Floating Quick Re-Style Action */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-3 right-3 z-10"
        >
          <div className="relative">
            <button
              onClick={() => setShowStyleMenu(!showStyleMenu)}
              title="Change Photo Aesthetic"
              className="bg-white/90 hover:bg-white text-[#163022] p-2 rounded-xl shadow-md border border-[#e4dcce] hover:border-[#1b3a27] transition-all flex items-center gap-1 text-xs font-medium backdrop-blur-sm"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
              <span className="hidden sm:inline text-[11px]">Re-Style</span>
            </button>

            {showStyleMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-xl shadow-2xl border border-[#ded5c5] p-1.5 text-xs z-30 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold uppercase text-[#8c8273] px-2 py-1 tracking-wider">
                  Re-Shoot Aesthetic:
                </p>
                <button
                  onClick={() => {
                    onQuickRestyle(item, 'rustic');
                    setShowStyleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#f4efe6] flex items-center gap-2 text-[#342f28]"
                >
                  <span>🪵</span>
                  <span>Rustic / Dark</span>
                </button>
                <button
                  onClick={() => {
                    onQuickRestyle(item, 'bright');
                    setShowStyleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#f4efe6] flex items-center gap-2 text-[#342f28]"
                >
                  <span>☀️</span>
                  <span>Bright / Modern</span>
                </button>
                <button
                  onClick={() => {
                    onQuickRestyle(item, 'social');
                    setShowStyleMenu(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#f4efe6] flex items-center gap-2 text-[#342f28]"
                >
                  <span>📸</span>
                  <span>Social Media (Top-down)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Harvest Freshess Tag */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="bg-[#1b3a27]/90 backdrop-blur-sm text-[#95d5b2] text-[10px] font-medium px-2 py-0.5 rounded-md border border-[#2d6a4f]/50">
            {item.harvestDate.includes('morning') || item.harvestDate.includes('today')
              ? '🌿 Fresh Picked'
              : '🌱 Farm Direct'}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Terroir */}
          <div className="flex items-center justify-between text-xs text-[#7e7669] mb-1">
            <span className="font-semibold text-[#2d6a4f] uppercase tracking-wider text-[11px]">
              {item.category}
            </span>
            <span className="line-clamp-1 text-[11px] font-mono-clean">{item.harvestLocation.split('(')[0]}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif-luxury font-bold text-lg text-[#163022] group-hover:text-[#2d6a4f] transition-colors leading-snug line-clamp-2">
            {item.name}
          </h3>

          {/* Sensory Description */}
          <p className="text-xs text-[#5e584f] mt-1 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          {/* Tasting Notes */}
          {item.tastingNotes && item.tastingNotes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2.5">
              {item.tastingNotes.slice(0, 3).map((note, idx) => (
                <span
                  key={idx}
                  className="text-[10px] bg-[#f4efe6] text-[#635c51] px-2 py-0.5 rounded-md font-medium"
                >
                  {note}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Cart Actions */}
        <div className="pt-3 border-t border-[#f0e9dc] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-serif-luxury text-xl font-bold text-[#163022]">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-[11px] text-[#787165] font-medium">/{item.unit.replace(/^per\s+/i, '')}</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-medium">
              {item.inStock > 5 ? `${item.inStock} in stock` : `Only ${item.inStock} left!`}
            </div>
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5"
          >
            {/* Quantity Stepper */}
            <div className="flex items-center border border-[#ded5c5] rounded-xl bg-[#faf8f5] px-1 py-0.5">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1 text-[#6b6457] hover:text-black cursor-pointer"
                title="Decrease"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-1.5 text-xs font-semibold text-[#163022] min-w-4 text-center">
                {qty}
              </span>
              <button
                onClick={() => setQty(Math.min(item.inStock, qty + 1))}
                className="p-1 text-[#6b6457] hover:text-black cursor-pointer"
                title="Increase"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Add Button */}
            <button
              onClick={handleAdd}
              className={`p-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center cursor-pointer ${
                justAdded
                  ? 'bg-[#2d6a4f] text-white scale-95'
                  : 'bg-[#1b3a27] hover:bg-[#132a1c] text-white'
              }`}
              title="Add to Basket"
            >
              {justAdded ? (
                <Check className="w-4 h-4 text-[#95d5b2]" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-[#95d5b2]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
