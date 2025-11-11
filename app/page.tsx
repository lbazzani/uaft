'use client';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AIPricingSection from '@/components/AIPricingSection';
import ServicesSection from '@/components/ServicesSection';
import AboutSection from '@/components/AboutSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <HeroSection />
      <AIPricingSection />
      <ServicesSection />
      <AboutSection />
      <CTASection />
      <Footer />
    </>
  );
}
