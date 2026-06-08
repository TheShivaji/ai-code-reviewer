import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Code2, GitFork, Link2, AlertCircle, Send, Terminal } from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { AgentLoader } from '../components/AgentLoader.jsx'
import { ReviewResult } from '../components/ReviewResult.jsx'
import { createReview as createReviewAPI } from '../services/api.js'
import { setCurrentReview, setLoading, setError } from '../reviewSlice.js'

export function Dashboard() {
  const dispatch = useDispatch()
  const { currentReview, isLoading, error } = useSelector((s) => s.review)

  // Input states
  const [activeTab, setActiveTab] = useState('paste') // 'paste' | 'github' | 'pr'
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('auto')
  const [githubUrl, setGithubUrl] = useState('')
  const [prUrl, setPrUrl] = useState('')
  const [validationError, setValidationError] = useState('')

  const handleStartReview = async (e) => {
    e.preventDefault()
    setValidationError('')
    dispatch(setError(null))

    // Form validation
    if (activeTab === 'paste' && !code.trim()) {
      setValidationError('Please paste some code to review.')
      return
    }
    if (activeTab === 'github' && !githubUrl.trim()) {
      setValidationError('Please enter a GitHub repository file URL.')
      return
    }
    if (activeTab === 'pr' && !prUrl.trim()) {
      setValidationError('Please enter a Pull Request URL.')
      return
    }

    dispatch(setLoading(true))
    dispatch(setCurrentReview(null))

    try {
      const payload = { language }
      if (activeTab === 'paste') payload.code = code
      if (activeTab === 'github') payload.githubUrl = githubUrl
      if (activeTab === 'pr') {
        if (prUrl.includes('gitlab.com')) {
          payload.gitlabUrl = prUrl
        } else {
          payload.prUrl = prUrl
        }
      }

      const res = await createReviewAPI(payload)
      if (res.success) {
        dispatch(setCurrentReview(res.review))
      } else {
        dispatch(setError(res.message || 'Failed to generate code review.'))
      }
    } catch (err) {
      console.error(err)
      dispatch(
        setError(
          err.response?.data?.message ||
            'Something went wrong while connecting to the review agents.'
        )
      )
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-start gap-8 z-10">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center py-8"
            >
              <AgentLoader />
            </motion.div>
          ) : currentReview ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ReviewResult review={currentReview} />
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-3xl bg-slate-900 border border-slate-800/80 p-8 rounded-xl shadow-sm"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Select Source & Run Code Review
                </h1>
                <p className="text-slate-400 text-xs mt-1.5">
                  Choose a code source to trigger the multi-agent optimization pipeline.
                </p>
              </div>

              {/* Input Type Selector Tabs */}
              <div className="flex bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 mb-6">
                {[
                  { id: 'paste', label: 'Paste Code', icon: Code2 },
                  { id: 'github', label: 'GitHub File', icon: Link2 },
                  { id: 'pr', label: 'PR Diff', icon: GitFork },
                ].map((tab) => {
                  const Icon = tab.icon
                  const active = activeTab === tab.id
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id)
                        setValidationError('')
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        active
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  )
                })}
              </div>

              {/* Inputs Form */}
              <form onSubmit={handleStartReview} className="space-y-6">
                {/* Alert for Validation & API Errors */}
                {(validationError || error) && (
                  <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{validationError || error}</span>
                  </div>
                )}

                {/* Language Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Language Context
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 text-slate-200 rounded-xl py-2.5 px-4 outline-none transition duration-300 text-sm cursor-pointer"
                  >
                    <option value="auto">Auto Detect Language</option>
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="go">Go</option>
                  </select>
                </div>

                {/* Tab specific input panels */}
                <AnimatePresence mode="wait">
                  {activeTab === 'paste' && (
                    <motion.div
                      key="paste"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                        Source Code
                      </label>
                      <div className="relative border border-slate-800 rounded-xl bg-slate-950/50 overflow-hidden focus-within:border-purple-500 transition duration-300">
                        <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-2 flex items-center gap-2 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                          <Terminal className="w-3.5 h-3.5" />
                          Code Editor Panel
                        </div>
                        <textarea
                          placeholder="// Paste your source code here..."
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full h-80 bg-slate-950/40 p-4 outline-none text-slate-300 placeholder-slate-700 font-mono text-xs leading-relaxed resize-y"
                        />
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'github' && (
                    <motion.div
                      key="github"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                        GitHub File URL
                      </label>
                      <div className="relative">
                        <Link2 className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="url"
                          placeholder="https://github.com/owner/repo/blob/main/src/App.js"
                          value={githubUrl}
                          onChange={(e) => setGithubUrl(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 text-slate-100 placeholder-slate-600 rounded-xl py-3 pl-11 pr-4 outline-none transition duration-300 text-xs"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1 pl-1">
                        Ensure the file is publicly accessible to the agent system.
                      </p>
                    </motion.div>
                  )}

                  {activeTab === 'pr' && (
                    <motion.div
                      key="pr"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-2"
                    >
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                        PR / MR URL
                      </label>
                      <div className="relative">
                        <GitFork className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                        <input
                          type="url"
                          placeholder="https://github.com/.../pull/1 or https://gitlab.com/.../-/merge_requests/1"
                          value={prUrl}
                          onChange={(e) => setPrUrl(e.target.value)}
                          className="w-full bg-slate-950/80 border border-slate-800 hover:border-slate-700 focus:border-purple-500 text-slate-100 placeholder-slate-600 rounded-xl py-3 pl-11 pr-4 outline-none transition duration-300 text-xs"
                        />
                      </div>
                      <p className="text-[10px] text-slate-500 italic mt-1 pl-1">
                        Ensure the Pull/Merge Request is open and accessible.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full relative group overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  Analyze Code Quality <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
