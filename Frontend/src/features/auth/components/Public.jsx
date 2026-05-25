const PublicRoute = ({ children }) => {
    const { user, loading } = useSelector(s => s.auth)
    if (loading) return null
    return !user ? children : <Navigate to='/dashboard' />
}