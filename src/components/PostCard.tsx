import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../types';



// Define props interface for PostCard component
interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  // Calculate percentage of votes for each option
  const totalVotes = post.options.reduce((sum, option) => sum + 1, 0);
  
  return (
    <div className="post-card">
      <h3>{post.title}</h3>
      <p className="post-creator">Posted by: {post.user.username}</p>
      <div className="post-options-preview">
        {post.options.slice(0, 2).map((option, index) => (
          <div key={index} className="option-preview">
            <img src={option.url} alt={`Option ${index + 1}`} />
            <div className="votes-bar">
              <div 
                className="votes-fill" 
                style={{ width: `${totalVotes > 0 ? (1) * 100 : 0}%` }}
              ></div>
            </div>
            <p>{totalVotes > 0 ? Math.round((1) * 100) : 0}% votes</p>
          </div>
        ))}
        {post.options.length > 2 && <p className="more-options">+{post.options.length - 2} more options</p>}
      </div>
      <div className="post-meta">
        <span>{totalVotes} votes</span>
        <span>{post.comments.length} comments</span>
      </div>
      <Link to={`/post/${post.id}`} className="view-details-btn">View Details</Link>
    </div>
  );
};

export default PostCard;