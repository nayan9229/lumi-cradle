import { createContext, useContext, useState, useEffect } from 'react';
import usersData from '../data/users.json';

/**
 * Authentication Context
 * Manages user authentication state and provides login/logout functionality
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser);
        // Verify token exists in users data
        const userExists = usersData.find(u => u.token === storedToken);
        if (userExists) {
          setUser(userData);
        } else {
          // Invalid token, clear storage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Object} { success: boolean, message: string }
   */
  const login = (email, password) => {
    const user = usersData.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      };

      // Store user data and token
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', user.token);
      setUser(userData);

      return { success: true, message: 'Login successful' };
    } else {
      return { success: false, message: 'Invalid email or password' };
    }
  };

  /**
   * Logout function
   */
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

