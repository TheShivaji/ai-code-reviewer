import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Sparkles, AlertCircle } from 'lucide-react'
import { useAuth } from '../hook/useAuth.js'

export const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { loading, loginUser, error, user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            navigate('/dashboard')
        }
    }, [user, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await loginUser(email, password)
        } catch (err) {
            console.error('Login failed:', err)
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
                        Antigravity Reviewer
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">
                        Log in to review and optimize your codebase with AI.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-slate-900 border border-slate-800/80 p-8 rounded-xl shadow-sm"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                                    Password
                                </label>
                                <a href="#" className="text-xs text-purple-400 hover:text-purple-300 transition">
                                    Forgot password?
                                </a>
                            </div>
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
                            className="w-full relative group bg-purple-600 hover:bg-purple-500 text-white font-medium py-2.5 px-4 rounded-xl shadow-md transition duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-800/80 pt-6">
                        <p className="text-slate-400 text-xs">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-purple-400 hover:text-purple-300 font-semibold transition">
                                Create one
                            </Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
