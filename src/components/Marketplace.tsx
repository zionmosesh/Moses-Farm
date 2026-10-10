import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles, Filter, Leaf, ArrowUpDown } from 'lucide-react';
import { ProduceCategory, ProduceItem, StylePreset } from '../types/produce';
import { ProduceCard } from './ProduceCard';

interface MarketplaceProps {
  items: ProduceItem[];
  onAddToCart: (item: ProduceItem, quantity: number) => void;
  onOpenDetails: (item: ProduceItem) => void;
  onQuickRestyle: (item: ProduceItem, newStyle: StylePreset) => void;
  onOpenStudio: () => void;
  selectedAesthetic: StylePreset | 'all';
  onSelectAesthetic: (style: StylePreset | 'all') => void;
  restylingItemId?: string | null;
}

const CATEGORIES: Array<'All' | ProduceCategory> = [
  'All',
  'Vegetables',
  'Leafy Greens',
  'Roots & Tubers',
  'Fruits & Berries',
  'Artisanal & Honey',
];

export const Marketplace: React.FC<MarketplaceProps> = ({
  items,
  onAddToCart,
  onOpenDetails,
  onQuickRestyle,
  onOpenStudio,
  selectedAesthetic,
  onSelectAesthetic,
  restylingItemId,
}) => {
  const [activeCategory, setActiveCategory] = useState<'All' | ProduceCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name'>('featured');

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (activeCategory !== 'All' && item.category !== activeCategory) {
        return false;
      }
      // Style aesthetic filter
      if (selectedAesthetic !== 'all' && item.stylePreset !== selectedAesthetic) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.category.toLowerCase().includes(query);
        const matchesNotes = item.tastingNotes?.some((n) => n.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesNotes) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0; // featured
    });
  }, [items, activeCategory, selectedAesthetic, searchQuery, sortBy]);

  return (
    <section id="marketplace-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Section Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-[#2d6a4f] text-xs font-bold uppercase tracking-wider font-mono-clean">
            <Leaf className="w-3.5 h-3.5" />
            <span>Farm Direct Catalog</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#163022] mt-1">
            Current Farm Harvest
          </h2>
          <p className="text-sm text-[#666056] mt-1 max-w-xl">
            Each item is generated with realistic terroir details, pricing, and visual style presets. Click any product to inspect harvest notes or refine its photo.
          </p>
        </div>

        {/* Upload menu quick shortcut */}
        <button
          onClick={onOpenStudio}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#95d5b2]" />
          <span>Upload Custom Farm Menu</span>
        </button>
      </div>

      {/* Filter and Search Bar Control Strip */}
      <div className="bg-white rounded-2xl p-4 border border-[#e4dcce] shadow-xs mb-8 space-y-4">
        {/* Row 1: Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#9c9384] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tomatoes, figs, chanterelles, beets..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#ded5c5] bg-[#faf8f5] focus:bg-white focus:outline-hidden focus:border-[#2d6a4f] transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#9c9384] hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-[#7d7466] font-medium flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs py-2 px-3 rounded-xl border border-[#ded5c5] bg-[#faf8f5] focus:bg-white focus:outline-hidden focus:border-[#2d6a4f] text-[#342f28] font-medium cursor-pointer"
            >
              <option value="featured">Featured Harvest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Produce Name (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Category Pills & Style Preset Toggles */}
        <div className="pt-3 border-t border-[#f0e9dc] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1b3a27] text-white font-semibold shadow-xs'
                    : 'bg-[#faf8f5] text-[#635c51] hover:bg-[#ede7dc] border border-[#e4dcce]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Style Preset Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-bold text-[#8c8273] uppercase tracking-wider font-mono-clean mr-1">
              Style:
            </span>
            <button
              onClick={() => onSelectAesthetic('all')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                selectedAesthetic === 'all'
                  ? 'bg-[#1b3a27] text-white'
                  : 'bg-[#faf8f5] text-[#635c51] border border-[#ded5c5]'
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => onSelectAesthetic('rustic')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                selectedAesthetic === 'rustic'
                  ? 'bg-[#d4a373] text-[#163022] font-semibold'
                  : 'bg-[#faf8f5] text-[#635c51] border border-[#ded5c5]'
              }`}
            >
              <span>🪵 Rustic</span>
            </button>
            <button
              onClick={() => onSelectAesthetic('bright')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                selectedAesthetic === 'bright'
                  ? 'bg-[#52b788] text-[#163022] font-semibold'
                  : 'bg-[#faf8f5] text-[#635c51] border border-[#ded5c5]'
              }`}
            >
              <span>☀️ Bright</span>
            </button>
            <button
              onClick={() => onSelectAesthetic('social')}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                selectedAesthetic === 'social'
                  ? 'bg-[#e76f51] text-white font-semibold'
                  : 'bg-[#faf8f5] text-[#635c51] border border-[#ded5c5]'
              }`}
            >
              <span>📸 Social</span>
            </button>
          </div>
        </div>
      </div>

      {/* Produce Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <ProduceCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onOpenDetails={onOpenDetails}
              onQuickRestyle={onQuickRestyle}
              isRestyling={restylingItemId === item.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-[#ded5c5] p-12 text-center max-w-lg mx-auto my-12 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#f4efe6] text-[#2d6a4f] mx-auto flex items-center justify-center">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-[#163022]">
            No produce matches this filter
          </h3>
          <p className="text-xs text-[#7a7163]">
            Try adjusting your search query, switching categories, or upload a new text-based menu to generate fresh catalog items.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveCategory('All');
                onSelectAesthetic('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl border border-[#ded5c5] text-xs font-semibold text-[#163022] hover:bg-[#f4efe6] cursor-pointer"
            >
              Reset Filters
            </button>
            <button
              onClick={onOpenStudio}
              className="px-4 py-2 rounded-xl bg-[#1b3a27] text-white text-xs font-semibold hover:bg-[#132a1c] cursor-pointer"
            >
              Upload Menu
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
