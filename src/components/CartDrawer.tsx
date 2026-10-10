import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Heart,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, Order } from '../types/produce';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (order: Order) => void;
  onClearCart: () => void;
}

const DELIVERY_SLOTS = [
  'Tomorrow: Dawn Harvest (6:00 AM - 9:00 AM)',
  'Tomorrow: Midday Fresh (11:00 AM - 2:00 PM)',
  'Tomorrow: Sunset Chilled (4:00 PM - 7:00 PM)',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onPlaceOrder,
  onClearCart,
}) => {
  const [tipPercent, setTipPercent] = useState<number>(10);
  const [selectedSlot, setSelectedSlot] = useState<string>(DELIVERY_SLOTS[0]);
  const [customerName, setCustomerName] = useState('Eleanor Vance');
  const [customerEmail, setCustomerEmail] = useState('eleanor.vance@example.com');
  const [address, setAddress] = useState('742 Evergreen Terrace, Farmstead District');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + item.produce.price * item.quantity,
    0
  );
  const farmerTip = (subtotal * tipPercent) / 100;
  const deliveryFee = subtotal > 35 ? 0 : 4.5;
  const total = subtotal + farmerTip + deliveryFee;

  const handleCheckout = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const order: Order = {
        id: `VH-${Math.floor(100000 + Math.random() * 900000)}`,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: [...cart],
        subtotal,
        farmerTip,
        deliveryFee,
        total,
        customerName,
        customerEmail,
        deliveryAddress: address,
        deliverySlot: selectedSlot,
        status: 'harvesting',
      };

      onPlaceOrder(order);
      setCompletedOrder(order);
      onClearCart();
      setIsSubmitting(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2d6a4f', '#52b788', '#d4a373', '#e76f51'],
        });
      } catch (e) {
        // Safe fallback
      }
    }, 900);
  };

  const handleCloseSuccess = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div
        className="w-full max-w-md bg-[#faf8f5] h-full shadow-2xl flex flex-col justify-between border-l border-[#ded5c5] relative animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#ded5c5] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#e8f5e9] text-[#1b3a27] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg text-[#163022]">
                Your Harvest Basket
              </h3>
              <p className="text-[11px] text-[#6e685f]">
                {cart.length} unique produce {cart.length === 1 ? 'item' : 'items'}
              </p>
            </div>
          </div>

          <button
            onClick={completedOrder ? handleCloseSuccess : onClose}
            className="p-2 rounded-full hover:bg-[#f4efe6] text-[#6e685f] hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {completedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 flex-1 overflow-y-auto space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <span className="text-xs font-mono-clean font-bold text-[#2d6a4f] uppercase tracking-wider">
                Order #{completedOrder.id} Placed!
              </span>
              <h2 className="font-serif-luxury text-2xl font-bold text-[#163022] mt-1">
                Harvesting Has Begun
              </h2>
              <p className="text-xs text-[#6e685f] mt-1 leading-relaxed">
                The growers have received your order. Your produce will be harvested directly from the living soil and packed into chilled artisan crates.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-[#ded5c5] text-left text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-[#f4efe6]">
                <span className="text-[#8c8273]">Delivery Slot:</span>
                <span className="font-semibold text-[#163022]">{completedOrder.deliverySlot.split(':')[0]}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4efe6]">
                <span className="text-[#8c8273]">Destination:</span>
                <span className="font-semibold text-[#163022] truncate max-w-[200px]">{completedOrder.deliveryAddress}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f4efe6]">
                <span className="text-[#8c8273]">Total Payout:</span>
                <span className="font-bold text-[#163022] font-serif-luxury text-sm">${completedOrder.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1 text-emerald-800">
                <span>Farmer Support Tip:</span>
                <span className="font-bold">+${completedOrder.farmerTip.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCloseSuccess}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1b3a27] text-white font-semibold text-xs shadow-md hover:bg-[#132a1c] cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : cart.length === 0 ? (
          /* Empty State */
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#ede7dc] text-[#7a7163] flex items-center justify-center">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h4 className="font-serif-luxury text-lg font-bold text-[#163022]">
              Your Basket is Empty
            </h4>
            <p className="text-xs text-[#7a7163] max-w-xs">
              Explore today's peak morning harvest or upload your farm menu to generate fresh catalog produce.
            </p>
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#1b3a27] text-white text-xs font-semibold cursor-pointer"
            >
              Explore Produce
            </button>
          </div>
        ) : (
          /* Active Cart Items */
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Items List */}
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={item.produce.id}
                  className="bg-white rounded-2xl p-3 border border-[#ded5c5] flex gap-3 shadow-2xs"
                >
                  <img
                    src={item.produce.imageUrl}
                    alt={item.produce.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 bg-[#f4efe6]"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif-luxury font-bold text-xs text-[#163022] line-clamp-1">
                          {item.produce.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.produce.id)}
                          className="text-[#9e9688] hover:text-rose-600 p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[10px] text-[#787165]">
                        ${item.produce.price.toFixed(2)} / {item.produce.unit.replace(/^per\s+/i, '')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#ded5c5] rounded-lg bg-[#faf8f5] px-1 py-0.5">
                        <button
                          onClick={() => onUpdateQty(item.produce.id, -1)}
                          className="p-0.5 text-[#6b6457] hover:text-black cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold min-w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.produce.id, 1)}
                          className="p-0.5 text-[#6b6457] hover:text-black cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-serif-luxury font-bold text-xs text-[#163022]">
                        ${(item.produce.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Farmer Tip Selector */}
            <div className="bg-white rounded-2xl p-4 border border-[#ded5c5] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#163022] flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  Support Our Local Growers:
                </span>
                <span className="text-[11px] font-mono-clean font-bold text-[#2d6a4f]">
                  +${farmerTip.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-[#7a7163]">
                100% of this tip directly funds sustainable soil biology and small-scale grower living wages.
              </p>
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[0, 10, 15, 20].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setTipPercent(pct)}
                    className={`py-1 text-xs rounded-lg font-mono-clean font-semibold cursor-pointer border ${
                      tipPercent === pct
                        ? 'bg-[#1b3a27] text-white border-[#1b3a27]'
                        : 'bg-[#faf8f5] text-[#554e43] border-[#ded5c5]'
                    }`}
                  >
                    {pct === 0 ? 'None' : `${pct}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Slot Selector */}
            <div className="bg-white rounded-2xl p-4 border border-[#ded5c5] space-y-2">
              <label className="text-xs font-bold text-[#163022] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#2d6a4f]" />
                Fresh Delivery Window:
              </label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f5] focus:outline-hidden"
              >
                {DELIVERY_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery Address Input */}
            <div className="bg-white rounded-2xl p-4 border border-[#ded5c5] space-y-2">
              <label className="text-xs font-bold text-[#163022]">
                Delivery Address:
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address for chilled crate drop"
                className="w-full text-xs p-2.5 rounded-xl border border-[#ded5c5] bg-[#faf8f5]"
              />
            </div>
          </div>
        )}

        {/* Footer Checkout Summary */}
        {!completedOrder && cart.length > 0 && (
          <div className="p-5 border-t border-[#ded5c5] bg-white space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6e685f]">
                <span>Produce Subtotal:</span>
                <span className="font-medium text-[#163022]">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6e685f]">
                <span>Farmer Direct Tip:</span>
                <span className="font-medium text-emerald-800">+${farmerTip.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#6e685f]">
                <span>Chilled Farm Delivery:</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE ($35+ order)</strong> : `$${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="pt-2 border-t border-[#f0e9dc] flex justify-between items-baseline">
                <span className="font-bold text-sm text-[#163022]">Total Due:</span>
                <span className="font-serif-luxury font-bold text-2xl text-[#163022]">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              onClick={handleCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1b3a27] hover:bg-[#132a1c] disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              {isSubmitting ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#95d5b2] animate-spin" />
                  <span>Submitting to Farm Dispatch...</span>
                </>
              ) : (
                <>
                  <span>Harvest & Place Order (${total.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4 text-[#95d5b2]" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
