// src/services/api.ts
import axios from 'axios';
import { Post, Comment, AuthResponse, LoginCredentials, RegisterCredentials, User, CreatePostDto, FilterPostsDto, FilterType, CreateVoteDto, GoogleToken, AccessTokenResponse, CreateOptionDto, LinkPreview } from '../types';
import { getMockPosts } from './mockData';
import { isExpiringSoon, parseJwt } from '../utils/utils';

// Set base URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const refreshApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});




// Add request interceptor for authentication
api.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken') || "";
    const refreshToken = localStorage.getItem('refreshToken') || "";
    if (accessToken) {
      const parsedJwt = parseJwt(accessToken);
      const isExpiring = isExpiringSoon(parsedJwt.exp)
      console.log(isExpiring)
      if (isExpiring){
        try{
          const response = await authService.getAccessToken(refreshToken);
          console.log(response);
          localStorage.setItem('accessToken', response.accessToken);
        } catch (tokenError) {
          console.error('Error fetching user profile:', tokenError);
        }
    }
    
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Auth services
export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  loginWithGoogle: async (credentials: GoogleToken): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google/verify', credentials);
    return response.data;
  },

  getAccessToken:async (refreshToken: string): Promise<AccessTokenResponse> => {
    const response = await refreshApi.post<AccessTokenResponse>('/auth/access-token', {"token":refreshToken});
    return response.data;
  },
};

// User services
export const userService = {
  getProfile: async (email:string): Promise<User> => {
    const response = await api.get<User>('/users/email?email='+email);
    return response.data;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.patch<User>('/users/profile', userData);
    return response.data;
  },
  
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },
};

// Post services
export const postService = {
  createPost: async (postData: CreatePostDto): Promise<Post> => {
    const response = await api.post<Post>('/posts', postData);
    return response.data;
  },

  getLinkPreview: async (url: CreateOptionDto): Promise<LinkPreview> => {
    const response = await api.post<LinkPreview>('/posts/link-preview', url);
    return response.data;
  },
  
  getPosts: async (filter: FilterPostsDto = {}): Promise<Post[]> => {
    // const { page = 1, limit = 10, filter: filterType = FilterType.RECENT } = filter;
    // const response = await api.get<Post[]>('/posts', {
    //   params: { page, limit, filter: filterType },
    // });
    // return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
        // Use the mock data generator
        const posts = getMockPosts(filter.filter || FilterType.POPULAR);
        resolve(posts);
      }, 500);
    });
  },
  
  getPostById: async (id: number): Promise<Post> => {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },
  
  getUserPosts: async (): Promise<Post[]> => {
    const response = await api.get<Post[]>('/posts/user/me');
    return response.data;
  },
  
  getUserVotes: async (): Promise<{ postId: number, optionId: number, post: Post }[]> => {
    const response = await api.get<{ postId: number, optionId: number, post: Post }[]>('/posts/user/votes');
    return response.data;
  },
  
  deletePost: async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },
};

// Comment services
export const commentService = {
  getComments: async (postId: number): Promise<Comment[]> => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
    return response.data;
  },

  addComment: async (postId: number, comment:Partial<Comment>): Promise<Comment> => {
    const response = await api.post<Comment>(`/posts/${postId}/comments`, comment);
    return response.data;
  },
  
  deleteComment: async (postId: number, commentId: number): Promise<void> => {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },
};

// Vote services
export const voteService = {
  vote: async (postId: number, voteData: CreateVoteDto): Promise<void> => {
    const response = await api.post(`/posts/${postId}/votes`, voteData);
    return response.data;
  },
  
  getVotes: async (postId: number): Promise<{ optionId: number, count: number }[]> => {
    const response = await api.get<{ optionId: number, count: number }[]>(`/posts/${postId}/votes`);
    return response.data;
  },
  
  hasVoted: async (postId: number): Promise<{ hasVoted: boolean, optionId?: number }> => {
    const response = await api.get<{ hasVoted: boolean, optionId?: number }>(`/posts/${postId}/votes/user`);
    return response.data;
  },
};

export default api;