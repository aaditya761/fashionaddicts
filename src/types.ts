// src/types.ts
// Central location for all type definitions

export interface User {
  id: number;
  username: string;
  email?: string;
  picture: string;
}

export interface Comment {
  id: number;
  text: string;
  userId: number;
  username: string;
  postId?: number;
  createdAt: string;
}
    
export interface Option {
  id: number;
  url: string;
}
  
export interface Post {
  id: number;
  title: string;
  user: User,
  options: Option[];
  comments: Comment[];
}
  
export interface PostDetailProps {
  user: User | null;
  isAuthenticated: boolean;
}
  
export interface UserVotes {
  [postId: number]: number;
}


export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateOptionDto {
  imageUrl: string;
  description: string;
  price?: number;
  store?: string;
  url?: string;
}

export interface CreatePostDto {
  title: string;
  options: CreateOptionDto[];
}

export interface CreateCommentDto {
  text: string;
}

export interface CreateVoteDto {
  optionId: number;
}

export enum FilterType {
  RECENT = 'recent',
  POPULAR = 'popular',
  TRENDING = 'trending',
}

export interface FilterPostsDto {
  page?: number;
  limit?: number;
  filter?: FilterType;
}