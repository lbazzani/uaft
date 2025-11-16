'use client';
import Header from '@/components/shared/Header';
import HeroSection from '@/components/home/HeroSection';
import AIPricingSection from '@/components/home/AIPricingSection';
import ServicesSection from '@/components/home/ServicesSection';
import AboutSection from '@/components/home/AboutSection';
import CTASection from '@/components/home/CTASection';
import Footer from '@/components/shared/Footer';
import Script from 'next/script';

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'UAFT - Una Azienda che può Fare Tutto',
    alternateName: 'UAFT',
    url: 'https://uaft.it',
    logo: 'https://uaft.it/logo.png',
    description: 'Servizi IT innovativi con un tocco ironico ma professionale. Cloud, AI, automazione e soluzioni as-a-Service.',
    foundingDate: '2025',
    areaServed: {
      '@type': 'Country',
      name: 'Italia',
    },
    sameAs: [
      'https://twitter.com/uaft_it',
      'https://linkedin.com/company/uaft',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['Italian', 'English'],
    },
    offers: [
      {
        '@type': 'Offer',
        name: 'Servizi Cloud as-a-Service',
        description: 'Soluzioni cloud scalabili e personalizzate',
      },
      {
        '@type': 'Offer',
        name: 'AI Pricing Calculator',
        description: 'Preventivi automatici basati su intelligenza artificiale',
      },
      {
        '@type': 'Offer',
        name: 'Consulenza IT',
        description: 'Consulenza professionale per trasformazione digitale',
      },
    ],
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UAFT',
    url: 'https://uaft.it',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://uaft.it/?s={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
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
