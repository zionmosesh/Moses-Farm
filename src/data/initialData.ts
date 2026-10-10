import { FarmMetadata, ProduceItem } from '../types/produce';

export const INITIAL_FARM: FarmMetadata = {
  farmName: 'Oakhaven Organic Farm & Orchards',
  tagline: 'Regenerative, soil-nurtured heirloom harvest delivered straight from our fields to your table.',
  location: 'Willamette Valley & Oakridge Ridges, Oregon',
  certifications: ['USDA Organic Certified', 'Regenerative Organic Alliance', 'Non-GMO Project Verified', 'Demeter Biodynamic'],
  establishedYear: 1998,
  story: 'Cultivated across three generations, Oakhaven balances heirloom bio-diversity with living soil stewardship. We never spray synthetic pesticides, picking all produce by hand at peak sunrise maturity for uncompromised flavor and nutrient density.',
  contactEmail: 'orders@oakhavenorganics.farm',
};

export const INITIAL_HERO_IMAGE = '/src/assets/images/hero_agro_farm_1791634255833.jpg';

export const INITIAL_PRODUCE: ProduceItem[] = [
  {
    id: 'prod-1',
    name: 'Cherokee Purple Heirloom Tomatoes & Golden Beets',
    category: 'Vegetables',
    description: 'Deep mahogany heirloom beefsteak tomatoes paired with freshly pulled golden chioggia beets and garden rosemary. Intense wine-like sweetness with smoky earthen notes.',
    unit: 'per 2 lb basket',
    price: 8.50,
    inStock: 24,
    harvestLocation: 'Field 4 (South Terrace Clay Loam)',
    harvestDate: 'Harvested this morning at 6:30 AM',
    tastingNotes: ['Wine-sweet', 'Smoky umami', 'Earth & mineral finish'],
    organicCertified: true,
    stylePreset: 'rustic',
    imageUrl: '/src/assets/images/produce_rustic_dark_1791634350540.jpg',
    imageSize: '2K',
    modelUsed: 'gemini-3-pro-image-preview',
    generationPrompt: 'Moody rustic dark food photography of heirloom purple tomatoes, golden beets, organic garlic bulbs and fresh rosemary arranged on aged dark reclaimed barn wood table, dramatic chiaroscuro soft side lighting, fine dewdrops, artisanal earthy farm produce',
  },
  {
    id: 'prod-2',
    name: 'Crisp Baby Gem Romaine & Rainbow Carrots',
    category: 'Leafy Greens',
    description: 'Tender sweet baby gem romaine heads with crisp mineral snap, accompanied by heritage purple, yellow, and orange baby carrots with fresh leafy tops.',
    unit: 'per farm bunch bundle',
    price: 6.75,
    inStock: 35,
    harvestLocation: 'High Tunnel Greenhouse #2',
    harvestDate: 'Harvested yesterday evening',
    tastingNotes: ['Crisp water-crunch', 'Carrot honey sweetness', 'Peppery greens'],
    organicCertified: true,
    stylePreset: 'bright',
    imageUrl: '/src/assets/images/produce_bright_modern_1791634371209.jpg',
    imageSize: '2K',
    modelUsed: 'gemini-3-pro-image-preview',
    generationPrompt: 'Bright modern minimalist culinary photography of crisp vibrant agricultural harvest: fresh crisp baby romaine lettuce, rainbow heritage carrots with leafy green tops, ripe heirloom yellow cherry tomatoes in clean handmade white ceramic plates, bright natural daylight on clean pale limestone surface, high-end farm-to-table menu aesthetic',
  },
  {
    id: 'prod-3',
    name: 'Wild Mission Figs, Heritage Strawberries & Raw Honey',
    category: 'Artisanal & Honey',
    description: 'Tree-ripened black mission figs, sun-sweet alpine heritage strawberries, freshly pulled French breakfast radishes, and wildflower raw honeycomb jar.',
    unit: 'per artisan harvest box',
    price: 16.50,
    inStock: 18,
    harvestLocation: 'Lower Orchard & Apiary Grove',
    harvestDate: 'Hand-picked today at sunrise',
    tastingNotes: ['Floral clover nectar', 'Ripe fig jam richness', 'Bright strawberry acidity'],
    organicCertified: true,
    stylePreset: 'social',
    imageUrl: '/src/assets/images/produce_social_topdown_1791634393316.jpg',
    imageSize: '2K',
    modelUsed: 'gemini-nano-banana-2.1',
    generationPrompt: 'Flat-lay overhead top-down bird\'s-eye view culinary composition of freshly picked local organic agricultural produce: woven wicker farm basket with ripe figs, heritage strawberries, fresh artisanal honey jar with honeycomb, crisp radishes and fresh mint arranged artfully on natural beige linen tablecloth, trendy social media aesthetic, soft diffused daylight',
  },
  {
    id: 'prod-4',
    name: 'Forest Chanterelles & Purple Garlic Cloves',
    category: 'Vegetables',
    description: 'Wild foraged golden chanterelle mushrooms brushed with pine needles, accompanied by cured hardneck purple stripe garlic bulbs for rich culinary creations.',
    unit: 'per 1 lb crate',
    price: 14.00,
    inStock: 12,
    harvestLocation: 'Oak Woodlot & Shaded Ridge',
    harvestDate: 'Harvested 24 hours ago',
    tastingNotes: ['Apricot aroma', 'Rich buttery woodiness', 'Pungent sweet garlic'],
    organicCertified: true,
    stylePreset: 'rustic',
    imageUrl: '/src/assets/images/produce_rustic_dark_1791634350540.jpg',
    imageSize: '1K',
    modelUsed: 'gemini-3-pro-image-preview',
    generationPrompt: 'Moody rustic dark food photography of golden chanterelles, purple stripe garlic, on weathered dark wooden board',
  },
  {
    id: 'prod-5',
    name: 'Sunburst Golden Cherry Tomatoes on Vine',
    category: 'Vegetables',
    description: 'Cluster-harvested golden yellow cherry tomatoes bursting with sweet citrusy nectar, with tender green calyx and dewy morning freshness.',
    unit: 'per 1.5 lb vine bundle',
    price: 5.80,
    inStock: 40,
    harvestLocation: 'Sun-drenched South Slopes',
    harvestDate: 'Harvested this morning',
    tastingNotes: ['Bright tropical tang', 'Thin skin snap', 'Sun-warmed sweetness'],
    organicCertified: true,
    stylePreset: 'bright',
    imageUrl: '/src/assets/images/produce_bright_modern_1791634371209.jpg',
    imageSize: '1K',
    modelUsed: 'gemini-nano-banana-2.1',
    generationPrompt: 'Bright modern minimalist culinary photography of sunburst golden yellow cherry tomatoes on vine in clean ceramic bowl with bright daylight',
  },
  {
    id: 'prod-6',
    name: 'Artisan Raw Blackberry Blossom Comb Honey',
    category: 'Artisanal & Honey',
    description: 'Unpasteurized, unfiltered comb honey harvested from beehives foraging on wild coastal blackberry blossoms and lavender hedgerows.',
    unit: 'per 16 oz glass mason jar',
    price: 18.00,
    inStock: 15,
    harvestLocation: 'East Pasture Wildflower Meadow',
    harvestDate: 'Bottled this week',
    tastingNotes: ['Blackberry blossom aroma', 'Smooth crystallization', 'Delicate herbal undertone'],
    organicCertified: true,
    stylePreset: 'social',
    imageUrl: '/src/assets/images/produce_social_topdown_1791634393316.jpg',
    imageSize: '2K',
    modelUsed: 'gemini-3-pro-image-preview',
    generationPrompt: 'Social media flat-lay top-down view of artisan glass jar of raw wildflower comb honey with wooden dipper and fresh berries on natural linen',
  }
];

export const SAMPLE_MENUS = [
  {
    id: 'menu-1',
    title: '🌿 Oakhaven Valley Heirloom Farm Menu',
    subtitle: 'Classic mixed heirloom nightshades, artisanal roots & apiary honey',
    content: `OAKHAVEN ORGANIC ACRES - WEEKLY HARVEST MENU
Location: Willamette Valley, Oregon (USDA Organic Certified)

1. Heirloom Black Krim & Cherokee Purple Beefsteak Tomatoes
- Hand-picked at deep burgundy ripeness. Rich, wine-like complex sweetness.
- $7.50 / 2 lb basket (Stock: 30)

2. Rainbow Chioggia & Golden Cylindra Beets with Tender Greens
- Crisp sweet candy-striped and golden beets. Earthy, honeyed mineral flavor.
- $5.50 / bunch (Stock: 25)

3. Baby Butterhead Bibb Lettuce & Micro-Arugula Mix
- Silky melt-in-your-mouth leaves, tender crunch with mild peppery finish.
- $4.75 / clam-shell pack (Stock: 40)

4. Early Summer Mission Figs & Alpine Strawberries
- Jammy tree-ripened black figs and tiny explosive sweet mountain berries.
- $12.00 / 1 lb wooden crate (Stock: 15)

5. Raw Mountain Wildflower Honey with Cut Comb
- Unfiltered, rich floral nectar harvested from native hedgerows.
- $16.00 / 16 oz jar (Stock: 20)

6. Foraged Golden Chanterelle & Morels
- Forest-harvested wild mushrooms, delicate apricot and woody aroma.
- $15.50 / lb (Stock: 10)
`
  },
  {
    id: 'menu-2',
    title: '🍎 High Mountain Orchard & Berry Patch',
    subtitle: 'Crisp heritage pomes, cane berries & cider preserves',
    content: `HIGH MOUNTAIN ORCHARDS & BERRY PATCH
Location: Hood River Valley, Washington State

1. Heritage Honeycrisp & Cosmic Crisp Apples
- Tree-ripened, explosive snap, sweet-tart effervescence.
- $6.00 / 3 lb tote (Stock: 50)

2. Wild Marionberries & Autumn Heritage Raspberries
- Hand-harvested dawn berries with deep ruby juice and velvet sweetness.
- $8.50 / double pint basket (Stock: 35)

3. Bartlett & Asian Pear Sampler
- Butter-soft aromatic flesh with floral perfume.
- $7.00 / 2 lb tray (Stock: 22)

4. Mountain Elderberry & Blackcurrant Botanical Elixir
- Cold-pressed small batch farm syrup with raw organic ginger.
- $14.50 / 250ml glass bottle (Stock: 18)

5. Heirloom Purple Kohlrabi & Crisp Watermelon Radishes
- Peppery, juicy crunch for raw carpaccio and salads.
- $5.25 / bunch (Stock: 28)
`
  },
  {
    id: 'menu-3',
    title: '🌱 Sunlit Hydro & Vertical Micro-Greens',
    subtitle: 'Nutrient-dense specialty herbs, edible flowers & baby brassicas',
    content: `VERDANT HEIGHTS BOTANICAL FARM
Location: Hudson Valley Organic Co-op

1. Genovese Sweet Basil & Thai Holy Basil
- Heavily fragrant aromatic leaves, harvested roots-on for maximum freshness.
- $4.25 / live root bunch (Stock: 60)

2. Rainbow Swiss Chard & Lacinato Dinosaur Kale
- Sturdy vibrant stalks with deep emerald mineral-rich leaves.
- $5.00 / farm bouquet (Stock: 30)

3. Gourmet Edible Flower Medley (Nasturtium, Borage & Calendula)
- Vibrant culinary blossoms for chef plating, peppery sweet floral notes.
- $9.00 / chef tray (Stock: 16)

4. Hakurei Tokyo Sweet White Turnips
- So sweet they can be eaten raw like apples, with crisp buttery greens.
- $5.50 / bunch (Stock: 24)

5. Hand-Smoked Garlic Braid & Rosemary Wreath
- Hardneck porcelain garlic smoked over applewood embers.
- $13.50 / decorative braid (Stock: 12)
`
  }
];
