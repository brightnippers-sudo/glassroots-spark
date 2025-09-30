const API_BASE_URL = 'https://scholars.ng/api.php'

// --- Fetch Helper with Timeout ---
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
  const { timeout = 8000, ...fetchOptions } = options

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    clearTimeout(id)
    return response
  } catch (error: any) {
    clearTimeout(id)
    if (error?.name === 'AbortError') throw new Error('Request timeout')
    throw error
  }
}

// --- Unified Response Handler ---
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type')
  let data: any

  try {
    if (contentType && contentType.includes('application/json')) {
      data = await response.json()
    } else {
      const text = await response.text()
      try {
        data = JSON.parse(text)
      } catch {
        throw new Error(`Invalid response format: ${text}`)
      }
    }
  } catch {
    throw new Error('Error parsing response')
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `HTTP error! status: ${response.status}`
    throw new Error(errorMsg)
  }

  return {
    success: true,
    ...(typeof data === 'object' ? data : { data }),
  }
}

// Types
export interface LoginResponse {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    status: string;
    photo_url?: string;
  };
  sessionId: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  userType?: 'participant' | 'coach' | 'sponsor';
}

// Auth Service
export const authService = {
  register: async (userData: RegisterData) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
      timeout: 12000,
    })
    return handleResponse(response)
  },

  login: async (email: string, password: string, rememberMe: boolean) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
      credentials: 'include',
    })
    return handleResponse(response) as Promise<LoginResponse>
  },

  logout: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })
    return handleResponse(response)
  },

  getCurrentUser: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'include',
    });

    const data = await handleResponse(response);

    // Return the profile directly
    if (!data.profile) {
        throw new Error("Profile not found in response");
    }

    return data.profile;
  },


  forgotPassword: async (email: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email }),
      timeout: 10000,
    })
    return handleResponse(response)
  },

  resetPassword: async (token: string, password: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ token, password }),
      timeout: 10000,
    })
    return handleResponse(response)
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
      credentials: 'include',
    })
    return handleResponse(response)
  },

  googleLogin: async (token: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include',
    })
    return handleResponse(response)
  },

  microsoftLogin: async (token: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/auth/microsoft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ token }),
      credentials: 'include',
    })
    return handleResponse(response)
  },
}
