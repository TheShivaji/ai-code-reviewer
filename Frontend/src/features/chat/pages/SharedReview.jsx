import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Code2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react'
import { getSharedReview as getSharedReviewAPI } from '../services/api.js'
import { ReviewResult } from '../components/ReviewResult.jsx'

export function SharedReview() {
  const { shareToken } = useParams()
  const [review, setReview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSharedReview = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getSharedReviewAPI(shareToken)
        if (res.success) {
          setReview(res.review)
        } else {
          setError(res.message || 'Review not found.')
        }
      } catch (err) {
        console.error(err)
        setError(
          err.response?.data?.message || 'Failed to retrieve the shared review.'
        )
      } finally {
        setLoading(false)
      }
    }

    if (shareToken) {
      fetchSharedReview()
    }
  }, [shareToken])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      {/* Shared Navbar (No user session controls, call-to-action instead) */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Code2 size={18} className="text-purple-400" />
          <span className="text-white font-semibold text-[13.5px] tracking-tight">
            AI Code Reviewer
          </span>
        </Link>

        <Link to="/register">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[12px] font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md transition cursor-pointer"
          >
            Review Your Code
            <ArrowRight size={12} />
          </motion.button>
        </Link>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-start gap-8 z-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex gap-1.5">
              {[0, 150, 300].map((d) => (
                <span
                  key={d}
                  className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
                  style={{ animationDelay: `${d}ms` }}
                />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl max-w-md mx-auto p-8">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">Shared Review Unavailable</h3>
            <p className="text-sm text-slate-500 mt-2">{error}</p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 cursor-pointer transition"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full"
          >
            {/* Call to action card */}
            <div className="mb-6 bg-gradient-to-r from-purple-950/20 to-indigo-950/20 border border-purple-500/20 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  This code review report was shared with you. Want to run analysis on your own project?
                </span>
              </div>
              <Link to="/register" className="shrink-0">
                <span className="text-xs font-bold text-purple-400 hover:text-purple-300 underline cursor-pointer">
                  Get started free
                </span>
              </Link>
            </div>

            <ReviewResult review={review} />
          </motion.div>
        )}
      </main>
    </div>
  )
}
