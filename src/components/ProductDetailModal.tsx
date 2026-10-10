import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  Wand2,
  Sliders,
  Layers,
  Leaf,
  MapPin,
  Calendar,
  Award,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { ProduceItem, StylePreset, ImageResolution, GenModel } from '../types/produce';
import { editProduceImage, generateProduceImage } from '../services/api';

interface ProductDetailModalProps {
  item: ProduceItem | null;
  onClose: () => void;
  onAddToCart: (item: ProduceItem, qty: number) => void;
  onUpdateItem: (updated: ProduceItem) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  item,
  onClose,
  onAddToCart,
  onUpdateItem,
}) => {
  if (!item) return null;

  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'retouch'>('info');

  // Retouching / Photo Studio states
  const [editPrompt, setEditPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(item.stylePreset);
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>(item.imageSize || '2K');
  const [selectedModel, setSelectedModel] = useState<GenModel>(item.modelUsed || 'gemini-nano-banana-2.1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddToCart = () => {
    onAddToCart(item, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  // Re-generate photo with selected style and resolution
  const handleRegenerateWithStyle = async (style: StylePreset) => {
    setIsProcessing(true);
    setErrorMessage(null);
    setProcessStatus(`Generating realistic ${style} aesthetic photo with ${selectedModel}...`);

    try {
      const res = await generateProduceImage({
        prompt: item.generationPrompt || `${item.name}, ${item.description}`,
        style,
        model: selectedModel,
        imageSize: selectedResolution,
      });

      const updated: ProduceItem = {
        ...item,
        imageUrl: res.imageUrl,
        stylePreset: style,
        imageSize: selectedResolution,
        modelUsed: res.modelUsed,
        lastEditedAt: new Date().toLocaleTimeString(),
      };
      setSelectedStyle(style);
      onUpdateItem(updated);
      setProcessStatus('Photo updated successfully!');
      setTimeout(() => setProcessStatus(''), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to re-generate photo');
    } finally {
      setIsProcessing(false);
    }
  };

  // Retouch/Edit existing image with text prompt using gemini-nano-banana-2.1
  const handleEditWithNanoBanana = async () => {
    if (!editPrompt.trim()) return;

    setIsProcessing(true);
    setErrorMessage(null);
    setProcessStatus('Retouching photo with gemini-nano-banana-2.1...');

    try {
      const res = await editProduceImage({
        imageBase64: item.imageUrl,
        editPrompt,
        imageSize: selectedResolution,
      });

      const updated: ProduceItem = {
        ...item,
        imageUrl: res.imageUrl,
        modelUsed: 'gemini-nano-banana-2.1',
        imageSize: selectedResolution,
        lastEditedAt: new Date().toLocaleTimeString(),
      };
      onUpdateItem(updated);
      setEditPrompt('');
      setProcessStatus('Retouched & saved!');
      setTimeout(() => setProcessStatus(''), 2500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Image retouching failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#faf8f5] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#ded5c5] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-[#4f483e] shadow-md border border-[#e4dcce] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Left: High-Res Image & Studio Controls */}
          <div className="bg-[#163022] p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/40 border border-white/10 shadow-xl group">
              <img
                src={item.imageUrl}
                alt={item.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Processing Spinner Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
                  <Sparkles className="w-10 h-10 text-[#95d5b2] animate-spin mb-3" />
                  <p className="text-sm font-semibold text-white">{processStatus}</p>
                  <p className="text-xs text-emerald-300/80 mt-1">Applying resolution & aesthetic styling</p>
                </div>
              )}

              {/* Image Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="text-[11px] font-mono-clean uppercase px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[#95d5b2] border border-white/20 font-bold">
                  {item.stylePreset === 'rustic' ? '🪵 Rustic/Dark' : item.stylePreset === 'bright' ? '☀️ Bright/Modern' : '📸 Social Top-Down'}
                </span>
                <span className="text-[11px] font-mono-clean font-bold px-2 py-1 rounded-md bg-[#d4a373] text-[#163022] shadow-xs">
                  {item.imageSize || '2K'}
                </span>
              </div>

              {item.modelUsed && (
                <div className="absolute bottom-3 left-3">
                  <span className="text-[10px] font-mono-clean px-2 py-0.5 rounded-md bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
                    {item.modelUsed}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Aesthetic Switcher below image */}
            <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-[#a3b899]">
                <span className="font-mono-clean uppercase tracking-wider font-semibold">Switch Aesthetic:</span>
                {item.lastEditedAt && <span>Updated {item.lastEditedAt}</span>}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  disabled={isProcessing}
                  onClick={() => handleRegenerateWithStyle('rustic')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border ${
                    selectedStyle === 'rustic'
                      ? 'bg-[#d4a373] text-[#163022] font-bold border-[#d4a373]'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 border-white/15'
                  }`}
                >
                  🪵 Rustic / Dark
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => handleRegenerateWithStyle('bright')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border ${
                    selectedStyle === 'bright'
                      ? 'bg-[#52b788] text-[#163022] font-bold border-[#52b788]'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 border-white/15'
                  }`}
                >
                  ☀️ Bright / Modern
                </button>
                <button
                  disabled={isProcessing}
                  onClick={() => handleRegenerateWithStyle('social')}
                  className={`py-2 px-2 rounded-xl text-xs font-medium text-center transition-all cursor-pointer border ${
                    selectedStyle === 'social'
                      ? 'bg-[#e76f51] text-white font-bold border-[#e76f51]'
                      : 'bg-white/10 text-white/90 hover:bg-white/20 border-white/15'
                  }`}
                >
                  📸 Social (Top-Down)
                </button>
              </div>
            </div>
          </div>

          {/* Right: Produce Details & Retouch Studio */}
          <div className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              {/* Tab navigation */}
              <div className="flex items-center gap-2 border-b border-[#e4dcce] pb-3 mb-5">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activeTab === 'info'
                      ? 'bg-[#1b3a27] text-white'
                      : 'text-[#6e685f] hover:text-[#163022]'
                  }`}
                >
                  Harvest Provenance
                </button>
                <button
                  onClick={() => setActiveTab('retouch')}
                  className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'retouch'
                      ? 'bg-[#1b3a27] text-white'
                      : 'text-[#6e685f] hover:text-[#163022]'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-[#d4a373]" />
                  <span>AI Retouch Studio</span>
                </button>
              </div>

              {activeTab === 'info' ? (
                /* Information Tab */
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2d6a4f] font-mono-clean">
                      {item.category} • {item.organicCertified ? 'USDA Organic' : 'Regenerative'}
                    </span>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#163022] mt-1 leading-snug">
                      {item.name}
                    </h2>
                  </div>

                  <p className="text-sm text-[#5f5950] leading-relaxed">
                    {item.description}
                  </p>

                  {/* Terroir & Origin details */}
                  <div className="bg-white rounded-2xl p-4 border border-[#e4dcce] space-y-2.5 text-xs">
                    <div className="flex items-center gap-2 text-[#4f483e]">
                      <MapPin className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <div>
                        <span className="font-bold text-[#163022]">Terroir Block: </span>
                        <span>{item.harvestLocation}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#4f483e]">
                      <Calendar className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <div>
                        <span className="font-bold text-[#163022]">Harvested: </span>
                        <span>{item.harvestDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-[#4f483e]">
                      <Award className="w-4 h-4 text-[#2d6a4f] shrink-0" />
                      <div>
                        <span className="font-bold text-[#163022]">Standard: </span>
                        <span>Living Soil Bio-Dynamic, Hand-Picked</span>
                      </div>
                    </div>
                  </div>

                  {/* Tasting Notes */}
                  {item.tastingNotes && item.tastingNotes.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#7a7163] font-mono-clean mb-2">
                        Sommelier Tasting Notes:
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item.tastingNotes.map((note, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-[#f4efe6] text-[#4f483e] px-2.5 py-1 rounded-lg border border-[#e4dcce] font-medium"
                          >
                            🌿 {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* AI Retouch Studio Tab */
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif-luxury text-lg font-bold text-[#163022]">
                      AI Retouch & Edit Studio
                    </h3>
                    <p className="text-xs text-[#6e685f] mt-0.5">
                      Prompt-based editing powered by <span className="font-semibold text-[#1b3a27]">gemini-nano-banana-2.1</span> and high-res rendering with <span className="font-semibold text-[#1b3a27]">gemini-3-pro-image-preview</span>.
                    </p>
                  </div>

                  {/* Resolution Affordance Selector (1K, 2K, 4K) */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[#ded5c5]">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[#163022] flex items-center gap-1.5">
                        <Maximize2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                        Image Resolution:
                      </span>
                      <span className="text-[11px] text-[#7a7163]">Affordance selector</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                        <button
                          key={res}
                          type="button"
                          onClick={() => setSelectedResolution(res)}
                          className={`py-1.5 text-xs font-mono-clean font-bold rounded-xl transition-all cursor-pointer ${
                            selectedResolution === res
                              ? 'bg-[#1b3a27] text-white shadow-xs'
                              : 'bg-[#faf8f5] text-[#5f5950] border border-[#ded5c5] hover:bg-[#ede7dc]'
                          }`}
                        >
                          {res} {res === '4K' ? '(Ultra HD)' : res === '2K' ? '(Crisp)' : '(Standard)'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Model Selection */}
                  <div className="bg-white p-3.5 rounded-2xl border border-[#ded5c5]">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-[#163022] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#2d6a4f]" />
                        Generation Engine:
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedModel('gemini-nano-banana-2.1')}
                        className={`py-2 px-2 text-xs rounded-xl font-medium text-left transition-all cursor-pointer border ${
                          selectedModel === 'gemini-nano-banana-2.1'
                            ? 'bg-[#1b3a27] text-white border-[#1b3a27]'
                            : 'bg-[#faf8f5] text-[#5f5950] border-[#ded5c5]'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Nano Banana 2.1</div>
                        <div className="text-[10px] opacity-80">Ideal for create & edit</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedModel('gemini-3-pro-image-preview')}
                        className={`py-2 px-2 text-xs rounded-xl font-medium text-left transition-all cursor-pointer border ${
                          selectedModel === 'gemini-3-pro-image-preview'
                            ? 'bg-[#1b3a27] text-white border-[#1b3a27]'
                            : 'bg-[#faf8f5] text-[#5f5950] border-[#ded5c5]'
                        }`}
                      >
                        <div className="font-bold text-[11px]">Gemini 3 Pro</div>
                        <div className="text-[10px] opacity-80">High-end 1K/2K/4K</div>
                      </button>
                    </div>
                  </div>

                  {/* Text Prompt Edit Input */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#163022] flex items-center gap-1">
                      <Wand2 className="w-3.5 h-3.5 text-[#d4a373]" />
                      Edit Image with Text Prompt:
                    </label>
                    <textarea
                      rows={2}
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="e.g. Add morning dew drops, rustic garden twine, and golden sunrise light"
                      className="w-full text-xs p-3 rounded-xl border border-[#ded5c5] bg-white focus:outline-hidden focus:border-[#2d6a4f]"
                    />
                    <div className="flex flex-wrap gap-1 text-[11px]">
                      <span className="text-[#8c8273]">Quick ideas:</span>
                      <button
                        onClick={() => setEditPrompt('Add crisp morning dew drops and garden shears')}
                        className="text-[#2d6a4f] hover:underline cursor-pointer"
                      >
                        + Dew drops
                      </button>
                      <span className="text-[#c7bcab]">•</span>
                      <button
                        onClick={() => setEditPrompt('Place on dark reclaimed timber with salt crystals')}
                        className="text-[#2d6a4f] hover:underline cursor-pointer"
                      >
                        + Timber & salt
                      </button>
                      <span className="text-[#c7bcab]">•</span>
                      <button
                        onClick={() => setEditPrompt('Warm sunset golden hour rim lighting')}
                        className="text-[#2d6a4f] hover:underline cursor-pointer"
                      >
                        + Golden hour
                      </button>
                    </div>

                    <button
                      disabled={isProcessing || !editPrompt.trim()}
                      onClick={handleEditWithNanoBanana}
                      className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#2d6a4f] hover:bg-[#1f4a36] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
                      <span>Retouch Image via Nano Banana 2.1</span>
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                      {errorMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions: Price, Quantity & Add to Cart */}
            <div className="pt-6 mt-6 border-t border-[#e4dcce] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif-luxury text-3xl font-bold text-[#163022]">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#787165] font-medium">/{item.unit.replace(/^per\s+/i, '')}</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  {item.inStock} available in current harvest
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Stepper */}
                <div className="flex items-center border border-[#ded5c5] rounded-xl bg-white px-2 py-1.5 shadow-2xs">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-1 text-[#6b6457] hover:text-black cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-sm font-bold text-[#163022] min-w-6 text-center">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(item.inStock, qty + 1))}
                    className="p-1 text-[#6b6457] hover:text-black cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    justAdded
                      ? 'bg-[#2d6a4f] text-white'
                      : 'bg-[#1b3a27] hover:bg-[#132a1c] text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-4 h-4 text-[#95d5b2]" />
                      <span>Added to Basket</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-[#95d5b2]" />
                      <span>Add to Basket (${(item.price * qty).toFixed(2)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
