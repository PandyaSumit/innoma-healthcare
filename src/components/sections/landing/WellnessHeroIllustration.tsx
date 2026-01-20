import React from "react";

const WellnessHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes gentleGlow {
          0%, 100% { opacity: 0.9; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes sunRaysPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }

        @keyframes waterFlow {
          0% { transform: translateX(0); }
          100% { transform: translateX(-150px); }
        }

        @keyframes waterRipple {
          0%, 100% { transform: scale(1) translateY(0); opacity: 0.3; }
          50% { transform: scale(1.2) translateY(-2px); opacity: 0.15; }
        }

        @keyframes handsBreathing {
          0%, 100% { transform: translate(300px, 380px) scale(1); }
          50% { transform: translate(300px, 380px) scale(1.02); }
        }

        @keyframes heartBeat {
          0%, 100% { transform: translate(0, 5px) scale(1); }
          25% { transform: translate(0, 5px) scale(1.1); }
          50% { transform: translate(0, 5px) scale(1); }
        }

        @keyframes plantSway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg); }
        }

        @keyframes leafFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes ambientFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.12; }
          50% { transform: translateY(-10px) scale(1.1); opacity: 0.18; }
        }

        .sun-glow {
          animation: gentleGlow 4s ease-in-out infinite;
        }

        .sun-rays {
          animation: sunRaysPulse 3s ease-in-out infinite;
        }

        .water-group path:nth-child(1) {
          animation: waterFlow 20s linear infinite;
        }

        .water-group path:nth-child(2) {
          animation: waterFlow 25s linear infinite;
        }

        .water-group path:nth-child(3) {
          animation: waterFlow 30s linear infinite;
        }

        .water-ripple {
          animation: waterRipple 3s ease-in-out infinite;
        }

        .hands-group {
          animation: handsBreathing 4s ease-in-out infinite;
        }

        .heart-symbol {
          animation: heartBeat 2s ease-in-out infinite;
        }

        .left-plant, .right-plant {
          transform-origin: bottom center;
          animation: plantSway 4s ease-in-out infinite;
        }

        .plant-leaf {
          animation: leafFloat 3s ease-in-out infinite;
        }

        .ambient-circle {
          animation: ambientFloat 6s ease-in-out infinite;
        }
      `}</style>

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

          {/* Pattern for continuous water flow */}
          <pattern id="waterPattern" x="0" y="0" width="300" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M 0 60 Q 37.5 50 75 60 T 150 60 T 225 60 T 300 60"
              stroke="#A5F3FC"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
          </pattern>
        </defs>

        {/* Background soft gradient circle */}
        <circle cx="300" cy="400" r="350" fill="url(#sunRays)" className="sun-rays" />

        {/* Sunrise at the top - Hope and Healing */}
        <g className="sunrise-group">
          {/* Sun rays spreading downward */}
          <g opacity="0.4" className="sun-rays">
            <line x1="300" y1="120" x2="300" y2="280" stroke="#FBBF24" strokeWidth="4" strokeLinecap="round" />
            <line x1="300" y1="120" x2="220" y2="250" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="300" y1="120" x2="380" y2="250" stroke="#FBBF24" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <line x1="300" y1="120" x2="180" y2="220" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="300" y1="120" x2="420" y2="220" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            <line x1="300" y1="120" x2="150" y2="200" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="300" y1="120" x2="450" y2="200" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
          </g>

          {/* Sun circle with soft glow */}
          <circle cx="300" cy="120" r="60" fill="url(#sunGradient)" filter="url(#softGlow)" className="sun-glow" />
          <circle cx="300" cy="120" r="48" fill="#FEF3C7" opacity="0.9" className="sun-glow" />
          <circle cx="300" cy="120" r="36" fill="#FFFBEB" opacity="0.8" />
        </g>

        {/* Left plant - Recovery, Growth, Well-being */}
        <g className="left-plant" style={{ transformOrigin: "80px 660px" }}>
          <g transform="translate(80, 580)">
            {/* Stem */}
            <path
              d="M 0 80 Q -5 60 0 40 Q 5 20 0 0"
              stroke="url(#plantGradient)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Leaves with float animation */}
            <ellipse cx="-12" cy="60" rx="18" ry="26" fill="#86EFAC" opacity="0.8" transform="rotate(-30 -12 60)" className="plant-leaf" style={{ animationDelay: "0s" }} />
            <ellipse cx="12" cy="50" rx="16" ry="24" fill="#4ADE80" opacity="0.85" transform="rotate(25 12 50)" className="plant-leaf" style={{ animationDelay: "0.5s" }} />
            <ellipse cx="-10" cy="35" rx="17" ry="25" fill="#86EFAC" opacity="0.75" transform="rotate(-35 -10 35)" className="plant-leaf" style={{ animationDelay: "1s" }} />
            <ellipse cx="14" cy="25" rx="18" ry="26" fill="#22C55E" opacity="0.8" transform="rotate(30 14 25)" className="plant-leaf" style={{ animationDelay: "1.5s" }} />

            {/* Flowers */}
            <g transform="translate(0, 10)">
              <circle cx="0" cy="0" r="8" fill="#FCA5A5" opacity="0.9" />
              <circle cx="-5" cy="-2" r="6" fill="#FCD34D" opacity="0.85" />
              <circle cx="5" cy="-2" r="6" fill="#FCD34D" opacity="0.85" />
              <circle cx="-3" cy="3" r="5" fill="#FBBF24" opacity="0.8" />
              <circle cx="3" cy="3" r="5" fill="#FBBF24" opacity="0.8" />
            </g>

            {/* Small fruits */}
            <circle cx="-8" cy="45" r="6" fill="#F87171" opacity="0.85" />
            <circle cx="10" cy="15" r="5" fill="#FB923C" opacity="0.8" />
          </g>
        </g>

        {/* Right plant - Symmetrical balance */}
        <g className="right-plant" style={{ transformOrigin: "520px 660px" }}>
          <g transform="translate(520, 580) scale(-1, 1)">
            {/* Stem */}
            <path
              d="M 0 80 Q -5 60 0 40 Q 5 20 0 0"
              stroke="url(#plantGradient)"
              strokeWidth="5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Leaves */}
            <ellipse cx="-12" cy="60" rx="18" ry="26" fill="#86EFAC" opacity="0.8" transform="rotate(-30 -12 60)" className="plant-leaf" style={{ animationDelay: "0.3s" }} />
            <ellipse cx="12" cy="50" rx="16" ry="24" fill="#4ADE80" opacity="0.85" transform="rotate(25 12 50)" className="plant-leaf" style={{ animationDelay: "0.8s" }} />
            <ellipse cx="-10" cy="35" rx="17" ry="25" fill="#86EFAC" opacity="0.75" transform="rotate(-35 -10 35)" className="plant-leaf" style={{ animationDelay: "1.3s" }} />
            <ellipse cx="14" cy="25" rx="18" ry="26" fill="#22C55E" opacity="0.8" transform="rotate(30 14 25)" className="plant-leaf" style={{ animationDelay: "1.8s" }} />

            {/* Flowers */}
            <g transform="translate(0, 10)">
              <circle cx="0" cy="0" r="8" fill="#FCA5A5" opacity="0.9" />
              <circle cx="-5" cy="-2" r="6" fill="#FCD34D" opacity="0.85" />
              <circle cx="5" cy="-2" r="6" fill="#FCD34D" opacity="0.85" />
              <circle cx="-3" cy="3" r="5" fill="#FBBF24" opacity="0.8" />
              <circle cx="3" cy="3" r="5" fill="#FBBF24" opacity="0.8" />
            </g>

            {/* Small fruits */}
            <circle cx="-8" cy="45" r="6" fill="#F87171" opacity="0.85" />
            <circle cx="10" cy="15" r="5" fill="#FB923C" opacity="0.8" />
          </g>
        </g>

        {/* Center hands holding - Support, Safety, Connection */}
        <g className="hands-group" filter="url(#softGlow)">
          {/* Soft glow background circle */}
          <circle cx="0" cy="0" r="95" fill="#FECACA" opacity="0.2" />
          <circle cx="0" cy="0" r="75" fill="#FCA5A5" opacity="0.15" />

          {/* Left hand */}
          <g transform="translate(-35, 0)">
            {/* Palm */}
            <ellipse cx="0" cy="0" rx="30" ry="40" fill="url(#handsGradient)" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="26" ry="36" fill="#FEE2E2" opacity="0.8" />

            {/* Fingers */}
            <ellipse cx="-15" cy="-28" rx="9" ry="24" fill="#FECACA" opacity="0.85" transform="rotate(-15 -15 -28)" />
            <ellipse cx="-8" cy="-33" rx="8" ry="26" fill="#FCA5A5" opacity="0.9" transform="rotate(-5 -8 -33)" />
            <ellipse cx="0" cy="-35" rx="8" ry="28" fill="#FCA5A5" opacity="0.9" />
            <ellipse cx="8" cy="-33" rx="8" ry="26" fill="#FECACA" opacity="0.85" transform="rotate(5 8 -33)" />
            <ellipse cx="15" cy="-28" rx="8" ry="22" fill="#FEE2E2" opacity="0.8" transform="rotate(12 15 -28)" />

            {/* Thumb */}
            <ellipse cx="-22" cy="8" rx="11" ry="22" fill="#FCA5A5" opacity="0.85" transform="rotate(-45 -22 8)" />
          </g>

          {/* Right hand */}
          <g transform="translate(35, 0)">
            {/* Palm */}
            <ellipse cx="0" cy="0" rx="30" ry="40" fill="url(#handsGradient)" opacity="0.9" />
            <ellipse cx="0" cy="0" rx="26" ry="36" fill="#FEE2E2" opacity="0.8" />

            {/* Fingers */}
            <ellipse cx="15" cy="-28" rx="9" ry="24" fill="#FECACA" opacity="0.85" transform="rotate(15 15 -28)" />
            <ellipse cx="8" cy="-33" rx="8" ry="26" fill="#FCA5A5" opacity="0.9" transform="rotate(5 8 -33)" />
            <ellipse cx="0" cy="-35" rx="8" ry="28" fill="#FCA5A5" opacity="0.9" />
            <ellipse cx="-8" cy="-33" rx="8" ry="26" fill="#FECACA" opacity="0.85" transform="rotate(-5 -8 -33)" />
            <ellipse cx="-15" cy="-28" rx="8" ry="22" fill="#FEE2E2" opacity="0.8" transform="rotate(-12 -15 -28)" />

            {/* Thumb */}
            <ellipse cx="22" cy="8" rx="11" ry="22" fill="#FCA5A5" opacity="0.85" transform="rotate(45 22 8)" />
          </g>

          {/* Connection symbol - small heart in center */}
          <g className="heart-symbol">
            <path
              d="M 0 10 C -4 6 -10 4 -12 -2 C -14 -8 -12 -14 -6 -14 C -2 -14 0 -11 0 -11 C 0 -11 2 -14 6 -14 C 12 -14 14 -8 12 -2 C 10 4 4 6 0 10 Z"
              fill="#F87171"
              opacity="0.8"
            />
          </g>
        </g>

        {/* Water flow at the bottom - Calm and Emotional Stability */}
        <g className="water-group" filter="url(#waterReflection)">
          {/* Flowing water waves */}
          <g>
            <path
              d="M -150 680 Q -75 670 0 680 T 150 680 T 300 680 T 450 680 T 600 680 T 750 680 L 750 800 L -150 800 Z"
              fill="url(#waterGradient)"
              opacity="0.6"
            />
            <path
              d="M -150 700 Q -75 690 0 700 T 150 700 T 300 700 T 450 700 T 600 700 T 750 700 L 750 800 L -150 800 Z"
              fill="#A5F3FC"
              opacity="0.5"
            />
            <path
              d="M -150 720 Q -90 710 -30 720 T 90 720 T 210 720 T 330 720 T 450 720 T 570 720 T 690 720 L 690 800 L -150 800 Z"
              fill="#CFFAFE"
              opacity="0.4"
            />
          </g>

          {/* Water ripples */}
          <ellipse cx="150" cy="710" rx="35" ry="10" fill="#E0F2FE" className="water-ripple" style={{ animationDelay: "0s" }} />
          <ellipse cx="350" cy="705" rx="30" ry="9" fill="#E0F2FE" className="water-ripple" style={{ animationDelay: "1s" }} />
          <ellipse cx="480" cy="715" rx="33" ry="10" fill="#E0F2FE" className="water-ripple" style={{ animationDelay: "2s" }} />
        </g>

        {/* Decorative ambient circles for depth */}
        <circle cx="130" cy="300" r="45" fill="#E9D5FF" className="ambient-circle" style={{ animationDelay: "0s" }} />
        <circle cx="470" cy="500" r="55" fill="#D1FAE5" className="ambient-circle" style={{ animationDelay: "2s" }} />
        <circle cx="100" cy="500" r="40" fill="#DBEAFE" className="ambient-circle" style={{ animationDelay: "4s" }} />
        <circle cx="500" cy="320" r="50" fill="#FCE7F3" className="ambient-circle" style={{ animationDelay: "3s" }} />
      </svg>
    </div>
  );
};

export default WellnessHeroIllustration;
