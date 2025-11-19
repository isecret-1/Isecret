import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

export const Create: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File too large (max 5MB)");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if ((!text && !imageFile) || !user) return;
    
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = null;

      // 1. Upload Image if exists
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('posts')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('posts')
          .getPublicUrl(fileName);
          
        uploadedImageUrl = publicUrl;
      }

      // 2. Create Post Record
      const { error: dbError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: text,
          image_url: uploadedImageUrl,
        });

      if (dbError) throw dbError;

      navigate('/');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto h-screen flex flex-col bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <button 
            onClick={() => navigate(-1)}
            className="p-2 text-zinc-400 hover:text-white rounded-full"
        >
            <X size={24} />
        </button>
        <h1 className="text-lg font-bold text-white">{t.create}</h1>
        <button 
            onClick={handleSubmit}
            disabled={(!text && !imagePreview) || isSubmitting}
            className={`px-6 py-2 rounded-sm font-bold text-sm transition-all ${
                (text || imagePreview) && !isSubmitting
                ? 'bg-primary text-white shadow-neon' 
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
        >
            {isSubmitting ? t.posting : t.postButton}
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.postPlaceholder}
            className="w-full flex-1 bg-transparent text-lg text-white placeholder-zinc-600 resize-none focus:outline-none p-2 leading-relaxed"
            maxLength={2000}
        />

        {imagePreview && (
            <div className="relative rounded-sm overflow-hidden max-h-64 mb-4 border border-zinc-800">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                    }}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                >
                    <X size={16} />
                </button>
            </div>
        )}
      </div>

      <div className="py-4 border-t border-zinc-900">
        <div className="flex gap-4 items-center">
            <label className="p-3 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-300 cursor-pointer hover:bg-zinc-800 transition-colors flex items-center gap-2">
                <ImageIcon size={20} />
                <span className="text-sm font-medium">Photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
        </div>
      </div>
    </div>
  );
};