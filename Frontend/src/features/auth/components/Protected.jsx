import { useAuth } from "../hook/useAuth.js"
import { Navigate } from "react-router-dom"

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) {
        return (
            <div className='min-h-screen bg-[#0a0a0a] flex items-center justify-center'>
                <div className='flex gap-1.5'>
                    {[0, 150, 300].map(d => (
                        <span key={d} className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                            style={{ animationDelay: `${d}ms` }} />
                    ))}
                </div>
            </div>
        )
    }
    return user ? children : <Navigate to='/login' replace />
}