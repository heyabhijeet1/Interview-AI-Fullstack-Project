import axios from 'axios'

// Set VITE_API_URL to the backend's public URL for deployments. In local
// development, use the current hostname so LAN devices can reach the backend.
const apiBaseURL = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, "") ||
    (import.meta.env.DEV ? `http://${window.location.hostname}:3000` : window.location.origin)

const api = axios.create({
    baseURL: apiBaseURL,
    withCredentials:true
})

export async function register({username, email, password}){
    const response = await api.post('/api/auth/register',{
        username, email, password
    })
    return response.data
}

export async function login({email, password}){
    const response = await api.post('/api/auth/login',{
        email, password
    })
    return response.data
}

export async function startGuestSession() {
    const response = await api.post('/api/auth/guest')
    return response.data
}

export async function logout() {
    const response = await api.get('/api/auth/logout')
    return response.data
}

export async function getMe() {
    const response = await api.get('/api/auth/get-me')
    return response.data
}
