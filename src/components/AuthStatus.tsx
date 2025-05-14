// src/components/AuthStatus.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaPlus } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import styles from '../css/AuthStatus.module.css';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={styles.authStatus}>
      {isAuthenticated && user ? (
        <>
          <div className={styles.userInfo}>
            <Link to="/create-post" className={styles.createPostBtn}>
              <FaPlus /> Create Post
            </Link>
            <div className={styles.userDropdown}>
              <div className={styles.userTrigger}>
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.username} 
                    className={styles.profilePic} 
                  />
                ) : (
                  <div className={styles.profileInitial}>
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className={styles.username}>{user.username}</span>
              </div>
              <div className={styles.dropdownMenu}>
                <Link to="/profile" className={styles.dropdownItem}>
                  <FaUser /> Profile
                </Link>
                <button onClick={logout} className={styles.dropdownItem}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.authButtons}>
          <Link to="/login" className={styles.authButton}>
            <FaSignInAlt /> Login
          </Link>
          <Link to="/register" className={styles.authButton}>
            <FaUserPlus /> Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthStatus;