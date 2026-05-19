import { create } from 'zustand';
import axios from 'axios';
import { useAuthStore } from './useAuthStore';

const API_URL = 'http://localhost:5000/api/score';

/**
 * Zustand store for managing user typing speed scores
 */
export const useScoreStore = create((set) => ({
  history: [],
  isLoading: false,
  error: null,

  saveScore: async (scoreData) => {
    set({ isLoading: true, error: null });
    try {
      const { mode, duration, rawWpm, netWpm, accuracy, errors } = scoreData;
      
      const response = await axios.post(`${API_URL}/`, {
        mode,
        duration,
        rawWpm,
        netWpm,
        accuracy,
        errors
      });

      // Update history in state
      set((state) => ({
        history: [response.data, ...state.history].slice(0, 10),
        isLoading: false
      }));

      // Trigger user profile refresh in Auth Store to update live XP & Level
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();

      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to save score';
      set({ error: errorMsg, isLoading: false });
      throw errorMsg;
    }
  },

  getHistory: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/history`);
      set({ history: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.error || 'Failed to load typing history', 
        isLoading: false 
      });
    }
  }
}));
