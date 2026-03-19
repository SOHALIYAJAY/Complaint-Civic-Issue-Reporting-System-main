import axios from 'axios'

// Create base axios instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('access_token')
      localStorage.removeItem('adminToken')
      localStorage.removeItem('departmentToken')
      
      // Redirect to login if needed
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// Common API functions
export const apiGet = async (url: string, params?: any) => {
  try {
    const response = await api.get(url, { params })
    return response.data
  } catch (error) {
    console.error(`GET ${url} failed:`, error)
    throw error
  }
}

export const apiPost = async (url: string, data?: any) => {
  try {
    const response = await api.post(url, data)
    return response.data
  } catch (error) {
    console.error(`POST ${url} failed:`, error)
    throw error
  }
}

export const apiPut = async (url: string, data?: any) => {
  try {
    const response = await api.put(url, data)
    return response.data
  } catch (error) {
    console.error(`PUT ${url} failed:`, error)
    throw error
  }
}

export const apiDelete = async (url: string) => {
  try {
    const response = await api.delete(url)
    return response.data
  } catch (error) {
    console.error(`DELETE ${url} failed:`, error)
    throw error
  }
}

// Public API functions (no auth required)
export const publicApiGet = async (url: string, params?: any) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${url}`, { 
      params,
      headers: {
        'Content-Type': 'application/json',
      }
    })
    return response.data
  } catch (error) {
    console.error(`Public GET ${url} failed:`, error)
    throw error
  }
}

// File upload helper
export const uploadFile = async (url: string, file: File, additionalData?: any) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key])
      })
    }
    
    const token = localStorage.getItem('access_token')
    const headers: Record<string, string> = {
      'Content-Type': 'multipart/form-data',
    }
    
    if (token && token !== 'undefined' && token !== 'null') {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    const response = await axios.post(`${API_BASE_URL}${url}`, formData, { headers })
    return response.data
  } catch (error) {
    console.error(`File upload ${url} failed:`, error)
    throw error
  }
}
