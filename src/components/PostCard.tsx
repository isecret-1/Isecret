import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, Send, X } from 'lucide-react';
import { Post, Comment } from '../types';
import { Avatar } from './Avatar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  
  // Comment State
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0); // Ideally passed from post prop, but local state for now

  // Initial like check could go here if we had user_has_liked in prop

  const handleLike = async () => {
    if (!user) return;

    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    try {
      if (newLikedState) {
        await supabase.from('likes').insert({ user_id: user.id, post_id: post.id });
        await supabase.rpc('increment_likes', { row_id: post.id }); 
      } else {
        await supabase.from('likes').delete().match({ user_id: user.id, post_id: post.id });
         await supabase.rpc('decrement_likes', { row_id: post.id });
      }
    } catch (err) {
      console.error("Like error", err);
      setLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users (handle, avatar_color)
        `)
        .eq('post_id', post.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setComments(data as any);
        setCommentCount(data.length);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const tempId = Date.now().toString();
    const optimisticComment: any = {
      id: tempId,
      post_id: post.id,
      user_id: user.id,
      content: newComment,
      created_at: new Date().toISOString(),
      users: {
        // @ts-ignore - accessing auth context profile would be better here, simplified for now
        handle: 'You', 
        avatar_color: '#666' 
      }
    };

    setComments([...comments, optimisticComment]);
    setNewComment('');
    setCommentCount(prev => prev + 1);

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: optimisticComment.content
        });

      if (error) throw error;
      // Refresh to get real data (ID, Handle, Avatar)
      fetchComments();
    } catch (error) {
      console.error("Error posting comment:", error);
      setComments(prev => prev.filter(c => c.id !== tempId)); // Revert
      setCommentCount(prev => prev - 1);
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

          <button 
            onClick={toggleComments}
            className={`flex items-center gap-1.5 transition-colors duration-200 ${showComments ? 'text-secondary' : 'text-white hover:text-subtext'}`}
          >
            <MessageCircle size={24} strokeWidth={2} fill={showComments ? "currentColor" : "none"} />
            <span className="text-sm font-medium">{commentCount > 0 ? commentCount : ''}</span>
          </button>
        </div>

        <button className="text-white hover:text-subtext transition-colors duration-200">
          <Share2 size={24} strokeWidth={2} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="bg-black/20 border-t border-border animate-in slide-in-from-top-2 duration-200">
          
          {/* Comment List */}
          <div className="px-4 py-2 max-h-64 overflow-y-auto no-scrollbar space-y-4">
            {loadingComments ? (
              <div className="text-center py-4 text-xs text-subtext">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-6 text-xs text-subtext italic">No secrets shared here yet.</div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-2 items-start">
                  <div className="mt-1">
                    <Avatar color={comment.users?.avatar_color || '#555'} size="xs" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-white">{comment.users?.handle || 'Unknown'}</span>
                      <span className="text-[10px] text-zinc-600">{formatTime(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-zinc-300 leading-snug mt-0.5 break-words">{comment.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          {user ? (
            <form onSubmit={handlePostComment} className="p-3 flex items-center gap-2 border-t border-zinc-900">
              <input 
                type="text" 
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts anonymously..."
                className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary transition-colors"
              />
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className="p-2 text-secondary hover:text-white disabled:text-zinc-700 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          ) : (
            <div className="p-4 text-center text-xs text-subtext border-t border-zinc-900">
              Login to comment
            </div>
          )}
        </div>
      )}
    </div>
  );
};