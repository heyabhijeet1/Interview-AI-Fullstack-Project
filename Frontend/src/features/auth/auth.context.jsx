import { useEffect, useState } from 'react'
import { getMe } from './services/auth.api'
import { AuthContext } from './auth.context'

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [initializing, setInitializing] = useState(true)

    useEffect(() => {
        getMe()
            .then((data) => setUser(data.user))
            .catch(() => setUser(null))
            .finally(() => {
                setInitializing(false)
                setLoading(false)
            })
    }, [])

    return (
        <AuthContext.Provider value={{user, setUser, loading, setLoading, initializing}}> {children} </AuthContext.Provider>)
}

