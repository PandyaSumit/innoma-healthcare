import Header from './components/layout/Header';
import HeroBanner from './components/sections/landing/HeroBanner';
import ApproachSection from './components/sections/landing/ApproachSection';
import TraumaExplanation from './components/sections/landing/TraumaExplanation';
import TherapistsCarousel from './components/sections/landing/TherapistsCarousel';
import SymptomsGrid from './components/sections/landing/SymptomsGrid';
import LeadForm from './components/sections/landing/LeadForm';
import FAQSection from './components/sections/landing/FAQSection';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <Header />
      <main>
        <HeroBanner />
        <ApproachSection />
        <TraumaExplanation />
        <TherapistsCarousel />
        <SymptomsGrid />
        {/* <BenefitsSection /> */}
        <LeadForm />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
