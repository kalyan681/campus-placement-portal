import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// --- Request interceptor: attach JWT ---
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cpp_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// --- Response interceptor: handle errors globally ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status  = error.response?.status
    const message = error.response?.data?.message || 'Something went wrong'

    if (status === 401) {
      localStorage.removeItem('cpp_token')
      localStorage.removeItem('cpp_user')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (status === 403) {
      toast.error('You do not have permission to perform this action.')
    } else if (status === 409) {
      toast.error(message)
    } else if (status === 404) {
      toast.error(message)
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default api
