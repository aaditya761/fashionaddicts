import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchPosts } from '../services/api';
import { Post, FilterType } from '../types';
import '../css/Home.css';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterType>('recent');
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});

  // Fetch posts
  useEffect(() => {
    const getPosts = async (): Promise<void> => {
      try {
        const data = await fetchPosts(filter);
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    getPosts();
  }, [filter]);

  // Load user votes from localStorage on initial render
  useEffect(() => {
    const storedVotes = localStorage.getItem('userVotes');
    if (storedVotes) {
      try {
        setUserVotes(JSON.parse(storedVotes));
      } catch (error) {
        console.error('Error parsing user votes:', error);
      }
    }
  }, []);

  // Handle carousel navigation
  const scrollCarousel = (elementId: string, direction: 'left' | 'right'): void => {
    const carousel = document.getElementById(elementId);
    if (!carousel) return;
    
    const scrollAmount = direction === 'right' 
      ? carousel.clientWidth * 0.8 
      : -carousel.clientWidth * 0.8;
    
    carousel.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  // Handle voting
  const handleVote = (postId: number, optionId: number): void => {
    // Check if user has already voted on this post
    if (userVotes[postId]) {
      // User already voted for this post
      return;
    }
    
    // In a real implementation, this would call an API
    console.log(`Voted for option ${optionId} on post ${postId}`);
    
    // Update local state to reflect the vote
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          options: post.options.map(option => ({
            ...option,
            votes: option.id === optionId ? "option.votes" + 1 : "option.votes",
            hasUserVoted: option.id === optionId
          }))
        };
      }
      return post;
    }));
    
    // Update user votes record
    const newUserVotes = {
      ...userVotes,
      [postId]: optionId
    };
    setUserVotes(newUserVotes);
    
    // Save to localStorage
    localStorage.setItem('userVotes', JSON.stringify(newUserVotes));
  };

  // Calculate total votes for a post
  const getTotalVotes = (post: Post): number => {
    return post.options.reduce((sum, option) => sum + 1, 0);
  };

  // Get option vote percentage
  const getVotePercentage = (post: Post, optionId: number): number => {
    const totalVotes = getTotalVotes(post);
    if (totalVotes === 0) return 0;
    
    const option = post.options.find(opt => opt.id === optionId);
    if (!option) return 0;
    
    return Math.round((1 / totalVotes) * 100);
  };

  // Check if user has voted for an option
  const hasVotedFor = (postId: number, optionId: number): boolean => {
    return userVotes[postId] === optionId;
  };

  // Check if user has voted on a post
  const hasVotedOnPost = (postId: number): boolean => {
    return userVotes[postId] !== undefined;
  };

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
        <div className="posts-container">
          {posts.length > 0 ? (
            posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <h3>{post.title}</h3>
                  <p className="post-creator">Posted by: {post.user.username}</p>
                </div>
                
                <div className="carousel-container">
                  <div 
                    className="carousel" 
                    id={`carousel-${post.id}`}
                  >
                    {post.options.map((option, index) => (
                      <div
                        key={option.id}
                        className={`carousel-item ${hasVotedFor(post.id, option.id) ? 'voted-option' : ''}`}
                      >
                        <div className="option-image-container">
                          <img 
                            src={option.url} 
                            alt={`Option ${index + 1}: ${"option.description"}`} 
                            className="option-image"
                          />
                          {/* Always visible vote button on image */}
                          <div className="vote-overlay always-visible">
                            <button 
                              className={`vote-overlay-btn ${hasVotedFor(post.id, option.id) ? 'voted' : ''}`}
                              onClick={() => handleVote(post.id, option.id)}
                              disabled={hasVotedOnPost(post.id)}
                            >
                              {hasVotedFor(post.id, option.id) 
                                ? '✓ Your Choice!' 
                                : hasVotedOnPost(post.id) 
                                  ? 'Already Voted'
                                  : 'I like this!'}
                            </button>
                          </div>
                          
                          {/* User has voted badge */}
                          {hasVotedFor(post.id, option.id) && (
                            <div className="voted-badge">
                              <span>✓</span>
                            </div>
                          )}
                        </div>
                        <div className="option-info">
                          <p className="option-description">{"option.description"}</p>
                          <div className="votes-bar">
                            <div 
                              className={`votes-fill ${hasVotedFor(post.id, option.id) ? 'user-vote' : ''}`}
                              style={{ width: `${getVotePercentage(post, option.id)}%` }}
                            ></div>
                          </div>
                          <p className="votes-text">{getVotePercentage(post, option.id)}% ({"option.votes"} votes)</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {post.options.length > 2 && (
                    <div className="carousel-controls">
                      <button 
                        className="carousel-control left"
                        onClick={() => scrollCarousel(`carousel-${post.id}`, 'left')}
                        aria-label="Previous options"
                      >
                        <span aria-hidden="true">&#10094;</span>
                      </button>
                      <button 
                        className="carousel-control right"
                        onClick={() => scrollCarousel(`carousel-${post.id}`, 'right')}
                        aria-label="Next options"
                      >
                        <span aria-hidden="true">&#10095;</span>
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="post-meta">
                  <span>{getTotalVotes(post)} total votes</span>
                  <span>{post.comments.length} comments</span>
                  <Link to={`/post/${post.id}`} className="view-details-btn">View Details</Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-posts">No posts found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;