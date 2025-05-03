import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OptionCard from '../components/OptionCard';
import CommentSection from '../components/CommentSection';
import { User, Comment } from '../types';

// Define interfaces with numeric IDs
interface Option {
  id: number;
  imageUrl: string;
  votes: number;
  hasUserVoted: boolean;
  description: string;
  price: number;
  store: string;
  url: string;
}

interface Post {
  id: number;
  title: string;
  user: {
    id: number;
    username: string;
  };
  options: Option[];
  comments: Comment[];
}

interface PostDetailProps {
  user: User | null;
  isAuthenticated: boolean;
}

interface UserVotes {
  [postId: number]: number; // Maps postId to optionId, both as numbers
}

const PostDetail: React.FC<PostDetailProps> = ({ user, isAuthenticated }) => {
  // Get the id parameter and convert to number
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? parseInt(idParam, 10) : 0;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getPost = async (): Promise<void> => {
      if (!id) return;
      
      try {
        // In a real app, you'd fetch from an API
        // const data = await fetchPostById(id);
        
        // For demo purposes, use mock data
        const mockPost: Post = {
          id,
          title: id === 1 ? 'Which dress for a summer wedding?' : 'Help me pick shoes for my interview',
          user: { username: id === 1 ? 'fashionlover' : 'careergirl', id: id === 1 ? 1 : 2 },
          options: id === 1 
            ? [
                { id: 1, imageUrl: 'https://via.placeholder.com/300x400', votes: 24, hasUserVoted: false, description: 'Floral maxi dress', price: 129.99, store: 'Nordstrom', url: '#' },
                { id: 2, imageUrl: 'https://via.placeholder.com/300x400', votes: 16, hasUserVoted: false, description: 'Blue cocktail dress', price: 89.99, store: 'Macy\'s', url: '#' },
                { id: 3, imageUrl: 'https://via.placeholder.com/300x400', votes: 8, hasUserVoted: false, description: 'Red evening gown', price: 199.99, store: 'Bloomingdale\'s', url: '#' }
              ]
            : [
                { id: 1, imageUrl: 'https://via.placeholder.com/300x400', votes: 35, hasUserVoted: false, description: 'Black pumps', price: 79.99, store: 'Nine West', url: '#' },
                { id: 2, imageUrl: 'https://via.placeholder.com/300x400', votes: 42, hasUserVoted: false, description: 'Navy loafers', price: 65.99, store: 'DSW', url: '#' }
              ],
          comments: [
            { id: 1, text: 'I love the first option!', username: 'stylefan', userId: 3, createdAt: '2023-05-15T12:00:00Z' },
            { id: 2, text: 'The second one looks more versatile.', username: 'fashionista', userId: 4, createdAt: '2023-05-15T13:30:00Z' }
          ]
        };
        
        // Check if user has already voted
        if (isAuthenticated && user && user.id) {
          const userVotesStr = localStorage.getItem(`votes-${user.id}`);
          const userVotes: UserVotes = userVotesStr 
            ? JSON.parse(userVotesStr) 
            : {};
          
          if (userVotes[id]) {
            setHasVoted(true);
            
            // Mark which option user voted for
            const votedOptionId = userVotes[id];
            const updatedOptions = mockPost.options.map(option => ({
              ...option,
              hasUserVoted: option.id === votedOptionId
            }));
            
            mockPost.options = updatedOptions;
          }
        }
        
        setPost(mockPost);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        setError('Failed to load post. Please try again.');
        setLoading(false);
      }
    };

    getPost();
  }, [id, isAuthenticated, user]);

  const handleVote = async (optionId: number) => {
    if (!isAuthenticated) {
      setError('Please login to vote');
      return;
    }
    
    if (hasVoted || !post) {
      return;
    }
    
    try {
      // In a real app, you'd call the API
      // await voteOnOption(post.id, optionId);
      
      // For demo, update locally
      const updatedOptions = post.options.map(option => ({
        ...option,
        votes: option.id === optionId ? option.votes + 1 : option.votes,
        hasUserVoted: option.id === optionId
      }));
      
      setPost({ ...post, options: updatedOptions });
      setHasVoted(true);
      
      // Store vote in localStorage for persistence
      if (user && user.id && id) {
        const userVotesStr = localStorage.getItem(`votes-${user.id}`);
        const userVotes: UserVotes = userVotesStr
          ? JSON.parse(userVotesStr) 
          : {};
        
        userVotes[id] = optionId;
        localStorage.setItem(`votes-${user.id}`, JSON.stringify(userVotes));
      }
    } catch (error) {
      console.error('Error voting:', error);
      setError('Failed to submit vote. Please try again.');
    }
  };

  const handleAddComment = async (newComment: Partial<Comment>): Promise<void> => {
    if (!post) return;
    
    try {
      // In a real app, you'd call the API
      // const addedComment = await addComment(post.id, newComment);
      
      // For demo, update locally
      const commentWithId: Comment = {
        id: Date.now(), // Use timestamp as numeric ID
        text: newComment.text || '',
        userId: newComment.userId || 0,
        username: newComment.username || '',
        createdAt: newComment.createdAt || new Date().toISOString()
      };
      
      setPost({
        ...post,
        comments: [...post.comments, commentWithId]
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return <div className="error-message">Post not found</div>;
  }

  return (
    <div className="post-detail-page">
      {error && <div className="error-message">{error}</div>}
      
      <div className="post-header">
        <h2>{post.title}</h2>
        <p className="post-creator">Posted by: {post.user.username}</p>
      </div>
      
      <div className="voting-section">
        <h3>Vote for your favorite</h3>
        {!isAuthenticated && (
          <p className="login-prompt">Please login to vote</p>
        )}
        {hasVoted && (
          <p className="voted-message">Thank you for voting!</p>
        )}
        
        <div className="options-grid">
          {post.options.map((option, index) => (
            <OptionCard
              key={option.id}
              option={option}
              index={index + 1}
              onVote={handleVote}
              hasVoted={hasVoted}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
        
        <div className="voting-results">
          <h3>Results</h3>
          <div className="results-graph">
            {post.options.map((option, index) => {
              const totalVotes = post.options.reduce((sum, opt) => sum + opt.votes, 0);
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
              
              return (
                <div key={option.id} className="result-bar">
                  <div className="bar-label">Option {index + 1}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <span className="bar-percentage">{Math.round(percentage)}%</span>
                  </div>
                  <div className="bar-votes">{option.votes} votes</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <CommentSection
        comments={post.comments}
        postId={post.id}
        user={user}
        isAuthenticated={isAuthenticated}
        onAddComment={handleAddComment}
      />
    </div>
  );
};

export default PostDetail;