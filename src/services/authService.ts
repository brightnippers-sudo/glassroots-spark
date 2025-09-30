const API_BASE_URL = 'https://scholars.ng/api.php'

// --- Helper: timeout fetch ---
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
  const { timeout = 8000, ...fetchOptions } = options
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, { ...fetchOptions, signal: controller.signal })
    clearTimeout(id)
    return response
  } catch (error: any) {
    clearTimeout(id)
    if (error?.name === 'AbortError') throw new Error('Request timeout')
    throw error
  }
}

// --- Unified response handler (resilient) ---
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') || '';
  let data: any = null;
  let responseText = '';

  try {
    responseText = await response.text();

    // If empty response but status OK, return a simple success object
    if (responseText.trim() === '') {
      if (response.ok) {
        return { success: true };
      } else {
        // Non-ok + empty body: throw for visibility
        throw new Error(`Empty response body (status ${response.status})`);
      }
    }

    // Try to parse JSON if the content appears to be JSON or responseText contains JSON
    try {
      data = JSON.parse(responseText);
    } catch (jsonErr) {
      // Content-Type says JSON but parsing failed -> surface an informative error
      if (contentType.includes('application/json')) {
        console.error('Invalid JSON response body:', responseText);
        throw new Error(`Invalid JSON response: ${responseText}`);
      }

      // Not JSON — wrap raw text
      data = { text: responseText };
    }
  } catch (e: any) {
    console.error('Response parsing error:', e);
    throw new Error(`Failed to parse response: ${e.message}`);
  }

  if (!response.ok) {
    console.error('Server error response:', {
      status: response.status,
      statusText: response.statusText,
      data,
      responseText
    });

    // prefer structured error from server if present
    const errorMsg = (data && (data.error || data.message)) || responseText || `HTTP error! status: ${response.status}`;
    throw new Error(errorMsg);
  }

  // If parsed JSON object, merge success flag if missing
  if (typeof data === 'object' && data !== null) {
    return { success: data.success ?? true, ...data };
  }

  return { success: true, data };
};

// --- Helper: convert camelCase to snake_case for PHP API ---
const camelToSnake = (obj: Record<string, any>) => {
  const result: Record<string, any> = {}
  Object.keys(obj).forEach(key => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`)
    result[snakeKey] = obj[key]
  })
  return result
}

// --- Types ---
export interface LoginResponse {
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    status: string
    photo_url?: string
  }
  sessionId: string
}

export interface RegisterData {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  userType?: 'participant' | 'coach' | 'sponsor'
}

// --- Auth Service ---
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
    })
    const data = await handleResponse(response)
    console.log('Profile Response:', data); // Debug log
    
    // Handle both cases where profile might be in data.profile or directly in data
    const profile = data.profile || (data.success ? data : null);
    if (!profile) throw new Error('Profile not found in response')
    return profile
  },

  updateProfile: async (profileData: Record<string, any>) => {
    // Convert to snake_case for PHP API
    const payload = camelToSnake({
      ...profileData,
      phone: profileData.phone || null  // Ensure phone is sent as phone
    });
    
    console.log('Sending profile update:', payload);

    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });

    return handleResponse(response);
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
