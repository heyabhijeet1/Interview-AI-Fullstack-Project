import { useContext } from 'react'
import { AuthContext } from '../auth.context'
import { login, register, startGuestSession, logout } from '../services/auth.api'

export const useAuth = () => {
    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)

        try {
            const data = await login({ email, password })
            setUser(data.user)
            return { success: true }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Unable to log in. Please check your connection and try again."
            }
        } finally {
            setLoading(false)
        }
    }

    const handleGuestLogin = async () => {
        setLoading(true)
        try {
            const data = await startGuestSession()
            setUser(data.user)
            return { success: true }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Could not start a guest session. Please try again."
            }
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)

        try {
            const data = await register({ username, email, password })
            setUser(data.user ?? { id: data.id, username: data.username, email: data.email })
            return { success: true }
        } catch (err) {
            return {
                success: false,
                message: err.response?.data?.message || "Could not create your account. Please try again."
            }
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)

        try {
            await logout()
        } catch (err) {
            console.error(err)
        } finally {
            setUser(null)
            setLoading(false)
        }
    }

    return { user, loading, handleRegister, handleLogin, handleGuestLogin, handleLogout }
}
