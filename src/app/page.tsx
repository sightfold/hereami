import ClosingCta from "@/components/landing/ClosingCta";
import Departments from "@/components/landing/Departments";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingNav from "@/components/landing/LandingNav";
import PaperProblem from "@/components/landing/PaperProblem";
import Visibility from "@/components/landing/Visibility";
import WhiteLabel from "@/components/landing/WhiteLabel";

const LandingPage = () => (
  <>
    <LandingNav />
    <main>
      <Hero />
      <Departments />
      <PaperProblem />
      <HowItWorks />
      <Visibility />
      <Features />
      <WhiteLabel />
      <ClosingCta />
    </main>
  </>
);

export default LandingPage;
