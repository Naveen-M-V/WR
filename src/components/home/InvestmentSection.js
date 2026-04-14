import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Briefcase, CheckCircle, Sparkles } from 'lucide-react';

const InvestmentSection = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const investmentServices = [
    {
      title: "Strategic Partnership Program",
      description: "Join our exclusive network of partners shaping the future of renewable energy",
      delay: 0.2,
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      features: ["Exclusive access", "Revenue sharing", "Strategic insights"],
      stat: "25%",
      statLabel: "Avg. ROI"
    },
    {
      title: "Business Investment Pack",
      description: "Comprehensive investment documentation and market analysis for informed decisions",
      delay: 0.3,
      icon: Briefcase,
      color: "from-purple-500 to-blue-600",
      features: ["Market analysis", "Financial projections", "Risk assessment"],
      stat: "95%",
      statLabel: "Success Rate",
      gridClass: "sm:col-span-2 lg:col-span-1"
    }
  ];

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 py-16 overflow-hidden">
      {/* Enhanced Gradient Background */}
      <div className="absolute inset-0 bg-[#051f46]" />

      {/* Enhanced Mesh Pattern */}
      <motion.svg
        className="absolute inset-0 w-full h-full opacity-10"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        animate={{
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <defs>
          <pattern
            id="grid-investment"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path d="M40 0H0V40" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-investment)" />
      </motion.svg>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Glassmorphism Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          
          <div className="relative z-10 p-8">

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight"
            >
              Ready to Invest in the Future of Renewable Energy?
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed"
            >
              Join the UK & Ireland's largest renewable energy platform and be part of the green revolution
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-4 -left-4 w-8 h-8 bg-blue-400/20 rounded-full blur-sm"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-6 h-6 bg-cyan-400/25 rounded-full blur-sm"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </motion.div>

        {/* Enhanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 relative z-10">
          {investmentServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60, rotateX: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 0.8, delay: service.delay }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative group cursor-pointer ${service.gridClass || ''}`}
                style={{ perspective: "1000px" }}
              >
                <motion.div
                  whileHover={{ 
                    y: -10, 
                    rotateY: 5,
                    scale: 1.05,
                    boxShadow: '0 30px 60px -12px rgba(59, 130, 246, 0.3)'
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="relative backdrop-blur-2xl border border-white/30 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-700 overflow-hidden"
                  style={{
                    background: hoveredCard === index 
                      ? `linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0.1))`
                      : `linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(59, 130, 246, 0.05), rgba(255, 255, 255, 0.05))`
                  }}
                >
                  {/* Animated Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${service.color} rounded-3xl`}
                    animate={{
                      opacity: hoveredCard === index ? [0.05, 0.1, 0.05] : [0.02, 0.05, 0.02],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                  />

                  {/* Animated Border Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-blue-400/50"
                    animate={{
                      opacity: hoveredCard === index ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  {/* Floating Color Orbs */}
                  <motion.div
                    className={`absolute top-4 left-4 w-20 h-20 bg-gradient-to-br ${service.color} rounded-full blur-2xl`}
                    animate={{
                      scale: hoveredCard === index ? [1, 1.4, 1] : [0.8, 1, 0.8],
                      opacity: hoveredCard === index ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 4 + index * 0.5, repeat: Infinity }}
                  />
                  <motion.div
                    className={`absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-br ${service.color} rounded-full blur-xl`}
                    animate={{
                      scale: hoveredCard === index ? [1.2, 1, 1.2] : [1, 0.8, 1],
                      opacity: hoveredCard === index ? [0.25, 0.5, 0.25] : [0.08, 0.15, 0.08],
                    }}
                    transition={{ duration: 3.5 + index * 0.3, repeat: Infinity }}
                  />

                  {/* Shimmer Effect */}
                  <AnimatePresence>
                    {hoveredCard === index && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        exit={{ x: "200%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Floating Icon with Animation */}
                  <motion.div 
                    className="mb-6 flex justify-center relative"
                    animate={{
                      y: hoveredCard === index ? [-2, 2, -2] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: hoveredCard === index ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </motion.div>
                    
                    {/* Sparkle Effects */}
                    <AnimatePresence>
                      {hoveredCard === index && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-blue-400 rounded-full"
                              initial={{ 
                                opacity: 0, 
                                scale: 0,
                                x: 40,
                                y: 40
                              }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                x: [40, 40 + (i - 1) * 20, 40 + (i - 1) * 40],
                                y: [40, 40 - i * 15, 40 - i * 30],
                              }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{
                                duration: 1.5,
                                delay: i * 0.2,
                                repeat: Infinity,
                                repeatDelay: 1
                              }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Stat Badge */}
                  <motion.div
                    className={`absolute top-6 right-6 px-3 py-1 bg-gradient-to-r ${service.color} text-white text-xs font-bold rounded-full shadow-lg`}
                    animate={{
                      scale: hoveredCard === index ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat: hoveredCard === index ? Infinity : 0,
                    }}
                  >
                    {service.stat}
                  </motion.div>

                  {/* Title with Enhanced Animation */}
                  <motion.h3 
                    className="font-bold text-xl text-blue-900 mb-3 group-hover:text-blue-700 transition-colors"
                    animate={{
                      x: hoveredCard === index ? [0, 5, 0] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: hoveredCard === index ? Infinity : 0,
                    }}
                  >
                    {service.title}
                  </motion.h3>

                  {/* Description */}
                  <motion.p 
                    className="text-sm text-blue-700/90 leading-relaxed mb-4"
                    animate={{
                      opacity: hoveredCard === index ? [0.9, 1, 0.9] : 0.9,
                    }}
                    transition={{
                      duration: 2,
                      repeat: hoveredCard === index ? Infinity : 0,
                    }}
                  >
                    {service.description}
                  </motion.p>

                  {/* Features List */}
                  <motion.div 
                    className="space-y-2 mb-6"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: hoveredCard === index ? 1 : 0,
                      height: hoveredCard === index ? "auto" : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {service.features.map((feature, featureIndex) => (
                      <motion.div
                        key={featureIndex}
                        className="flex items-center gap-2 text-xs text-blue-600"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{
                          x: hoveredCard === index ? 0 : -20,
                          opacity: hoveredCard === index ? 1 : 0,
                        }}
                        transition={{ 
                          duration: 0.3, 
                          delay: featureIndex * 0.1 
                        }}
                      >
                        <CheckCircle className="w-3 h-3 text-cyan-500" />
                        <span>{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  <motion.div
                    className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default InvestmentSection;
