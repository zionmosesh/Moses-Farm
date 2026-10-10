import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize GoogleGenAI SDK on server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Style enhancement prompts for the 3 requested aesthetic toggles
const STYLE_ENHANCERS: Record<string, string> = {
  rustic:
    'Moody chiaroscuro food photography, dark aged reclaimed barn wood tabletop, dramatic soft directional side lighting, deep rich earthy shadows, delicate water droplets and natural freshness on heirloom produce, artisanal local farm heritage aesthetic, authentic rustic warmth, photorealistic 8k food photography',
  bright:
    'Bright modern minimalist culinary editorial photography, clean soft natural morning daylight, minimalist pale limestone surface and handmade off-white ceramic bowl, crisp vibrant fresh agricultural harvest, high-end farm-to-table culinary magazine aesthetic, hyper-detailed, clean modern freshness',
  social:
    'Flat-lay overhead 90-degree top-down bird\'s-eye view culinary composition, artfully arranged local produce on woven beige linen cloth, rustic wicker textures and fresh garden herbs, viral Instagram food styling aesthetic, soft diffused daylight, balanced appetizing composition',
};

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    modelsSupported: ['gemini-3-pro-image-preview', 'gemini-nano-banana-2.1', 'gemini-3.8-flash'],
  });
});

// Parse text menu into structured produce catalog
app.post('/api/parse-menu', async (req, res) => {
  try {
    const { menuText } = req.body;
    if (!menuText || typeof menuText !== 'string' || !menuText.trim()) {
      return res.status(400).json({ error: 'Menu text is required' });
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Intelligent procedural fallback parser when API key is not yet set
      const parsedMock = fallbackMenuParser(menuText);
      return res.json(parsedMock);
    }

    const systemPrompt = `You are a master agricultural merchandiser and farm-to-table culinary expert.
Analyze the user's text-based farm menu and convert it into a structured, luxurious agricultural catalog.
If farm name, location, or story are mentioned or implied, capture them. If not, generate authentic local farm details fitting the produce.
For each item, identify or synthesize:
- name: crisp, authentic produce name (e.g., "Heirloom Brandywine Tomatoes", "Wild Mountain Huckleberries")
- category: one of ["Vegetables", "Fruits & Berries", "Leafy Greens", "Roots & Tubers", "Herbs & Aromatics", "Artisanal & Honey"]
- description: 1-2 sensory, rich agricultural sentences detailing terroir, sweetness, freshness, and culinary uses.
- unit: e.g. "per lb", "per bunch", "per 2 lb basket", "per pint", "per 16 oz jar"
- price: realistic decimal price (e.g. 5.50)
- inStock: integer inventory (e.g. 20 to 50)
- harvestLocation: specific micro-field or terrace (e.g. "Field 3 - South Hill Slope")
- harvestDate: e.g. "Harvested this morning at dawn"
- tastingNotes: array of 3 sensory notes (e.g. ["Sun-warmed sweetness", "Earthy umami", "Crisp snap"])
- organicCertified: boolean
- recommendedStyle: one of ["rustic", "bright", "social"]
- specificProduceSubject: descriptive visual subject for generating realistic photo.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Parse this farm produce menu:\n\n${menuText}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            farm: {
              type: Type.OBJECT,
              properties: {
                farmName: { type: Type.STRING },
                tagline: { type: Type.STRING },
                location: { type: Type.STRING },
                certifications: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                establishedYear: { type: Type.INTEGER },
                story: { type: Type.STRING },
              },
              required: ['farmName', 'tagline', 'location', 'story'],
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  description: { type: Type.STRING },
                  unit: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                  inStock: { type: Type.INTEGER },
                  harvestLocation: { type: Type.STRING },
                  harvestDate: { type: Type.STRING },
                  tastingNotes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  organicCertified: { type: Type.BOOLEAN },
                  recommendedStyle: { type: Type.STRING },
                  specificProduceSubject: { type: Type.STRING },
                },
                required: ['name', 'category', 'description', 'unit', 'price', 'inStock'],
              },
            },
          },
          required: ['farm', 'items'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error parsing menu with Gemini:', error);
    // Fall back to robust procedural parser so user flow never breaks
    const parsedMock = fallbackMenuParser(req.body?.menuText || '');
    return res.json({
      ...parsedMock,
      warning: error.message || 'Processed using smart local parser',
    });
  }
});

// Image Generation Endpoint with style toggles, model affordance, and 1K/2K/4K resolution
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      style = 'rustic',
      model = 'gemini-3-pro-image-preview',
      imageSize = '1K', // 1K, 2K, 4K affordance
      aspectRatio = '4:3',
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const styleModifier = STYLE_ENHANCERS[style] || STYLE_ENHANCERS.rustic;
    const fullPrompt = `${prompt}. Style: ${styleModifier}. High resolution, hyper-realistic texture, farm-fresh produce.`;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
        promptUsed: fullPrompt,
      });
    }

    // Determine target model with fallback
    const selectedModel = model === 'gemini-nano-banana-2.1'
      ? 'gemini-nano-banana-2.1'
      : 'gemini-3-pro-image-preview';

    let resultImageUrl: string | null = null;
    let actualModelUsed = selectedModel;

    try {
      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '4:3',
            imageSize: (imageSize as any) || '1K',
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          resultImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    } catch (primaryErr: any) {
      console.warn(`Primary model ${selectedModel} failed, trying fallback:`, primaryErr?.message);
      // Try gemini-3.1-flash-lite-image or nano banana as fallback
      actualModelUsed = 'gemini-3.1-flash-lite-image';
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: (aspectRatio as any) || '4:3',
          },
        },
      });

      const parts = fallbackResponse.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          resultImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultImageUrl) {
      return res.status(500).json({ error: 'No image data returned from model' });
    }

    return res.json({
      imageUrl: resultImageUrl,
      promptUsed: fullPrompt,
      modelUsed: actualModelUsed,
      imageSize,
      aspectRatio,
      style,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-image:', err);
    return res.status(500).json({
      error: err.message || 'Image generation failed',
    });
  }
});

// Image Edit & Refinement Endpoint using gemini-nano-banana-2.1
app.post('/api/edit-image', async (req, res) => {
  try {
    const {
      imageBase64,
      editPrompt,
      imageSize = '1K',
      aspectRatio = '4:3',
    } = req.body;

    if (!imageBase64 || !editPrompt) {
      return res.status(400).json({ error: 'imageBase64 and editPrompt are required' });
    }

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in environment secrets.',
      });
    }

    // Clean base64 string
    let cleanBase64 = imageBase64;
    let mimeType = 'image/jpeg';
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      cleanBase64 = parts[1];
    }

    const response = await ai.models.generateContent({
      model: 'gemini-nano-banana-2.1',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          {
            text: `Refine and edit this agricultural produce photograph: ${editPrompt}. Maintain natural organic textures and photorealistic quality.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: (aspectRatio as any) || '4:3',
          imageSize: (imageSize as any) || '1K',
        },
      },
    });

    let editedImageUrl: string | null = null;
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        editedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        break;
      }
    }

    if (!editedImageUrl) {
      return res.status(500).json({ error: 'No edited image returned' });
    }

    return res.json({
      imageUrl: editedImageUrl,
      modelUsed: 'gemini-nano-banana-2.1',
      promptUsed: editPrompt,
    });
  } catch (err: any) {
    console.error('Error in /api/edit-image:', err);
    return res.status(500).json({
      error: err.message || 'Image editing failed',
    });
  }
});

// Fallback procedural menu parser if key is absent or offline
function fallbackMenuParser(rawText: string) {
  const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: any[] = [];
  let currentFarmName = 'Green Valley Organics';
  let currentLocation = 'Sonoma County & Russian River Valley';

  // Check lines for farm headers
  for (const line of lines) {
    if (line.toLowerCase().includes('farm') || line.toLowerCase().includes('orchard') || line.toLowerCase().includes('acres')) {
      currentFarmName = line.replace(/^[#\-*0-9.]+\s*/, '').replace(/menu/i, '').trim() || currentFarmName;
    }
  }

  // Parse lines with prices or produce indicators
  const produceCandidates = [
    {
      name: 'Heritage Cherokee Purple Tomatoes',
      cat: 'Vegetables',
      price: 7.5,
      unit: 'per 2 lb basket',
      notes: ['Wine-like acidity', 'Rich umami', 'Sun-warmed'],
      style: 'rustic',
    },
    {
      name: 'Crisp Rainbow Chioggia Beets',
      cat: 'Roots & Tubers',
      price: 5.25,
      unit: 'per bunch',
      notes: ['Candy stripe sweetness', 'Earthy finish', 'Crisp raw crunch'],
      style: 'bright',
    },
    {
      name: 'Baby Butterhead Bibb Greens',
      cat: 'Leafy Greens',
      price: 4.8,
      unit: 'per farm pack',
      notes: ['Silky texture', 'Mild sweet butter', 'Mineral clean'],
      style: 'bright',
    },
    {
      name: 'Wild Summer Black Figs & Alpine Berries',
      cat: 'Fruits & Berries',
      price: 11.5,
      unit: 'per 1 lb crate',
      notes: ['Jammy sugar', 'Floral bouquet', 'Velvet seeds'],
      style: 'social',
    },
    {
      name: 'Raw Mountain Wildflower Honeycomb',
      cat: 'Artisanal & Honey',
      price: 16.0,
      unit: 'per 16 oz jar',
      notes: ['Clover nectar', 'Rich golden comb', 'Herbal undertones'],
      style: 'social',
    },
    {
      name: 'Wild Forest Golden Chanterelles',
      cat: 'Vegetables',
      price: 14.5,
      unit: 'per lb',
      notes: ['Apricot aroma', 'Earthy butter', 'Forest floor'],
      style: 'rustic',
    },
  ];

  // Try extracting lines matching numbers/items
  let parsedFromText = 0;
  for (const line of lines) {
    const priceMatch = line.match(/\$?(\d+(?:\.\d{1,2})?)/);
    const hasName = /[a-zA-Z]{3,}/.test(line);
    if (hasName && !line.toLowerCase().includes('menu') && !line.toLowerCase().includes('location') && !line.startsWith('---')) {
      const cleanName = line.replace(/^[0-9#\-\*.]+\s*/, '').split(/[-–—$]/)[0].trim();
      if (cleanName.length > 3 && cleanName.length < 50) {
        const fallbackTemplate = produceCandidates[parsedFromText % produceCandidates.length];
        const price = priceMatch ? parseFloat(priceMatch[1]) : fallbackTemplate.price;
        items.push({
          name: cleanName,
          category: fallbackTemplate.cat,
          description: `Hand-selected, prime seasonal ${cleanName.toLowerCase()} grown with organic regenerative care at peak ripeness.`,
          unit: fallbackTemplate.unit,
          price: price > 0 ? price : 6.5,
          inStock: Math.floor(Math.random() * 25) + 15,
          harvestLocation: 'Field Block 2 - Organic Terraces',
          harvestDate: 'Harvested this morning',
          tastingNotes: fallbackTemplate.notes,
          organicCertified: true,
          recommendedStyle: fallbackTemplate.style,
          specificProduceSubject: cleanName,
        });
        parsedFromText++;
        if (parsedFromText >= 6) break;
      }
    }
  }

  // If no items extracted, populate with default templates
  if (items.length === 0) {
    for (const t of produceCandidates) {
      items.push({
        name: t.name,
        category: t.cat,
        description: `Premium farm-harvested ${t.name.toLowerCase()} cultivated with regenerative organic soil methods.`,
        unit: t.unit,
        price: t.price,
        inStock: 25,
        harvestLocation: 'Valley Field 3',
        harvestDate: 'Harvested at dawn',
        tastingNotes: t.notes,
        organicCertified: true,
        recommendedStyle: t.style,
        specificProduceSubject: t.name,
      });
    }
  }

  return {
    farm: {
      farmName: currentFarmName,
      tagline: 'Regenerative small-batch heirloom harvest straight from soil to your table.',
      location: currentLocation,
      certifications: ['USDA Organic Certified', 'Regenerative Alliance', 'Non-GMO'],
      establishedYear: 2004,
      story: 'Dedicated to soil vitality, heirloom crop preservation, and direct community nourishment with zero synthetic inputs.',
    },
    items,
  };
}

// Start Vite in dev mode or serve static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Verdant Harvest Agro Server running on port ${port} (mode: ${isProd ? 'production' : 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
