import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Language, t } from '../lib/i18n';
import { Image as ImageIcon, Loader2, X } from 'lucide-react';

export function CreatePost({ lang }: { lang: Language }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        setLoading(false);
        return;
    }

    let imageUrl = null;
    if (image) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, image);
        
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const { error } = await supabase.from('posts').insert({
      user_id: user.id,
      content,
      image_url: imageUrl
    });

    if (!error) navigate('/');
    setLoading(false);
  };

  return (
    <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
        {t('create_post', lang)}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel rounded-3xl p-4 focus-within:ring-1 focus-within:ring-violet-500/50 transition-all">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t('write_secret', lang)}
            maxLength={2000}
            className="w-full h-40 bg-transparent text-lg text-white placeholder-gray-600 focus:outline-none resize-none"
          />
          
          {previewUrl && (
            <div className="relative mt-4 rounded-2xl overflow-hidden group">
              <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
              <button 
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 transition-colors backdrop-blur-sm"
              >
                <X size={18} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4">
             <label className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-xl hover:bg-white/5 transition-colors text-violet-400 hover:text-violet-300">
                <ImageIcon size={22} />
                <span className="text-sm font-medium">Add Photo</span>
                <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleImageChange} 
                />
            </label>
            <span className="text-xs text-gray-600">{content.length}/2000</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || (!content.trim() && !image)}
          className="btn-primary w-full py-4 rounded-2xl text-lg flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : t('publish', lang)}
        </button>
      </form>
    </div>
  );
}