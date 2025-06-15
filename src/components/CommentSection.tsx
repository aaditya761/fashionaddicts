import React, { useState } from 'react';
import { User, Comment } from '../types';


interface CommentSectionProps {
  comments: Comment[];
  postId: number;
  user: User | null;
  isAuthenticated: boolean;
  onAddComment: (comment: Partial<Comment>) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, postId, user, isAuthenticated, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (newComment.trim() && user) {
      onAddComment({
        text: newComment
      });
      setNewComment('');
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments ({comments.length})</h3>
      
      {isAuthenticated ? (
        <form className="comment-form" onSubmit={handleSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
          ></textarea>
          <button type="submit">Post Comment</button>
        </form>
      ) : (
        <p className="login-prompt">Please login to add a comment</p>
      )}
      
      <div className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-header">
                <span className="username">{comment.user.username}</span>
                <span className="date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          ))
        ) : (
          <p>No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
}

export default CommentSection;