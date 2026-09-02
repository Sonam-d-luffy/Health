import React from 'react'
import assets from '../assets/assets'

const Bg = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* ================= BACKGROUND VIDEO ================= */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="fixed inset-0 h-full w-full object-cover"
      >
        <source src={assets.bg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* ================= DARK OVERLAY ================= */}
      <div className="fixed inset-0 bg-black/60 pointer-events-none" />

      {/* ================= CONTENT ================= */}
      <div className="relative z-10">
        {children}
      </div>

    </div>
  )
}

export default Bg