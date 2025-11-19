import React, { useState } from 'react';
import { Image as ImageIcon, X, Wand2 } from 'lucide-react';
import { ViewState } from '../types';

interface CreateProps {
  onNavigate: (view: ViewState) => void;
}

export const Create: React.FC<CreateProps> = ({ onNavigate }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!text && !imagePreview) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      onNavigate(ViewState.FEED);
    }, 1500);
  };

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto h-screen flex flex-col bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={() => onNavigate(ViewState.FEED)}
            className="p-2 text-zinc-400 hover:text-white rounded-full"
        >
            <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-white">New Secret</h1>
        <button 
            onClick={handleSubmit}
            disabled={(!text && !imagePreview) || isSubmitting}
            className={`px-6 py-2 rounded-sm font-bold text-sm transition-all ${
                (text || imagePreview) && !isSubmitting
                ? 'bg-primary text-white shadow-neon' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
        >
            {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's your secret?..."
            className="w-full flex-1 bg-transparent text-lg text-white placeholder-zinc-600 resize-none focus:outline-none p-2 leading-relaxed"
            maxLength={2000}
        />

        {imagePreview && (
            <div className="relative rounded-sm overflow-hidden max-h-64 mb-4 border border-zinc-800">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                    <X size={16} />
                </button>
            </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="py-4 border-t border-zinc-900">
        <div className="flex gap-4 items-center">
            <label className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors flex items-center gap-2">
                <ImageIcon size={20} />
                <span className="text-sm font-medium">Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            <button className="p-3 bg-gradient-to-r from-secondary to-blue-600 rounded-sm text-black font-bold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-glow">
                <Wand2 size={20} />
                <span className="text-sm">AI Enhance</span>
            </button>
        </div>
      </div>
    </div>
  );
};