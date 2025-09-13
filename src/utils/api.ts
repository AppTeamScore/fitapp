import { supabase } from './supabase/client';
import { projectId } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-c6c9ad1a`;

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        let errorMessage = 'API request failed';
        try {
          const error = await response.json();
          errorMessage = error.error || errorMessage;
        } catch {
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Не удается подключиться к серверу. Проверьте подключение к интернету.');
      }
      throw error;
    }
  },

  // Профиль пользователя
  async getProfile() {
    return this.request('/profile');
  },

  async updateProfile(data: any) {
    return this.request('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // План тренировок
  async getWorkoutPlan() {
    return this.request('/workout-plan');
  },

  async generateWorkoutPlan(data: any) {
    return this.request('/generate-workout-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Прогресс
  async saveWorkoutProgress(data: any) {
    return this.request('/workout-progress', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getWorkoutProgress() {
    return this.request('/workout-progress');
  },
};