import { GenModel, ImageResolution, StylePreset } from '../types/produce';

export interface ParseMenuResponse {
  farm: {
    farmName: string;
    tagline: string;
    location: string;
    certifications?: string[];
    establishedYear?: number;
    story: string;
  };
  items: Array<{
    name: string;
    category: string;
    description: string;
    unit: string;
    price: number;
    inStock: number;
    harvestLocation?: string;
    harvestDate?: string;
    tastingNotes?: string[];
    organicCertified?: boolean;
    recommendedStyle?: StylePreset;
    specificProduceSubject?: string;
  }>;
  warning?: string;
}

export interface GenerateImageResponse {
  imageUrl: string;
  promptUsed: string;
  modelUsed: GenModel;
  imageSize: ImageResolution;
  aspectRatio: string;
  style: StylePreset;
  error?: string;
}

export interface EditImageResponse {
  imageUrl: string;
  promptUsed: string;
  modelUsed: string;
  error?: string;
}

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function parseMenuText(menuText: string): Promise<ParseMenuResponse> {
  const res = await fetch('/api/parse-menu', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ menuText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to parse menu' }));
    throw new Error(err.error || 'Failed to parse menu');
  }

  return await res.json();
}

export async function generateProduceImage(params: {
  prompt: string;
  style: StylePreset;
  model?: GenModel;
  imageSize?: ImageResolution;
  aspectRatio?: string;
}): Promise<GenerateImageResponse> {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: params.prompt,
      style: params.style,
      model: params.model || 'gemini-3-pro-image-preview',
      imageSize: params.imageSize || '1K',
      aspectRatio: params.aspectRatio || '4:3',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Image generation failed' }));
    throw new Error(err.error || 'Image generation failed');
  }

  return await res.json();
}

export async function editProduceImage(params: {
  imageBase64: string;
  editPrompt: string;
  imageSize?: ImageResolution;
}): Promise<EditImageResponse> {
  const res = await fetch('/api/edit-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageBase64: params.imageBase64,
      editPrompt: params.editPrompt,
      imageSize: params.imageSize || '1K',
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Image editing failed' }));
    throw new Error(err.error || 'Image editing failed');
  }

  return await res.json();
}
