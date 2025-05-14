import React, { use, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../types';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

interface LoginProps {
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setUser: (user: User | null) => void;
}



interface FormData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated, setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });

  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { loginWithGoogle, isAuthenticated} = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // In a real app, you would validate and authenticate with a backend
      // const response = await loginUser(formData);
      
      // For demo purposes, use mock data
      const mockResponse: AuthResponse = {
        token: 'mock-token-12345',
        user: {
          id: 1,
          username: 'fashionlover',
          email: formData.email,
          picture:""
        }
      };
      
      // Store token and user data
      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      
      // Update app state
      setIsAuthenticated(true);
      setUser(mockResponse.user);
      
      // Redirect to home page
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
      setIsSubmitting(false);
    }
  };

  const handleSuccess = async (response:any)=>{
  const resp = await authService.loginWithGoogle({credential: response.credential});
  const { tokens, user } = resp;
  await loginWithGoogle(tokens.accessToken, tokens.refreshToken, user.email);
  navigate("/", { replace: true });
  }

  const handleError = () => {
    console.log('Login Failed');
  };


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="auth-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          
            <GoogleOAuthProvider clientId="922492381354-0bnc1gec7avgav3nsm5p27m8mmr9jq5u.apps.googleusercontent.com">
            <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
            </GoogleOAuthProvider>
          


        </form>
        
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;