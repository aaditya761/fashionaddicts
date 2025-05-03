import React, { useState, useEffect } from 'react';
import PostCard from '../components/PostCard';
import { fetchPosts } from '../services/api';
import { Post, FilterType } from '../types';


const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterType>('recent');

  useEffect(() => {
    const getPosts = async (): Promise<void> => {
      try {
        // In a real app, you would pass the filter to the API
        const data = await fetchPosts(filter);
        setPosts(data as Post[]);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    getPosts();
  }, [filter]);

  // For demo purposes, use mock data
  useEffect(() => {
    // This is mock data for demonstration
    const mockPosts: Post[] = [
      {
        id: 1,
        title: 'Which dress for a summer wedding?',
        user: { username: 'fashionlover', id: 1 },
        options: [
          { id: 1, imageUrl: 'https://via.placeholder.com/300x400', votes: 24, description: 'Floral maxi dress', price: 129.99, store: 'Nordstrom', url: '#', hasUserVoted:false },
          { id: 2, imageUrl: 'https://via.placeholder.com/300x400', votes: 16, description: 'Blue cocktail dress', price: 89.99, store: 'Macy\'s', url: '#', hasUserVoted:false },
          { id: 3, imageUrl: 'https://via.placeholder.com/300x400', votes: 8, description: 'Red evening gown', price: 199.99, store: 'Bloomingdale\'s', url: '#', hasUserVoted:false }
        ],
        comments: []
      },
      {
        id: 2,
        title: 'Help me pick shoes for my interview',
        user: { username: 'careergirl', id: 2 },
        options: [
          { id: 1, imageUrl: 'https://via.placeholder.com/300x400', votes: 35, description: 'Black pumps', price: 79.99, store: 'Nine West', url: '#', hasUserVoted:false },
          { id: 2, imageUrl: 'https://via.placeholder.com/300x400', votes: 42, description: 'Navy loafers', price: 65.99, store: 'DSW', url: '#', hasUserVoted:false }
        ],
        comments: []
      }
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  }, [filter]);

  return (
    <div className="home-page">
      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'recent' ? 'active' : ''}`} 
          onClick={() => setFilter('recent')}
        >
          Recent
        </button>
        <button 
          className={`filter-btn ${filter === 'popular' ? 'active' : ''}`} 
          onClick={() => setFilter('popular')}
        >
          Popular
        </button>
        <button 
          className={`filter-btn ${filter === 'trending' ? 'active' : ''}`} 
          onClick={() => setFilter('trending')}
        >
          Trending
        </button>
      </div>
      
      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="posts-grid">
          {posts.length > 0 ? (
            posts.map(post => <PostCard key={post.id} post={post} />)
          ) : (
            <div className="no-posts">No posts found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;