import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Calendar, MessageSquare, TrendingUp, Check, AlertCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Post, Comment } from '../types';
import { postService } from '../services/api';

type CommentSectionProps = {
  comments: Comment[];
};


// Mock components and services for demonstration
const CommentSection: React.FC<CommentSectionProps> = ({ comments}) => (
  <div>
    <h3 className="text-xl font-bold text-gray-800 mb-4">Comments ({comments.length})</h3>
    <div className="space-y-4">
      {comments.map((comment, i) => (
        <div key={i} className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-purple-600" />
            </div>
            <span className="font-medium text-gray-800">{comment.user?.username || 'Anonymous'}</span>
            <span className="text-sm text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <p className="text-gray-700">{comment.text}</p>
        </div>
      ))}
    </div>
  </div>
);

const PostDetail = () => {



  // Mock auth state
  const isAuthenticated = true;
  const { id } = useParams<{ id: string }>();
  const [hasVoted, setHasVoted] = useState(false);

  const [post, setPost] = useState<Post>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);


  // Fetch post data
  useEffect(() => {
    const getPost = async (): Promise<void> => {
      if (!id) return;
      
      try {
        const fetchedPost = await postService.getPostById(Number(id));
        if (fetchedPost) {
          setPost(fetchedPost);
          if(fetchedPost.hasUserVoted){
            setHasVoted(true);
          }
        } else {
          setError('Post not found');
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again.');
        setLoading(false);
      }
    };

    getPost();
  }, [id]);


if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error-message">Post not found</div>;
  }

  // Calculate voting percentages
  const totalVotes = post?.options.reduce((sum, opt) => sum + (opt.votesCount || 0), 0) || 0;
  const getPercentage = (optionId:number) => {
    if (!post || totalVotes === 0) return 0;
    const option = post.options.find(o => o.id === optionId);
    return Math.round(((option?.votesCount || 0) / totalVotes) * 100);
  };


  const handleVote = (optionId:number) => {
    if (!isAuthenticated || hasVoted) return;
    setPost(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        options: prev.options.map(opt => 
          opt.id === optionId 
            ? { ...opt, votes: (opt.votesCount || 0) + 1 }
            : opt
        )
      } as Post;
    });
    setHasVoted(true);
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Post Not Found</h2>
          <p className="text-gray-600">The post you're looking for doesn't exist.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
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


  const hasVotedFor = (optionId: number): boolean => {
    if(post.votedOption){
      if(post.votedOption.id === optionId){
        return true;
      }
    }
    return false;
  };
  

  const getCarouselItemClass = (optionsCount: number): string => {
    if (optionsCount === 2) {
      return 'w-[85%] sm:w-[48%] lg:w-[48%]'; // ~50% on desktop with gap
    } else if (optionsCount === 3) {
      return 'w-[85%] sm:w-[48%] lg:w-[32%]'; // ~33% on desktop with gap
    }
    return 'w-[85%] sm:w-full lg:w-full'; // Full width for single option
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center text-purple-600 hover:text-purple-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Back to Posts
        </button>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}
        
        {/* Post header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>Posted by {post.user.username}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span>{post.comments.length} comments</span>
            </div>
          </div>
        </div>
        
        {/* Voting section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cast Your Vote</h2>
            {!isAuthenticated ? (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
                Please login to participate in voting
              </div>
            ) : hasVoted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <Check className="w-5 h-5 mr-2" />
                Thank you for voting! See the results below.
              </div>
            ) : (
              <p className="text-gray-600">Choose your favorite option below</p>
            )}
          </div>
          










          <article key={post.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden">
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
                            ${hasVotedFor(option.id) 
                              ? 'bg-green-500 text-white shadow-lg scale-110' 
                              : hasVoted
                                ? 'bg-gray-800/50 text-white cursor-not-allowed'
                                : 'bg-white/90 text-gray-700 hover:bg-white hover:scale-105 shadow-lg'
                            }
                          `}
                          onClick={() => handleVote(option.id)}
                          disabled={hasVoted}
                        >
                          <span className="text-base">
                            {hasVotedFor(option.id) ? '✓' : hasVoted ? '🔒' : '👍'}
                          </span>
                          <span>
                            {hasVotedFor(option.id) 
                              ? 'Your Choice' 
                              : hasVoted
                                ? 'Voted'
                                : 'Vote'}
                          </span>
                        </button>
                        
                        {/* Voted Badge */}
                        {hasVotedFor(option.id) && (
                          <div className="absolute top-4 left-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold shadow-lg text-lg">
                            ✓
                          </div>
                        )}
                      </div>
                      
                      {/* Option Details */}
                      <div className="p-4">
                        {/* Show results only after voting */}
                        {hasVoted && (
                          <div className="space-y-2">
                            <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className={`
                                  absolute h-full rounded-full transition-all duration-500 ease-out
                                  ${hasVotedFor(option.id) ? 'bg-green-500' : 'bg-indigo-500'}
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




























          {/* Results summary */}
          {hasVoted && (
            <div className="mt-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Voting Results
              </h3>
              <div className="space-y-3">
                {post.options.map((option, index) => {
                  const percentage = getPercentage(option.id);
                  const isWinning = percentage === Math.max(...post.options.map(o => getPercentage(o.id)));
                  
                  return (
                    <div key={option.id} className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700 w-20">
                        Option {index + 1}
                      </span>
                      <div className="flex-1">
                        <div className="relative h-8 bg-white rounded-full overflow-hidden shadow-inner">
                          <div 
                            className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                              isWinning 
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500' 
                                : 'bg-gradient-to-r from-gray-300 to-gray-400'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {option.votesCount || 0} votes
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-purple-200">
                <p className="text-center text-gray-700 font-semibold">
                  Total votes: {totalVotes}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Comments section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <CommentSection
            comments={post.comments}
          />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;