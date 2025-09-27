const API_BASE_URL = 'https://scholars.ng/api.php';

// Add timeout to fetch requests
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
    const { timeout = 8000, ...fetchOptions } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout');
        }
        throw error;
    }
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            console.warn('Non-JSON response:', text);
            try {
                data = JSON.parse(text);
            } catch (e) {
                throw new Error(`Invalid response format: ${text}`);
            }
        }
    } catch (error) {
        console.error('Error parsing response:', error);
        throw error;
    }

    console.log('API Response:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data
    });
    
    // If the response is not ok, but contains a success message, return the data
    if (!response.ok && data && typeof data.message === 'string' && data.message.includes('updated successfully')) {
        return { success: true, message: data.message, data };
    }
    
    // If the response is not ok and doesn't contain a success message, throw an error
    if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    // For successful responses, ensure they have a consistent format
    return {
        success: true,
        ...(typeof data === 'object' ? data : { data })
    };
};

export const apiService = {
    // Homepage Content (Generic)
    getHomepageContent: async (section: string) => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/${section}`, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'omit'
        });
        return handleResponse(response);
    },

    updateHomepageContent: async (section: string, content: any) => {
        console.log(`Updating ${section} content:`, content);
        try {
            const response = await fetch(`${API_BASE_URL}/homepage/${section}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(content),
                // Don't include credentials since the API doesn't support it with current CORS setup
                credentials: 'omit'
            });
            console.log(`${section} update response status:`, response.status);
            return handleResponse(response);
        } catch (error) {
            console.error(`Error updating ${section} content:`, error);
            throw error;
        }
    },
    // Hero Section
    getHeroContent: async () => {
        const response = await fetch(`${API_BASE_URL}/homepage/hero`);
        return handleResponse(response);
    },

    updateHeroContent: async (content: any) => {
        const response = await fetch(`${API_BASE_URL}/homepage/hero`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content)
        });
        return handleResponse(response);
    },

    // Statistics
    getStatistics: async () => {
        const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/statistics`, {
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'omit'
        });
        return handleResponse(response);
    },

    updateStatistics: async (statistics: any) => {
        // Convert statistics object to array format
        const statsArray = Object.entries(statistics).map(([key_name, value]) => ({
            key_name,
            value: Number(value)
        }));

        const response = await fetchWithTimeout(`${API_BASE_URL}/homepage/statistics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'omit',
            body: JSON.stringify(statsArray)
        });
        return handleResponse(response);
    },

    // Testimonials
    getTestimonials: async () => {
        const response = await fetch(`${API_BASE_URL}/homepage/testimonials`);
        return handleResponse(response);
    },

    addTestimonial: async (testimonial: any) => {
        const response = await fetch(`${API_BASE_URL}/homepage/testimonials`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testimonial)
        });
        return handleResponse(response);
    },

    updateTestimonial: async (id: number, testimonial: any) => {
        const response = await fetch(`${API_BASE_URL}/homepage/testimonials/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: testimonial.name,
                role: testimonial.role,
                quote: testimonial.quote,
                image_url: testimonial.image_url || testimonial.imageUrl,
                is_featured: testimonial.is_featured || testimonial.isFeatured
            })
        });
        return handleResponse(response);
    },

    deleteTestimonial: async (id: number) => {
        const response = await fetch(`${API_BASE_URL}/homepage/testimonials/${id}`, {
            method: 'DELETE'
        });
        return handleResponse(response);
    }
};