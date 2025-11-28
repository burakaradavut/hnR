import React, { useState, useEffect, useCallback } from 'react';
import { 
    AppStatus, 
    RoomConfig, 
    GeneratedImage, 
    AspectRatio,
    Preset
} from './types';
import { checkApiKey, openKeySelection, generateRoomImage } from './services/geminiService';
import { ApiKeyModal } from './components/ApiKeyModal';
import { CreatorWizard } from './components/CreatorWizard';
import { Gallery } from './components/Gallery';
import { ASPECT_RATIOS } from './constants';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.CHECKING_KEY);
  
  // Configuration State
  const [config, setConfig] = useState<RoomConfig>({
    aspectRatio: '1:1',
    lens: 'iphone_1x',
    angle: 1.0, // Default 1.0 Front View
    cameraHeight: 5, // Default Eye Level
    lighting: [],
    rugScale: 5,
    extraPrompt: '',
    rugImages: [],
    roomReferenceImage: null,
    referenceImageAngle: 1.0
  });

  const [presets, setPresets] = useState<Preset[]>(() => {
    try {
        const saved = localStorage.getItem('room_presets');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load presets", e);
        return [];
    }
  });

  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  
  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  
  const initKeyCheck = useCallback(async () => {
    try {
      const hasKey = await checkApiKey();
      setStatus(hasKey ? AppStatus.READY : AppStatus.NO_KEY);
    } catch {
      setStatus(AppStatus.NO_KEY);
    }
  }, []);

  useEffect(() => { initKeyCheck(); }, [initKeyCheck]);

  const handleKeySelect = async () => {
    await openKeySelection();
    await initKeyCheck();
  };

  const updateConfig = (key: keyof RoomConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Preset Handlers
  const handleSavePreset = (name: string) => {
    // We intentionally exclude heavy image data from presets to save LocalStorage space
    const cleanConfig: RoomConfig = {
        ...config,
        rugImages: [], // Don't save rug images in preset
        roomReferenceImage: null, // Don't save reference room in preset
    };

    const newPreset: Preset = {
        id: crypto.randomUUID(),
        name,
        timestamp: Date.now(),
        config: cleanConfig
    };

    const updatedPresets = [...presets, newPreset];
    setPresets(updatedPresets);
    localStorage.setItem('room_presets', JSON.stringify(updatedPresets));
  };

  const handleDeletePreset = (id: string) => {
    const updatedPresets = presets.filter(p => p.id !== id);
    setPresets(updatedPresets);
    localStorage.setItem('room_presets', JSON.stringify(updatedPresets));
  };

  const handleLoadPreset = (preset: Preset) => {
    // Preserve current images if any, but overwrite settings
    setConfig(prev => ({
        ...preset.config,
        rugImages: prev.rugImages,
        roomReferenceImage: prev.roomReferenceImage
    }));
  };

  const handleGenerate = async (customConfig?: RoomConfig, customEditPrompt?: string, sourceImg?: GeneratedImage) => {
    if (status === AppStatus.GENERATING) return;
    setStatus(AppStatus.GENERATING);

    try {
      const cfg = customConfig || config;
      const result = await generateRoomImage(cfg, customEditPrompt, sourceImg);
      
      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: result.url,
        timestamp: Date.now(),
        config: cfg,
        base64Data: result.base64Data,
        mimeType: result.mimeType
      };

      setHistory(prev => [newImage, ...prev]);
      setCurrentImage(newImage);
      setStatus(AppStatus.READY);
      
      // Reset specialized modes
      setIsEditing(false);
      setEditPrompt('');

    } catch (error: any) {
      console.error(error);
      if (error.message === "API_KEY_INVALID") {
        setStatus(AppStatus.NO_KEY);
      } else {
        setStatus(AppStatus.ERROR);
        alert("Failed to generate. Please try again.");
        setStatus(AppStatus.READY);
      }
    }
  };

  const startEdit = (img: GeneratedImage) => {
    setCurrentImage(img);
    setIsEditing(true);
    setEditPrompt('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const performResize = (img: GeneratedImage, newRatio: AspectRatio) => {
     const newConfig = { ...img.config, aspectRatio: newRatio };
     handleGenerate(newConfig);
  };

  const downloadImage = (img: GeneratedImage) => {
    const a = document.createElement('a');
    a.href = img.url;
    a.download = `home-rugs-${img.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans pb-20">
      {status === AppStatus.NO_KEY && <ApiKeyModal onConnect={handleKeySelect} />}

      <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/90">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setCurrentImage(null); setIsEditing(false); }}>
             <div className="w-8 h-8 bg-terracotta-500 rounded-lg flex items-center justify-center shadow-lg shadow-terracotta-500/30">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-white">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
               </svg>
             </div>
             <h1 className="font-serif font-bold text-lg tracking-tight text-stone-900">
                Home & Rugs <span className="text-stone-400 font-sans font-normal text-xs ml-1">AI Creator</span>
             </h1>
          </div>
          {currentImage && (
             <button 
                onClick={() => { setCurrentImage(null); setIsEditing(false); }}
                className="text-sm font-medium text-stone-500 hover:text-stone-900"
             >
                New Project
             </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* VIEW: RESULT DISPLAY */}
        {currentImage && !isEditing && (
            <div className="animate-fade-in flex flex-col gap-6">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
                    <img src={currentImage.url} alt="Result" className="w-full h-auto max-h-[70vh] object-contain bg-stone-100" />
                    
                    <div className="p-6 bg-white border-t border-stone-100 flex flex-col md:flex-row gap-4 justify-between items-center">
                        <div className="flex gap-4 w-full md:w-auto">
                            <button 
                                onClick={() => startEdit(currentImage)}
                                className="flex-1 md:flex-none px-6 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                                Edit
                            </button>
                            <div className="relative group">
                                <button className="px-6 py-2.5 bg-stone-100 text-stone-700 font-bold rounded-lg hover:bg-stone-200 transition-colors flex items-center justify-center gap-2">
                                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                     </svg>
                                    Resize
                                </button>
                                <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 p-2 hidden group-hover:block z-20">
                                    <div className="text-xs font-bold text-stone-400 px-2 py-1 uppercase">Select Ratio</div>
                                    {ASPECT_RATIOS.map(r => (
                                        <button 
                                            key={r.value}
                                            onClick={() => performResize(currentImage, r.value)}
                                            className="w-full text-left px-2 py-2 text-sm hover:bg-stone-50 rounded-lg text-stone-700"
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => downloadImage(currentImage)}
                            className="w-full md:w-auto px-8 py-2.5 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/20"
                        >
                            Save Image
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* VIEW: EDIT MODE */}
        {isEditing && currentImage && (
            <div className="animate-fade-in max-w-2xl mx-auto">
                 <div className="flex items-center gap-2 mb-4 text-stone-500 cursor-pointer hover:text-stone-900" onClick={() => setIsEditing(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    <span className="text-sm font-bold">Cancel Editing</span>
                 </div>
                 
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-stone-200">
                    <div className="flex gap-4 mb-6">
                        <img src={currentImage.url} alt="Reference" className="w-24 h-24 object-cover rounded-lg border border-stone-200" />
                        <div>
                             <h2 className="text-xl font-serif font-bold text-stone-900">Edit this Room</h2>
                             <p className="text-sm text-stone-500 leading-relaxed mt-1">
                                Describe what you want to change. The AI will keep the room architecture consistent but update the styling.
                             </p>
                        </div>
                    </div>
                    
                    <textarea 
                        className="w-full h-32 p-4 bg-stone-50 rounded-xl border border-stone-200 focus:ring-2 focus:ring-terracotta-500 outline-none resize-none mb-4"
                        placeholder="e.g., Change the rug to a blue vintage one, add more plants near the window..."
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                    />
                    
                    <button 
                        onClick={() => handleGenerate(currentImage.config, editPrompt, currentImage)}
                        disabled={!editPrompt.trim() || status === AppStatus.GENERATING}
                        className="w-full py-3 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                         {status === AppStatus.GENERATING ? 'Processing Edit...' : 'Generate Edit'}
                    </button>
                 </div>
            </div>
        )}

        {/* VIEW: CREATOR WIZARD (SINGLE PAGE) */}
        {!currentImage && !isEditing && (
            <CreatorWizard 
                config={config} 
                updateConfig={updateConfig}
                onGenerate={() => handleGenerate()}
                isGenerating={status === AppStatus.GENERATING}
                presets={presets}
                onSavePreset={handleSavePreset}
                onDeletePreset={handleDeletePreset}
                onLoadPreset={handleLoadPreset}
            />
        )}

        {/* GLOBAL GALLERY */}
        <Gallery 
            images={history} 
            onSelect={(img) => { setCurrentImage(img); setIsEditing(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            onEdit={startEdit}
            onResize={performResize}
            onDownload={downloadImage}
        />
        
      </main>
    </div>
  );
};

export default App;