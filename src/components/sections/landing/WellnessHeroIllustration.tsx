import React from "react";
import Lottie from "lottie-react";

// Import Lottie animation files
import waterFlowAnimation from "../../../assets/animations/Water flow.json";
import sunAnimation from "../../../assets/animations/clear sun.json";
import handshakeAnimation from "../../../assets/animations/Handshake.json";
import plantAnimation from "../../../assets/animations/Animated plant loader..json";

const WellnessHeroIllustration: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Soft gradient background for warmth and calm */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/40 via-sky-50/30 to-blue-50/40 rounded-3xl" />

      {/* Sunrise at the top - Hope and Healing */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 md:w-80 md:h-80 opacity-90">
        <Lottie
          animationData={sunAnimation}
          loop={true}
          className="w-full h-full drop-shadow-[0_0_40px_rgba(251,191,36,0.3)]"
        />
        {/* Warm pastel light spreading downward */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[200%] h-64 bg-gradient-to-b from-amber-100/40 via-orange-50/20 to-transparent blur-2xl -z-10" />
      </div>

      {/* Center focal point - Hands holding (Support, Safety, Connection) */}
      <div className="relative z-10 w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
        {/* Soft glow around hands for emphasis */}
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-pink-50/20 to-transparent rounded-full blur-3xl" />

        <Lottie
          animationData={handshakeAnimation}
          loop={true}
          className="w-full h-full drop-shadow-[0_8px_32px_rgba(251,113,133,0.2)]"
        />
      </div>

      {/* Left side - Plant with flowers and fruits (Recovery, Growth, Well-being) */}
      <div className="absolute left-0 bottom-24 md:bottom-32 w-40 h-40 md:w-56 md:h-56 opacity-80">
        <Lottie
          animationData={plantAnimation}
          loop={true}
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(34,197,94,0.15)]"
        />
      </div>

      {/* Right side - Plant with flowers and fruits (Symmetrical balance) */}
      <div className="absolute right-0 bottom-24 md:bottom-32 w-40 h-40 md:w-56 md:h-56 opacity-80 scale-x-[-1]">
        <Lottie
          animationData={plantAnimation}
          loop={true}
          className="w-full h-full drop-shadow-[0_4px_16px_rgba(34,197,94,0.15)]"
        />
      </div>

      {/* Water flow at the bottom - Calm and Emotional Stability */}
      <div className="absolute bottom-0 left-0 right-0 w-full h-32 md:h-40 opacity-70">
        <Lottie
          animationData={waterFlowAnimation}
          loop={true}
          className="w-full h-full"
        />
        {/* Soft water reflection effect */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-cyan-100/30 via-blue-50/20 to-transparent blur-xl" />
      </div>

      {/* Decorative soft circles for depth and premium feel */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-purple-100/20 to-transparent rounded-full blur-2xl" />
      <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-100/20 to-transparent rounded-full blur-2xl" />
    </div>
  );
};

export default WellnessHeroIllustration;
