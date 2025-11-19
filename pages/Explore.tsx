import React from 'react';
import { Search, TrendingUp, Hash } from 'lucide-react';
import { TAGS, generateMockPosts } from '../constants';

export const Explore: React.FC = () => {
  const trendingPosts = generateMockPosts(6);

  return (
    <div className="pb-20 pt-4 px-4 max-w-md mx-auto min-h-screen bg-black text-white">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-zinc-500" />
        </div>
        <input
          type="text"
          placeholder="Search tags or secrets..."
          className="block w-full pl-10 pr-3 py-3 border-none rounded-sm leading-5 bg-surface text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-secondary"
        />
      </div>

      {/* Trending Tags */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-secondary" />
          <h2 className="text-lg font-bold text-white">Trending Now</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag, index) => (
            <button 
              key={tag}
              className={`px-4 py-1.5 rounded-sm text-sm font-bold transition-all border ${index === 0 ? 'bg-transparent border-primary text-primary shadow-neon' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Challenge */}
      <div className="mb-8 border border-primary/30 bg-gradient-to-r from-black to-zinc-900 rounded-sm p-5 text-white shadow-neon relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full -mr-10 -mt-10"></div>
        <div className="flex items-start justify-between relative z-10">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <Hash size={16} className="text-primary" />
                    <span className="text-primary font-bold text-xs tracking-wider uppercase">Challenge</span>
                </div>
                <h3 className="font-black text-xl mb-1 italic">#NeonDreams</h3>
                <p className="text-zinc-400 text-sm mb-4">Post a secret about your wildest dream.</p>
                <button className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-opacity-90">Join Now</button>
            </div>
        </div>
      </div>

      {/* Recommended Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">For You</h2>
        <div className="grid grid-cols-2 gap-1">
            {trendingPosts.map(post => (
                <div key={post.id} className="bg-surface aspect-[3/4] relative overflow-hidden group cursor-pointer border border-transparent hover:border-secondary/50 transition-colors">
                    {post.imageUrl ? (
                        <img src={post.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Explore" />
                    ) : (
                        <div className="p-4 h-full flex items-center justify-center bg-surface text-center border border-zinc-900">
                             <p className="text-xs text-zinc-400 font-medium line-clamp-5 leading-relaxed">{post.content}</p>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                         <span className="text-white text-xs font-bold flex items-center gap-1">
                            @{post.authorHandle.split('_')[0]}
                         </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};