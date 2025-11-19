import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';
import { Avatar } from './Avatar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false); // simplified local state, ideally check DB if user liked
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);

  const handleLike = async () => {
    if (!user) return;

    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      if (newLikedState) {
        // Insert like
        await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
        // Increment counter on post (optional, or rely on count query)
        await supabase.rpc('increment_likes', { row_id: post.id }); 
      } else {
        // Delete like
        await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id });
         await supabase.rpc('decrement_likes', { row_id: post.id });
      }
    } catch (err) {
      console.error("Like error", err);
      // Revert optimistic UI
      setLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / 1000 / 60; // minutes

    if (diff < 60) return `${Math.floor(diff)}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-surface rounded-sm shadow-sm border-b border-border overflow-hidden mb-0">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar color={post.users?.avatar_color || '#555'} size="sm" />
          <div>
            <h3 className="font-bold text-sm text-white">{post.users?.handle || 'Anonymous'}</h3>
            <p className="text-xs text-subtext">{formatTime(post.created_at)}</p>
          </div>
        </div>
        <button className="text-subtext hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
         {post.image_url && (
          <div className="mb-3 -mx-4 mt-0">
             <img 
               src={post.image_url} 
               alt="Post content" 
               className="w-full h-auto object-cover max-h-[500px]"
               loading="lazy"
               decoding="async"
             />
          </div>
        )}
        <p className="text-white text-base leading-relaxed whitespace-pre-wrap font-normal">
          {post.content}
        </p>
      </div>

      {/* Actions */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-colors duration-200 ${liked ? 'text-primary' : 'text-white hover:text-subtext'}`}
          >
            <Heart size={24} fill={liked ? "currentColor" : "none"} strokeWidth={2} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>

          <button className="flex items-center gap-1.5 text-white hover:text-subtext transition-colors duration-200">
            <MessageCircle size={24} strokeWidth={2} />
            <span className="text-sm font-medium">0</span>
          </button>
        </div>

        <button className="text-white hover:text-subtext transition-colors duration-200">
          <Share2 size={24} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};