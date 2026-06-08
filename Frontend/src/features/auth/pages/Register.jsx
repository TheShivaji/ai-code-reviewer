import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../hook/useAuth.js'

export const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { loading, registerUser, error, user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-600/10 rounded-full filter blur-[100px] animate-pulse"></div>
        <div className="flex flex-col items-center z-10">
          <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
          <p className="text-slate-400 text-[10px] tracking-widest uppercase font-bold">Creating your CodeSentry AI account...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await registerUser(name, email, password)
    } catch {
      console.error('Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center relative overflow-hidden font-sans">
      <div className="w-full max-w-md p-8 z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900 text-slate-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            AI-Powered Code Analysis
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Create Account
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Sign up to get access to automated AI reviews.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-slate-900 border border-slate-800/80 p-8 rounded-xl shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 rounded-xl py-2.5 pl-10 pr-4 outline-none transition duration-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 rounded-xl py-2.5 pl-10 pr-4 outline-none transition duration-300 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-slate-100 placeholder-slate-600 rounded-xl py-2.5 pl-10 pr-4 outline-none transition duration-300 text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 relative group bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Register <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
            <p className="text-slate-400 text-xs">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
