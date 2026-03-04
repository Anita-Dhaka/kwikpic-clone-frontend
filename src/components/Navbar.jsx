import { useNavigate } from 'react-router-dom'
import { usePhoto } from '../context/PhotoContext'

export default function Navbar() {
  const navigate = useNavigate()
  const { resetAll } = usePhoto()

  const handleLogo = () => {
    resetAll()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between"
      style={{ backdropFilter: 'blur(16px)', background: 'rgba(8,10,15,0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <button onClick={handleLogo} className="flex items-center gap-2.5 group">
        {/* Logo icon */}
        <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center group-hover:bg-amber-400 transition-colors">
          <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
        </div>
        <span className="font-display font-bold text-lg tracking-tight">
          Kwik<span className="text-gradient">Pic</span>
        </span>
      </button>

      <div className="text-xs text-ink-600 font-body">
        Find yourself in every frame
      </div>
    </nav>
  )
}
