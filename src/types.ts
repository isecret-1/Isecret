export interface UserProfile {
  id: string; // uuid
  google_id?: string;
  handle: string;
  avatar_color: string;
  bio?: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  created_at: string;
  likes_count: number;
  
  // Joined fields
  users?: {
    handle: string;
    avatar_color: string;
  };
  user_has_liked?: boolean; // Calculated field
}

export enum ViewState {
  FEED = 'FEED',
  EXPLORE = 'EXPLORE',
  CREATE = 'CREATE',
  PROFILE = 'PROFILE'
}