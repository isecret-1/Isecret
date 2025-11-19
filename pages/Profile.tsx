import React, { useState } from 'react';
import { Settings, Grid, Share2, Lock } from 'lucide-react';
import { MOCK_CURRENT_USER, MOCK_USER_POSTS } from '../constants';
import { Avatar } from '../components/Avatar';

export const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grid' | 'mentions'>('grid');
  const user = MOCK_CURRENT_USER;

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 opacity-50">
          <Lock size={14} className="text-white" />
          <span className="text-sm font-mono uppercase tracking-widest">Anonymous ID</span>
        </div>
        <div className="flex gap-6">
           <button className="text-white hover:text-secondary transition-colors">
            <Share2 size={22} />
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
             <Avatar color={user.avatarColor} size="xl" />
           </div>
           <div className="absolute bottom-1 right-1 bg-primary text-white px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border border-black">
             PRO
           </div>
        </div>

        <h1 className="text-xl font-bold text-white mb-2">{user.handle}</h1>
        
        {/* Stats */}
        <div className="flex justify-center w-full gap-10 mb-6 border-y border-zinc-900 py-4">
            <div className="text-center">
                <div className="text-lg font-black text-white">{user.postsCount}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide">Posts</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-black text-white">{user.followersCount}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide">Followers</div>
            </div>
            <div className="text-center">
                <div className="text-lg font-black text-white">{user.followingCount}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wide">Following</div>
            </div>
        </div>

        {/* Bio */}
        <p className="text-center text-zinc-300 text-sm leading-relaxed px-4 mb-6 max-w-xs">
          {user.bio}
        </p>

        {/* Actions */}
        <div className="flex gap-3 w-full px-4">
          <button className="flex-1 bg-white text-black py-2.5 rounded-sm text-sm font-bold hover:bg-gray-200 transition-colors">
            Edit Profile
          </button>
          <button className="flex-1 bg-zinc-900 border border-zinc-800 text-white py-2.5 rounded-sm text-sm font-bold hover:bg-zinc-800 transition-colors">
            Share ID
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 mb-1">
        <button 
            className={`flex-1 pb-3 text-sm font-medium relative transition-colors ${activeTab === 'grid' ? 'text-white' : 'text-zinc-600'}`}
            onClick={() => setActiveTab('grid')}
        >
            <div className="flex justify-center items-center gap-2">
                <Grid size={20} />
            </div>
            {activeTab === 'grid' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white mx-12" />}
        </button>
        <button 
             className={`flex-1 pb-3 text-sm font-medium relative text-zinc-600`}
        >
            <div className="flex justify-center items-center gap-2 opacity-50">
                <span>Locked</span>
            </div>
        </button>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {MOCK_USER_POSTS.map((post) => (
          <div key={post.id} className="aspect-[3/4] bg-zinc-900 relative overflow-hidden group cursor-pointer">
            {post.imageUrl ? (
              <img src={post.imageUrl} alt="Post" className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full p-2 flex items-center justify-center bg-zinc-900 text-[10px] text-center text-zinc-500 border border-zinc-800">
                {post.content.slice(0, 50)}...
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};