// src/constants.ts

export const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1', desc: 'Instagram Post / Square' },
  { value: '4:5', label: '4:5', desc: 'Portrait Post' },
  { value: '9:16', label: '9:16', desc: 'Story / Reels' },
  { value: '3:2', label: '3:2', desc: 'Natural Frame' },
  { value: '2:1', label: '2:1', desc: 'Cinematic Wide' },
  { value: '16:9', label: '16:9', desc: 'Landscape / Header' },
];

export const CAMERA_ANGLES = [
  {
    value: 1.0,
    label: 'Front',
    desc: 'Straight-on view of the main windows wall',
  },
  {
    value: 1.5,
    label: 'Left Corner',
    desc: 'Between windows and left wall (45° angle)',
  },
  {
    value: 2.0,
    label: 'Right Corner',
    desc: 'Between windows and right wall (45° angle)',
  },
  {
    value: 2.5,
    label: 'Side Wall',
    desc: 'Looking at the long side wall',
  },
  {
    value: 3.0,
    label: 'Opposite Wall',
    desc: 'Facing opposite wall from windows',
  },
  {
    value: 4.0,
    label: 'Wide Architectural',
    desc: 'Wide angle showing multiple walls',
  },
  {
    value: 5.0,
    label: 'Four Wall View',
    desc: 'Maximally wide, all walls visible',
  },
];

export const LENS_OPTIONS = [
  { id: 'iphone-1x', name: 'iPhone 1x', description: 'Most natural perspective, everyday look' },
  { id: 'iphone-0.5x', name: 'iPhone 0.5x', description: 'Ultra wide, slight corner distortion' },
  { id: 'iphone-2x', name: 'iPhone 2x', description: 'Telephoto, tighter framing' },
  { id: '24mm', name: '24mm Wide', description: 'Classic architectural wide angle' },
  { id: '16mm', name: '16mm Ultra Wide', description: 'Dramatic ultra wide room shot' },
  { id: '35mm', name: '35mm Lifestyle', description: 'Natural depth, lifestyle photography' },
  { id: '50mm', name: '50mm Prime', description: 'Beautiful soft bokeh, premium feel' },
  { id: '85mm', name: '85mm Portrait', description: 'Compresses space, highlights objects' },
  { id: '135mm', name: '135mm Tele', description: 'Strong compression, pulls background closer' },
  { id: '28mm-analog', name: '28mm Analog', description: 'Vintage grain, slight softness' },
  { id: 'gopro-superview', name: 'GoPro Superview', description: 'Extreme wide, curved edges' },
  { id: 'drone-top', name: 'Drone Top View', description: 'Straight top-down, full floor' },
  { id: 'cctv', name: 'CCTV Lens', description: 'Flat contrast, mild distortion' },
  { id: 'film-90s', name: '90s Film Lens', description: 'Warm tones, nostalgic softness' },
  { id: 'dslr-14mm', name: '14mm DSLR', description: 'Super wide, full room coverage' },
];

export const LIGHTING_OPTIONS = [
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
  'Mixed Lighting',
];
