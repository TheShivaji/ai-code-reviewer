import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { setActiveTab } from '../reviewSlice.js'

const tabs = [
    { id: 'final', icon: '🎯', label: 'Final Report' },
    { id: 'security', icon: '🔒', label: 'Security' },
    { id: 'bugs', icon: '🐛', label: 'Bugs' },
    { id: 'performance', icon: '⚡', label: 'Performance' },
    { id: 'practices', icon: '✅', label: 'Best Practices' },
    { id: 'fixed', icon: '🔧', label: 'Fixed Code' },
    { id: 'pr', icon: '💬', label: 'PR Comment' },
]

export default function ReviewTabs() {
    const dispatch = useDispatch()
    const { activeTab } = useSelector(s => s.review)

    return (
        <div className='flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none'>
            {tabs.map(tab => (
                <motion.button
                    key={tab.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => dispatch(setActiveTab(tab.id))}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] whitespace-nowrap transition-all cursor-pointer ${
                        activeTab === tab.id
                            ? 'bg-purple-500/15 border border-purple-500/25 text-purple-300'
                            : 'text-white/35 hover:text-white/60 border border-transparent'
                    }`}
                >
                    <span>{tab.icon}</span>
                    {tab.label}
                </motion.button>
            ))}
        </div>
    )
}
