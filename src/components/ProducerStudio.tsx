import React, { useState } from 'react';
import {
  UploadCloud,
  Sparkles,
  Wand2,
  FileText,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Layers,
  ArrowRight,
  Maximize2,
  Camera,
  Store,
  Edit3,
  Trash2,
  Plus,
  Info,
  Check,
} from 'lucide-react';
import {
  ProduceItem,
  StylePreset,
  ImageResolution,
  GenModel,
  FarmMetadata,
} from '../types/produce';
import { SAMPLE_MENUS } from '../data/initialData';
import {
  parseMenuText,
  generateProduceImage,
  editProduceImage,
} from '../services/api';

interface ProducerStudioProps {
  currentFarm: FarmMetadata;
  onPublishToStorefront: (newFarm: FarmMetadata, newItems: ProduceItem[]) => void;
  onGoToStorefront: () => void;
}

export const ProducerStudio: React.FC<ProducerStudioProps> = ({
  currentFarm,
  onPublishToStorefront,
  onGoToStorefront,
}) => {
  // Input state
  const [menuText, setMenuText] = useState<string>(SAMPLE_MENUS[0].content);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>('rustic');
  const [selectedResolution, setSelectedResolution] = useState<ImageResolution>('2K');
  const [selectedModel, setSelectedModel] = useState<GenModel>('gemini-3-pro-image-preview');

  // Generation workflow state
  const [step, setStep] = useState<'input' | 'parsed' | 'generating' | 'completed'>('input');
  const [parsedFarm, setParsedFarm] = useState<FarmMetadata>(currentFarm);
  const [stagedItems, setStagedItems] = useState<ProduceItem[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  // Batch generation state
  const [generationProgress, setGenerationProgress] = useState<{
    current: number;
    total: number;
    currentItemName: string;
  }>({ current: 0, total: 0, currentItemName: '' });

  // Single item editing modal
  const [editingItem, setEditingItem] = useState<ProduceItem | null>(null);
  const [editPrompt, setEditPrompt] = useState('');
  const [isRetouching, setIsRetouching] = useState(false);
  const [retouchMessage, setRetouchMessage] = useState<string | null>(null);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setMenuText(text);
      }
    };
    reader.readAsText(file);
  };

  // Step 1: Parse Menu Text via Gemini
  const handleParseMenu = async () => {
    if (!menuText.trim()) return;
    setIsParsing(true);
    setParseError(null);

    try {
      const res = await parseMenuText(menuText);
      const farmMeta: FarmMetadata = {
        farmName: res.farm.farmName || 'Heritage Local Farm',
        tagline: res.farm.tagline || 'Regenerative small-batch heirloom harvest.',
        location: res.farm.location || 'Local Organic Valleys',
        certifications: res.farm.certifications || ['USDA Organic Certified', 'Regenerative'],
        establishedYear: res.farm.establishedYear || 2012,
        story: res.farm.story || 'Cultivating living soils with natural heritage seed varieties.',
        contactEmail: 'grower@localharvest.farm',
      };

      const items: ProduceItem[] = res.items.map((it, idx) => ({
        id: `gen-prod-${Date.now()}-${idx}`,
        name: it.name,
        category: (it.category as any) || 'Vegetables',
        description: it.description,
        unit: it.unit || 'per lb',
        price: it.price || 6.5,
        inStock: it.inStock || 25,
        harvestLocation: it.harvestLocation || `${farmMeta.location} - Terrace ${idx + 1}`,
        harvestDate: it.harvestDate || 'Harvested this morning at dawn',
        tastingNotes: it.tastingNotes || ['Fresh-picked', 'Natural sweetness', 'Earthy terroir'],
        organicCertified: it.organicCertified !== false,
        stylePreset: selectedStyle,
        // Initial placeholder or fallbacks before generation
        imageUrl: '/src/assets/images/produce_rustic_dark_1791634350540.jpg',
        imageSize: selectedResolution,
        modelUsed: selectedModel,
        generationPrompt: `${it.name}, ${it.description}. Specifically: ${it.specificProduceSubject || it.name}`,
      }));

      setParsedFarm(farmMeta);
      setStagedItems(items);
      setStep('parsed');
    } catch (err: any) {
      console.error(err);
      setParseError(err.message || 'Failed to parse menu text');
    } finally {
      setIsParsing(false);
    }
  };

  // Step 2: Generate All Images Sequentially
  const handleGenerateAllImages = async () => {
    setStep('generating');
    setGenerationProgress({ current: 0, total: stagedItems.length, currentItemName: '' });

    const updated = [...stagedItems];

    for (let i = 0; i < updated.length; i++) {
      const it = updated[i];
      setGenerationProgress({
        current: i + 1,
        total: updated.length,
        currentItemName: it.name,
      });

      try {
        const res = await generateProduceImage({
          prompt: it.generationPrompt || it.name,
          style: selectedStyle,
          model: selectedModel,
          imageSize: selectedResolution,
        });

        updated[i] = {
          ...it,
          imageUrl: res.imageUrl,
          stylePreset: selectedStyle,
          imageSize: selectedResolution,
          modelUsed: res.modelUsed,
          lastEditedAt: new Date().toLocaleTimeString(),
        };
        // Update stage in real-time so user sees items lighting up!
        setStagedItems([...updated]);
      } catch (err) {
        console.warn(`Failed image generation for ${it.name}:`, err);
      }
    }

    setStep('completed');
  };

  // Single Item Re-Shoot
  const handleRegenerateSingleItem = async (index: number) => {
    const item = stagedItems[index];
    try {
      const res = await generateProduceImage({
        prompt: item.generationPrompt || item.name,
        style: item.stylePreset,
        model: selectedModel,
        imageSize: selectedResolution,
      });

      const updated = [...stagedItems];
      updated[index] = {
        ...item,
        imageUrl: res.imageUrl,
        imageSize: selectedResolution,
        modelUsed: res.modelUsed,
        lastEditedAt: new Date().toLocaleTimeString(),
      };
      setStagedItems(updated);
    } catch (err: any) {
      alert(`Could not regenerate photo: ${err.message}`);
    }
  };

  // Retouch with Gemini Nano Banana 2.1
  const handleRetouchItem = async () => {
    if (!editingItem || !editPrompt.trim()) return;
    setIsRetouching(true);
    setRetouchMessage(null);

    try {
      const res = await editProduceImage({
        imageBase64: editingItem.imageUrl,
        editPrompt,
        imageSize: selectedResolution,
      });

      const updated = stagedItems.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              imageUrl: res.imageUrl,
              modelUsed: 'gemini-nano-banana-2.1' as GenModel,
              imageSize: selectedResolution,
              lastEditedAt: new Date().toLocaleTimeString(),
            }
          : item
      );

      setStagedItems(updated);
      setEditingItem({
        ...editingItem,
        imageUrl: res.imageUrl,
        modelUsed: 'gemini-nano-banana-2.1',
        lastEditedAt: new Date().toLocaleTimeString(),
      });
      setRetouchMessage('Image successfully retouched with Nano Banana 2.1!');
      setEditPrompt('');
    } catch (err: any) {
      setRetouchMessage(`Error: ${err.message}`);
    } finally {
      setIsRetouching(false);
    }
  };

  // Publish newly generated catalog to live marketplace
  const handlePublish = () => {
    onPublishToStorefront(parsedFarm, stagedItems);
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Studio Header */}
      <div className="bg-[#163022] rounded-3xl p-6 sm:p-10 text-white border border-[#2d5a3c] mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-emerald-950/40 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d5a3c]/80 border border-[#40916c]/40 text-[#95d5b2] text-xs font-mono-clean font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Agricultural Photography Engine</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
            Upload Farm Menu <br />
            <span className="italic font-normal text-[#d4a373]">& Generate Realistic Produce.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#d8dfd9] leading-relaxed">
            Provide your raw text menu or farm list. Our studio extracts items, sensory descriptions, pricing, and terroir, then uses <span className="text-[#95d5b2] font-semibold">gemini-3-pro-image-preview</span> and <span className="text-[#95d5b2] font-semibold">gemini-nano-banana-2.1</span> to shoot photorealistic produce photos in your chosen aesthetic.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Menu Text & Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Aesthetic Style Toggles (Explicit Requirement) */}
          <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury font-bold text-lg text-[#163022] flex items-center gap-2">
                <Camera className="w-4 h-4 text-[#2d6a4f]" />
                Photo Aesthetic Style:
              </h3>
              <span className="text-[11px] font-mono-clean font-semibold text-[#8c8273] uppercase">
                Required Toggle
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Rustic / Dark */}
              <button
                type="button"
                onClick={() => setSelectedStyle('rustic')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedStyle === 'rustic'
                    ? 'bg-[#2b1810] text-[#fbf9f5] border-[#d4a373] ring-2 ring-[#d4a373]/30 shadow-md'
                    : 'bg-[#faf8f5] text-[#342f28] border-[#ded5c5] hover:bg-[#ede7dc]'
                }`}
              >
                <span className="text-2xl mt-0.5">🪵</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Rustic / Dark</span>
                    {selectedStyle === 'rustic' && (
                      <span className="text-[10px] bg-[#d4a373] text-[#163022] px-2 py-0.5 rounded-full font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${selectedStyle === 'rustic' ? 'text-amber-200/80' : 'text-[#6e685f]'}`}>
                    Moody chiaroscuro lighting, dark reclaimed barn wood, rich shadows, fine dew, heirloom warmth.
                  </p>
                </div>
              </button>

              {/* Option 2: Bright / Modern */}
              <button
                type="button"
                onClick={() => setSelectedStyle('bright')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedStyle === 'bright'
                    ? 'bg-[#1b3a27] text-white border-[#52b788] ring-2 ring-[#52b788]/30 shadow-md'
                    : 'bg-[#faf8f5] text-[#342f28] border-[#ded5c5] hover:bg-[#ede7dc]'
                }`}
              >
                <span className="text-2xl mt-0.5">☀️</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Bright / Modern</span>
                    {selectedStyle === 'bright' && (
                      <span className="text-[10px] bg-[#52b788] text-[#163022] px-2 py-0.5 rounded-full font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${selectedStyle === 'bright' ? 'text-emerald-200/80' : 'text-[#6e685f]'}`}>
                    Minimalist daylight, Scandinavian ceramic & pale limestone, crisp vibrancy, editorial freshness.
                  </p>
                </div>
              </button>

              {/* Option 3: Social Media (Top-down) */}
              <button
                type="button"
                onClick={() => setSelectedStyle('social')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                  selectedStyle === 'social'
                    ? 'bg-[#3b2319] text-white border-[#e76f51] ring-2 ring-[#e76f51]/30 shadow-md'
                    : 'bg-[#faf8f5] text-[#342f28] border-[#ded5c5] hover:bg-[#ede7dc]'
                }`}
              >
                <span className="text-2xl mt-0.5">📸</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Social Media (Top-Down Flat-Lay)</span>
                    {selectedStyle === 'social' && (
                      <span className="text-[10px] bg-[#e76f51] text-white px-2 py-0.5 rounded-full font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-xs mt-1 ${selectedStyle === 'social' ? 'text-rose-200/80' : 'text-[#6e685f]'}`}>
                    90° bird’s-eye overhead, artisanal linen tablecloth, wicker baskets, viral foodie aesthetic.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Model and Resolution Affordance (Explicit Requirements) */}
          <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs space-y-4">
            <h3 className="font-serif-luxury font-bold text-lg text-[#163022] flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2d6a4f]" />
              Model & Size Affordances:
            </h3>

            {/* Model Toggle */}
            <div>
              <label className="text-xs font-bold text-[#4a4439] block mb-1.5 font-mono-clean uppercase">
                Generation Model:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModel('gemini-3-pro-image-preview')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedModel === 'gemini-3-pro-image-preview'
                      ? 'bg-[#163022] text-white border-[#163022] shadow-xs'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <div className="font-bold text-xs">gemini-3-pro-image</div>
                  <div className="text-[10px] opacity-75">Flagship Studio Model</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedModel('gemini-nano-banana-2.1')}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedModel === 'gemini-nano-banana-2.1'
                      ? 'bg-[#163022] text-white border-[#163022] shadow-xs'
                      : 'bg-[#faf8f5] text-[#4f483e] border-[#ded5c5]'
                  }`}
                >
                  <div className="font-bold text-xs">nano-banana-2.1</div>
                  <div className="text-[10px] opacity-75">Create & Edit Engine</div>
                </button>
              </div>
            </div>

            {/* Image Size Affordance (1K, 2K, 4K) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-[#4a4439] font-mono-clean uppercase">
                  Image Resolution:
                </label>
                <span className="text-[10px] text-[#2d6a4f] font-semibold">1K • 2K • 4K Support</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setSelectedResolution(res)}
                    className={`py-2 text-center rounded-xl font-mono-clean font-bold text-xs transition-all cursor-pointer border ${
                      selectedResolution === res
                        ? 'bg-[#d4a373] text-[#163022] border-[#d4a373] shadow-xs font-extrabold'
                        : 'bg-[#faf8f5] text-[#5f5950] border-[#ded5c5] hover:bg-[#ede7dc]'
                    }`}
                  >
                    {res}
                    <span className="block text-[9px] font-normal opacity-80">
                      {res === '4K' ? 'Master HD' : res === '2K' ? 'Ultra Sharp' : 'Standard'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Menu Text Input Box */}
          <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury font-bold text-lg text-[#163022] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2d6a4f]" />
                Your Text-Based Menu:
              </h3>
              <label className="text-xs text-[#2d6a4f] hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload File</span>
                <input
                  type="file"
                  accept=".txt,.csv,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Sample Menu Fillers */}
            <div>
              <span className="text-[11px] font-bold text-[#8c8273] uppercase font-mono-clean block mb-1.5">
                Load Quick Sample Menu:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SAMPLE_MENUS.map((menu) => (
                  <button
                    key={menu.id}
                    onClick={() => setMenuText(menu.content)}
                    className="text-[11px] bg-[#faf8f5] hover:bg-[#ede7dc] text-[#4f483e] border border-[#ded5c5] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    {menu.title.split(' ')[1]} {menu.title.split(' ')[2]}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={8}
              value={menuText}
              onChange={(e) => setMenuText(e.target.value)}
              placeholder="Paste your farm produce list, harvest prices, varieties..."
              className="w-full text-xs font-mono-clean p-3.5 rounded-2xl border border-[#ded5c5] bg-[#faf8f5] focus:bg-white focus:outline-hidden focus:border-[#2d6a4f] leading-relaxed"
            />

            {parseError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {parseError}
              </div>
            )}

            <button
              disabled={isParsing || !menuText.trim()}
              onClick={handleParseMenu}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              {isParsing ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#95d5b2] animate-spin" />
                  <span>Parsing Menu with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-[#95d5b2]" />
                  <span>Parse Menu & Prepare Shoot</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Staged Harvest Items & Photo Studio (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {step === 'input' && (
            <div className="bg-white rounded-3xl p-10 border border-[#e4dcce] text-center space-y-4 my-auto min-h-[420px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-[#f4efe6] text-[#2d6a4f] flex items-center justify-center">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h3 className="font-serif-luxury text-2xl font-bold text-[#163022]">
                Ready to Shoot Your Harvest
              </h3>
              <p className="text-xs text-[#6e685f] max-w-md leading-relaxed">
                Choose your preferred visual aesthetic (<span className="font-semibold">Rustic/Dark</span>, <span className="font-semibold">Bright/Modern</span>, or <span className="font-semibold">Social Top-Down</span>) on the left, then click <strong>"Parse Menu & Prepare Shoot"</strong> to stage the catalog items.
              </p>
            </div>
          )}

          {step !== 'input' && (
            <div className="space-y-6">
              {/* Batch Action Bar */}
              <div className="bg-white rounded-3xl p-6 border border-[#e4dcce] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif-luxury text-xl font-bold text-[#163022]">
                      {parsedFarm.farmName}
                    </span>
                    <span className="text-xs bg-[#e8f5e9] text-[#1b3a27] px-2 py-0.5 rounded-full font-semibold border border-[#c8e6c9]">
                      {stagedItems.length} Produce Items
                    </span>
                  </div>
                  <p className="text-xs text-[#6e685f] mt-0.5">{parsedFarm.location}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    disabled={step === 'generating'}
                    onClick={handleGenerateAllImages}
                    className="px-4 py-2.5 rounded-xl bg-[#2d6a4f] hover:bg-[#1f4a36] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-[#95d5b2]" />
                    <span>Generate All Produce Photos</span>
                  </button>

                  <button
                    onClick={handlePublish}
                    className="px-4 py-2.5 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] text-white text-xs font-semibold flex items-center gap-2 shadow-md cursor-pointer"
                  >
                    <Store className="w-4 h-4 text-[#d4a373]" />
                    <span>Publish to Live Store</span>
                  </button>
                </div>
              </div>

              {/* Progress Banner when generating */}
              {step === 'generating' && (
                <div className="bg-[#163022] rounded-2xl p-5 text-white border border-[#2d5a3c] space-y-3 animate-pulse">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold flex items-center gap-2 text-[#95d5b2]">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      Generating photo for: {generationProgress.currentItemName}
                    </span>
                    <span className="font-mono-clean font-bold">
                      {generationProgress.current} / {generationProgress.total}
                    </span>
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#52b788] h-full transition-all duration-300"
                      style={{
                        width: `${(generationProgress.current / generationProgress.total) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Completed Banner */}
              {step === 'completed' && (
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      All produce photos rendered in <strong>{selectedStyle}</strong> aesthetic with <strong>{selectedModel}</strong>!
                    </span>
                  </div>
                  <button
                    onClick={handlePublish}
                    className="font-bold underline text-emerald-950 hover:text-emerald-700 cursor-pointer"
                  >
                    View in Live Storefront →
                  </button>
                </div>
              )}

              {/* Staged Produce Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stagedItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-[#e4dcce] overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div className="relative aspect-[4/3] bg-[#f4efe6]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="text-[10px] font-mono-clean uppercase px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs font-bold">
                          {item.stylePreset}
                        </span>
                        {item.imageSize && (
                          <span className="text-[10px] font-mono-clean font-bold px-1.5 py-0.5 rounded-md bg-[#d4a373] text-[#163022]">
                            {item.imageSize}
                          </span>
                        )}
                      </div>

                      {/* Action buttons on photo */}
                      <div className="absolute bottom-2 right-2 flex items-center gap-1">
                        <button
                          onClick={() => handleRegenerateSingleItem(idx)}
                          title="Re-Generate Image"
                          className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-[#163022] shadow-xs cursor-pointer border border-[#ded5c5]"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingItem(item)}
                          title="Edit with Prompt (Nano Banana 2.1)"
                          className="p-1.5 rounded-lg bg-[#1b3a27] hover:bg-[#132a1c] text-white shadow-xs cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#95d5b2]" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif-luxury font-bold text-sm text-[#163022] line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-xs font-bold text-[#163022] shrink-0 font-serif-luxury">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6e685f] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[#8c8273] pt-2 border-t border-[#f4efe6]">
                        <span>{item.unit}</span>
                        <span>Stock: {item.inStock}</span>
                        <span>{item.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Retouch Modal using Gemini Nano Banana 2.1 */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#faf8f5] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#ded5c5] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-clean font-bold uppercase text-[#2d6a4f]">
                  gemini-nano-banana-2.1 Retouch Tool
                </span>
                <h3 className="font-serif-luxury text-xl font-bold text-[#163022]">
                  Refine {editingItem.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-[#6e685f] hover:text-black text-sm"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-black/20 relative">
              <img
                src={editingItem.imageUrl}
                alt={editingItem.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {isRetouching && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
                  <Sparkles className="w-8 h-8 text-[#95d5b2] animate-spin mb-2" />
                  <p className="text-xs font-bold">Retouching with Nano Banana 2.1...</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#163022]">
                Edit Prompt Instructions:
              </label>
              <textarea
                rows={2}
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                placeholder="e.g. Add morning dew drops, rustic wooden crate background, softer lighting"
                className="w-full text-xs p-3 rounded-xl border border-[#ded5c5] bg-white focus:outline-hidden focus:border-[#2d6a4f]"
              />
            </div>

            {retouchMessage && (
              <div className="text-xs p-2.5 rounded-xl bg-white border border-[#ded5c5] text-[#163022]">
                {retouchMessage}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6e685f] hover:bg-[#ede7dc] cursor-pointer"
              >
                Close
              </button>
              <button
                disabled={isRetouching || !editPrompt.trim()}
                onClick={handleRetouchItem}
                className="px-5 py-2 rounded-xl bg-[#2d6a4f] hover:bg-[#1f4a36] disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#95d5b2]" />
                <span>Apply Nano Banana Edit</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
