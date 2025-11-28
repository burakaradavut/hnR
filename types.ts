export enum AppStatus {
  CHECKING_KEY = 'CHECKING_KEY',
  NO_KEY = 'NO_KEY',
  READY = 'READY',
  GENERATING = 'GENERATING',
  ERROR = 'ERROR'
}

export type AspectRatio = '1:1' | '4:5' | '9:16' | '3:2' | '2:1' | '16:9';

export interface LensConfig {
  id: string;
  name: string;
  description: string;
}

export type LightingOption = 
  | 'Golden Hour'
  | 'Morning Light'
  | 'Soft Cloudy'
  | 'Moonlight'
  | 'Candlelight'
  | 'Accent Lamps Only'
  | 'Neon Lighting'
  | 'Fireplace Glow'
  | 'TV Screen Light'
  | 'Spotlights'
  | 'Table Lamps Only'
  | 'Mixed Lighting';

export interface RoomConfig {
  rugImages: string[];           // base64 PNG string listesi
  roomReferenceImage: string | null; // base64 PNG
  referenceImageAngle: number;   // referans foto açısı (1.0, 1.5 vs)
  angle: number;                 // yeni istenen açı
  cameraHeight: number;          // 1–10
  aspectRatio: string;           // "1:1" vb
  lens: string;                  // LENS_OPTIONS içindeki id
  lighting: string[];            // LIGHTING_OPTIONS içinden seçilenler
  rugScale: number;              // 1–10
  extraPrompt: string;           // kullanıcı serbest prompt
}

export interface Preset {
  id: string;
  name: string;
  timestamp: number;
  config: RoomConfig;
}

export interface GeneratedImage {
  id: string;
  url: string;
  timestamp: number;
  config: RoomConfig;
  base64Data?: string; // Stored for editing re-use
  mimeType?: string;
}
