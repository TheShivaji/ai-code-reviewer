import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  History as HistoryIcon, ArrowRight, Calendar, 
  BarChart2, AlertCircle
} from 'lucide-react'
import Navbar from '../components/Navbar.jsx'
import { getReviews as getReviewsAPI, getScoreHistory as getScoreHistoryAPI } from '../services/api.js'
import { setHistory, setScoreHistory, setCurrentReview, setLoading, setError } from '../reviewSlice.js'

export function History() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { history, scoreHistory, isLoading, error } = useSelector((s) => s.review)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchHistoryData = async () => {
      dispatch(setLoading(true))
      dispatch(setError(null))
      try {
        const reviewsRes = await getReviewsAPI()
        if (reviewsRes.success) {
          dispatch(setHistory(reviewsRes.reviews))
        }

        const scoreRes = await getScoreHistoryAPI()
        if (scoreRes.success) {
          dispatch(setScoreHistory(scoreRes.history))
        }
      } catch (err) {
        console.error(err)
        dispatch(setError('Failed to fetch history.'))
      } finally {
        dispatch(setLoading(false))
      }
    }

    fetchHistoryData()
  }, [dispatch])

  const handleViewReview = (review) => {
    dispatch(setCurrentReview(review))
    navigate('/dashboard')
  }

  const scoreColor = (score) => {
    if (score >= 8) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    if (score >= 6) return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    return 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }

  const filteredHistory = history.filter((item) => {
    if (activeFilter === 'all') return true
    return item.language === activeFilter
  })

  // Get unique languages for filter
  const uniqueLanguages = ['all', ...new Set(history.map(item => item.language))]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8 z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <HistoryIcon className="w-5 h-5 text-purple-400" />
              Review History
            </h1>
            <p className="text-slate-400 text-xs mt-1.5">
              Browse and re-inspect your past code review runs.
            </p>
          </div>

          {/* Filtering tabs */}
          {history.length > 0 && (
            <div className="flex gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl overflow-x-auto max-w-full">
              {uniqueLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveFilter(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition cursor-pointer whitespace-nowrap ${
                    activeFilter === lang
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex gap-1.5">
              {[0, 150, 300].map(d => (
                <span key={d} className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                  style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/40 border border-slate-800 rounded-2xl max-w-2xl mx-auto p-8">
            <BarChart2 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-300">No Review History Found</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
              Start by submitting your code on the dashboard page to see reviews here.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-lg cursor-pointer transition"
            >
              Analyze Your First Code <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* History List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredHistory.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: idx * 0.05 }}
                  onClick={() => handleViewReview(item)}
                  className="bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 p-5 rounded-2xl flex items-center justify-between gap-4 cursor-pointer transition duration-300 group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Score Badge */}
                    <div className={`w-12 h-12 rounded-xl border flex flex-col items-center justify-center shrink-0 font-bold ${scoreColor(item.score)}`}>
                      <span className="text-lg">{item.score || '?'}</span>
                      <span className="text-[7.5px] uppercase tracking-wide opacity-80 -mt-0.5">Score</span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white truncate max-w-[120px] md:max-w-none">
                          Review #{item.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700 capitalize">
                          {item.language}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-900/20 text-purple-400 border border-purple-800/30 capitalize">
                          {item.source_type || 'Paste'}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-slate-500 group-hover:text-purple-400 transition shrink-0">
                    <span className="text-xs font-semibold mr-1.5 hidden sm:inline">View Report</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Right column: Analytics overview */}
            <div className="lg:col-span-1 space-y-6">
              {/* Score Trend Widget */}
              <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Score Trend</h3>

                {scoreHistory.length > 1 ? (
                  <div className="space-y-4">
                    {/* SVG Score Line Chart */}
                    <div className="h-32 w-full bg-slate-950 rounded-xl p-2 border border-slate-900 relative">
                      <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        {/* Area */}
                        <path
                          d={`M 0 30 ${scoreHistory.map((s, i) => `L ${(i / (scoreHistory.length - 1)) * 100} ${30 - (s.score / 10) * 25}`).join(' ')} L 100 30 Z`}
                          fill="url(#chartGrad)"
                        />
                        {/* Line */}
                        <path
                          d={scoreHistory.map((s, i) => `${i === 0 ? 'M' : 'L'} ${(i / (scoreHistory.length - 1)) * 100} ${30 - (s.score / 10) * 25}`).join(' ')}
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="1"
                        />
                      </svg>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 px-1">
                      <span>Older</span>
                      <span>Recent</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Not enough data points to plot trend. Submit more reviews to view your trajectory.
                  </p>
                )}

                {/* Score Stats */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <div className="text-center">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Average Score</p>
                    <p className="text-xl font-bold text-white mt-1">
                      {(scoreHistory.reduce((acc, curr) => acc + curr.score, 0) / (scoreHistory.length || 1)).toFixed(1)}
                    </p>
                  </div>
                  <div className="text-center border-l border-slate-800">
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Total Runs</p>
                    <p className="text-xl font-bold text-white mt-1">{history.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
