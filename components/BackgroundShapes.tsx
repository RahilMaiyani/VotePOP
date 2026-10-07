import React from 'react';

export const BackgroundShapes: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none max-w-full w-full h-full"
    >
      {/* Light subtle geometric dot grid */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#000000 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Left: Overlapping Lime Pill + Hot Coral Square */}
      <div className="absolute top-2 left-2 sm:top-6 sm:left-8 animate-float-slow opacity-85 pointer-events-none">
        <div className="relative">
          <div className="w-16 h-8 sm:w-24 sm:h-12 bg-[#CEFF00] border-[2.5px] border-black rounded-full shadow-[3px_3px_0px_#000] rotate-[-15deg]" />
          <div className="absolute top-2 left-8 sm:left-12 w-8 h-8 sm:w-10 sm:h-10 bg-[#FF5533] border-[2px] border-black rounded-xl shadow-[2px_2px_0px_#000] rotate-[32deg] animate-spin-slow" />
        </div>
      </div>

      {/* Top Right: Cyber Cyan Star & Canary Yellow Donut Ring */}
      <div className="absolute top-4 right-2 sm:top-10 sm:right-10 animate-float-reverse opacity-85 pointer-events-none">
        <div className="relative">
          <svg width="48" height="48" viewBox="0 0 64 64" className="w-9 h-9 sm:w-14 sm:h-14 drop-shadow-[2.5px_2.5px_0px_#000]">
            <path
              d="M32 0 L39 25 L64 32 L39 39 L32 64 L25 39 L0 32 L25 25 Z"
              fill="#00E5FF"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          <div className="absolute -bottom-3 -left-3 w-7 h-7 sm:w-10 sm:h-10 bg-[#FFE600] border-[2px] border-black rounded-full shadow-[2px_2px_0px_#000] flex items-center justify-center">
            <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 bg-white border-[1.5px] border-black rounded-full" />
          </div>
        </div>
      </div>

      {/* Middle Left: Bubblegum Pink Diamond */}
      <div className="absolute top-[45%] left-3 animate-float-slow opacity-80 hidden sm:block pointer-events-none">
        <div className="w-12 h-12 bg-[#FF6EA7] border-[2px] border-black rotate-45 shadow-[3px_3px_0px_#000]" />
      </div>

      {/* Middle Right: Vivid Purple Cross */}
      <div className="absolute top-[52%] right-3 animate-float-reverse opacity-80 hidden sm:block pointer-events-none">
        <div className="w-10 h-10 bg-[#A78BFA] border-[2px] border-black rounded-xl rotate-12 shadow-[3px_3px_0px_#000] flex items-center justify-center font-black text-lg text-black">
          +
        </div>
      </div>

      {/* Bottom Left: Half-Moon */}
      <div className="absolute bottom-6 left-2 sm:bottom-12 sm:left-12 animate-float-reverse opacity-85 pointer-events-none">
        <div className="relative">
          <div className="w-12 h-6 sm:w-18 sm:h-9 bg-[#FFE600] border-[2px] border-black rounded-t-full shadow-[2.5px_2.5px_0px_#000] rotate-[-20deg]" />
          <div className="absolute -bottom-1 right-1 w-5 h-5 bg-[#00E5FF] border-[1.5px] border-black rounded-full shadow-[1.5px_1.5px_0px_#000]" />
        </div>
      </div>

      {/* Bottom Right: Lime & Coral Blocks */}
      <div className="absolute bottom-4 right-2 sm:bottom-8 sm:right-10 animate-float-slow opacity-85 pointer-events-none">
        <div className="relative">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#FF5533] border-[2px] border-black rounded-2xl rotate-[15deg] shadow-[3px_3px_0px_#000]" />
          <div className="absolute -top-2 -left-2 w-6 h-6 sm:w-8 sm:h-8 bg-[#CEFF00] border-[1.5px] border-black rounded-lg -rotate-12 shadow-[2px_2px_0px_#000]" />
        </div>
      </div>
    </div>
  );
};