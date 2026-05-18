import { create } from 'zustand';
import axios from 'axios';

// Configure Axios to always send credentials (cookies) in cross-origin requests
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:5000/api/auth';

/**
 * Zustand store for authentication state management
 */
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true,
  error: null,

  register: async (username, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/register`, { username, email, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to register', 
        isLoading: false 
      });
      throw error;
    }
  },

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      set({ user: response.data, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to login', 
        isLoading: false 
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/logout`);
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to logout', isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/me`);
      set({ user: response.data, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isCheckingAuth: false });
    }
  }
}));
