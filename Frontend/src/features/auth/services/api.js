import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:3000/api' : 'https://ai-code-reviewer-b244.onrender.com/api'),
  withCredentials: true,
})

export const register = async (name, email, password) => {
  const response = await api.post('/auth/register', { name, email, password })
  return response.data
}

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}

export const logout = async () => {
  const response = await api.get('/auth/logout')
  return response.data
}

export const getCurrentUser = async () => {
  const response = await api.get('/auth/user')
  return response.data
}
