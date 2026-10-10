export type StylePreset = 'rustic' | 'bright' | 'social';

export type ImageResolution = '1K' | '2K' | '4K';

export type GenModel = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export type ProduceCategory =
  | 'Vegetables'
  | 'Fruits & Berries'
  | 'Leafy Greens'
  | 'Roots & Tubers'
  | 'Herbs & Aromatics'
  | 'Artisanal & Honey';

export interface ProduceItem {
  id: string;
  name: string;
  category: ProduceCategory;
  description: string;
  unit: string; // e.g. "per lb", "per bunch", "per pint", "per 500g basket"
  price: number;
  inStock: number;
  harvestLocation: string;
  harvestDate: string;
  tastingNotes: string[];
  organicCertified: boolean;
  stylePreset: StylePreset;
  imageUrl: string;
  imageSize?: ImageResolution;
  modelUsed?: GenModel;
  generationPrompt?: string;
  lastEditedAt?: string;
}

export interface FarmMetadata {
  farmName: string;
  tagline: string;
  location: string;
  certifications: string[];
  establishedYear: number;
  story: string;
  contactEmail?: string;
}

export interface CartItem {
  produce: ProduceItem;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  farmerTip: number;
  deliveryFee: number;
  total: number;
  customerName: string;
  customerEmail: string;
  deliveryAddress: string;
  deliverySlot: string;
  status: 'confirmed' | 'harvesting' | 'out_for_delivery' | 'delivered';
}
