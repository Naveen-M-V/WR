"use client";

import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navcontent/navbar";
import LoadingOptimized from "./components/LoadingOptimized";
import { AuthProvider } from "./contexts/AuthContext";
import { StripeProvider } from "./context/StripeContext";
import { preloadCriticalImages, registerServiceWorker } from "./utils/performance";
import CompaniesInSpotlight from "./components/showcasehub/CompaniesInSpotlight";
import ProductServiceInSpotlight from "./components/showcasehub/ProductServiceInSpotlight";
import InnovationHubPage from "./components/showcasehub/InnovationHubPage";
import HallOfFamePage from "./components/showcasehub/HallOfFamePage";
import RecentCompletedProjects from "./components/showcasehub/RecentCompletedProjects";
import IndustryCaseStudies from "./components/showcasehub/IndustryCaseStudies";
import WhichWomenInRenewables from "./components/showcasehub/WhichWomenInRenewables";
import FloatingAIVideo from "./components/FloatingAIVideo";
import FloatingNewsletter from "./components/FloatingNewsletter";
import { FloatingButtonProvider } from "./contexts/FloatingButtonContext";

// Lazy load HomePage for better initial performance
const HomePage = lazy(() => import("./components/home/HomePage"));
// Lazy load Footer for better performance
const Footer = lazy(() => import("./components/Footer"));

// Lazy load route components for code splitting
const About = lazy(() => import("./components/About"));
const Construction = lazy(() => import("./components/Construction"));
const Industrial = lazy(() => import("./components/Industrial"));
const Agriculture = lazy(() => import("./components/Agriculture"));
const Domestic = lazy(() => import("./components/Domestic"));
const Comercial = lazy(() => import("./components/Comercial-retail"));
const SigeneryProductsServices = lazy(() => import("./components/SigeneryProductsServices"));
const SigenergyCaseStudy = lazy(() => import("./components/SigenergyCaseStudy"));
const MaxxenProductsServices = lazy(() => import("./components/MaxxenProductsServices"));
const CaseStudies = lazy(() => import("./components/CaseStudies"));
const CaseStudySubmission = lazy(() => import("./components/CaseStudySubmission"));
const CertificationsSubmission = lazy(() => import("./components/CertificationsSubmission"));
const ProductsServices = lazy(() => import("./components/ProductsServices"));
const ProductsServicesSubmission = lazy(() => import("./components/ProductsServicesSubmission"));
const ProjectsSubmission = lazy(() => import("./components/ProjectsSubmission"));
const AwardsSubmission = lazy(() => import("./components/AwardsSubmission"));
const CompanyProductsServices = lazy(() => import("./components/CompanyProductsServices"));
const GHProductsServices = lazy(() => import("./components/GHProductsServices"));
const TitanProductsServices = lazy(() => import("./components/TitanProductsServices"));
const Renewable = lazy(() => import("./components/services/renewable"));
const Sustainable = lazy(() => import("./components/services/sustainable"));
const ITServices = lazy(() => import("./components/services/it-services"));
const JobsRecruitment = lazy(() => import("./components/services/jobs-recruitment"));
const UtilityCivils = lazy(() => import("./components/services/utility-civils"));
const EnergyManagement = lazy(() => import("./components/services/energy-management"));
const CompanyWellness = lazy(() => import("./components/services/company-wellness"));
const FinanceFunding = lazy(() => import("./components/services/finance-funding"));
const EcoFriendly = lazy(() => import("./components/services/eco-friendly"));
const NewsEvents = lazy(() => import("./components/news/NewsEvents"));
const TodaysIndustryNews = lazy(() => import("./components/news/TodaysIndustryNews"));
const IndustryAwardsPage = lazy(() => import("./components/news/IndustryAwardsPage"));
const WhatsHappeningRegion = lazy(() => import("./components/news/WhatsHappeningRegion"));
const ContactUs = lazy(() => import("./components/ContactUs"));
const StrategicPartnerships = lazy(() => import("./components/StrategicPartnerships"));
const SubscriptionPlans = lazy(() => import("./components/SubscriptionPlans"));
const WorkWithUs = lazy(() => import("./components/WorkWithUs"));
const PlanningConsultation = lazy(() => import("./components/PlanningConsultation"));
const ProfileCompletionPage = lazy(() => import("./components/ProfileCompletionPage"));
const EditCompanyProfilePage = lazy(() => import("./components/EditCompanyProfilePage"));
const FindCompany = lazy(() => import("./components/FindCompany"));
const CompanyProfile = lazy(() => import("./components/CompanyProfile"));
const AdminOnboardCompany = lazy(() => import("./components/admin/onboard-a-company/AdminOnboardCompany"));
const AdminProductsServices = lazy(() => import("./components/admin/AdminProductsServices"));
const BlogsSection = lazy(() => import("./components/BlogsSection"));
const MeetOurTeamPage = lazy(() => import("./components/MeetOurTeamPage"));
const ExpertPanelPage = lazy(() => import("./components/ExpertPanelPage"));
const IndustryWebinars = lazy(() => import("./components/news/IndustryWebinars"));
const TradeShowsEvents = lazy(() => import("./components/news/TradeShowsEvents"));
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const DynamicCompanyPage = lazy(() => import("./components/DynamicCompanyPage"));
const UserOnboardCompany = lazy(() => import("./components/onboarding/UserOnboardCompany"));
const ManageSubscriptionsPage = lazy(() => import("./components/ManageSubscriptionsPage"));


// Scroll to top on every route change
function ScrollToTop({ children }) {
  const location = useLocation();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }
  }, [location.pathname]);

  return children;
}

function App() {
  // Preload critical resources and register service worker on app start
  useEffect(() => {
    preloadCriticalImages();
    registerServiceWorker();
  }, []);

  return (
    <AuthProvider>
      <StripeProvider>
        <FloatingButtonProvider>
          <div>
            <Navbar />
            <FloatingAIVideo />
            <FloatingNewsletter />
            <Suspense fallback={<LoadingOptimized />}>
              <ScrollToTop>
                <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<About />} />
                <Route path="/agriculture" element={<Agriculture />} />
                <Route path="/construction" element={<Construction />} />
                <Route path="/industrial" element={<Industrial />} />
                <Route path="/domestic" element={<Domestic />} />
                <Route path="/comercial" element={<Comercial />} />
                <Route path="/sigenergy-products-services" element={<SigeneryProductsServices />} />
                <Route path="/sigenergy-case-study" element={<SigenergyCaseStudy />} />
                <Route path="/maxxen-products-services" element={<MaxxenProductsServices />} />
                <Route path="/gh-products-services" element={<GHProductsServices />} />
                <Route path="/titan-products-services" element={<TitanProductsServices />} />
                <Route path="/renewable" element={<Renewable />} />
                <Route path="/sustainable" element={<Sustainable />} />
                <Route path="/it-services" element={<ITServices />} />
                <Route path="/jobs-recruitment" element={<JobsRecruitment />} />
                <Route path="/utility-civils" element={<UtilityCivils />} />
                <Route path="/energy-management" element={<EnergyManagement />} />
                <Route path="/company-wellness" element={<CompanyWellness />} />
                <Route path="/finance-funding" element={<FinanceFunding />} />
                <Route path="/eco-friendly" element={<EcoFriendly />} />
                <Route path="/news-events" element={<NewsEvents />} />
                <Route path="/news-events/todays-industry-news" element={<TodaysIndustryNews />} />
                <Route path="/news-events/whats-happening-region" element={<WhatsHappeningRegion />} />
                <Route path="/news-events/industry-awards" element={<IndustryAwardsPage />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/submit-case-study" element={<CaseStudySubmission />} />
                <Route path="/submit-product-service" element={<ProductsServicesSubmission />} />
                <Route path="/submit-projects" element={<ProjectsSubmission />} />
                <Route path="/submit-awards" element={<AwardsSubmission />} />
                <Route path="/submit-certifications" element={<CertificationsSubmission />} />
                <Route path="/showcase-hub/companies-in-spotlight" element={<CompaniesInSpotlight />} />
                <Route path="/products-services" element={<ProductServiceInSpotlight />} />
                <Route path="/showcase-hub/product-service-in-spotlight" element={<ProductServiceInSpotlight />} />
                <Route path="/showcase-hub/innovation-hub" element={<InnovationHubPage />} />
                <Route path="/showcase-hub/hall-of-fame" element={<HallOfFamePage />} />
                <Route path="/showcase-hub/recent-completed-projects" element={<RecentCompletedProjects />} />
                <Route path="/showcase-hub/industry-case-studies" element={<IndustryCaseStudies />} />
                <Route path="/showcase-hub/which-women-in-renewables" element={<WhichWomenInRenewables />} />
                <Route path="/contact-us" element={<ContactUs />} />
                <Route path="/strategic-partnerships" element={<StrategicPartnerships />} />
                <Route path="/subscription-plans" element={<SubscriptionPlans />} />
                <Route path="/work-with-us" element={<WorkWithUs />} />
                <Route path="/planning-consultation" element={<PlanningConsultation />} />
                <Route path="/profile-completion" element={<ProfileCompletionPage />} />
                <Route path="/edit-profile" element={<EditCompanyProfilePage />} />
                <Route path="/admin/onboard-company" element={<AdminOnboardCompany />} />
                <Route path="/setup-company-profile" element={<UserOnboardCompany />} />
                <Route path="/admin/products-services" element={<AdminProductsServices />} />
                <Route path="/find-company" element={<FindCompany />} />
                <Route path="/company/:companyId" element={<DynamicCompanyPage />} />
                <Route path="/blogs" element={<BlogsSection />} />
                <Route path="/meet-our-team" element={<MeetOurTeamPage />} />
                <Route path="/expert-panel" element={<ExpertPanelPage />} />
                <Route path="/news-events/industry-webinars" element={<IndustryWebinars />} />
                <Route path="/news-events/trade-shows-events" element={<TradeShowsEvents />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/manage-subscriptions" element={<ManageSubscriptionsPage />} />
              </Routes>
            </ScrollToTop>
          </Suspense>
          {/* Footer */}
          <div>
            <Footer />
          </div>
          </div>
        </FloatingButtonProvider>
      </StripeProvider>
    </AuthProvider>
  );
}

export default App;
