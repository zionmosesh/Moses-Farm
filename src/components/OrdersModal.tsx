import React from 'react';
import { X, ClipboardList, CheckCircle2, Package, Truck, Clock, Sprout } from 'lucide-react';
import { Order } from '../types/produce';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-[#faf8f5] rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto shadow-2xl border border-[#ded5c5] space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#ded5c5] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#e8f5e9] text-[#1b3a27] flex items-center justify-center">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-2xl text-[#163022]">
                Your Farm Orders
              </h3>
              <p className="text-xs text-[#6e685f]">
                Track harvest dispatch and field-to-table delivery
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#ede7dc] text-[#6e685f] hover:text-black cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <Sprout className="w-12 h-12 text-[#95d5b2] mx-auto" />
            <h4 className="font-serif-luxury text-lg font-bold text-[#163022]">
              No Orders Placed Yet
            </h4>
            <p className="text-xs text-[#7a7163] max-w-sm mx-auto">
              Browse our seasonal harvest catalog or upload a menu in the studio to start placing farm-direct orders.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-[#ded5c5] shadow-xs space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#f4efe6] pb-3">
                  <div>
                    <span className="font-mono-clean text-xs font-bold text-[#2d6a4f]">
                      Order #{order.id}
                    </span>
                    <span className="text-[11px] text-[#8c8273] ml-2">
                      Placed at {order.createdAt}
                    </span>
                  </div>
                  <span className="font-serif-luxury font-bold text-lg text-[#163022]">
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* Status Timeline */}
                <div className="grid grid-cols-4 gap-2 text-center text-[10px] py-1">
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#1b3a27] text-white flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#163022]">Confirmed</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center mx-auto animate-pulse">
                      <Sprout className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-bold text-[#2d6a4f]">Harvesting</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#ede7dc] text-[#7a7163] flex items-center justify-center mx-auto">
                      <Package className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[#7a7163]">Crated</span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-6 h-6 rounded-full bg-[#ede7dc] text-[#7a7163] flex items-center justify-center mx-auto">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[#7a7163]">Delivered</span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-[11px] text-[#8c8273] uppercase font-mono-clean">
                    Harvested Items:
                  </div>
                  {order.items.map((it) => (
                    <div
                      key={it.produce.id}
                      className="flex items-center justify-between text-[#4f483e] py-1"
                    >
                      <span className="truncate max-w-xs">
                        {it.quantity}x {it.produce.name}
                      </span>
                      <span className="font-medium">
                        ${(it.produce.price * it.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#f4efe6] flex items-center justify-between text-[11px] text-[#7a7163]">
                  <span>Slot: {order.deliverySlot.split(':')[0]}</span>
                  <span>Destination: {order.deliveryAddress}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
