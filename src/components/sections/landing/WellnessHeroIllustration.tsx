import React, { useEffect, useRef } from "react";
import Lottie from "lottie-react";

// Import animations from assets
import sunAnimation from "../../../assets/animations/clear sun.json";
import handsAnimation from "../../../assets/animations/Handshake.json";
import waterAnimation from "../../../assets/animations/Water flow.json";
import plantAnimation from "../../../assets/animations/Animated plant loader..json";

const WellnessHeroIllustration: React.FC = () => {
  const handsRef = useRef<any>(null);

  useEffect(() => {
    if (handsRef.current) {
      // Play from frame 0 to 45 (where hands are fully met and clasped)
      handsRef.current.playSegments([0, 45], true);
    }
  }, []);

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-amber-50/30 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-blue-50/20 rounded-full blur-[140px] animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Sun Animation - Top Center Ambient */}
      <div className="absolute top-[5%] sm:top-[8%] left-1/2 -translate-x-1/2 w-[14rem] sm:w-[20rem] md:w-[22rem] h-auto z-0 opacity-30 pointer-events-none">
        <Lottie animationData={sunAnimation} loop={true} />
      </div>

      {/* Hands Animation - CENTER PIECE BEHIND TEXT */}
      <div className="absolute left-1/2 -translate-x-1/2 -translate-y-[45%] w-[45rem] h-[45rem] w-full z-0 opacity-[0.15] pointer-events-none blur-[1px]">
        <Lottie 
          lottieRef={handsRef}
          animationData={handsAnimation} 
          loop={false} 
          autoplay={false}
        />
      </div>

      {/* Water Flow Animation - SEAMLESS BOTTOM EDGE */}
      <div className="absolute bottom-0 left-[-2%] w-[104%] h-[150px] sm:h-[220px] md:h-[280px] z-20 opacity-95 pointer-events-none">
        <Lottie 
          animationData={waterAnimation} 
          loop={true} 
          style={{ width: '100%', height: '100%' }} 
          rendererSettings={{
            preserveAspectRatio: 'none'
          }}
        />
      </div>

      {/* Left Plant - Corner Anchor */}
      <div className="absolute bottom-0 left-[-10px] sm:left-[-20px] w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 z-30 opacity-95 pointer-events-none animate-sway" style={{ transformOrigin: 'bottom' }}>
        <Lottie animationData={plantAnimation} loop={false} />
      </div>

      {/* Right Plant - Corner Anchor */}
      <div className="absolute bottom-0 right-[-10px] sm:right-[-20px] w-32 h-32 sm:w-48 sm:h-48 md:w-72 md:h-72 z-30 opacity-95 pointer-events-none animate-sway scale-x-[-1]" style={{ transformOrigin: 'bottom', animationDelay: '1.5s' }}>
        <Lottie animationData={plantAnimation} loop={false} />
      </div>

      {/* Ambient Floating Elements */}
      <div className="absolute top-[25%] left-[15%] w-24 h-24 rounded-full bg-purple-100/20 blur-xl animate-float" />
      <div className="absolute bottom-[45%] right-[20%] w-28 h-28 rounded-full bg-emerald-50/20 blur-xl animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[65%] left-[8%] w-20 h-20 rounded-full bg-blue-100/20 blur-xl animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default WellnessHeroIllustration;
