import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  user: {
    id: string
    name: string
    email: string
    photo?: string
    tier: string
  } | null
  sessionId: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  register: (formData: any) => Promise<void>
  loginWithGoogle: () => Promise<void>
  loginWithMicrosoft: () => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      sessionId: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('https://scholars.ng/api.php/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // This is important for cookies
            body: JSON.stringify({ email, password }),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || 'Login failed')
          }

          set({
            user: data.user,
            sessionId: data.sessionId,
            isLoading: false,
          })
        } catch (error) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      register: async (formData) => {
        try {
          set({ isLoading: true, error: null })
          const response = await fetch('https://scholars.ng/api.php/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData),
          })

          const data = await response.json()
          if (!response.ok) {
            throw new Error(data.error || 'Registration failed')
          }

          // Auto-login after successful registration
          set({
            user: data.user,
            sessionId: data.sessionId,
            isLoading: false,
          })
        } catch (error) {
          set({ error: error.message, isLoading: false })
          throw error
        }
      },

      logout: () => {
        set({ user: null, sessionId: null })
      },

      clearError: () => {
        set({ error: null })
      },

      loginWithGoogle: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('https://scholars.ng/api.php/auth/google', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Google login failed');
          }

          set({
            user: data.user,
            sessionId: data.sessionId,
            isLoading: false,
          });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      loginWithMicrosoft: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await fetch('https://scholars.ng/api.php/auth/microsoft', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Microsoft login failed');
          }

          set({
            user: data.user,
            sessionId: data.sessionId,
            isLoading: false,
          });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
