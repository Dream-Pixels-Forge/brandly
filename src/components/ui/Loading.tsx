import { motion } from 'motion/react';

const LOADING_PHRASES = [
  "ANALYZING_INPUT_STRUCTURE",
  "IDENTIFYING_VISUAL_AXIS",
  "SYNTHESIZING_TYPOGRAPHIC_HIERARCHY",
  "CALIBRATING_PALETTE_HARMONICS",
  "ANCHORING_GRID_SYSTEMS",
  "GENERATING_MANIFEST_ARTIFACTS"
];

export function Loading() {
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center p-6 touch-none select-none"
      style={{ opacity: 1, visibility: 'visible' }}
    >
      {/* Structural Corner Marks - Non-animated for stability */}
      <div className="absolute top-12 left-12 w-8 h-8 border-t-2 border-l-2 border-zinc-900 z-20" />
      <div className="absolute top-12 right-12 w-8 h-8 border-t-2 border-r-2 border-zinc-900 z-20" />
      <div className="absolute bottom-12 left-12 w-8 h-8 border-b-2 border-l-2 border-zinc-900 z-20" />
      <div className="absolute bottom-12 right-12 w-8 h-8 border-b-2 border-r-2 border-zinc-900 z-20" />

      {/* Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <div className="w-full max-w-sm space-y-16 relative z-10 flex flex-col items-center text-center">
        {/* Rhythmic Geometric Animation - Optimized for immediate paint */}
        <div className="flex justify-center items-end h-20 gap-1.5 w-full">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-zinc-900 origin-bottom"
              animate={{ 
                height: [6, 80, 6],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.05
              }}
              style={{ height: 6 }}
            />
          ))}
        </div>

        <div className="w-full space-y-6">
          <div className="flex justify-between items-baseline border-b border-zinc-900 pb-3">
            <span className="text-[11px] font-black tracking-[0.5em] uppercase text-zinc-400">System_Phase</span>
            <span className="text-[11px] font-black uppercase text-zinc-900 bg-zinc-100 px-3 py-1">Active_Synthesis</span>
          </div>
          
          <div className="h-8 overflow-hidden relative">
            <motion.div
              animate={{ y: ["0%", "-100%", "-200%", "-300%", "-400%", "-500%"] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
              className="flex flex-col"
            >
              {LOADING_PHRASES.map((phrase) => (
                <div key={phrase} className="h-8 flex items-center justify-center">
                  <span className="text-2xl font-black italic tracking-tighter uppercase text-zinc-900">
                    {phrase}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 tracking-[0.3em] pt-4 font-bold">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-zinc-900 animate-pulse" />
              AXIS_09_PROC
            </span>
            <span>BUILD_V5.0.1</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-24 w-full flex justify-center text-[10px] font-black tracking-[0.6em] text-zinc-200 uppercase pointer-events-none">
        Architectural Consciousness Emerging
      </div>
    </div>
  );
}
