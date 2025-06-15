import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService, voteService } from '../services/api';
import { Post, FilterType, FilterPostsDto } from '../types';
import '../css/Home.css';


const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<FilterPostsDto>({page:1, limit:10, filter: FilterType.RECENT});
  const [userVotes, setUserVotes] = useState<Record<number, number>>({});
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);


  // Fetch posts
  useEffect(() => {
    const getPosts = async (): Promise<void> => {
      try {
        const data = await postService.getPosts(filter);
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
  const handleVote = async (postId: number, optionId: number): Promise<void> => {
    // Check if user has already voted on this post
    if (userVotes[postId]) {
      // User already voted for this post
      return;
    }
    
    // In a real implementation, this would call an API
    
    await voteService.vote(postId, {optionId});
    
    // Update local state to reflect the vote
    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          options: post.options.map(option => ({
            ...option,
            votes: option.id === optionId ? option.votesCount + 1 : option.votesCount,
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
    return post.options.reduce((sum, option) => sum + option.votesCount, 0);
  };

  // Get option vote percentage
  const getVotePercentage = (post: Post, optionId: number): number => {
    const totalVotes = getTotalVotes(post);
    if (totalVotes === 0) return 0;
    
    const option = post.options.find(opt => opt.id === optionId);
    if (!option) return 0;
    
    return Math.round((option.votesCount / totalVotes) * 100);
  };

  // Check if user has voted for an option
  const hasVotedFor = (postId: number, optionId: number): boolean => {
    return userVotes[postId] === optionId;
  };

  // Check if user has voted on a post
  const hasVotedOnPost = (postId: number): boolean => {
    return userVotes[postId] !== undefined;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (carouselId: string) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      scrollCarousel(carouselId, 'right');
    }
    if (isRightSwipe) {
      scrollCarousel(carouselId, 'left');
    }
  };

  const getFilterIcon = (filterType: string): string => {
    switch (filterType) {
      case FilterType.RECENT:
        return '🕐';
      case FilterType.POPULAR:
        return '🔥';
      case FilterType.TRENDING:
        return '📈';
      default:
        return '';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const getCarouselItemClass = (optionsCount: number): string => {
    if (optionsCount === 2) {
      return 'w-[85%] sm:w-[48%] lg:w-[48%]'; // ~50% on desktop with gap
    } else if (optionsCount === 3) {
      return 'w-[85%] sm:w-[48%] lg:w-[32%]'; // ~33% on desktop with gap
    }
    return 'w-[85%] sm:w-full lg:w-full'; // Full width for single option
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading amazing posts...</p>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-4 py-6">
          {posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map(post => (
                <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {/* Post Header */}
                  <div className="p-6 md:p-8">
                    <div className="space-y-4">
                      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
                        {post.title}
                      </h2>
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${post.user.username}&background=6366f1&color=fff`} 
                          alt={post.user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <span className="text-sm font-medium text-gray-900">@{post.user.username}</span>
                          <p className="text-xs text-gray-500">Posted recently</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Options Container */}
                  <div className="px-6 md:px-8 pb-6">
                    <div 
                      className={`
                        flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide
                        ${post.options.length === 1 ? 'justify-center' : ''}
                      `}
                      id={`carousel-${post.id}`}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={() => handleTouchEnd(`carousel-${post.id}`)}
                      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      {post.options.map((option, index) => (
                        <div
                          key={option.id}
                          className={`flex-none snap-center ${getCarouselItemClass(post.options.length)}`}
                        >
                          <div className="bg-gray-100 rounded-xl overflow-hidden h-full">
                            {/* Image Container */}
                            <div className="relative aspect-[4/5] overflow-hidden">
                              <img 
                                src={option.image} 
                                alt={`Option ${index + 1}`} 
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                              
                              {/* Vote Button */}
                              <button 
                                className={`
                                  absolute bottom-4 right-4 px-5 py-2.5 rounded-full font-medium text-sm
                                  flex items-center gap-2 backdrop-blur-sm transition-all duration-200
                                  ${hasVotedFor(post.id, option.id) 
                                    ? 'bg-green-500 text-white shadow-lg scale-110' 
                                    : hasVotedOnPost(post.id)
                                      ? 'bg-gray-800/50 text-white cursor-not-allowed'
                                      : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105 shadow-lg'
                                  }
                                `}
                                onClick={() => handleVote(post.id, option.id)}
                                disabled={hasVotedOnPost(post.id)}
                              >
                                <span className="text-base">
                                  {hasVotedFor(post.id, option.id) ? '✓' : hasVotedOnPost(post.id) ? '🔒' : '👍'}
                                </span>
                                <span>
                                  {hasVotedFor(post.id, option.id) 
                                    ? 'Your Choice' 
                                    : hasVotedOnPost(post.id) 
                                      ? 'Voted'
                                      : 'Vote'}
                                </span>
                              </button>
                              
                              {/* Voted Badge */}
                              {hasVotedFor(post.id, option.id) && (
                                <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg text-lg">
                                  ✓
                                </div>
                              )}
                            </div>
                            
                            {/* Option Details */}
                            <div className="p-4">
                              {/* Show results only after voting */}
                              {hasVotedOnPost(post.id) && (
                                <div className="space-y-2">
                                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className={`
                                        absolute h-full rounded-full transition-all duration-500 ease-out
                                        ${hasVotedFor(post.id, option.id) ? 'bg-green-500' : 'bg-indigo-500'}
                                      `}
                                      style={{ width: `${getVotePercentage(post, option.id)}%` }}
                                    />
                                  </div>
                                  <div className="flex justify-between text-sm font-medium">
                                    <span className="text-gray-900">{getVotePercentage(post, option.id)}%</span>
                                    <span className="text-gray-600">{option.votesCount} votes</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Desktop Carousel Controls - Only show if scrollable */}
                    {post.options.length > 2 && (
                      <>
                        <button 
                          className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                          onClick={() => scrollCarousel(`carousel-${post.id}`, 'left')}
                          aria-label="Previous options"
                        >
                          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button 
                          className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                          onClick={() => scrollCarousel(`carousel-${post.id}`, 'right')}
                          aria-label="Next options"
                        >
                          <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}
                    
                    {/* Carousel Indicators for mobile */}
                    {post.options.length > 1 && (
                      <div className="flex justify-center gap-1.5 mt-4 lg:hidden">
                        {post.options.map((_, index) => (
                          <span 
                            key={index} 
                            className={`
                              h-2 rounded-full transition-all duration-300
                              ${index === 0 ? 'w-6 bg-indigo-500' : 'w-2 bg-gray-300'}
                            `}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Post Footer */}
                  <div className="px-6 md:px-8 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                    <div className="flex gap-6 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">🗳️</span>
                        <span className="font-semibold text-gray-900 text-base">{getTotalVotes(post)}</span>
                        <span>votes</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span className="text-lg">💬</span>
                        <span className="font-semibold text-gray-900 text-base">{post.comments.length}</span>
                        <span>comments</span>
                      </div>
                    </div>
                    <Link 
                      to={`/post/${post.id}`} 
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-gray-600">Be the first to create a post!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;