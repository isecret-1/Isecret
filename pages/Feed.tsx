import React, { useEffect, useState } from 'react';
import { PostCard } from '../components/PostCard';
import { generateMockPosts, APP_NAME } from '../constants';
import { Post } from '../types';

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(generateMockPosts(10));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setPosts(prev => [...generateMockPosts(3), ...prev]);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

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
      
      {/* Tabs (Following / For You) - TikTok style */}
      <div className="flex justify-center gap-6 pt-2 pb-4 text-sm font-semibold sticky top-[60px] bg-black z-10">
         <button className="text-subtext hover:text-white transition-colors">Following</button>
         <button className="text-white border-b-2 border-primary pb-1">For You</button>
      </div>

      {loading && posts.length === 0 ? (
        <div className="space-y-6 px-4 mt-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-surface rounded-sm h-80 animate-pulse" />
            ))}
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
          <div className="py-8 flex flex-col items-center gap-2">
            <button 
                onClick={handleRefresh} 
                className="text-secondary font-medium text-sm hover:text-white transition-colors"
            >
                Load more secrets
            </button>
          </div>
        </div>
      )}
    </div>
  );
};