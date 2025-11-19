import { Post, User } from './types';

export const APP_NAME = "iSecret";

export const MOCK_CURRENT_USER: User = {
  uid: 'u_current_123',
  handle: 'MysticOwl_99',
  avatarColor: '#FF0050', // Neon Pink
  bio: 'Just an observer in the digital void. 🌌 Sharing thoughts that the daylight hides.',
  postsCount: 12,
  followersCount: 342,
  followingCount: 45,
  isAnonymous: true,
  joinedAt: new Date().toISOString(),
};

export const TAGS = ["#confession", "#secret", "#dream", "#night", "#anonymous", "#truth", "#love", "#life"];

const ADJECTIVES = ["Silent", "Misty", "Neon", "Quiet", "Echo", "Velvet", "Hidden", "Solar"];
const ANIMALS = ["Fox", "Raven", "Wolf", "Cat", "Owl", "Bear", "Hawk", "Swan"];

const generateHandle = () => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const ani = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
  const num = Math.floor(Math.random() * 900) + 100;
  return `${adj}${ani}_${num}`;
};

const getRandomColor = () => {
  // Vibrant Neon Colors for Dark Mode
  const colors = ['#FF0050', '#00F2EA', '#7B61FF', '#FFD700', '#00FF94', '#FF4D00'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const generateMockPosts = (count: number): Post[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `p_${i}_${Date.now()}`,
    authorId: `u_${i}`,
    authorHandle: generateHandle(),
    authorAvatarColor: getRandomColor(),
    content: i % 3 === 0 
      ? "Sometimes I look at the stars and wonder if anyone is looking back." 
      : "Just finished a huge project. Feels like a weight has been lifted off my shoulders. Time to sleep for 2 days.",
    // Reduced image size from 600x600 to 400x500 for better mobile performance
    imageUrl: i % 2 === 0 ? `https://picsum.photos/seed/${i * 123}/400/500` : undefined,
    likesCount: Math.floor(Math.random() * 500),
    commentsCount: Math.floor(Math.random() * 50),
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString(),
    tags: [TAGS[Math.floor(Math.random() * TAGS.length)]],
    isLiked: false,
  }));
};

export const MOCK_USER_POSTS: Post[] = Array.from({ length: 9 }).map((_, i) => ({
    id: `up_${i}`,
    authorId: MOCK_CURRENT_USER.uid,
    authorHandle: MOCK_CURRENT_USER.handle,
    authorAvatarColor: MOCK_CURRENT_USER.avatarColor,
    content: "My personal secret...",
    // Smaller thumbnails
    imageUrl: i % 3 !== 0 ? `https://picsum.photos/seed/${i + 500}/300/300` : undefined,
    likesCount: Math.floor(Math.random() * 100),
    commentsCount: Math.floor(Math.random() * 10),
    createdAt: new Date().toISOString(),
    tags: ["#personal"],
    isLiked: false,
}));