import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shield, Bug, Zap, Sparkles, Brain, Cpu, CheckCircle2, Circle } from 'lucide-react'

const steps = [
  { id: 1, label: 'Initializing Graph Workspace', icon: Cpu, desc: 'Setting up agent memory and parameters' },
  { id: 2, label: 'Security Auditor', icon: Shield, desc: 'Scanning for vulnerabilities and secrets exposure' },
  { id: 3, label: 'Bug Detector', icon: Bug, desc: 'Identifying syntax errors, logic flaws, and edge cases' },
  { id: 4, label: 'Performance Analyzer', icon: Zap, desc: 'Profiling complexity, memory, and database calls' },
  { id: 5, label: 'Clean Code Architect', icon: Sparkles, desc: 'Applying SOLID principles and clean conventions' },
  { id: 6, label: 'Decision Node Synthesis', icon: Brain, desc: 'Merging multi-agent findings and resolving conflicts' },
  { id: 7, label: 'AI Review Ready', icon: CheckCircle2, desc: 'Compiling final production report' },
]

export function AgentLoader() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate steps progress
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 2500)

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 98) {
          return prev + 0.5
        }
        return prev
      })
    }, 120)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500 rounded-full filter blur-[80px] opacity-20 animate-pulse"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500 rounded-full filter blur-[80px] opacity-10 animate-pulse delay-500"></div>

      <div className="flex flex-col items-center text-center mb-8 relative z-10">
        {/* Glowing brain animation */}
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-purple-500/20 rounded-full filter blur-md animate-ping"></div>
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white tracking-wide">
          Running CodeSentry AI Agent Graph
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-md">
          A team of specialized AI agents is reviewing your code. This takes about 10-15 seconds.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 relative z-10">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Overall Analysis Progress</span>
          <span className="font-semibold text-purple-400">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4 relative z-10">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const Icon = step.icon

          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-3.5 rounded-xl border transition-all duration-300 ${
                isActive
                  ? 'bg-purple-950/20 border-purple-500/30 shadow-sm'
                  : 'bg-slate-950/20 border-slate-900/50'
              }`}
            >
              <div className="mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-slate-700 shrink-0" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-purple-400 animate-pulse' : isCompleted ? 'text-emerald-400/80' : 'text-slate-600'
                    }`}
                  />
                  <h3
                    className={`text-sm font-semibold truncate ${
                      isActive ? 'text-purple-300 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </h3>
                </div>
                <p
                  className={`text-xs mt-0.5 truncate ${
                    isActive ? 'text-purple-400/70' : 'text-slate-500'
                  }`}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
