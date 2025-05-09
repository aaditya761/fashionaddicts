import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface ProfileProps {
  user: User | null;
  isAuthenticated: boolean;
}

interface UserPost {
  id: number;
  title: string;
  date: string;
  options: UserPostOption[];
  totalVotes: number;
  comments: number;
}

interface UserPostOption {
  id: number;
  imageUrl: string;
  votes: number;
}

interface UserVote {
  postId: number;
  postTitle: string;
  date: string;
  optionVoted: string;
}

const Profile: React.FC<ProfileProps> = ({ user, isAuthenticated }) => {
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [userVotes, setUserVotes] = useState<UserVote[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        // In a real app, you would fetch from API
        // const posts = await fetchUserPosts(user.id);
        // const votes = await fetchUserVotes(user.id);
        
        // For demo purposes, use mock data
        const mockPosts: UserPost[] = [
          {
            id: 3,
            title: 'Which jacket for fall?',
            date: '2023-09-15T10:30:00Z',
            options: [
              { id: 1, imageUrl: 'https://via.placeholder.com/300x400', votes: 18 },
              { id: 2, imageUrl: 'https://via.placeholder.com/300x400', votes: 27 }
            ],
            totalVotes: 45,
            comments: 12
          }
        ];
        
        const mockVotes: UserVote[] = [
          {
            postId: 1,
            postTitle: 'Which dress for a summer wedding?',
            date: '2023-05-20T14:45:00Z',
            optionVoted: 'option1'
          },
          {
            postId: 2,
            postTitle: 'Help me pick shoes for my interview',
            date: '2023-06-10T09:15:00Z',
            optionVoted: 'option2'
          }
        ];
        
        setUserPosts(mockPosts);
        setUserVotes(mockVotes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h2>Profile</h2>
        <div className="user-info">
          <h3>{user.username}</h3>
          <p>{user.email}</p>
        </div>
      </div>
      
      {loading ? (
        <div className="loading">Loading profile data...</div>
      ) : (
        <div className="profile-content">
          <div className="profile-section">
            <h3>Your Posts</h3>
            {userPosts.length > 0 ? (
              <div className="user-posts">
                {userPosts.map(post => (
                  <div key={post.id} className="user-post-card" onClick={() => navigate(`/post/${post.id}`)}>
                    <h4>{post.title}</h4>
                    <div className="post-thumbnails">
                      {post.options.slice(0, 2).map((option, index) => (
                        <img key={option.id} src={option.imageUrl} alt={`Option ${index + 1}`} />
                      ))}
                    </div>
                    <div className="post-meta">
                      <span>{post.totalVotes} votes</span>
                      <span>{post.comments} comments</span>
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">You haven't created any posts yet.</p>
            )}
          </div>
          
          <div className="profile-section">
            <h3>Your Votes</h3>
            {userVotes.length > 0 ? (
              <div className="user-votes">
                {userVotes.map((vote, index) => (
                  <div key={index} className="user-vote-card" onClick={() => navigate(`/post/${vote.postId}`)}>
                    <h4>{vote.postTitle}</h4>
                    <p>You voted for option {vote.optionVoted.replace('option', '')}</p>
                    <p className="vote-date">{new Date(vote.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">You haven't voted on any posts yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;