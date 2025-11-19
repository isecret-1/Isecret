export interface User {
  uid: string;
  handle: string;
  avatarColor: string; // Hex color for the generated avatar background
  bio?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isAnonymous: boolean;
  joinedAt: string;
}

export interface Comment {
  id: string;
  authorHandle: string;
  authorAvatarColor: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorHandle: string;
  authorAvatarColor: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  isLiked?: boolean; // Local state for current user
}

export enum ViewState {
  FEED = 'FEED',
  EXPLORE = 'EXPLORE',
  CREATE = 'CREATE',
  PROFILE = 'PROFILE'
}