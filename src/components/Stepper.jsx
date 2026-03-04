/** Displays current step (1-3) with visual indicators */
export default function Stepper({ current }) {
  const steps = [
    { num: 1, label: 'Upload Photos' },
    { num: 2, label: 'Your Selfie' },
    { num: 3, label: 'Your Matches' },
  ]

  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          {/* Step circle */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-display transition-all duration-500
                ${current === step.num
                  ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  : current > step.num
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-ink-700 text-ink-600 border border-ink-600'
                }
              `}
              style={{ fontWeight: 700 }}
            >
              {current > step.num ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : step.num}
            </div>
            <span
              className={`mt-1.5 text-xs font-body whitespace-nowrap transition-colors duration-300
                ${current === step.num ? 'text-amber-400' : current > step.num ? 'text-amber-500/50' : 'text-ink-600'}
              `}
            >
              {step.label}
            </span>
          </div>

          {/* Connector line */}
          {i < steps.length - 1 && (
            <div className="w-16 md:w-24 h-px mx-3 mb-5 transition-all duration-500"
              style={{
                background: current > step.num
                  ? 'linear-gradient(90deg, #f59e0b, #f59e0b66)'
                  : 'rgba(255,255,255,0.07)'
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}
