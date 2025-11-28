import React, { useState } from 'react';

interface ApiKeyModalProps {
  onConnect: () => Promise<void>;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onConnect }) => {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await onConnect();
    } catch (e) {
      console.error("Failed to connect key", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 border border-stone-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-terracotta-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Access Required</h2>
          <p className="text-stone-600 mb-6 leading-relaxed">
            This application uses the high-fidelity <span className="font-semibold text-stone-800">Gemini 3 Pro Image</span> model. 
            To proceed, please select a paid Google Cloud Project API key.
          </p>

          <button
            onClick={handleConnect}
            disabled={loading}
            className="w-full py-3.5 bg-stone-900 text-white rounded-lg font-medium hover:bg-stone-800 transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg transform active:scale-[0.98]"
          >
            {loading ? 'Connecting...' : 'Select API Key'}
          </button>
          
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 text-xs text-stone-400 hover:text-stone-600 hover:underline transition-colors"
          >
            Read about Gemini API Billing
          </a>
        </div>
      </div>
    </div>
  );
};
