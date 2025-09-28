import Navigation from "@/components/Navigation"
import Hero from "@/components/Hero"
import ConversionSection from "@/components/ConversionSection"
import HowItWorks from "@/components/HowItWorks"
import TestimonialsSection from "@/components/TestimonialsSection"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Hero />
      <ConversionSection />
      <TestimonialsSection />
      <HowItWorks />
      <Footer />
    </div>
  );
};

export default Index;
