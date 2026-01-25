import HeroBanner from '../components/sections/landing/HeroBanner';
import HowItWorks from '../components/sections/landing/HowItWorks';
import ApproachSection from '../components/sections/landing/ApproachSection';
import TraumaExplanation from '../components/sections/landing/TraumaExplanation';
import TherapistsCarousel from '../components/sections/landing/TherapistsCarousel';
import SymptomsGrid from '../components/sections/landing/SymptomsGrid';
import FreeAssessmentCTA from '../components/sections/landing/FreeAssessmentCTA';
import FAQSection from '../components/sections/landing/FAQSection';

const LandingPage = () => {
  return (
    <>
      <HeroBanner />
      <HowItWorks />
      <ApproachSection />
      <TherapistsCarousel />
      <SymptomsGrid />
      <FreeAssessmentCTA />
      <TraumaExplanation />
      <FAQSection />
    </>
  );
};

export default LandingPage;
