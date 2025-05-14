// src/services/api.ts
import { Post, User, Comment, FilterType } from '../types';
import { getMockPosts } from './mockData';

/**
 * Fetches posts based on the specified filter
 */
export const fetchPosts = async (filter: FilterType): Promise<Post[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Use the mock data generator
      const posts = getMockPosts(filter);
      resolve(posts);
    }, 500);
  });
};

/**
 * Fetches a post by its ID
 */
export const fetchPostById = async (id: number): Promise<Post | null> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get all posts and find the one with matching ID
      const allPosts = getMockPosts('recent');
      const post = allPosts.find(post => post.id === id) || null;
      resolve(post);
    }, 500);
  });
};

interface PostData {
  title: string;
  options: any[];
  userId: number;
}

/**
 * Creates a new post
 */
export const createPost = async (postData: PostData): Promise<Post> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get existing posts to determine new ID
      const allPosts = getMockPosts('recent');
      const newId = Math.max(...allPosts.map(post => post.id)) + 1;
      
      // Create the new post
      const newPost: Post = { 
        id: newId,
        title: postData.title,
        user: { 
          id: postData.userId, 
          username: 'current-user' 
        },
        options: postData.options.map((option, index) => ({
          ...option,
          id: (newId * 1000) + index + 1, // Generate unique option IDs
          votes: 0
        })),
        comments: []
      };
      
      resolve(newPost);
    }, 500);
  });
};

interface VoteResponse {
  success: boolean;
}

/**
 * Votes on a specific option for a post
 */
export const voteOnOption = async (postId: number, optionId: number): Promise<VoteResponse> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, this would update the database
      resolve({ success: true });
    }, 300);
  });
};

/**
 * Adds a comment to a post
 */
export const addComment = async (postId: number, comment: Partial<Comment>): Promise<Comment> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Get existing posts to determine new comment ID
      const allPosts = getMockPosts('recent');
      const post = allPosts.find(p => p.id === postId);
      
      // Generate a unique comment ID based on post ID
      const commentId = post ? 
        (postId * 10000) + (post.comments.length + 1) : 
        Date.now();
      
      // Create the new comment
      const newComment: Comment = { 
        id: commentId,
        text: comment.text || '',
        userId: comment.userId || 0,
        username: comment.username || '',
        createdAt: new Date().toISOString(),
        postId
      };
      
      resolve(newComment);
    }, 300);
  });
};

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Authenticates a user with email and password
 */
export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Dummy validation
      if (credentials.email && credentials.password) {
        resolve({
          token: 'mock-token-' + Date.now(),
          user: {
            id: 101, // Using a consistent ID from our mock data
            username: 'fashionlover',
            email: credentials.email
          }
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 500);
  });
};

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

/**
 * Registers a new user
 */
export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Dummy validation
      if (userData.username && userData.email && userData.password) {
        resolve({
          token: 'mock-token-' + Date.now(),
          user: {
            id: Date.now(), // Generate unique user ID
            username: userData.username,
            email: userData.email
          }
        });
      } else {
        reject(new Error('Invalid user data'));
      }
    }, 500);
  });
};
