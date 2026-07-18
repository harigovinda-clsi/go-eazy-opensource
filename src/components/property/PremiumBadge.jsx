import React from 'react'
import { Rocket } from 'lucide-react'

// Accent border wrapper component to frame premium listings with an elegant gradient glow
export const PremiumCardWrapper = ({ isPremium, children }) => {
  if (!isPremium) return <>{children}</>

  return (
    <div className="relative p-[2px] rounded-2xl bg-gradient-to-br from-[#CA3433] via-[#ff6b6b] to-amber-500 shadow-lg shadow-red-500/10 hover:shadow-xl hover:shadow-red-500/20 transition-all duration-300 group/premium h-full">
      {/* Dynamic ambient backdrop aura */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#CA3433] to-amber-500 opacity-20 blur-md rounded-2xl group-hover/premium:opacity-30 transition-opacity pointer-events-none" />
      
      {/* Inner containment card body mapping cleanly back to application backgrounds */}
      <div className="bg-white rounded-[14px] overflow-hidden h-full">
        {children}
      </div>
    </div>
  )
}

// Crisp, high-impact floating badge overlay for property cards and detail viewports
export const PremiumBadge = ({ size = 'sm' }) => {
  const isLarge = size === 'lg'
  
  return (
    <div className={`
      flex items-center gap-1 font-bold tracking-wide uppercase shadow-sm select-none animate-fade-in
      bg-gradient-to-r from-[#CA3433] to-[#e63946] text-white
      ${isLarge ? 'px-3 py-1.5 text-xs rounded-lg' : 'px-2 py-0.5 text-[9px] rounded-md'}
    `}>
      <Rocket size={isLarge ? 14 : 10} className="animate-pulse" />
      <span>Premium</span>
    </div>
  )
}
