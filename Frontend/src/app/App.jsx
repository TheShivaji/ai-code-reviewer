import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes.jsx'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentUser } from '../features/auth/services/api.js'
import { setUser, setLoading } from '../features/auth/auth.slice.js'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setLoading(true))
      try {
        const data = await getCurrentUser()
        if (data.success) {
          dispatch(setUser(data.user))
        }
      } catch (err) {
        // 401 Unauthorized is expected if user is not logged in yet.
        console.log('User is not authenticated (requires login).')
      } finally {
        dispatch(setLoading(false))
      }
    }
    fetchUser()
  }, [dispatch])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
export default App