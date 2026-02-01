import HeroBanner from "../components/sections/landing/HeroBanner";
import ApproachSection from "../components/sections/landing/ApproachSection";
import TraumaExplanation from "../components/sections/landing/TraumaExplanation";
import TherapistsCarousel from "../components/sections/landing/TherapistsCarousel";
import SymptomsGrid from "../components/sections/landing/SymptomsGrid";
import OffersSection from "../components/sections/landing/OffersSection";
import LeadForm from "../components/sections/landing/LeadForm";
import FAQSection from "../components/sections/landing/FAQSection";

const LandingPage = () => {
  return (
    <>
      <HeroBanner />
      <ApproachSection />
      <TraumaExplanation />
      <TherapistsCarousel />
      <SymptomsGrid />
      <OffersSection />
      <LeadForm />
      <FAQSection />
    </>
  );
};

export default LandingPage;
