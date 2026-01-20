import React from "react";

const WellnessHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 600 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for soft, premium look */}
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FDE68A" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="sunRays" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CFFAFE" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#A5F3FC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0.7" />
          </linearGradient>

          <linearGradient id="handsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FECACA" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#FCA5A5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="plantGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#4ADE80" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#22C55E" stopOpacity="0.7" />
          </linearGradient>

          {/* Filters for soft glows */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="waterReflection" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.5 0" />
          </filter>
        </defs>

        {/* Background soft gradient circle */}
        <circle cx="300" cy="400" r="350" fill="url(#sunRays)" opacity="0.3" />

        {/* Sunrise at the top - Hope and Healing */}
        <g className="sunrise-group">
          {/* Sun rays spreading downward */}
          <g opacity="0.4">
            <line x1="300" y1="120" x2="300" y2="250" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" />
            <line x1="300" y1="120" x2="240" y2="230" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="300" y1="120" x2="360" y2="230" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="300" y1="120" x2="200" y2="210" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="300" y1="120" x2="400" y2="210" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="300" y1="120" x2="180" y2="200" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="300" y1="120" x2="420" y2="200" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Sun circle with soft glow */}
          <circle cx="300" cy="120" r="55" fill="url(#sunGradient)" filter="url(#softGlow)" />
          <circle cx="300" cy="120" r="45" fill="#FEF3C7" opacity="0.9" />
          <circle cx="300" cy="120" r="35" fill="#FFFBEB" opacity="0.8" />
        </g>

        {/* Left plant - Recovery, Growth, Well-being */}
        <g className="left-plant" transform="translate(80, 580)">
          {/* Stem */}
          <path
            d="M 0 80 Q -5 60 0 40 Q 5 20 0 0"
            stroke="url(#plantGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaves */}
          <ellipse cx="-12" cy="60" rx="16" ry="24" fill="#86EFAC" opacity="0.8" transform="rotate(-30 -12 60)" />
          <ellipse cx="12" cy="50" rx="14" ry="22" fill="#4ADE80" opacity="0.85" transform="rotate(25 12 50)" />
          <ellipse cx="-10" cy="35" rx="15" ry="23" fill="#86EFAC" opacity="0.75" transform="rotate(-35 -10 35)" />
          <ellipse cx="14" cy="25" rx="16" ry="24" fill="#22C55E" opacity="0.8" transform="rotate(30 14 25)" />

          {/* Flowers */}
          <g transform="translate(0, 10)">
            <circle cx="0" cy="0" r="7" fill="#FCA5A5" opacity="0.9" />
            <circle cx="-4" cy="-2" r="5" fill="#FCD34D" opacity="0.85" />
            <circle cx="4" cy="-2" r="5" fill="#FCD34D" opacity="0.85" />
            <circle cx="-3" cy="3" r="4.5" fill="#FBBF24" opacity="0.8" />
            <circle cx="3" cy="3" r="4.5" fill="#FBBF24" opacity="0.8" />
          </g>

          {/* Small fruits */}
          <circle cx="-8" cy="45" r="5" fill="#F87171" opacity="0.85" />
          <circle cx="10" cy="15" r="4.5" fill="#FB923C" opacity="0.8" />
        </g>

        {/* Right plant - Symmetrical balance */}
        <g className="right-plant" transform="translate(520, 580) scale(-1, 1)">
          {/* Stem */}
          <path
            d="M 0 80 Q -5 60 0 40 Q 5 20 0 0"
            stroke="url(#plantGradient)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Leaves */}
          <ellipse cx="-12" cy="60" rx="16" ry="24" fill="#86EFAC" opacity="0.8" transform="rotate(-30 -12 60)" />
          <ellipse cx="12" cy="50" rx="14" ry="22" fill="#4ADE80" opacity="0.85" transform="rotate(25 12 50)" />
          <ellipse cx="-10" cy="35" rx="15" ry="23" fill="#86EFAC" opacity="0.75" transform="rotate(-35 -10 35)" />
          <ellipse cx="14" cy="25" rx="16" ry="24" fill="#22C55E" opacity="0.8" transform="rotate(30 14 25)" />

          {/* Flowers */}
          <g transform="translate(0, 10)">
            <circle cx="0" cy="0" r="7" fill="#FCA5A5" opacity="0.9" />
            <circle cx="-4" cy="-2" r="5" fill="#FCD34D" opacity="0.85" />
            <circle cx="4" cy="-2" r="5" fill="#FCD34D" opacity="0.85" />
            <circle cx="-3" cy="3" r="4.5" fill="#FBBF24" opacity="0.8" />
            <circle cx="3" cy="3" r="4.5" fill="#FBBF24" opacity="0.8" />
          </g>

          {/* Small fruits */}
          <circle cx="-8" cy="45" r="5" fill="#F87171" opacity="0.85" />
          <circle cx="10" cy="15" r="4.5" fill="#FB923C" opacity="0.8" />
        </g>

        {/* Center hands holding - Support, Safety, Connection */}
        <g className="hands-group" transform="translate(300, 380)" filter="url(#softGlow)">
          {/* Soft glow background circle */}
          <circle cx="0" cy="0" r="90" fill="#FECACA" opacity="0.2" />
          <circle cx="0" cy="0" r="70" fill="#FCA5A5" opacity="0.15" />

          {/* Left hand */}
          <g transform="translate(-35, 0)">
            {/* Palm */}
            <ellipse cx="0" cy="0" rx="28" ry="38" fill="url(#handsGradient)" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="24" ry="34" fill="#FEE2E2" opacity="0.8" />

            {/* Fingers */}
            <ellipse cx="-15" cy="-25" rx="8" ry="22" fill="#FECACA" opacity="0.85" transform="rotate(-15 -15 -25)" />
            <ellipse cx="-8" cy="-30" rx="7" ry="24" fill="#FCA5A5" opacity="0.9" transform="rotate(-5 -8 -30)" />
            <ellipse cx="0" cy="-32" rx="7" ry="26" fill="#FCA5A5" opacity="0.9" />
            <ellipse cx="8" cy="-30" rx="7" ry="24" fill="#FECACA" opacity="0.85" transform="rotate(5 8 -30)" />
            <ellipse cx="15" cy="-25" rx="7" ry="20" fill="#FEE2E2" opacity="0.8" transform="rotate(12 15 -25)" />

            {/* Thumb */}
            <ellipse cx="-20" cy="8" rx="10" ry="20" fill="#FCA5A5" opacity="0.85" transform="rotate(-45 -20 8)" />
          </g>

          {/* Right hand */}
          <g transform="translate(35, 0)">
            {/* Palm */}
            <ellipse cx="0" cy="0" rx="28" ry="38" fill="url(#handsGradient)" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="24" ry="34" fill="#FEE2E2" opacity="0.8" />

            {/* Fingers */}
            <ellipse cx="15" cy="-25" rx="8" ry="22" fill="#FECACA" opacity="0.85" transform="rotate(15 15 -25)" />
            <ellipse cx="8" cy="-30" rx="7" ry="24" fill="#FCA5A5" opacity="0.9" transform="rotate(5 8 -30)" />
            <ellipse cx="0" cy="-32" rx="7" ry="26" fill="#FCA5A5" opacity="0.9" />
            <ellipse cx="-8" cy="-30" rx="7" ry="24" fill="#FECACA" opacity="0.85" transform="rotate(-5 -8 -30)" />
            <ellipse cx="-15" cy="-25" rx="7" ry="20" fill="#FEE2E2" opacity="0.8" transform="rotate(-12 -15 -25)" />

            {/* Thumb */}
            <ellipse cx="20" cy="8" rx="10" ry="20" fill="#FCA5A5" opacity="0.85" transform="rotate(45 20 8)" />
          </g>

          {/* Connection symbol - small heart in center */}
          <g transform="translate(0, 5)">
            <path
              d="M 0 8 C -3 5 -8 3 -10 -2 C -12 -7 -10 -12 -5 -12 C -2 -12 0 -10 0 -10 C 0 -10 2 -12 5 -12 C 10 -12 12 -7 10 -2 C 8 3 3 5 0 8 Z"
              fill="#F87171"
              opacity="0.7"
            />
          </g>
        </g>

        {/* Water flow at the bottom - Calm and Emotional Stability */}
        <g className="water-group" filter="url(#waterReflection)">
          {/* Flowing water waves */}
          <path
            d="M 0 680 Q 75 670 150 680 T 300 680 T 450 680 T 600 680 L 600 800 L 0 800 Z"
            fill="url(#waterGradient)"
            opacity="0.6"
          />
          <path
            d="M 0 700 Q 75 690 150 700 T 300 700 T 450 700 T 600 700 L 600 800 L 0 800 Z"
            fill="#A5F3FC"
            opacity="0.5"
          />
          <path
            d="M 0 720 Q 60 710 120 720 T 240 720 T 360 720 T 480 720 T 600 720 L 600 800 L 0 800 Z"
            fill="#CFFAFE"
            opacity="0.4"
          />

          {/* Water ripples */}
          <ellipse cx="150" cy="710" rx="30" ry="8" fill="#E0F2FE" opacity="0.3" />
          <ellipse cx="350" cy="705" rx="25" ry="7" fill="#E0F2FE" opacity="0.25" />
          <ellipse cx="480" cy="715" rx="28" ry="8" fill="#E0F2FE" opacity="0.28" />
        </g>

        {/* Decorative ambient circles for depth */}
        <circle cx="130" cy="300" r="40" fill="#E9D5FF" opacity="0.15" filter="url(#softGlow)" />
        <circle cx="470" cy="500" r="50" fill="#D1FAE5" opacity="0.12" filter="url(#softGlow)" />
        <circle cx="100" cy="500" r="35" fill="#DBEAFE" opacity="0.13" filter="url(#softGlow)" />
        <circle cx="500" cy="320" r="45" fill="#FCE7F3" opacity="0.14" filter="url(#softGlow)" />
      </svg>
    </div>
  );
};

export default WellnessHeroIllustration;
