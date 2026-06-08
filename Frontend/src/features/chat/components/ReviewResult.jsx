import { useState } from 'react'
import { useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'
import ReviewTabs from './ReviewTabs.jsx'
import { Copy, Check, Share2, CheckCircle } from 'lucide-react'

const MarkdownContent = ({ content }) => (
    <div className='text-white/65 text-[13px] leading-relaxed prose prose-invert max-w-none
    prose-headings:text-white/80 prose-headings:font-semibold
    prose-code:text-purple-300 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded'>
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{content || 'No data'}</ReactMarkdown>
    </div>
)

const SeverityBadge = ({ severity }) => {
    const sev = (severity || 'Warning').toLowerCase()
    const colors = {
        critical: 'bg-red-500/15 text-red-400 border-red-500/25',
        high: 'bg-orange-500/15 text-orange-400 border-orange-500/25',
        medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25',
        low: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
        warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/25'
    }
    return (
        <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${colors[sev] || colors.warning}`}>
            {severity || 'Warning'}
        </span>
    )
}

const IssuesCardView = ({ rawContent }) => {
    let parsedData = null
    try {
        if (rawContent && typeof rawContent === 'string') {
            let jsonString = rawContent.trim()
            if (jsonString.startsWith('```')) {
                jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '')
            }
            parsedData = JSON.parse(jsonString.trim())
        }
    } catch {
        // Not valid JSON, fall back to markdown
    }

    if (!parsedData || !parsedData.issues) {
        return <MarkdownContent content={rawContent} />
    }

    return (
        <div className="space-y-5">
            {/* Summary Banner */}
            {parsedData.summary && (
                <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
                    <InfoIcon className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Analysis Summary</span>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{parsedData.summary}</p>
                    </div>
                </div>
            )}

            {/* Issues Cards */}
            <div className="space-y-4">
                {parsedData.issues.length > 0 ? (
                    parsedData.issues.map((issue, index) => {
                        const sev = (issue.severity || '').toLowerCase()
                        let colorClass = 'border-slate-800 bg-slate-900/10'
                        if (sev === 'critical') colorClass = 'border-rose-500/20 bg-rose-500/5'
                        else if (sev === 'high') colorClass = 'border-orange-500/20 bg-orange-500/5'
                        else if (sev === 'medium') colorClass = 'border-amber-500/20 bg-amber-500/5'
                        else if (sev === 'low') colorClass = 'border-blue-500/20 bg-blue-500/5'

                        return (
                          <div key={index} className={`border rounded-xl p-5 space-y-3 transition duration-300 ${colorClass}`}>
                            <div className="flex justify-between items-start gap-4">
                              <h4 className="text-sm font-bold text-white">{issue.title}</h4>
                              <SeverityBadge severity={issue.severity} />
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              <span className="font-semibold text-slate-200">Description: </span>
                              {issue.description}
                            </p>
                            {issue.fix && (
                              <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800/80">
                                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wider block mb-1.5">Recommended Fix:</span>
                                <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">{issue.fix}</pre>
                              </div>
                            )}
                          </div>
                        )
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500">
                        <CheckCircle className="w-8 h-8 mb-2 opacity-50 text-emerald-400" />
                        <p className="text-sm text-emerald-400/80 font-bold">No issues detected for this report.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const InfoIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.063 1.063L12 13.5l-.293-.293a.75.75 0 011.063-1.063l.041.02zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

export function ReviewResult({ review }) {
    const { currentReview: reduxReview, activeTab } = useSelector(s => s.review)
    const currentReview = review || reduxReview
    const [copied, setCopied] = useState(false)
    const [shareMsg, setShareMsg] = useState('')

    if (!currentReview) return null

    const severity = currentReview.severity
        ? (typeof currentReview.severity === 'string'
            ? JSON.parse(currentReview.severity)
            : currentReview.severity)
        : null

    const handleCopy = (text) => {
        if (text) {
            navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    const handleShare = () => {
        const url = `${window.location.origin}/shared/${currentReview.share_token}`
        navigator.clipboard.writeText(url)
        setShareMsg('Link copied!')
        setTimeout(() => setShareMsg(''), 2000)
    }

    const tabContent = {
        security: currentReview.security_feedback,
        bugs: currentReview.bug_feedback,
        performance: currentReview.performance_feedback,
        practices: currentReview.best_practice_feedback || currentReview.best_practices_feedback,
        fixed: currentReview.fixed_code,
        pr: currentReview.pr_comment,
        final: currentReview.final_summary || currentReview.final_review
    }

    const isJsonTab = ['security', 'bugs', 'performance', 'practices'].includes(activeTab)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='flex flex-col gap-4'
        >
            {/* Header */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <span className='text-white/50 text-[12px] uppercase tracking-wider'>Review Complete</span>
                    {severity && <SeverityBadge severity={severity.severity} />}
                    {currentReview.score > 0 && (
                        <span className='text-[12px] text-white/40'>
                            Score: <span className='text-white/70 font-medium'>{currentReview.score}/10</span>
                        </span>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    {shareMsg && <span className='text-green-400 text-[12px]'>{shareMsg}</span>}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleShare}
                        className='flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[12px] transition-colors cursor-pointer'
                    >
                        <Share2 size={13} />
                        Share
                    </motion.button>
                </div>
            </div>

            {/* Tabs */}
            <ReviewTabs />

            {/* Content */}
            <AnimatePresence mode='wait'>
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className='bg-[#111] border border-white/[0.07] rounded-xl p-5 relative min-h-[300px]'
                >
                    {(activeTab === 'fixed' || activeTab === 'pr') && (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(tabContent[activeTab])}
                            className='absolute top-4 right-4 flex items-center gap-1.5 text-white/30 hover:text-white/60 text-[12px] transition-colors cursor-pointer'
                        >
                            {copied ? <Check size={13} className='text-green-400' /> : <Copy size={13} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </motion.button>
                    )}
                    
                    {isJsonTab ? (
                        <IssuesCardView rawContent={tabContent[activeTab]} />
                    ) : (
                        <MarkdownContent content={tabContent[activeTab]} />
                    )}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    )
}
export default ReviewResult
