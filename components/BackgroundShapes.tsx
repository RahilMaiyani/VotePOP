import React from 'react';

export const BackgroundShapes: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none"
    >
      {/* Light subtle geometric dot grid */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage: 'radial-gradient(#000000 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Left: Overlapping Lime Pill + Hot Coral Asterisk */}
      <div className="absolute -top-6 -left-6 md:top-6 md:left-8 animate-float-slow opacity-85">
        <div className="relative">
          <div className="w-20 h-10 md:w-28 md:h-14 bg-[#CEFF00] border-[2.5px] border-black rounded-full shadow-[4px_4px_0px_#000] rotate-[-18deg]" />
          <div className="absolute top-4 left-10 md:left-14 w-10 h-10 md:w-12 md:h-12 bg-[#FF5533] border-[2.5px] border-black rounded-xl shadow-[3px_3px_0px_#000] rotate-[32deg] animate-spin-slow" />
        </div>
      </div>

      {/* Top Right: Cyber Cyan Star & Canary Yellow Donut Ring */}
      <div className="absolute top-12 -right-4 md:top-14 md:right-12 animate-float-reverse opacity-85">
        <div className="relative">
          {/* 4-point Star */}
          <svg width="64" height="64" viewBox="0 0 64 64" className="w-12 h-12 md:w-16 md:h-16 drop-shadow-[3px_3px_0px_#000]">
            <path
              d="M32 0 L39 25 L64 32 L39 39 L32 64 L25 39 L0 32 L25 25 Z"
              fill="#00E5FF"
              stroke="#000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
          {/* Yellow Donut */}
          <div className="absolute -bottom-6 -left-6 w-9 h-9 md:w-12 md:h-12 bg-[#FFE600] border-[2.5px] border-black rounded-full shadow-[2.5px_2.5px_0px_#000] flex items-center justify-center">
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-white border-[2px] border-black rounded-full" />
          </div>
        </div>
      </div>

      {/* Middle Left: Bubblegum Pink Diamond + Electric Lime Squiggle */}
      <div className="absolute top-[42%] -left-8 md:left-10 animate-float-slow opacity-80 hidden sm:block">
        <div className="w-14 h-14 md:w-16 md:h-16 bg-[#FF6EA7] border-[2.5px] border-black rotate-45 shadow-[3.5px_3.5px_0px_#000]" />
        <div className="w-10 h-4 bg-[#CEFF00] border-[2px] border-black rounded-full shadow-[2px_2px_0px_#000] -rotate-12 -mt-3 ml-6" />
      </div>

      {/* Middle Right: Vivid Purple Cross / Plus shape */}
      <div className="absolute top-[50%] -right-4 md:right-8 animate-float-reverse opacity-80 hidden sm:block">
        <div className="relative">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-[#A78BFA] border-[2.5px] border-black rounded-2xl rotate-12 shadow-[4px_4px_0px_#000] flex items-center justify-center font-black text-xl text-black">
            +
          </div>
        </div>
      </div>

      {/* Bottom Left: Electric Sun / Half-Moon with Black Border */}
      <div className="absolute bottom-10 -left-6 md:bottom-16 md:left-16 animate-float-reverse opacity-85">
        <div className="relative">
          <div className="w-16 h-8 md:w-22 md:h-11 bg-[#FFE600] border-[2.5px] border-black rounded-t-full shadow-[3.5px_3.5px_0px_#000] rotate-[-25deg]" />
          <div className="absolute -bottom-2 right-1 w-6 h-6 md:w-8 md:h-8 bg-[#00E5FF] border-[2px] border-black rounded-full shadow-[2px_2px_0px_#000]" />
        </div>
      </div>

      {/* Bottom Right: Overlapping Hot Coral & Lime Blocks */}
      <div className="absolute -bottom-8 -right-8 md:bottom-8 md:right-16 animate-float-slow opacity-85">
        <div className="relative">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-[#FF5533] border-[2.5px] border-black rounded-3xl rotate-[18deg] shadow-[4px_4px_0px_#000]" />
          <div className="absolute -top-3 -left-3 w-8 h-8 md:w-10 md:h-10 bg-[#CEFF00] border-[2.5px] border-black rounded-xl -rotate-12 shadow-[2.5px_2.5px_0px_#000]" />
        </div>
      </div>
    </div>
  );
};
