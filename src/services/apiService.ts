import { fetchWithTimeout, handleResponse } from './helpers'
import { authService } from './authService'

const API_BASE_URL = 'https://scholars.ng/api.php'

// --- API Service ---
export const apiService = {
  // Re-export auth service
  auth: authService,

  // ======================
  // HOMEPAGE CONTENT
  // ======================
  getHomepageContent: async (section: string) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/${section}`, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    })
    return handleResponse(response)
  },

  updateHomepageContent: async (section: string, content: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/${section}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(content),
      credentials: 'include',
      timeout: 15000,
    })
    return handleResponse(response)
  },

  getHeroContent: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/hero`, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    })
    return handleResponse(response)
  },

  updateHeroContent: async (content: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/hero`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
      credentials: 'include',
      timeout: 15000,
    })
    return handleResponse(response)
  },

  getStatistics: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/statistics`, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    })
    return handleResponse(response)
  },

  updateStatistics: async (statistics: any) => {
    const statsArray = Object.entries(statistics).map(([key_name, value]) => ({
      key_name,
      value: Number(value),
    }))
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/statistics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(statsArray),
      credentials: 'include',
      timeout: 12000,
    })
    return handleResponse(response)
  },

  getTestimonials: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/testimonials`, {
      headers: { Accept: 'application/json' },
      credentials: 'omit',
    })
    return handleResponse(response)
  },

  addTestimonial: async (testimonial: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/testimonials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testimonial),
      credentials: 'include',
    })
    return handleResponse(response)
  },

  updateTestimonial: async (id: number, testimonial: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/testimonials/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: testimonial.name,
        role: testimonial.role,
        quote: testimonial.quote,
        image_url: testimonial.image_url || testimonial.imageUrl,
        is_featured: testimonial.is_featured || testimonial.isFeatured,
      }),
      credentials: 'include',
    })
    return handleResponse(response)
  },

  deleteTestimonial: async (id: number) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/testimonials/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return handleResponse(response)
  },

  // ======================
  // STUDENT PROFILE
  // ======================
  getStudentProfile: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },

  getStudentRegistrations: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student/registrations`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },

  getStudentCertificates: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student/certificates`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },

  getStudentInvoices: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student/invoices`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },

  getStudentClubStats: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student/club-stats`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },

  getStudentActivity: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student/activity`, {
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },

  createStudentProfile: async (profileData: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include',
    })
    return handleResponse(response)
  },

  updateStudentProfile: async (profileData: any) => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(profileData),
      credentials: 'include',
    })
    return handleResponse(response)
  },

  updateStudentPhoto: async (photoFile: File) => {
    const formData = new FormData()
    formData.append('photo', photoFile)
    
    const response = await fetchWithTimeout(`${API_BASE_URL}/profile/student/photo`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    return handleResponse(response)
  },

  // ======================
  // ADMIN ENDPOINTS
  // ======================
  adminAuth: {
    login: async (email: string, password: string) => {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      return handleResponse(response)
    },

    logout: async () => {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
      return handleResponse(response)
    },

    getMe: async () => {
      const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users/me`, {
        method: 'GET',
        credentials: 'include',
      })
      return handleResponse(response)
    },
  },

  getAdminUsers: async () => {
    const response = await fetchWithTimeout(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      credentials: 'include',
    })
    return handleResponse(response)
  },
}
