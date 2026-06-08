import { useAuth } from "../hook/useAuth.js"
import { Navigate } from "react-router-dom"

export const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return null
    return !user ? children : <Navigate to='/dashboard' replace />
}