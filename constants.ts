import { LensConfig, AspectRatio, LightingOption } from './types';

export const CORE_DNA_PROMPT = `
Mediterranean–Boho–Vintage maximalist living room
yüksek tavan, çok büyük yerden tavana pencereler
sabah/gün ışığı
büyük retro 70s corduroy koltuk
retro 70s objeler, modern/çılgın masalar
renkli gallery wall
bitkiler
neutral floor
iPhone gerçekçiliği, hafif kusurlu, doğal grain, lens distorsiyonu
gerçek fotoğraf gibi humanized görünüm
The room must ALWAYS keep the same architecture, proportions, lighting direction and window placement.
`;

export const ASPECT_RATIOS: { value: AspectRatio; label: string; desc: string }[] = [
  { value: '1:1', label: '1:1', desc: 'Instagram Post' },
  { value: '4:5', label: '4:5', desc: 'Portrait' },
  { value: '9:16', label: '9:16', desc: 'Story/Reels' },
  { value: '3:2', label: '3:2', desc: 'Natural Frame' },
  { value: '2:1', label: '2:1', desc: 'Cinematic Wide' },
  { value: '16:9', label: '16:9', desc: 'Landscape' },
];

export const LENS_OPTIONS: LensConfig[] = [
  { id: 'iphone_1x', name: 'iPhone 1x', description: 'en doğal' },
  { id: 'iphone_05x', name: 'iPhone 0.5x', description: 'ultra wide hafif distorsiyon' },
  { id: 'iphone_2x', name: 'iPhone 2x', description: 'telephoto' },
  { id: '24mm', name: '24mm', description: 'mimari geniş açı' },
  { id: '16mm', name: '16mm', description: 'dramatik ultra geniş' },
  { id: '35mm', name: '35mm', description: 'lifestyle doğal' },
  { id: '50mm', name: '50mm', description: 'premium bokeh' },
  { id: '85mm', name: '85mm', description: 'objeleri öne çıkarır' },
  { id: '135mm', name: '135mm', description: 'sıkıştırılmış perspektif' },
  { id: '28mm_analog', name: '28mm analog', description: 'vintage grain' },
  { id: 'gopro', name: 'GoPro Superview', description: 'aşırı geniş' },
  { id: 'drone', name: 'Drone top view', description: 'yukarıdan düz çekim' },
  { id: 'cctv', name: 'CCTV lens', description: 'düşük kontrast, hafif bozuk görüntü' },
  { id: 'film_90s', name: 'Film 90s lens', description: 'sıcak retro' },
  { id: 'dslr_14mm', name: 'DSLR 14mm', description: 'çok geniş oda yakalar' },
];

// 1.0 = Front (Windows)
// Each 0.5 increase rotates 45 degrees right
export const CAMERA_ANGLES: { value: number; label: string; desc: string }[] = [
  { value: 1.0, label: 'Angle 1.0', desc: 'Front View (Windows)' },
  { value: 1.5, label: 'Angle 1.5', desc: 'Corner (Windows + Right)' },
  { value: 2.0, label: 'Angle 2.0', desc: 'Right Wall' },
  { value: 2.5, label: 'Angle 2.5', desc: 'Corner (Right + Back)' },
  { value: 3.0, label: 'Angle 3.0', desc: 'Back Wall' },
  { value: 3.5, label: 'Angle 3.5', desc: 'Corner (Back + Left)' },
  { value: 4.0, label: 'Angle 4.0', desc: 'Left Wall' },
  { value: 4.5, label: 'Angle 4.5', desc: 'Corner (Left + Windows)' },
  { value: 5.0, label: 'Angle 5.0', desc: 'Top Down View' }, // Special case
];

export const LIGHTING_OPTIONS: LightingOption[] = [
  'Golden Hour',
  'Morning Light',
  'Soft Cloudy',
  'Moonlight',
  'Candlelight',
  'Accent Lamps Only',
  'Neon Lighting',
  'Fireplace Glow',
  'TV Screen Light',
  'Spotlights',
  'Table Lamps Only',
  'Mixed Lighting'
];