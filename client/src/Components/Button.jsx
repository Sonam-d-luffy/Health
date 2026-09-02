// Button.jsx
const Button = ({ type = "button", text, onClick, disabled }) => (
  <button
    type={type}  // ✅ must be here
    onClick={onClick}
    disabled={disabled}
    className={`
      relative px-4 py-3 sm:px-6 sm:py-4 md:px-8 md:py-4 
      bg-gradient-to-br from-magenta-200/35 via-fuchsia-200/30 to-pink-200/25
      backdrop-blur-2xl backdrop-saturate-200
      text-magenta-900 font-black text-sm sm:text-base md:text-lg tracking-wider
      rounded-[2.5rem] sm:rounded-[3rem] 
      border-2 border-magenta-300/70 
      shadow-[0_16px_50px_-6px_rgba(236,72,153,0.5),0_6px_20px_-3px_rgba(236,72,153,0.4)] 
      hover:shadow-[0_25px_70px_-6px_rgba(236,72,153,0.7),0_10px_40px_-3px_rgba(236,72,153,0.5)]
      hover:from-magenta-300/45 hover:via-fuchsia-300/40 hover:to-pink-300/35
      hover:border-magenta-400/80
      hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2
      active:scale-95 sm:active:scale-100 active:translate-y-0
      transition-all duration-600 ease-out
      group overflow-hidden
      before:absolute before:inset-0 before:rounded-[2.5rem] sm:before:rounded-[3rem] 
      before:bg-gradient-to-br before:from-white/50 before:to-transparent 
      before:opacity-70
      ${disabled 
        ? 'opacity-60 cursor-not-allowed hover:scale-100 hover:translate-y-0 hover:from-magenta-200/35 hover:via-fuchsia-200/30 hover:to-pink-200/25' 
        : 'hover:ring-2 sm:hover:ring-4 hover:ring-magenta-300/50 hover:ring-offset-2 hover:ring-offset-white/30'
      }
    `}
  >
    {/* Magenta Aurora Shimmer Effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-magenta-400/50 via-fuchsia-400/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-2000 ease-out"></div>
    
    {/* Enhanced Floating Sparkles */}
    <div className="absolute top-1 left-2 sm:left-3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-magenta-500/70 rounded-full blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:animate-pulse"></div>
    <div className="absolute top-2 sm:top-3 right-3 sm:right-4 w-2 h-2 sm:w-3 sm:h-3 bg-fuchsia-400/60 rounded-full blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-900 group-hover:animate-bounce"></div>
    <div className="absolute bottom-1.5 sm:bottom-2 left-4 sm:left-6 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-500/70 rounded-full blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-600"></div>
    <div className="absolute bottom-2 sm:bottom-3 right-2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-magenta-300/50 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-800"></div>
    
    {/* Additional Mobile Sparkles */}
    <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-fuchsia-600/60 rounded-full blur-[0.5px] opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:animate-ping"></div>
    <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-pink-400/50 rounded-full blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-1200"></div>
    
    {/* Enhanced Glass Reflection */}
    <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent rounded-t-[2.5rem] sm:rounded-t-[3rem]"></div>
    
    {/* Mobile-Optimized Micro Interactions */}
    <div className="absolute inset-2 bg-gradient-to-r from-magenta-100/10 via-fuchsia-100/5 to-pink-100/10 rounded-[2rem] sm:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    
    {/* Text Content with Enhanced Styling */}
    <span className="relative z-10 bg-gradient-to-r from-magenta-900 via-fuchsia-800 to-magenta-900 bg-clip-text text-transparent font-black drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_3px_10px_rgba(255,255,255,0.6)] transition-all duration-300">
      {text}
    </span>
    
    {/* Inner Magenta Ethereal Glow */}
    <div className="absolute inset-1 bg-gradient-to-br from-magenta-200/25 via-fuchsia-200/20 to-pink-200/15 rounded-[2rem] sm:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-800"></div>
    
    {/* Outer Atmospheric Glow - Responsive */}
    <div className="absolute -inset-2 sm:-inset-3 bg-gradient-to-br from-magenta-500/20 via-fuchsia-500/15 to-pink-500/10 rounded-[3rem] sm:rounded-[3.5rem] blur-lg sm:blur-xl opacity-0 group-hover:opacity-60 transition-all duration-1200 -z-10"></div>
    
    {/* Pulsing Border Effect */}
    <div className="absolute -inset-1 bg-gradient-to-r from-magenta-400/30 via-fuchsia-400/25 to-pink-400/30 rounded-[3rem] sm:rounded-[3.5rem] blur-md opacity-0 group-hover:opacity-40 group-hover:animate-pulse transition-all duration-1000 -z-20"></div>
    
    {/* Mobile Touch Feedback */}
    <div className="absolute inset-0 bg-magenta-400/10 rounded-[2.5rem] sm:rounded-[3rem] opacity-0 active:opacity-100 transition-opacity duration-150 pointer-events-none"></div>
  </button>
)

export default Button