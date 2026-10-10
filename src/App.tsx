/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { Marketplace } from './components/Marketplace';
import { ProducerStudio } from './components/ProducerStudio';
import { PhotoLab } from './components/PhotoLab';
import { AboutFarm } from './components/AboutFarm';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersModal } from './components/OrdersModal';
import {
  INITIAL_FARM,
  INITIAL_HERO_IMAGE,
  INITIAL_PRODUCE,
} from './data/initialData';
import {
  CartItem,
  FarmMetadata,
  Order,
  ProduceItem,
  StylePreset,
} from './types/produce';
import { generateProduceImage } from './services/api';
import { Sprout, Heart, Sparkles } from 'lucide-react';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'marketplace' | 'studio' | 'photolab' | 'about'>('marketplace');

  // Farm and Produce state
  const [farm, setFarm] = useState<FarmMetadata>(INITIAL_FARM);
  const [heroImage, setHeroImage] = useState<string>(INITIAL_HERO_IMAGE);
  const [produceList, setProduceList] = useState<ProduceItem[]>(INITIAL_PRODUCE);
  const [selectedAesthetic, setSelectedAesthetic] = useState<StylePreset | 'all'>('all');

  // Interactive Modals and Drawers
  const [selectedProduct, setSelectedProduct] = useState<ProduceItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // Cart and Orders
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Restyling loading status
  const [restylingItemId, setRestylingItemId] = useState<string | null>(null);

  // Toast / notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (item: ProduceItem, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.produce.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.produce.id === item.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { produce: item, quantity }];
    });
    showToast(`Added ${quantity}x ${item.name} to your basket!`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.produce.id === productId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.produce.id !== productId));
  };

  const handlePlaceOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
    showToast(`Order #${order.id} confirmed! Harvesting begins.`);
  };

  // Quick Restyle from card or modal
  const handleQuickRestyle = async (item: ProduceItem, newStyle: StylePreset) => {
    setRestylingItemId(item.id);
    try {
      const res = await generateProduceImage({
        prompt: item.generationPrompt || `${item.name}, ${item.description}`,
        style: newStyle,
        model: item.modelUsed || 'gemini-3-pro-image-preview',
        imageSize: item.imageSize || '2K',
      });

      const updated: ProduceItem = {
        ...item,
        imageUrl: res.imageUrl,
        stylePreset: newStyle,
        lastEditedAt: new Date().toLocaleTimeString(),
      };

      setProduceList((prev) =>
        prev.map((p) => (p.id === item.id ? updated : p))
      );

      if (selectedProduct && selectedProduct.id === item.id) {
        setSelectedProduct(updated);
      }

      showToast(`Updated ${item.name} to ${newStyle} aesthetic!`);
    } catch (err: any) {
      showToast(`Could not restyle: ${err.message || 'Error'}`);
    } finally {
      setRestylingItemId(null);
    }
  };

  // Update item from modal
  const handleUpdateItem = (updated: ProduceItem) => {
    setProduceList((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setSelectedProduct(updated);
  };

  // Publish new catalog from Producer Studio
  const handlePublishFromStudio = (newFarm: FarmMetadata, newItems: ProduceItem[]) => {
    setFarm(newFarm);
    setProduceList(newItems);
    setCurrentTab('marketplace');
    showToast(`Published ${newItems.length} items from ${newFarm.farmName} to the live storefront!`);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.produce.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#1c1917] flex flex-col selection:bg-[#95d5b2] selection:text-[#163022]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#163022] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#2d5a3c] text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4 text-[#95d5b2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        farm={farm}
      />

      {/* Main Body Content based on Active Tab */}
      <main className="flex-1">
        {currentTab === 'marketplace' && (
          <>
            <HeroBanner
              farm={farm}
              heroImage={heroImage}
              onExploreClick={() => {
                const el = document.getElementById('marketplace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenStudioClick={() => setCurrentTab('studio')}
              selectedAesthetic={selectedAesthetic}
              onSelectAesthetic={setSelectedAesthetic}
            />

            <Marketplace
              items={produceList}
              onAddToCart={handleAddToCart}
              onOpenDetails={setSelectedProduct}
              onQuickRestyle={handleQuickRestyle}
              onOpenStudio={() => setCurrentTab('studio')}
              selectedAesthetic={selectedAesthetic}
              onSelectAesthetic={setSelectedAesthetic}
              restylingItemId={restylingItemId}
            />
          </>
        )}

        {currentTab === 'studio' && (
          <ProducerStudio
            currentFarm={farm}
            onPublishToStorefront={handlePublishFromStudio}
            onGoToStorefront={() => setCurrentTab('marketplace')}
          />
        )}

        {currentTab === 'photolab' && <PhotoLab />}

        {currentTab === 'about' && (
          <AboutFarm
            farm={farm}
            heroImage={heroImage}
            onOpenStudio={() => setCurrentTab('studio')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#163022] text-[#d8dfd9] border-t border-[#2d5a3c] pt-12 pb-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#2d6a4f] text-white flex items-center justify-center">
                <Sprout className="w-5 h-5 text-[#95d5b2]" />
              </div>
              <span className="font-serif-luxury text-xl font-bold text-white">
                Verdant Harvest
              </span>
            </div>
            <p className="text-xs text-[#a3b899] leading-relaxed">
              Next-generation agro e-commerce empowering regenerative growers with AI-driven menu parsing and realistic produce photography.
            </p>
          </div>

          {/* Aesthetic Styles */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-clean font-bold uppercase text-white tracking-wider">
              Photo Aesthetics
            </h4>
            <ul className="text-xs space-y-1.5 text-[#a3b899]">
              <li>🪵 <strong>Rustic / Dark:</strong> Chiaroscuro & aged timber</li>
              <li>☀️ <strong>Bright / Modern:</strong> Crisp daylight & ceramic</li>
              <li>📸 <strong>Social Media:</strong> 90° overhead flat-lay linen</li>
            </ul>
          </div>

          {/* AI Capabilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-clean font-bold uppercase text-white tracking-wider">
              AI Photography Models
            </h4>
            <ul className="text-xs space-y-1.5 text-[#a3b899]">
              <li>• <strong>gemini-3-pro-image-preview:</strong> High-end 1K/2K/4K</li>
              <li>• <strong>gemini-nano-banana-2.1:</strong> Create & Edit with Prompts</li>
              <li>• <strong>gemini-3.8-flash:</strong> Text Menu Merchandising</li>
            </ul>
          </div>

          {/* Farm Direct Promise */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono-clean font-bold uppercase text-white tracking-wider">
              Terroir & Origin
            </h4>
            <p className="text-xs text-[#a3b899] leading-relaxed">
              Living soil biology, zero chemical spray, dawn harvesting, and cold-chain local direct distribution.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8ca384]">
          <p>© {new Date().getFullYear()} Verdant Harvest. Built for regenerative local agriculture.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Nurtured with living soil</span>
            <Heart className="w-3 h-3 text-[#d4a373] fill-[#d4a373]" />
            <span>& AI Studio</span>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        item={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onUpdateItem={handleUpdateItem}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onPlaceOrder={handlePlaceOrder}
        onClearCart={() => setCart([])}
      />

      {/* Orders Tracking Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        orders={orders}
      />
    </div>
  );
}
