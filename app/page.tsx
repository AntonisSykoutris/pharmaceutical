import { BenefitsSection } from '@/components/layout/sections/benefits';
import { FeaturesSection } from '@/components/layout/sections/features';
import { FooterSection } from '@/components/layout/sections/footer';
import { HeroSection } from '@/components/layout/sections/hero';
import { SponsorsSection } from '@/components/layout/sections/sponsors';
import { TeamSection } from '@/components/layout/sections/team';

export const metadata = {
  title: 'PharmaFlow – Automate Pharmaceutical Paperwork',
  description:
    'Streamline regulatory, compliance, and documentation workflows in the pharmaceutical industry with PharmaFlow.',
  openGraph: {
    type: 'website',
    url: 'https://pharmaflow.app', // Update to actual site URL
    title: 'PharmaFlow – Automate Pharmaceutical Paperwork',
    description:
      'Streamline regulatory, compliance, and documentation workflows in the pharmaceutical industry with PharmaFlow.',
    images: [
      {
        url: 'https://yourdomain.com/og-image.jpg', // Replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: 'PharmaFlow – Automate Pharmaceutical Paperwork',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://pharmaflow.app', // Update to actual Twitter site or handle
    title: 'PharmaFlow – Automate Pharmaceutical Paperwork',
    description:
      'Streamline regulatory, compliance, and documentation workflows in the pharmaceutical industry with PharmaFlow.',
    images: ['https://yourdomain.com/og-image.jpg'], // Same image as above or different if desired
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SponsorsSection />
      <BenefitsSection />
      <FeaturesSection />
      <TeamSection />
      {/* <ServicesSection /> */}
      {/* <TestimonialSection /> */}
      {/* <CommunitySection /> */}
      {/* <PricingSection /> */}
      {/* <ContactSection /> 
      {/* <FAQSection />*/}
      <FooterSection />
    </>
  );
}
