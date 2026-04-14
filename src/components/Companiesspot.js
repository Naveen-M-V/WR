"use client";
import { motion } from "framer-motion";
import { useState } from "react";

// Example companies data (you can import this from a data file instead)
const companies = [
  {
    name: "TechCorp",
    description: "Innovating future technologies for a better tomorrow.",
    image: "https://images.unsplash.com/photo-1603415526960-f7e0328a5e0a",
    alt: "TechCorp Office",
  },
  {
    name: "GreenSolutions",
    description: "Sustainable solutions for a greener planet.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    alt: "GreenSolutions Logo",
  },
  {
    name: "FinEdge",
    description: "Redefining the financial landscape with AI-driven tools.",
    image: "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9",
    alt: "FinEdge Team",
  },
  {
    name: "DUDE",
    description: "Redefining the financial landscape with AI-driven tools.",
    image: "https://images.unsplash.com/photo-1556157382-97eda2d62296",
    alt: "FinEdge Team",
  },
  {
    name: "BUDDY",
    description: "Redefining the financial landscape with AI-driven tools.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    alt: "FinEdge Team",
  },
];

export default function CompaniesSpotlight() {
  const [currentCompany, setCurrentCompany] = useState(0);

  const getCompanyAtPosition = (offset) => {
    const index = (currentCompany + offset + companies.length) % companies.length;
    return companies[index];
  };

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-800 mb-8 lg:mb-12 text-center"
        >
          Companies in the Spotlight
        </motion.h2>

        {/* Carousel */}
        <div className="relative overflow-hidden">
          {/* Mobile View - Single Card */}
          <div className="block sm:hidden">
            <motion.div
              key={currentCompany}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-2xl"
            >
              <div className="h-48 rounded-t-lg overflow-hidden">
                <img
                  src={getCompanyAtPosition(0).image}
                  alt={getCompanyAtPosition(0).alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">
                  {getCompanyAtPosition(0).name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {getCompanyAtPosition(0).description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Tablet View - Two Cards */}
          <div className="hidden sm:flex lg:hidden items-center justify-center space-x-6">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-64 h-56 bg-white rounded-lg shadow-lg transform scale-90 opacity-75 transition-all duration-500"
            >
              <div className="h-36 rounded-t-lg overflow-hidden">
                <img
                  src={getCompanyAtPosition(-1).image}
                  alt={getCompanyAtPosition(-1).alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-center text-sm">
                  {getCompanyAtPosition(-1).name}
                </h3>
                <p className="text-xs text-gray-600 text-center">
                  Featured Company
                </p>
              </div>
            </motion.div>

            {/* Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-72 h-64 bg-white rounded-lg shadow-2xl transform scale-100 transition-all duration-500 z-10"
            >
              <div className="h-40 rounded-t-lg overflow-hidden">
                <img
                  src={getCompanyAtPosition(0).image}
                  alt={getCompanyAtPosition(0).alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">
                  {getCompanyAtPosition(0).name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {getCompanyAtPosition(0).description}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Desktop View - Three Cards */}
          <div className="hidden lg:flex items-center mb-4 justify-center space-x-8">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-64 h-48 bg-white rounded-lg shadow-lg transform scale-75 opacity-60 transition-all duration-500 hover:scale-80 hover:opacity-80"
            >
              <div className="h-32 rounded-t-lg overflow-hidden">
                <img
                  src={getCompanyAtPosition(-1).image}
                  alt={getCompanyAtPosition(-1).alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-center">
                  {getCompanyAtPosition(-1).name}
                </h3>
                <p className="text-xs text-gray-600 text-center">
                  Featured Company
                </p>
              </div>
            </motion.div>

            {/* Center */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-80 h-64 bg-white rounded-lg shadow-2xl transform scale-100 transition-all duration-500 z-10"
            >
              <div className="h-40 rounded-t-lg overflow-hidden">
                <img
                  src={getCompanyAtPosition(0).image}
                  alt={getCompanyAtPosition(0).alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-800 text-center mb-2">
                  {getCompanyAtPosition(0).name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {getCompanyAtPosition(0).description}
                </p>
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-64 h-48 bg-white rounded-lg shadow-lg transform scale-75 opacity-60 transition-all duration-500 hover:scale-80 hover:opacity-80"
            >
              <div className="h-32 rounded-t-lg overflow-hidden">
                <img
                  src={getCompanyAtPosition(1).image}
                  alt={getCompanyAtPosition(1).alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-center">
                  {getCompanyAtPosition(1).name}
                </h3>
                <p className="text-xs text-gray-600 text-center">
                  Featured Company
                </p>
              </div>
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 sm:mt-8 pb-8 pt-2 space-x-3">
            {companies.map((_, index) => (
              <button
                key={index}
                className={`transition-all duration-300 border-2 rounded-lg ${
                  index === currentCompany
                    ? "w-8 h-4 bg-green-600 border-green-700 shadow-lg"
                    : "w-4 h-4 bg-gray-200 border-gray-400 hover:bg-gray-300 hover:border-gray-500 hover:w-6"
                }`}
                onClick={() => setCurrentCompany(index)}
                aria-label={`Go to company ${index + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
