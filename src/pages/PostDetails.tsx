import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OptionCard from '../components/OptionCard';
import CommentSection from '../components/CommentSection';
import { postService, commentService } from '../services/api';
import { Post, Comment } from '../types';
import { useVoting } from '../hooks/useVoting';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { isAuthenticated, user } = useAuth();
  const { id: idParam } = useParams<{ id: string }>();
  const id = idParam ? parseInt(idParam, 10) : 0;
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Use the voting hook
  const { 
    hasVoted, 
    totalVotes, 
    handleVote, 
    getPercentage 
  } = useVoting(
    post, 
    user?.id || null, 
    isAuthenticated
  );

  // Fetch post data
  useEffect(() => {
    const getPost = async (): Promise<void> => {
      if (!id) return;
      
      try {
        const fetchedPost = await postService.getPostById(id);
        
        if (fetchedPost) {
          setPost(fetchedPost);
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

  const handleAddComment = async (newComment: Partial<Comment>): Promise<void> => {
    if (!post) return;
    
    try {
      // Call the API to add a comment
      const commentWithId = await commentService.addComment(post.id, newComment);
      
      // Update the post with the new comment
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
              const percentage = getPercentage(option.id);
              
              return (
                <div key={option.id} className="result-bar">
                  <div className="bar-label">Option {index + 1}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill"
                      style={{ width: `${percentage}%` }}
                    ></div>
                    <span className="bar-percentage">{percentage}%</span>
                  </div>
                  <div className="bar-votes">{"option.votes"} votes</div>
                </div>
              );
            })}
          </div>
          <p className="total-votes">Total votes: {totalVotes}</p>
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