import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { APP_NAME } from '../constants';
import { Post } from '../types';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          users (handle, avatar_color)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        // Transform data if needed or map user_has_liked (requires subquery or separate fetch for optimization, keeping simple here)
        setPosts(data as any); 
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="pb-20 pt-0 max-w-md mx-auto min-h-screen bg-black">
      {/* Brand Header */}
      <div className="flex justify-center items-center sticky top-0 bg-black/80 backdrop-blur-md z-10 py-4 border-b border-zinc-900">
        <div className="relative">
            <h1 className="text-2xl font-black tracking-tighter italic glitch-text" data-text={APP_NAME}>
                {APP_NAME}
            </h1>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center gap-6 pt-2 pb-4 text-sm font-semibold sticky top-[60px] bg-black z-10">
         <button className="text-subtext hover:text-white transition-colors">{t.following}</button>
         <button className="text-white border-b-2 border-primary pb-1">{t.forYou}</button>
      </div>

      {loading ? (
        <div className="space-y-6 px-4 mt-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface rounded-sm h-80 animate-pulse" />
            ))}
        </div>
      ) : (
        <div className="space-y-2">
          {posts.length === 0 ? (
            <div className="text-center py-10 text-zinc-500">
              No secrets shared yet. Be the first.
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          )}
          
          {posts.length > 0 && (
             <div className="py-8 flex flex-col items-center gap-2">
                <button 
                    onClick={fetchPosts} 
                    className="text-secondary font-medium text-sm hover:text-white transition-colors"
                >
                    {t.loadMore}
                </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
};