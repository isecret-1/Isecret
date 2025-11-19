import React, { useState, useCallback } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Post } from '../types';
import { Avatar } from './Avatar';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = useCallback(() => {
    if (liked) {
      setLikesCount(prev => prev - 1);
    } else {
      setLikesCount(prev => prev + 1);
    }
    setLiked(!liked);
  }, [liked]);

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
          <Avatar color={post.authorAvatarColor} size="sm" />
          <div>
            <h3 className="font-bold text-sm text-white">{post.authorHandle}</h3>
            <p className="text-xs text-subtext">{formatTime(post.createdAt)}</p>
          </div>
        </div>
        <button className="text-subtext hover:text-white">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="px-4 pb-2">
         {post.imageUrl && (
          <div className="mb-3 -mx-4 mt-0">
             <img 
               src={post.imageUrl} 
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
        <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map(tag => (
                <span key={tag} className="text-xs text-secondary font-bold tracking-wide">
                    {tag}
                </span>
            ))}
        </div>
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
            <span className="text-sm font-medium">{post.commentsCount}</span>
          </button>
        </div>

        <button className="text-white hover:text-subtext transition-colors duration-200">
          <Share2 size={24} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
};