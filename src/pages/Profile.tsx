import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Language, t } from '../lib/i18n';
import { Settings, Grid } from 'lucide-react';

export function Profile({ lang }: { lang: Language }) {
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('users').select('*').eq('id', user.id).single();
        setProfile(data);
        
        const { data: userPosts } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        setPosts(userPosts || []);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <div className="p-10 text-center text-gray-500">{t('loading', lang)}</div>;

  return (
    <div className="animate-in fade-in duration-700">
      
      {/* Header Card */}
      <div className="glass-panel rounded-3xl p-6 mb-8 relative overflow-hidden text-center mt-4">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full blur opacity-70" />
            <img 
                src={profile.avatar_url || `https://api.dicebear.com/9.x/identicon/svg?seed=${profile.handle}&backgroundColor=1b1b26`} 
                alt="Profile" 
                className="relative w-28 h-28 rounded-full border-2 border-white/20 bg-[#1B1B26] object-cover"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tight">@{profile.handle}</h2>
          <p className="text-sm text-gray-400 mt-1">Anonymous User</p>

          <div className="flex items-center gap-8 mt-6 w-full justify-center">
             <div className="text-center">
                <span className="block text-xl font-bold text-white">{posts.length}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Secrets</span>
             </div>
             <div className="w-px h-8 bg-white/10" />
             <div className="text-center opacity-50">
                <span className="block text-xl font-bold text-white">0</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Followers</span>
             </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 mb-4 text-gray-400">
        <Grid size={20} className="text-white" />
        <span className="text-xs font-bold uppercase tracking-widest text-white">Your Secrets</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3 pb-4">
        {posts.map(post => (
            <div key={post.id} className="glass-panel aspect-square rounded-2xl overflow-hidden relative group cursor-pointer hover:bg-white/10 transition-colors">
                {post.image_url ? (
                    <img src={post.image_url} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <span className="text-[10px] leading-tight text-gray-300 line-clamp-6 text-center opacity-80 group-hover:opacity-100">
                           {post.content}
                        </span>
                    </div>
                )}
            </div>
        ))}
      </div>
      
      {posts.length === 0 && (
          <div className="text-center py-10 text-gray-600 text-sm">
              No secrets shared yet.
          </div>
      )}
    </div>
  );
}