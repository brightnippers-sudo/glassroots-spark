import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiService } from '../services/apiService'

interface AuthState {
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
    photo_url?: string
    tier: string
    role: 'participant' | 'coach' | 'sponsor' | 'admin'
    status: string
  } | null
  sessionId: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string, rememberMe?: boolean) => Promise<any>
  register: (formData: any) => Promise<void>
  loginWithGoogle: (token: string) => Promise<void>
  loginWithMicrosoft: (token: string) => Promise<void>
  logout: () => void
  clearError: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionId: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string, rememberMe?: boolean) => {
        try {
          set({ isLoading: true, error: null })

          const result = await apiService.auth.login(email.trim().toLowerCase(), password, rememberMe || false)

          if (!result?.user) {
            throw new Error('Login successful but no user data received')
          }

          set({
            user: {
              ...result.user,
              tier: (result.user as any).tier || 'Basic',
              role: (result.user as any).role || 'participant'
            },
            sessionId: result.sessionId || null,
            isLoading: false,
          })

          return result
        } catch (err: any) {
          const message = err?.message || 'An unexpected error occurred'
          console.error('Login error:', message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      register: async (formData) => {
        try {
          set({ isLoading: true, error: null })
          const result = await apiService.auth.register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            phone: formData.phone,
            userType: formData.userType,
          })

          set({ isLoading: false })
          return result
        } catch (err: any) {
          const message = err?.message || 'Registration failed'
          console.error('Registration error:', message)
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      logout: async () => {
        try {
          await apiService.auth.logout()
        } finally {
          set({ user: null, sessionId: null })
        }
      },

      clearError: () => {
        set({ error: null })
      },

      loginWithGoogle: async (token: string) => {
        try {
          set({ isLoading: true, error: null })
          const result = await apiService.auth.googleLogin(token)

          if (!result?.user) throw new Error('Google login failed')

          set({
            user: result.user,
            sessionId: result.sessionId || null,
            isLoading: false,
          })
        } catch (err: any) {
          const message = err?.message || 'Google login failed'
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },

      loginWithMicrosoft: async (token: string) => {
        try {
          set({ isLoading: true, error: null })
          const result = await apiService.auth.microsoftLogin(token)

          if (!result?.user) throw new Error('Microsoft login failed')

          set({
            user: result.user,
            sessionId: result.sessionId || null,
            isLoading: false,
          })
        } catch (err: any) {
          const message = err?.message || 'Microsoft login failed'
          set({ error: message, isLoading: false })
          throw new Error(message)
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
