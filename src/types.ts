// src/types.ts
// Central location for all type definitions

export interface User {
  id: number;
  username: string;
  email: string;
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

export interface LinkPreview{
  url:string;
  images:[string];
  description: string;
  sitename: string;
  title: string;
}
    
export interface Option {
  id: number;
  url: string;
  image: string; 
  productName: string;  
  siteName: string
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

export interface GoogleToken {
  credential: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  tokens: {accessToken:string; refreshToken: string};
  user: User;
}

export interface AccessTokenResponse {
  accessToken:string;
}

export interface CreateOptionDto {
  url?: string;
}

export interface CreatePostDto {
  title: string;
  description: string;
  postType: string;
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

export interface JwtPayload {
  email: string;
  exp: number;
  iat: number;
  sub: number;
}