// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api, { authService, userService } from '../services/api';
import { JwtPayload, User } from '../types';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (accessToken: string, refreshToken: string, email:string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create the auth context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props for the AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const parseJwt = (token:string) : JwtPayload => {
      const base64Url = token.split('.')[1]; // Get the payload part
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
  
      return JSON.parse(jsonPayload);
  }

  // Initialize auth state from localStorage on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      try {
        const storedToken = localStorage.getItem('accessToken');
        if (storedToken) {
          // Set the token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          setToken(storedToken);
          
          // Fetch the current user's profile to verify the token is still valid
          try {
            const parsedJwt = parseJwt(storedToken);
            const userData = await userService.getProfile(parsedJwt.email);
            setUser(userData);
            setIsAuthenticated(true);
          } catch (profileError) {
            console.error('Error fetching user profile:', profileError);
            // If fetching profile fails, the token is likely invalid or expired
            handleLogout();
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login({ email, password });
      const { tokens: { accessToken: newToken }, user: userData } = response;
      
      // Store in state
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      
      // Set the token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Show success message
      toast.success(`Welcome back, ${userData.username}!`);
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (accessToken: string, refreshToken: string, email:string): Promise<void> => {
    setToken(accessToken);
    setUser({email: email, id:1, picture:"", username: ""});
    setIsAuthenticated(true);
      
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
      
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      
    toast.success(`Welcome back, ${email}!`);
  };

  // Register function
  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register({ username, email, password });
      const { tokens: { accessToken: newToken }, user: userData } = response;
      
      // Store in state
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Store in localStorage
      localStorage.setItem('token', newToken);
      
      // Set the token in axios headers
      api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Show success message
      toast.success(`Welcome, ${userData.username}! Your account has been created.`);
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    // Clear state
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('token');
    
    // Clear axios header
    delete api.defaults.headers.common['Authorization'];
  };

  // Exposed logout function that also navigates
  const logout = () => {
    handleLogout();
    toast.info('You have been logged out');
    navigate('/');
  };

  // Update user profile
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    setIsLoading(true);
    
    try {
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      console.error('Update profile error:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Value to be provided by the context
  const value = {
    isAuthenticated,
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    error,
    loginWithGoogle
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};