import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { motion } from 'framer-motion'
import { Code2, History, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../auth/hook/useAuth.js'
import { clearReview } from '../reviewSlice.js'

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const { user, logoutUser } = useAuth()

    const handleLogout = async () => {
        try {
            await logoutUser()
            navigate('/login')
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    const isActive = (path) => location.pathname === path

    return (
        <nav className='sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between'>
            <Link to='/dashboard' className='flex items-center gap-2'>
                <Code2 size={18} className='text-purple-400' />
                <span className='text-white font-semibold text-[13.5px] tracking-tight'>AI Code Reviewer</span>
            </Link>

            <div className='flex items-center gap-1'>
                <Link to='/dashboard'>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => dispatch(clearReview())}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                            isActive('/dashboard') 
                            ? 'text-white bg-white/10' 
                            : 'text-white/40 hover:text-white/70'
                        }`}
                    >
                        <Plus size={13} />
                        New Review
                    </motion.button>
                </Link>

                <Link to='/history'>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] transition-colors cursor-pointer ${
                            isActive('/history') 
                            ? 'text-white bg-white/10' 
                            : 'text-white/40 hover:text-white/70'
                        }`}
                    >
                        <History size={13} />
                        History
                    </motion.button>
                </Link>

                <div className='w-px h-4 bg-white/10 mx-1' />

                <span className='text-white/30 text-[12px] px-2'>{user?.name || user}</span>

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] text-white/30 hover:text-red-400 transition-colors cursor-pointer'
                >
                    <LogOut size={13} />
                </motion.button>
            </div>
        </nav>
    )
}