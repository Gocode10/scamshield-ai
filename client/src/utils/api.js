import axios from 'axios'

const base = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: base,
  timeout: 20000,
})

export default api
