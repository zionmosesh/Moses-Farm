import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  Wand2,
  Maximize2,
  Layers,
  Download,
  Share2,
  RefreshCw,
  Check,
  Sliders,
} from 'lucide-react';
import { StylePreset, ImageResolution, GenModel } from '../types/produce';
import { generateProduceImage, editProduceImage } from '../services/api';

const INSPIRATIONS = [
  'Deep purple heirloom Cherokee beefsteak tomatoes on weathered dark oak with rosemary',
  'Crisp baby butterhead lettuce heads in handmade minimalist white ceramic plate under soft morning light',
  'Flat-lay top-down composition of ripe black mission figs, wild strawberries and honeycomb jar on linen cloth',
  'Freshly harvested golden chioggia beets and purple carrots with leafy tops and water droplets',
  'Wild foraged golden chanterelle mushrooms in rustic woven wicker farm basket with pine needles',
  'Cluster of bright golden cherry tomatoes on the vine with dew drops and garden shears',
];

export const PhotoLab: React.FC = () => {
  const [prompt, setPrompt] = useState(INSPIRATIONS[0]);
  const [style, setStyle] = useState<StylePreset>('rustic');
  const [model, setModel] = useState<GenModel>('gemini-3-pro-image-preview');
  const [imageSize, setImageSize] = useState<ImageResolution>('2K');
  const [aspectRatio, setAspectRatio] = useState<string>('4:3');

  // Generation result
  const [currentImage, setCurrentImage] = useState<string>(
    '/src/assets/images/produce_rustic_dark_1791634350540.jpg'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Edit / Retouch state using gemini-nano-banana-2.1
  const [editPrompt, setEditPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await generateProduceImage({
        prompt,
        style,
        model,
        imageSize,
        aspectRatio,
      });
      setCurrentImage(res.imageUrl);
    } catch (err: any) {
      setErrorMsg(err.message || 'Image generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRetouch = async () => {
    if (!editPrompt.trim() || !currentImage) return;
    setIsEditing(true);
    setErrorMsg(null);

    try {
      const res = await editProduceImage({
        imageBase64: currentImage,
        editPrompt,
        imageSize,
      });
      setCurrentImage(res.imageUrl);
      setEditPrompt('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Image retouch failed');
    } finally {
      setIsEditing(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e4dcce] shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#f0e9dc] pb-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e8f5e9] text-[#1b3a27] text-xs font-mono-clean font-bold uppercase mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Interactive Agro Photo Studio</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-bold text-[#163022]">
              Produce Photography Lab
            </h2>
            <p className="text-sm text-[#666056] mt-1 max-w-2xl">
              Experiment directly with <span className="font-semibold text-[#1b3a27]">gemini-3-pro-image-preview</span> and <span className="font-semibold text-[#1b3a27]">gemini-nano-banana-2.1</span>. Test high-resolution 1K, 2K, 4K rendering and the three signature aesthetic styles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Prompt Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#163022] font-mono-clean uppercase">
                Describe the Agricultural Produce:
              </label>
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe heirloom produce, texture, containers, background..."
                className="w-full text-xs p-3.5 rounded-2xl border border-[#ded5c5] bg-[#faf8f5] focus:bg-white focus:outline-hidden focus:border-[#2d6a4f]"
              />

              {/* Inspiration Chips */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-[#8c8273] font-mono-clean uppercase block mb-1">
                  Inspiration Prompts:
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {INSPIRATIONS.map((insp, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPrompt(insp)}
                      className="text-[11px] bg-[#faf8f5] hover:bg-[#ede7dc] text-[#554e43] border border-[#ded5c5] px-2.5 py-1 rounded-lg text-left line-clamp-1 cursor-pointer"
                    >
                      💡 {insp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Aesthetic Style Toggles */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#163022] font-mono-clean uppercase">
                Aesthetic Style Toggle:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setStyle('rustic')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    style === 'rustic'
                      ? 'bg-[#2b1810] text-[#fbf9f5] border-[#d4a373] shadow-xs font-bold'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <span className="block text-xl">🪵</span>
                  <span className="text-xs">Rustic/Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStyle('bright')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    style === 'bright'
                      ? 'bg-[#1b3a27] text-white border-[#52b788] shadow-xs font-bold'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <span className="block text-xl">☀️</span>
                  <span className="text-xs">Bright/Modern</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStyle('social')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    style === 'social'
                      ? 'bg-[#3b2319] text-white border-[#e76f51] shadow-xs font-bold'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <span className="block text-xl">📸</span>
                  <span className="text-xs">Social Top-Down</span>
                </button>
              </div>
            </div>

            {/* Resolution Affordance (1K, 2K, 4K) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#163022] font-mono-clean uppercase">
                  Image Resolution Affordance:
                </label>
                <span className="text-[10px] text-emerald-800 font-bold">1K / 2K / 4K</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setImageSize(res)}
                    className={`py-2 rounded-xl font-mono-clean font-bold text-xs border transition-all cursor-pointer ${
                      imageSize === res
                        ? 'bg-[#163022] text-white border-[#163022] shadow-xs'
                        : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#163022] font-mono-clean uppercase">
                Generation Model:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setModel('gemini-3-pro-image-preview')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    model === 'gemini-3-pro-image-preview'
                      ? 'bg-[#1b3a27] text-white border-[#1b3a27]'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <div className="font-bold text-xs">gemini-3-pro-image</div>
                  <div className="text-[10px] opacity-80">Pro Image Preview</div>
                </button>
                <button
                  type="button"
                  onClick={() => setModel('gemini-nano-banana-2.1')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    model === 'gemini-nano-banana-2.1'
                      ? 'bg-[#1b3a27] text-white border-[#1b3a27]'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <div className="font-bold text-xs">nano-banana-2.1</div>
                  <div className="text-[10px] opacity-80">Create & Edit Model</div>
                </button>
              </div>
            </div>

            <button
              disabled={isGenerating || !prompt.trim()}
              onClick={handleGenerate}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#95d5b2] animate-spin" />
                  <span>Shooting Photo with {model}...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4 text-[#95d5b2]" />
                  <span>Generate Photo ({imageSize})</span>
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Image Canvas & Retouch Tool Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="bg-[#163022] rounded-3xl p-4 sm:p-6 text-white border border-[#2d5a3c] shadow-lg relative flex-1 flex flex-col justify-between">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-white/10 group">
                <img
                  src={currentImage}
                  alt="AI Generated Produce"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-6">
                    <Sparkles className="w-12 h-12 text-[#95d5b2] animate-spin mb-3" />
                    <p className="font-serif-luxury text-lg text-white">Rendering High-End Harvest Photo</p>
                    <p className="text-xs text-emerald-300 mt-1">Applying {style} lighting & {imageSize} resolution</p>
                  </div>
                )}

                {isEditing && (
                  <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-6">
                    <Wand2 className="w-12 h-12 text-[#d4a373] animate-spin mb-3" />
                    <p className="font-serif-luxury text-lg text-white">Retouching via Nano Banana 2.1</p>
                    <p className="text-xs text-amber-200 mt-1">Refining photo textures and details</p>
                  </div>
                )}

                {/* Badges on image */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="text-[11px] font-mono-clean font-bold uppercase px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[#95d5b2] border border-white/20">
                    {style === 'rustic' ? '🪵 Rustic/Dark' : style === 'bright' ? '☀️ Bright/Modern' : '📸 Social Top-Down'}
                  </span>
                  <span className="text-[11px] font-mono-clean font-bold px-2 py-1 rounded-md bg-[#d4a373] text-[#163022]">
                    {imageSize}
                  </span>
                </div>
              </div>

              {/* Photo Actions */}
              <div className="flex items-center justify-between pt-4 mt-2 text-xs text-[#a3b899]">
                <span>Engine: {model}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={currentImage}
                    download={`verdant-harvest-${Date.now()}.png`}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Prompt Retouch Bar (Using Gemini Nano Banana 2.1) */}
            <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#ded5c5] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#163022] font-mono-clean flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  Refine Existing Photo (gemini-nano-banana-2.1):
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  placeholder="e.g. Add morning dew drops, rustic garden twine, or adjust to golden sunset..."
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-[#ded5c5] bg-white focus:outline-hidden focus:border-[#2d6a4f]"
                />
                <button
                  disabled={isEditing || !editPrompt.trim()}
                  onClick={handleRetouch}
                  className="px-4 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1f4a36] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
                  <span>Retouch</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
