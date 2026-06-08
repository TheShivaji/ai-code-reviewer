import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { getCurrentUser } from '../features/auth/service/auth.api.js'
import { setUser, setInitialized } from '../features/auth/states/auth.slice.js'

function AppLoader() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full filter blur-[100px] animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-[80px] animate-pulse delay-500"></div>

      <div className="flex flex-col items-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative w-16 h-16 mb-6 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-purple-500/20 rounded-full filter blur-md animate-ping"></div>
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-white font-bold text-sm tracking-wide"
        >
          CodeSentry AI
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-slate-400 text-[10px] mt-1.5 uppercase tracking-widest font-semibold"
        >
          Preparing workspace...
        </motion.p>
      </div>
    </div>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const initialized = useSelector((s) => s.auth.initialized)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser()
        if (data.success) {
          dispatch(setUser(data.user))
        }
      } catch {
        // 401 Unauthorized is expected if user is not logged in yet.
        console.log('User is not authenticated (requires login).')
      } finally {
        dispatch(setInitialized(true))
      }
    }
    fetchUser()
  }, [dispatch])

  if (!initialized) {
    return <AppLoader />
  }

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
export default App