import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20 text-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 animate-fade-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-3 py-1.5 rounded-full mb-8 font-body">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          AI-powered face matching
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl md:text-7xl font-800 leading-[1.05] mb-6 max-w-2xl mx-auto" style={{ fontWeight: 800 }}>
          Find yourself<br />in every <span className="text-gradient">frame</span>
        </h1>

        <p className="text-yellow-100 text-lg md:text-xl max-w-lg mx-auto mb-12 font-body leading-relaxed">
          Upload event photos, take a selfie, and let KwikPic instantly match every photo you're in.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/upload')}
          className="btn-primary text-lg px-10 py-4 animate-pulse-glow inline-flex items-center gap-3"
        >
          Get Started
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-14">
          {['Drag & Drop Upload', 'Face Recognition', 'Instant Results', 'Free Download'].map((f) => (
            <div key={f} className="flex items-center gap-1.5 text-xs text-yellow-100 bg-ink-800/60 border border-ink-700 px-3 py-1.5 rounded-full">
              <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
              </svg>
              {f}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
