import React, { Suspense, lazy, memo } from 'react';
import { motion } from 'framer-motion';
import ScrollingBanner from './ScrollingBanner';
import HeroSection from './HeroSection';

const InnovationHub        = lazy(() => import('./InnovationHub'));
const CompaniesSpotlight   = lazy(() => import('./CompaniesSpotlight'));
const ProjectConsultation  = lazy(() => import('./ProjectConsultation'));
const TestimonialsSection  = lazy(() => import('./TestimonialsSection'));
const ProductsSpotlight    = lazy(() => import('./ProductSpotlight'));
const CaseStudySection     = lazy(() => import('./Casestudy'));
const ExperienceBlogSpot   = lazy(() => import('./ExperienceBlogSpot'));
const UpcomingProjects     = lazy(() => import('./UpcomingProjects'));
const MonthlyAwards        = lazy(() => import('./MonthlyAwards'));

// border-3 does not exist in Tailwind — use inline style
const SectionLoader = memo(() => (
  <div className="py-20 flex justify-center items-center">
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '2px solid rgba(16,185,129,0.2)',
      borderTopColor: '#10b981',
      animation: 'spin 0.8s linear infinite',
    }} />
  </div>
));
SectionLoader.displayName = 'SectionLoader';

const HomePage = memo(() => {
  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: '#040e1e' }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <div className="relative z-10">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <ScrollingBanner />
        </motion.div>

        {/* HeroSection is NOT lazy — no Suspense wrapper needed */}
        <HeroSection />

        <Suspense fallback={<SectionLoader />}>
          <InnovationHub />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CompaniesSpotlight />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProductsSpotlight />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <CaseStudySection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ExperienceBlogSpot />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProjectConsultation />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <UpcomingProjects />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <MonthlyAwards />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>

      </div>
    </div>
  );
});
HomePage.displayName = 'HomePage';

export default HomePage;