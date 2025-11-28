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
  aspectRatio: AspectRatio;
  lens: string; // ID of the lens
  angle: number; // 1.0, 1.5, 2.0, etc.
  cameraHeight: number; // 1-10
  lighting: LightingOption[];
  rugScale: number; // 1-10
  extraPrompt: string;
  rugImages: string[]; // Array of base64 strings
  roomReferenceImage: string | null; // Base64 string of the room to keep consistent
  referenceImageAngle: number; // Angle of the uploaded reference
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