import React, { useRef, useState } from 'react';
import { 
  ASPECT_RATIOS, 
  LENS_OPTIONS, 
  CAMERA_ANGLES, 
  LIGHTING_OPTIONS 
} from '../constants';
import { 
  RoomConfig,
  Preset
} from '../types';

interface CreatorWizardProps {
  config: RoomConfig;
  updateConfig: (key: keyof RoomConfig, value: any) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onDeletePreset: (id: string) => void;
  onLoadPreset: (preset: Preset) => void;
}

export const CreatorWizard: React.FC<CreatorWizardProps> = ({
  config,
  updateConfig,
  onGenerate,
  isGenerating,
  presets,
  onSavePreset,
  onDeletePreset,
  onLoadPreset
}) => {
  const rugInputRef = useRef<HTMLInputElement>(null);
  const roomBaseInputRef = useRef<HTMLInputElement>(null);
  const [isNamingPreset, setIsNamingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');

  const handleRugUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files: File[] = Array.from(e.target.files);
      const selectedFiles = files.slice(0, 3 - config.rugImages.length);
      
      const promises = selectedFiles.map((file) => {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                if (result) {
                    const base64Data = result.split(',')[1];
                    resolve(base64Data);
                }
            };
            reader.readAsDataURL(file);
        });
      });

      const newImages = await Promise.all(promises);
      if (newImages.length > 0) {
        updateConfig('rugImages', [...config.rugImages, ...newImages]);
      }
      if (rugInputRef.current) rugInputRef.current.value = '';
    }
  };

  const handleRoomBaseUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            if (result) {
                const base64Data = result.split(',')[1];
                updateConfig('roomReferenceImage', base64Data);
            }
        };
        reader.readAsDataURL(file);
        if (roomBaseInputRef.current) roomBaseInputRef.current.value = '';
    }
  };

  const removeRugImage = (index: number) => {
    const newImages = [...config.rugImages];
    newImages.splice(index, 1);
    updateConfig('rugImages', newImages);
  };

  const savePreset = () => {
      if(!newPresetName.trim()) return;
      onSavePreset(newPresetName);
      setNewPresetName('');
      setIsNamingPreset(false);
  };

  const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
    <div className="mb-4 border-b border-stone-100 pb-2">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
        {title}
        </h3>
        {subtitle && <p className="text-xs text-stone-400 mt-1">{subtitle}</p>}
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-stone-100 overflow-hidden">
        
      {/* Header */}
      <div className="bg-stone-900 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif font-bold">Studio Configuration</h2>
            <p className="text-stone-400 text-sm mt-1">Configure your scene.</p>
          </div>
      </div>

      <div className="p-6 md:p-8 space-y-10">
        
        {/* PRESETS SECTION */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
                <label className="text-xs font-bold text-stone-500 uppercase block mb-2">Load Preset</label>
                {presets.length === 0 ? (
                    <div className="text-sm text-stone-400 italic">No saved presets yet</div>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {presets.map(p => (
                            <div key={p.id} className="inline-flex items-center gap-2 bg-white border border-stone-200 rounded-lg px-3 py-1.5 shadow-sm hover:border-terracotta-300 transition-colors">
                                <button 
                                    onClick={() => onLoadPreset(p)}
                                    className="text-sm font-medium text-stone-700 hover:text-terracotta-600"
                                >
                                    {p.name}
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDeletePreset(p.id); }}
                                    className="text-stone-400 hover:text-red-500"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-4">
                {!isNamingPreset ? (
                     <button 
                        onClick={() => setIsNamingPreset(true)}
                        className="text-sm font-bold text-stone-600 hover:text-stone-900 flex items-center gap-1 whitespace-nowrap"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                        </svg>
                        Save Current as Preset
                     </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <input 
                            type="text" 
                            autoFocus
                            placeholder="Preset Name"
                            value={newPresetName}
                            onChange={(e) => setNewPresetName(e.target.value)}
                            className="text-sm p-1.5 rounded border border-stone-300 w-32 focus:border-terracotta-500 outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && savePreset()}
                        />
                        <button 
                            onClick={savePreset}
                            disabled={!newPresetName.trim()}
                            className="bg-stone-900 text-white text-xs font-bold px-3 py-2 rounded hover:bg-stone-700 disabled:opacity-50"
                        >
                            Save
                        </button>
                         <button 
                            onClick={() => setIsNamingPreset(false)}
                            className="text-stone-400 hover:text-stone-600"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>

        {/* 1. UPLOADS GRID */}
        <div className="grid md:grid-cols-2 gap-8">
            
            {/* ROOM BASE REFERENCE */}
            <div>
                <SectionTitle 
                    title="1. Room Base Reference (Optional)" 
                    subtitle="Upload a room to keep architecture & furniture EXACTLY the same. Only the rug will change."
                />
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={roomBaseInputRef}
                    onChange={handleRoomBaseUpload}
                />
                
                {!config.roomReferenceImage ? (
                    <div 
                        className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-8 text-center hover:border-terracotta-400 transition-colors cursor-pointer group"
                        onClick={() => roomBaseInputRef.current?.click()}
                    >
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mx-auto mb-3 group-hover:scale-110 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-stone-400 group-hover:text-terracotta-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-stone-600">Upload Base Room</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        <div className="relative rounded-xl overflow-hidden border border-stone-200 group">
                            <img 
                                src={`data:image/png;base64,${config.roomReferenceImage}`} 
                                alt="Base Room" 
                                className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                    onClick={() => updateConfig('roomReferenceImage', null)}
                                    className="bg-white/90 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-white"
                                >
                                    Remove Base
                                </button>
                            </div>
                            <div className="absolute top-2 left-2 bg-stone-900 text-white text-[10px] px-2 py-1 rounded">Base Reference</div>
                        </div>

                         {/* Reference Angle Selector */}
                        <div className="bg-terracotta-50 border border-terracotta-200 rounded-lg p-3">
                             <label className="text-xs font-bold text-terracotta-800 uppercase block mb-2">
                                Which angle is this photo?
                             </label>
                             <select 
                                value={config.referenceImageAngle} 
                                onChange={(e) => updateConfig('referenceImageAngle', parseFloat(e.target.value))}
                                className="w-full p-2 rounded border border-terracotta-200 text-sm bg-white"
                             >
                                {CAMERA_ANGLES.map(a => (
                                    <option key={a.value} value={a.value}>{a.label} ({a.desc})</option>
                                ))}
                             </select>
                             <p className="text-[10px] text-terracotta-700 mt-1">
                                Telling AI the correct starting angle helps it rotate the room accurately.
                             </p>
                        </div>
                    </div>
                )}
            </div>

            {/* RUG REFERENCES */}
            <div>
                <SectionTitle 
                    title="2. Rug Reference (Optional)" 
                    subtitle="Upload rugs you want to place in the room."
                />
                 <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    className="hidden" 
                    ref={rugInputRef}
                    onChange={handleRugUpload}
                />
                
                <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl p-4 min-h-[12rem] flex flex-col justify-center">
                    {config.rugImages.length === 0 ? (
                         <div 
                            className="cursor-pointer flex flex-col items-center gap-2 py-6 hover:opacity-70"
                            onClick={() => rugInputRef.current?.click()}
                         >
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-terracotta-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-stone-600">Add Rugs</p>
                         </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2 px-2">
                            {config.rugImages.map((img, idx) => (
                                <div key={idx} className="relative group w-24 h-24 flex-shrink-0">
                                    <img 
                                        src={`data:image/png;base64,${img}`} 
                                        alt={`Rug ${idx}`} 
                                        className="w-full h-full object-cover rounded-lg border border-stone-200 shadow-sm"
                                    />
                                    <button 
                                        onClick={() => removeRugImage(idx)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                             {config.rugImages.length < 3 && (
                                 <div 
                                    className="w-24 h-24 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center cursor-pointer hover:bg-stone-100 flex-shrink-0"
                                    onClick={() => rugInputRef.current?.click()}
                                 >
                                    <span className="text-2xl text-stone-400">+</span>
                                 </div>
                             )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* 3. CAMERA VIEW & HEIGHT */}
        <div className="grid md:grid-cols-2 gap-8">
            {/* ANGLE */}
            <div>
                <SectionTitle title="3. Camera Wall View" subtitle="1 = Windows (Front), 1.5 = Corner, 2 = Right Wall, etc." />
                
                <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 h-full">
                    <div className="flex flex-col gap-6">
                        {/* Visual Slider */}
                        <input 
                            type="range"
                            min="1.0"
                            max="5.0"
                            step="0.5"
                            value={config.angle}
                            onChange={(e) => updateConfig('angle', parseFloat(e.target.value))}
                            className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-stone-900"
                        />
                        
                        {/* Visual Indicators */}
                        <div className="grid grid-cols-5 md:grid-cols-5 gap-2">
                            {CAMERA_ANGLES.filter(a => a.value <= 3.0).map((angle) => { // Show first 5
                                const isSelected = config.angle === angle.value;
                                return (
                                    <div 
                                        key={angle.value}
                                        onClick={() => updateConfig('angle', angle.value)}
                                        className={`
                                            cursor-pointer rounded-lg p-1 text-center transition-all border
                                            ${isSelected 
                                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105' 
                                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}
                                        `}
                                    >
                                        <div className="text-sm font-bold">{angle.value}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-4 md:grid-cols-4 gap-2">
                             {CAMERA_ANGLES.filter(a => a.value > 3.0).map((angle) => { // Show remaining
                                const isSelected = config.angle === angle.value;
                                return (
                                    <div 
                                        key={angle.value}
                                        onClick={() => updateConfig('angle', angle.value)}
                                        className={`
                                            cursor-pointer rounded-lg p-1 text-center transition-all border
                                            ${isSelected 
                                                ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105' 
                                                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'}
                                        `}
                                    >
                                        <div className="text-sm font-bold">{angle.value}</div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Description of current selection */}
                        <div className="text-center mt-auto">
                             <p className="text-stone-900 font-bold text-sm">
                                 Current: <span className="text-terracotta-600">{CAMERA_ANGLES.find(a => a.value === config.angle)?.desc}</span>
                             </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* HEIGHT */}
            <div>
                 <SectionTitle title="4. Camera Height" subtitle="1 = Floor Level, 5 = Eye Level, 10 = Top Down" />
                 <div className="bg-stone-50 p-6 rounded-xl border border-stone-200 h-full flex flex-col justify-center">
                    <div className="flex justify-between mb-4">
                        <label className="text-xs font-bold text-stone-500 uppercase">Height Level</label>
                        <span className="text-terracotta-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-stone-100">{config.cameraHeight}/10</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={config.cameraHeight}
                        onChange={(e) => updateConfig('cameraHeight', parseInt(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-medium">
                        <span>Floor (Carpet)</span>
                        <span>Eye Level</span>
                        <span>Ceiling</span>
                    </div>
                    <p className="text-center text-sm font-medium text-stone-700 mt-4">
                        {config.cameraHeight <= 2 && "Worm's Eye (Floor Texture)"}
                        {config.cameraHeight > 2 && config.cameraHeight <= 4 && "Low / Knee Level"}
                        {config.cameraHeight > 4 && config.cameraHeight <= 6 && "Standard Eye Level"}
                        {config.cameraHeight > 6 && config.cameraHeight <= 8 && "High Angle"}
                        {config.cameraHeight > 8 && "Bird's Eye / Top Down"}
                    </p>
                 </div>
            </div>
        </div>

        {/* 5. ASPECT RATIO */}
        <div>
            <SectionTitle title="5. Aspect Ratio" />
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => updateConfig('aspectRatio', ratio.value)}
                    className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-1 text-center ${
                      config.aspectRatio === ratio.value
                        ? 'border-terracotta-500 bg-terracotta-50 shadow-sm ring-1 ring-terracotta-500'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="text-sm font-bold text-stone-900">{ratio.label}</div>
                    <div className="text-[10px] text-stone-500 truncate w-full">{ratio.desc}</div>
                  </button>
                ))}
            </div>
        </div>

        {/* 6. CAMERA & LENS */}
        <div>
            <SectionTitle title="6. Camera & Lens" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {LENS_OPTIONS.map((lens) => (
                  <button
                    key={lens.id}
                    onClick={() => updateConfig('lens', lens.id)}
                    className={`p-2 text-left rounded border transition-all h-full ${
                      config.lens === lens.id
                        ? 'border-terracotta-500 bg-terracotta-50 shadow-sm'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-stone-900">{lens.name}</div>
                    <div className="text-[10px] text-stone-500 leading-tight mt-0.5">{lens.description}</div>
                  </button>
                ))}
            </div>
        </div>

        {/* 7. LIGHTING */}
        <div>
            <SectionTitle title="7. Lighting Atmosphere" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {LIGHTING_OPTIONS.map((light) => {
                   const isSelected = config.lighting.includes(light);
                   return (
                    <button
                        key={light}
                        onClick={() => {
                            const newLighting = isSelected 
                                ? config.lighting.filter(l => l !== light)
                                : [...config.lighting, light];
                            updateConfig('lighting', newLighting);
                        }}
                        className={`p-2 rounded border transition-all text-xs font-medium text-left flex items-center gap-2 ${
                        isSelected
                            ? 'border-olive-500 bg-olive-50 text-olive-800 ring-1 ring-olive-500'
                            : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                        }`}
                    >
                        <div className={`w-3 h-3 rounded-full border ${isSelected ? 'bg-olive-500 border-olive-500' : 'border-stone-300'}`} />
                        {light}
                    </button>
                   );
                })}
            </div>
        </div>

        {/* 8. DETAILS */}
        <div className="grid md:grid-cols-2 gap-8">
            <div>
                 <SectionTitle title="8. Rug Scale" />
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                    <div className="flex justify-between mb-4">
                        <label className="text-xs font-bold text-stone-500 uppercase">Size</label>
                        <span className="text-terracotta-600 font-bold bg-white px-2 py-0.5 rounded shadow-sm border border-stone-100">{config.rugScale}/10</span>
                    </div>
                    <input 
                        type="range" 
                        min="1" 
                        max="10" 
                        value={config.rugScale}
                        onChange={(e) => updateConfig('rugScale', parseInt(e.target.value))}
                        className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-terracotta-500"
                    />
                    <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-medium">
                        <span>Small Accent</span>
                        <span>Room Filling</span>
                    </div>
                </div>
            </div>

            <div>
                 <SectionTitle title="9. Extra Details" />
                <textarea
                    value={config.extraPrompt}
                    onChange={(e) => updateConfig('extraPrompt', e.target.value)}
                    placeholder="E.g. Add a white cat sleeping on the sofa, vintage books on the table..."
                    className="w-full p-4 rounded-xl border border-stone-200 focus:border-terracotta-500 focus:ring-1 focus:ring-terracotta-500 outline-none resize-none h-32 bg-stone-50 text-sm"
                />
            </div>
        </div>

        {/* SUBMIT */}
        <div className="pt-4">
            <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-5 bg-stone-900 text-white font-serif text-xl rounded-xl shadow-lg hover:bg-stone-800 hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center gap-3 transform active:scale-[0.99]"
            >
            {isGenerating ? (
                <>
                <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Space...
                </>
            ) : (
                <>
                 <span>Generate Room</span>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                </>
            )}
            </button>
        </div>
      </div>
    </div>
  );
};