// --- Fetch Helper with Timeout ---
export const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number } = {}) => {
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
export const handleResponse = async (response: Response) => {
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
