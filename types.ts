
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  PRO = 'PRO'
}

export type PlanType = 'Free' | 'Pro';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  plan: PlanType;
  
  // Stats
  stats: {
    prompts: number;
    likes: number;
    followers: number;
  };

  // Gamification
  points: number;
  rankTitle: string;

  // SaaS Extended Profile
  bio?: string;
  phone?: string;
  country?: string;
  jobTitle?: string;
  socials?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  joinDate: string;
  lastActive: string;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: string;
}

export interface PromptPost {
  id: string;
  title: string;
  description: string; // The generated prompt
  author: User;
  likes: number;
  views: number;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  category: 'Cinematic' | 'Anime' | '3D' | 'Realistic' | 'Cyberpunk';
  comments?: Comment[];
}

export interface PromptBundle {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  price: string;
  promptsCount: number;
  tags: string[];
}

export interface Course {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  students: number;
  thumbnail: string;
  progress?: number;
}

// Admin Dashboard Types
export interface SiteConfig {
  name: string;
  description: string;
}

export interface Section {
  id: string;
  label: string;
  icon?: any;
  isVisible: boolean;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Inactive';
  price: string;
}

export interface ContentConfig {
  heroTitle: string;
  heroSubtitle: string;
}

// New Features Types
export interface PromptStyle {
  id: string;
  label: string; 
  value: string; 
  suffix: string; 
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  originalIdea: string;
  generatedPrompt: string;
  modelUsed: string;
}

export interface Ad {
  id: string;
  type: 'banner' | 'native';
  label: string;
  imageUrl: string;
  linkUrl: string;
  
  // Banner Specific
  placement?: 'below-services' | 'below-best-prompts' | 'footer';
  
  // Native Specific
  title?: string;
  description?: string;
  
  isActive: boolean;
}
