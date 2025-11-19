import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Language, t } from '../lib/i18n';
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react';

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  user_id: string;
  users: {
    handle: string;
    avatar_url: string;
  };
  likes: { count: number }[];
  comments: { count: number }[];
}

export function Home({ lang }: { lang: Language }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users (handle, avatar_url),
        likes (count),
        comments (count)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data as any);
    }
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    if (likedPosts.has(postId)) return; // Prevent double like locally

    setLikedPosts(prev => new Set(prev).add(postId));
    
    // Optimistic UI update
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId 
          ? { ...post, likes: [{ count: (post.likes[0]?.count || 0) + 1 }] } 
          : post
      )
    );

    await supabase.from('likes').insert({ post_id: postId });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-gray-400 animate-pulse">{t('loading', lang)}</p>
    </div>
  );

  return (
    <div className="space-y-6 pt-2">
      {posts.map((post) => (
        <article key={post.id} className="glass-panel rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/[0.07]">
          
          {/* Header */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-violet-500 to-cyan-500 rounded-full blur-sm opacity-50" />
                <img 
                  src={post.users?.avatar_url || `https://api.dicebear.com/9.x/identicon/svg?seed=${post.users?.handle}&backgroundColor=1b1b26`} 
                  alt="Avatar" 
                  className="relative w-10 h-10 rounded-full border border-white/10 bg-[#1B1B26]"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-100 tracking-wide">@{post.users?.handle || 'anon'}</p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
            <button className="text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          {/* Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-200 leading-relaxed text-[15px] whitespace-pre-wrap font-light">{post.content}</p>
          </div>

          {/* Image */}
          {post.image_url && (
            <div className="relative w-full bg-black/50">
               <img 
                src={post.image_url} 
                alt="Post content" 
                loading="lazy"
                className="w-full h-auto object-cover max-h-[500px]" 
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/5" />
            </div>
          )}

          {/* Actions */}
          <div className="p-3 px-4 flex items-center gap-6">
            <button 
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 group transition-all ${likedPosts.has(post.id) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'}`}
            >
              <div className={`p-2 rounded-full group-hover:bg-pink-500/10 transition-colors ${likedPosts.has(post.id) ? 'bg-pink-500/10' : ''}`}>
                <Heart size={22} className={`transition-transform duration-200 ${likedPosts.has(post.id) ? 'fill-current scale-110' : 'group-hover:scale-110'}`} />
              </div>
              <span className="text-sm font-medium">{post.likes?.[0]?.count || 0}</span>
            </button>
            
            <button className="flex items-center gap-2 group text-gray-400 hover:text-cyan-400 transition-colors">
              <div className="p-2 rounded-full group-hover:bg-cyan-400/10 transition-colors">
                <MessageCircle size={22} className="group-hover:scale-110 transition-transform duration-200" />
              </div>
              <span className="text-sm font-medium">{post.comments?.[0]?.count || 0}</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}