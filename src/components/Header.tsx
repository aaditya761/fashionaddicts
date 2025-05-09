import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types';

interface HeaderProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated, user, onLogout }) => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">FashionVote</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/create">Create Post</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
