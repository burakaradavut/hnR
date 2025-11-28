import React from 'react';
import { GeneratedImage, AspectRatio } from '../types';

interface GalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
  onEdit: (image: GeneratedImage) => void;
  onResize: (image: GeneratedImage, newRatio: AspectRatio) => void;
  onDownload: (image: GeneratedImage) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ 
    images, 
    onSelect,
    onEdit,
    onResize,
    onDownload
}) => {
  if (images.length === 0) return null;

  return (
    <div className="mt-12 animate-fade-in">
      <h3 className="text-xl font-serif font-bold text-stone-900 mb-6 flex items-center gap-2">
        <span>Gallery</span>
        <span className="text-xs font-sans bg-stone-200 text-stone-600 px-2 py-1 rounded-full">{images.length}</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img) => (
          <div key={img.id} className="group relative aspect-square bg-stone-100 rounded-xl overflow-hidden shadow-sm border border-stone-100">
            <img 
                src={img.url} 
                alt="Room" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-pointer"
                onClick={() => onSelect(img)}
            />
            
            {/* Hover Overlay Actions */}
            <div className="absolute inset-0 bg-stone-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-4">
               <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(img); }}
                  className="w-full py-2 bg-white text-stone-900 text-xs font-bold rounded hover:bg-stone-200"
               >
                  EDIT
               </button>
               <div className="w-full flex gap-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDownload(img); }}
                        className="flex-1 py-2 bg-stone-800 text-white text-xs font-bold rounded hover:bg-stone-700"
                    >
                        SAVE
                    </button>
                     {/* Simple resize dropdown trigger could go here, for now just a button that might open a modal or default to 1:1 for simplicity in gallery view, or mapped in parent */}
               </div>
            </div>
            
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur text-white text-[10px] px-2 py-1 rounded pointer-events-none">
                {img.config.aspectRatio}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
