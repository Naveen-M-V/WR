import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const StrategicGoals = () => {
  const containerRef = useRef(null);
  const [hoveredGoal, setHoveredGoal] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: isMounted ? containerRef : undefined,
    offset: ["start 0.2", "end 0.1"],
  });
  const animatedPathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  const goals = [
    {
      id: 1,
      title: "Platform Excellence",
      description: "Deliver a user-friendly, scalable, and secure website that becomes the go-to hub for renewable energy solutions",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "pink",
      position: { desktop: "top-[8%] right-[5%]", mobile: 0 },
      delay: 0.5
    },
    {
      id: 2,
      title: "Industry Engagement",
      description: "Creating a comprehensive business directory and showcase platform for private & public sectors",
      image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "orange",
      position: { desktop: "top-[25%] left-[5%]", mobile: 1 },
      delay: 0.7,
      reverse: true
    },
    {
      id: 3,
      title: "Knowledge & Education",
      description: "Provide valuable industry news, case studies, and educational resources on legislation & compliance",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "green",
      position: { desktop: "top-[42%] right-[5%]", mobile: 2 },
      delay: 0.9
    },
    {
      id: 4,
      title: "Trust & Recognition",
      description: "Establishing Trust & Recognition via premium portals such as \"Recently completed projects\" and \"Case Studies\"",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "blue",
      position: { desktop: "top-[60%] left-[5%]", mobile: 3 },
      delay: 1.1,
      reverse: true
    },
    {
      id: 5,
      title: "Sustainability Advocacy",
      description: "Advocate for a greener planet by supporting organizations committed to reducing carbon footprints",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      color: "purple",
      position: { desktop: "top-[78%] right-[5%]", mobile: 4 },
      delay: 1.3
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      pink: {
        border: "border-pink-400",
        cardBorder: "border-pink-200/50",
        text: "text-pink-200",
        bg: "bg-gradient-to-br from-pink-900/20 via-rose-900/10 to-transparent",
        gradient: "from-pink-400/20 to-rose-500/20",
        glow: "rgba(236, 72, 153, 0.3)",
        sparkle: "bg-pink-400",
        shadow: "shadow-pink-500/25",
        meshGradient: "linear-gradient(135deg, rgba(255, 182, 193, 0.3), rgba(255, 105, 180, 0.2), rgba(255, 20, 147, 0.1))"
      },
      orange: {
        border: "border-orange-400",
        cardBorder: "border-orange-200/50",
        text: "text-orange-200",
        bg: "bg-gradient-to-br from-orange-900/20 via-amber-900/10 to-transparent",
        gradient: "from-orange-400/20 to-amber-500/20",
        glow: "rgba(249, 115, 22, 0.3)",
        sparkle: "bg-orange-400",
        shadow: "shadow-orange-500/25",
        meshGradient: "linear-gradient(135deg, rgba(255, 165, 0, 0.3), rgba(255, 140, 0, 0.2), rgba(255, 69, 0, 0.1))"
      },
      green: {
        border: "border-green-400",
        cardBorder: "border-green-200/50",
        text: "text-green-200",
        bg: "bg-gradient-to-br from-green-900/20 via-emerald-900/10 to-transparent",
        gradient: "from-green-400/20 to-emerald-500/20",
        glow: "rgba(16, 185, 129, 0.3)",
        sparkle: "bg-green-400",
        shadow: "shadow-green-500/25",
        meshGradient: "linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))"
      },
      blue: {
        border: "border-blue-400",
        cardBorder: "border-blue-200/50",
        text: "text-blue-200",
        bg: "bg-gradient-to-br from-blue-900/20 via-indigo-900/10 to-transparent",
        gradient: "from-blue-400/20 to-indigo-500/20",
        glow: "rgba(59, 130, 246, 0.3)",
        sparkle: "bg-blue-400",
        shadow: "shadow-blue-500/25",
        meshGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.1))"
      },
      purple: {
        border: "border-purple-400",
        cardBorder: "border-purple-200/50",
        text: "text-purple-200",
        bg: "bg-gradient-to-br from-purple-900/20 via-violet-900/10 to-transparent",
        gradient: "from-purple-400/20 to-violet-500/20",
        glow: "rgba(147, 51, 234, 0.3)",
        sparkle: "bg-purple-400",
        shadow: "shadow-purple-500/25",
        meshGradient: "linear-gradient(135deg, rgba(147, 51, 234, 0.3), rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.1))"
      }
    };
    return colorMap[color];
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
        <div className="w-full">
          {/* Enhanced Header */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 relative"
          >
            <div className="relative z-10 p-8">
              {/* Animated Badge */}
              <motion.div
                className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full mb-6 shadow-lg"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: ["0 4px 20px rgba(16, 185, 129, 0.3)", "0 4px 20px rgba(59, 130, 246, 0.4)", "0 4px 20px rgba(16, 185, 129, 0.3)"]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center"
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                </motion.div>
                <span className="text-white font-semibold">Strategic Roadmap</span>
              </motion.div>

              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 leading-tight"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                }}
              >
                Our Strategic Goals
              </motion.h2>
              
              <motion.p
                className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                A dynamic roadmap guiding our journey toward sustainable energy leadership and innovation
              </motion.p>
            </div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-6 -left-6 w-12 h-12 bg-green-400/20 rounded-full blur-sm"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-8 h-8 bg-blue-400/20 rounded-full blur-sm"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.8, 0.3]
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
              }}
            />
          </motion.div>

          {/* Roadmap Container */}
          <div className="relative w-full min-h-[600px] sm:min-h-[800px] lg:min-h-[900px] overflow-hidden">
            {/* SVG Vertical Winding Road Path */}
            <svg
              className="absolute inset-0 w-full h-full z-0 hidden sm:block"
              viewBox="0 0 400 800"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#7ed957" />
                  <stop offset="25%" stopColor="#4da82f" />
                  <stop offset="50%" stopColor="#7ed957" />
                  <stop offset="75%" stopColor="#4da82f" />
                  <stop offset="100%" stopColor="#2d5016" />
                </linearGradient>
              </defs>

              {/* Background path (gray) */}
              <path
                d="M200 30 Q280 120 200 210 Q120 300 200 390 Q280 480 200 570 Q120 660 200 750"
                stroke="#e5e7eb"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Animated green fill path */}
              <motion.path
                d="M200 30 Q280 120 200 210 Q120 300 200 390 Q280 480 200 570 Q120 660 200 750"
                stroke="url(#roadGradient)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                style={{ pathLength: isMounted ? animatedPathLength : 0 }}
              />

              {/* Road dashed line */}
              <motion.path
                d="M200 30 Q280 120 200 210 Q120 300 200 390 Q280 480 200 570 Q120 660 200 750"
                stroke="white"
                strokeWidth="2"
                fill="none"
                strokeDasharray="10,10"
                strokeLinecap="round"
                style={{ pathLength: isMounted ? animatedPathLength : 0 }}
              />
            </svg>

            {/* Enhanced Mobile Layout - Creative Cards */}
            <div className="sm:hidden space-y-8 p-4">
              {goals.map((goal, index) => {
                const colors = getColorClasses(goal.color);
                return (
                  <motion.div
                    key={goal.id}
                    initial={{ opacity: 0, y: 50, rotateY: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 + index * 0.15 }}
                    viewport={{ once: true }}
                    onMouseEnter={() => setHoveredGoal(goal.id)}
                    onMouseLeave={() => setHoveredGoal(null)}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -10,
                      rotateY: 5,
                    }}
                    className={`relative backdrop-blur-2xl border border-white/30 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 cursor-pointer overflow-hidden ${colors.bg}`}
                    style={{
                      background: hoveredGoal === goal.id 
                        ? `${colors.meshGradient}, linear-gradient(135deg, rgba(255, 255, 255, 0.4), ${colors.glow}, rgba(255, 255, 255, 0.2))`
                        : `${colors.meshGradient}, linear-gradient(135deg, rgba(255, 255, 255, 0.25), ${colors.glow}, rgba(255, 255, 255, 0.1))`
                    }}
                  >
                    {/* Creative Mesh Pattern Background */}
                    <div 
                      className="absolute inset-0 rounded-3xl opacity-20"
                      style={{
                        backgroundImage: `
                          radial-gradient(circle at 20% 20%, ${colors.glow} 0%, transparent 50%),
                          radial-gradient(circle at 80% 80%, ${colors.glow} 0%, transparent 50%),
                          radial-gradient(circle at 40% 60%, ${colors.glow} 0%, transparent 30%)
                        `
                      }}
                    />

                    {/* Enhanced Glassmorphism Background Effects */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl`}
                      animate={{
                        opacity: hoveredGoal === goal.id ? [0.15, 0.35, 0.15] : [0.08, 0.18, 0.08],
                        scale: [1, 1.02, 1],
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Animated Geometric Pattern */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, transparent 40%, ${colors.glow} 50%, transparent 60%),
                          linear-gradient(-45deg, transparent 40%, ${colors.glow} 50%, transparent 60%)
                        `,
                        backgroundSize: '20px 20px',
                        opacity: 0.05
                      }}
                      animate={{
                        backgroundPosition: hoveredGoal === goal.id 
                          ? ['0px 0px, 0px 0px', '20px 20px, -20px -20px', '0px 0px, 0px 0px']
                          : '0px 0px, 0px 0px'
                      }}
                      transition={{ duration: 6, repeat: Infinity }}
                    />

                    {/* Animated Border Effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-3xl border-2 ${colors.border}`}
                      animate={{
                        opacity: hoveredGoal === goal.id ? [0.4, 0.8, 0.4] : [0.2, 0.4, 0.2],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />

                    {/* Floating Color Orbs */}
                    <motion.div
                      className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-full blur-2xl`}
                      animate={{
                        scale: hoveredGoal === goal.id ? [1, 1.4, 1] : [0.8, 1, 0.8],
                        opacity: hoveredGoal === goal.id ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                      }}
                      transition={{ duration: 3 + index * 0.5, repeat: Infinity }}
                    />

                    {/* Shimmer Effect */}
                    <AnimatePresence>
                      {hoveredGoal === goal.id && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
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

                    <div className="flex items-start gap-4 relative z-10">
                      {/* Enhanced Image Container */}
                      <motion.div
                        className={`relative w-16 h-16 rounded-2xl border-3 ${colors.border} bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0 overflow-hidden`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                        <img 
                          src={goal.image}
                          alt={goal.title}
                          className="w-12 h-12 rounded-xl object-cover relative z-10" 
                        />
                        {/* Image Glow Effect */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-2xl`}
                          animate={{
                            opacity: hoveredGoal === goal.id ? [0, 0.4, 0] : 0,
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      {/* Enhanced Content */}
                      <div className="flex-1">
                        <motion.h3 
                          className={`text-lg font-bold ${colors.text} mb-2 transition-colors`}
                          animate={{
                            x: hoveredGoal === goal.id ? [0, 3, 0] : 0,
                          }}
                          transition={{
                            duration: 2,
                            repeat: hoveredGoal === goal.id ? Infinity : 0,
                          }}
                        >
                          {goal.title}
                        </motion.h3>
                        
                        {/* Glassmorphism Badge */}
                        <motion.div
                          className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full mb-3"
                          whileHover={{ scale: 1.05 }}
                          animate={{
                            boxShadow: hoveredGoal === goal.id 
                              ? [`0 4px 20px ${colors.glow}`, `0 4px 20px ${colors.glow}`, `0 4px 20px ${colors.glow}`]
                              : "0 2px 10px rgba(0, 0, 0, 0.1)"
                          }}
                          transition={{
                            duration: 2,
                            repeat: hoveredGoal === goal.id ? Infinity : 0,
                          }}
                        >
                          <div className={`w-2 h-2 ${colors.sparkle} rounded-full animate-pulse`} />
                          <span className={`${colors.text} font-medium text-xs`}>Goal {goal.id}</span>
                        </motion.div>
                        
                        <motion.p 
                          className="text-white/80 text-sm leading-relaxed"
                          animate={{
                            opacity: hoveredGoal === goal.id ? [0.8, 1, 0.8] : 0.8,
                          }}
                          transition={{
                            duration: 3,
                            repeat: hoveredGoal === goal.id ? Infinity : 0,
                          }}
                        >
                          {goal.description}
                        </motion.p>
                      </div>
                    </div>

                    {/* Sparkle Effects on Hover */}
                    <AnimatePresence>
                      {hoveredGoal === goal.id && (
                        <>
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`absolute w-1 h-1 ${colors.sparkle} rounded-full`}
                              initial={{ 
                                opacity: 0, 
                                scale: 0,
                                x: 200 + i * 15,
                                y: 30 + i * 20
                              }}
                              animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                y: [30 + i * 20, 10 + i * 20, -10 + i * 20],
                              }}
                              exit={{ opacity: 0, scale: 0 }}
                              transition={{
                                duration: 2,
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
                );
              })}
            </div>

            {/* Enhanced Desktop Layout - Creative Cards */}
            {goals.map((goal) => {
              const colors = getColorClasses(goal.color);
              return (
                <motion.div
                  key={`desktop-${goal.id}`}
                  initial={{ opacity: 0, x: goal.reverse ? -80 : 80, rotateY: goal.reverse ? 15 : -15 }}
                  whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ duration: 0.8, delay: goal.delay }}
                  viewport={{ once: true }}
                  onMouseEnter={() => setHoveredGoal(goal.id)}
                  onMouseLeave={() => setHoveredGoal(null)}
                  className={`hidden sm:flex absolute ${goal.position.desktop} z-10 items-center gap-8`}
                >
                  {goal.reverse ? (
                    <>
                      {/* Enhanced Card for reverse layout */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.08, 
                          y: -15,
                          rotateY: -5,
                        }}
                        className={`relative backdrop-blur-2xl border border-white/30 rounded-3xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 cursor-pointer max-w-xs overflow-hidden ${colors.bg}`}
                        style={{
                          background: hoveredGoal === goal.id 
                            ? `${colors.meshGradient}, linear-gradient(135deg, rgba(255, 255, 255, 0.5), ${colors.glow}, rgba(255, 255, 255, 0.2))`
                            : `${colors.meshGradient}, linear-gradient(135deg, rgba(255, 255, 255, 0.3), ${colors.glow}, rgba(255, 255, 255, 0.1))`
                        }}
                      >
                        {/* Creative Mesh Pattern Background */}
                        <div 
                          className="absolute inset-0 rounded-3xl opacity-15"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 25% 25%, ${colors.glow} 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, ${colors.glow} 0%, transparent 50%)
                            `
                          }}
                        />

                        {/* Enhanced Glassmorphism Background */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl`}
                          animate={{
                            opacity: hoveredGoal === goal.id ? [0.15, 0.35, 0.15] : [0.08, 0.18, 0.08],
                            scale: [1, 1.02, 1],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />

                        {/* Floating Orb */}
                        <motion.div
                          className={`absolute top-2 right-2 w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full blur-xl`}
                          animate={{
                            scale: hoveredGoal === goal.id ? [1, 1.3, 1] : [0.8, 1, 0.8],
                            opacity: hoveredGoal === goal.id ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Shimmer Effect */}
                        <AnimatePresence>
                          {hoveredGoal === goal.id && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
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

                        <div className="relative z-10">
                          {/* Goal Badge */}
                          <motion.div
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full mb-3"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className={`w-2 h-2 ${colors.sparkle} rounded-full animate-pulse`} />
                            <span className={`${colors.text} font-semibold text-xs`}>Goal {goal.id}</span>
                          </motion.div>

                          <motion.h3 
                            className={`text-sm sm:text-lg font-bold ${colors.text} mb-2 text-center`}
                            animate={{
                              x: hoveredGoal === goal.id ? [0, -3, 0] : 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: hoveredGoal === goal.id ? Infinity : 0,
                            }}
                          >
                            {goal.title}
                          </motion.h3>
                          <motion.p 
                            className="text-white/80 text-xs sm:text-sm leading-relaxed text-center"
                            animate={{
                              opacity: hoveredGoal === goal.id ? [0.8, 1, 0.8] : 0.8,
                            }}
                            transition={{
                              duration: 3,
                              repeat: hoveredGoal === goal.id ? Infinity : 0,
                            }}
                          >
                            {goal.description}
                          </motion.p>
                        </div>

                        {/* Sparkle Effects */}
                        <AnimatePresence>
                          {hoveredGoal === goal.id && (
                            <>
                              {[...Array(2)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className={`absolute w-1 h-1 ${colors.sparkle} rounded-full`}
                                  initial={{ 
                                    opacity: 0, 
                                    scale: 0,
                                    x: 250 + i * 10,
                                    y: 20 + i * 15
                                  }}
                                  animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    y: [20 + i * 15, 0 + i * 15, -20 + i * 15],
                                  }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{
                                    duration: 2,
                                    delay: i * 0.3,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                  }}
                                />
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>

                      {/* Enhanced Image for reverse layout */}
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-4 ${colors.border} bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />
                        <img 
                          src={goal.image}
                          alt={goal.title}
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl object-cover relative z-10" 
                        />
                        {/* Image Glow */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl`}
                          animate={{
                            opacity: hoveredGoal === goal.id ? [0, 0.5, 0] : [0, 0.2, 0],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Enhanced Image for normal layout */}
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: -10 }}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-3xl border-4 ${colors.border} bg-white/20 backdrop-blur-xl flex items-center justify-center shadow-2xl overflow-hidden`}
                      >
                        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl" />
                        <img 
                          src={goal.image}
                          alt={goal.title}
                          className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl object-cover relative z-10" 
                        />
                        {/* Image Glow */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl`}
                          animate={{
                            opacity: hoveredGoal === goal.id ? [0, 0.5, 0] : [0, 0.2, 0],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </motion.div>

                      {/* Enhanced Card for normal layout */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.08, 
                          y: -15,
                          rotateY: 5,
                        }}
                        className={`relative backdrop-blur-2xl border border-white/30 rounded-3xl p-4 sm:p-6 shadow-2xl hover:shadow-3xl transition-all duration-700 cursor-pointer max-w-xs overflow-hidden ${colors.bg}`}
                        style={{
                          background: hoveredGoal === goal.id 
                            ? `${colors.meshGradient}, linear-gradient(135deg, rgba(255, 255, 255, 0.5), ${colors.glow}, rgba(255, 255, 255, 0.2))`
                            : `${colors.meshGradient}, linear-gradient(135deg, rgba(255, 255, 255, 0.3), ${colors.glow}, rgba(255, 255, 255, 0.1))`
                        }}
                      >
                        {/* Creative Mesh Pattern Background */}
                        <div 
                          className="absolute inset-0 rounded-3xl opacity-15"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 25% 25%, ${colors.glow} 0%, transparent 50%),
                              radial-gradient(circle at 75% 75%, ${colors.glow} 0%, transparent 50%)
                            `
                          }}
                        />

                        {/* Enhanced Glassmorphism Background */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} rounded-3xl`}
                          animate={{
                            opacity: hoveredGoal === goal.id ? [0.15, 0.35, 0.15] : [0.08, 0.18, 0.08],
                            scale: [1, 1.02, 1],
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />

                        {/* Floating Orb */}
                        <motion.div
                          className={`absolute top-2 left-2 w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full blur-xl`}
                          animate={{
                            scale: hoveredGoal === goal.id ? [1, 1.3, 1] : [0.8, 1, 0.8],
                            opacity: hoveredGoal === goal.id ? [0.3, 0.6, 0.3] : [0.1, 0.2, 0.1],
                          }}
                          transition={{ duration: 3, repeat: Infinity }}
                        />

                        {/* Shimmer Effect */}
                        <AnimatePresence>
                          {hoveredGoal === goal.id && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
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

                        <div className="relative z-10">
                          {/* Goal Badge */}
                          <motion.div
                            className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full mb-3"
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className={`w-2 h-2 ${colors.sparkle} rounded-full animate-pulse`} />
                            <span className={`${colors.text} font-semibold text-xs`}>Goal {goal.id}</span>
                          </motion.div>

                          <motion.h3 
                            className={`text-sm sm:text-lg font-bold ${colors.text} mb-2 text-center`}
                            animate={{
                              x: hoveredGoal === goal.id ? [0, 3, 0] : 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: hoveredGoal === goal.id ? Infinity : 0,
                            }}
                          >
                            {goal.title}
                          </motion.h3>
                          <motion.p 
                            className="text-white/80 text-xs sm:text-sm leading-relaxed text-center"
                            animate={{
                              opacity: hoveredGoal === goal.id ? [0.8, 1, 0.8] : 0.8,
                            }}
                            transition={{
                              duration: 3,
                              repeat: hoveredGoal === goal.id ? Infinity : 0,
                            }}
                          >
                            {goal.description}
                          </motion.p>
                        </div>

                        {/* Sparkle Effects */}
                        <AnimatePresence>
                          {hoveredGoal === goal.id && (
                            <>
                              {[...Array(2)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className={`absolute w-1 h-1 ${colors.sparkle} rounded-full`}
                                  initial={{ 
                                    opacity: 0, 
                                    scale: 0,
                                    x: -20 + i * 10,
                                    y: 20 + i * 15
                                  }}
                                  animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    y: [20 + i * 15, 0 + i * 15, -20 + i * 15],
                                  }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{
                                    duration: 2,
                                    delay: i * 0.3,
                                    repeat: Infinity,
                                    repeatDelay: 1
                                  }}
                                />
                              ))}
                            </>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StrategicGoals;
