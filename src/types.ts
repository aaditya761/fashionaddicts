// src/types.ts
// Central location for all type definitions

export interface User {
    id: number;
    username: string;
    email?: string;
  }

  
  export interface Comment {
    id: number;
    text: string;
    userId: number;
    username: string;
    postId?: number;
    createdAt: string;
  }
    
  // Define type for filter options
  export type FilterType = 'recent' | 'popular' | 'trending';


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
    [postId: number]: number; // Maps postId to optionId, both as numbers
  }
  