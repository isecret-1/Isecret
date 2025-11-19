import React, { useEffect, useState } from 'react';
import { Settings, Grid, Share2, Lock, LogOut } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Post } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

export const Profile: React.FC = () => {
  const { profile, user, signOut } = useAuth();
  const { t } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) setPosts(data as any);
    };

    fetchUserPosts();
  }, [user]);

  if (!profile) return <div className="p-10 text-center text-white">Loading profile...</div>;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 opacity-50">
          <Lock size={14} className="text-white" />
          <span className="text-sm font-mono uppercase tracking-widest">{t.anonymousId}</span>
        </div>
        <div className="flex gap-6">
           <button onClick={signOut} className="text-red-500 hover:text-red-400 transition-colors">
            <LogOut size={22} />
          </button>
          <button className="text-white hover:text-secondary transition-colors">
            <Settings size={22} />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6 relative">
           <div className="p-1 rounded-full border-2 border-dashed border-secondary">
             <Avatar color={profile.avatar_color} size="xl" />
           </div>
        </div>

        <h1 className="text-xl font-bold text-white mb-2">{profile.handle}</h1>
        
        {/* Stats */}
        <div className="flex justify-center w-full gap-10 mb-6 border-y border-zinc-900 py-4">
            <div className="text-center">
                <div className="text-lg font-black text-white">{posts.length}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide">{t.posts}</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-black text-white">0</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide">{t.followers}</div>
            </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full px-4">
          <button className="flex-1 bg-zinc-900 border border-zinc-800 text-white py-2.5 rounded-sm text-sm font-bold hover:bg-zinc-800 transition-colors">
            Share Profile
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-1">
        <button 
            className="flex-1 pb-3 text-sm font-medium relative transition-colors text-white"
        >
            <div className="flex justify-center items-center gap-2">
                <Grid size={20} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white mx-12" />
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((post) => (
          <div key={post.id} className="aspect-[3/4] bg-zinc-900 relative overflow-hidden group cursor-pointer border border-black">
            {post.image_url ? (
              <img src={post.image_url} alt="Post" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full p-2 flex items-center justify-center bg-zinc-900 text-[10px] text-center text-zinc-500">
                {post.content.slice(0, 30)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};