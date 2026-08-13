import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes.jsx'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../features/auth/hook/useAuth.js'

const App = () => {

  const { handleGetCurrentUser } = useAuth()

  useEffect(() => {
    handleGetCurrentUser()
  }, [])

  

  return (
    <div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          }
        }} 
      />
      <RouterProvider router={router} />
    </div>
  )
}
export default App