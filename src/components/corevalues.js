import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RoadmapComponent() {
  const [hoveredStep, setHoveredStep] = useState(null);

  const steps = [
    { 
      id: "W", 
      title: "Worth", 
      color: "linear-gradient(135deg,#3b82f6,#1e40af,#1d4ed8)", 
      description: "Creating real value for businesses and consumers by fostering trust and recognition.",
      glow: "rgba(59, 130, 246, 0.4)",
      sparkle: "bg-blue-400",
      meshGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(30, 64, 175, 0.2), rgba(29, 78, 216, 0.1))"
    },
    { 
      id: "H", 
      title: "Honesty", 
      color: "linear-gradient(135deg,#ec4899,#be185d,#db2777)", 
      description: "Upholding transparency and integrity in our interactions.",
      glow: "rgba(236, 72, 153, 0.4)",
      sparkle: "bg-pink-400",
      meshGradient: "linear-gradient(135deg, rgba(236, 72, 153, 0.3), rgba(190, 24, 93, 0.2), rgba(219, 39, 119, 0.1))"
    },
    { 
      id: "I", 
      title: "Innovation", 
      color: "linear-gradient(135deg,#f59e0b,#b45309,#d97706)", 
      description: "We embrace innovation and forward-thinking solutions to drive sustainable growth and lasting change.",
      glow: "rgba(245, 158, 11, 0.4)",
      sparkle: "bg-amber-400",
      meshGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(180, 83, 9, 0.2), rgba(217, 119, 6, 0.1))"
    },
    { 
      id: "C", 
      title: "Collaboration", 
      color: "linear-gradient(135deg,#10b981,#047857,#059669)", 
      description: "Working together across connected industries and communities to achieve common sustainability goals.",
      glow: "rgba(16, 185, 129, 0.4)",
      sparkle: "bg-emerald-400",
      meshGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(4, 120, 87, 0.2), rgba(5, 150, 105, 0.1))"
    },
    { 
      id: "H", 
      title: "Harmony", 
      color: "linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9)", 
      description: "Striving to maintain a balance between human needs and the health of the planet, ensuring that energy solutions benefit all.",
      glow: "rgba(139, 92, 246, 0.4)",
      sparkle: "bg-violet-400",
      meshGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.3), rgba(124, 58, 237, 0.2), rgba(109, 40, 217, 0.1))"
    },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden"
    >
      {/* Creative Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/30 to-violet-500/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Animated Geometric Pattern */}
      <motion.div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 40%, rgba(16, 185, 129, 0.1) 50%, transparent 60%),
            linear-gradient(-45deg, transparent 40%, rgba(59, 130, 246, 0.1) 50%, transparent 60%)
          `,
          backgroundSize: '30px 30px'
        }}
        animate={{
          backgroundPosition: ['0px 0px, 0px 0px', '30px 30px, -30px -30px', '0px 0px, 0px 0px']
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="w-full relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 relative"
        >
          {/* Glassmorphism Background for Header */}
          <div className="relative z-10 p-6">
            {/* Animated Badge */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full mb-6 shadow-lg"
              whileHover={{ scale: 1.05 }}
              animate={{
                boxShadow: ["0 4px 20px rgba(16, 185, 129, 0.2)", "0 4px 20px rgba(59, 130, 246, 0.3)", "0 4px 20px rgba(16, 185, 129, 0.2)"]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
              />
              <span className="text-white font-semibold">Our Foundation</span>
            </motion.div>

            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 leading-tight"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
              }}
            >
              Our Core Values
            </motion.h2>
            
            <motion.p
              className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              The fundamental principles that guide our mission and shape our commitment to sustainable energy solutions
            </motion.p>
          </div>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -top-4 -left-4 w-8 h-8 bg-green-400/20 rounded-full blur-sm"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
          />
          <motion.div
            className="absolute -bottom-4 -right-4 w-6 h-6 bg-blue-400/20 rounded-full blur-sm"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              delay: 1
            }}
          />
        </motion.div>

        <div className="flex flex-col space-y-8 relative">
          {steps.map((s, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.div
                key={s.id + idx}
                initial={{ opacity: 0, x: isEven ? -100 : 100, rotateY: isEven ? -15 : 15 }}
                whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
                viewport={{ once: true }}
                className={`flex w-full items-center ${isEven ? "justify-start" : "justify-end"} mb-8`}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
              >
                <div className="flex items-center w-1/2 relative">
                  {isEven ? (
                    <>
                      {/* Enhanced Card left with creative glassmorphism */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.05, 
                          y: -10,
                          rotateY: 5,
                        }}
                        className="relative rounded-3xl w-full shadow-2xl p-6 pr-[100px] text-white min-h-[120px] flex flex-col justify-center transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-xl border border-white/20"
                        style={{ 
                          background: hoveredStep === idx 
                            ? `${s.meshGradient}, ${s.color}` 
                            : s.color 
                        }}
                      >
                        {/* Creative Mesh Pattern Background */}
                        <div 
                          className="absolute inset-0 rounded-3xl opacity-20"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 20% 20%, ${s.glow} 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, ${s.glow} 0%, transparent 50%)
                            `
                          }}
                        />

                        {/* Animated Geometric Pattern */}
                        <motion.div
                          className="absolute inset-0 rounded-3xl opacity-10"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, transparent 40%, white 50%, transparent 60%),
                              linear-gradient(-45deg, transparent 40%, white 50%, transparent 60%)
                            `,
                            backgroundSize: '15px 15px'
                          }}
                          animate={{
                            backgroundPosition: hoveredStep === idx 
                              ? ['0px 0px, 0px 0px', '15px 15px, -15px -15px', '0px 0px, 0px 0px']
                              : '0px 0px, 0px 0px'
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />

                        {/* Shimmer Effect */}
                        <AnimatePresence>
                          {hoveredStep === idx && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
                          <motion.h3 
                            className="text-xl md:text-2xl font-bold mb-3"
                            animate={{
                              x: hoveredStep === idx ? [0, 3, 0] : 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: hoveredStep === idx ? Infinity : 0,
                            }}
                          >
                            {s.title}
                          </motion.h3>
                          <motion.p 
                            className="text-sm leading-relaxed opacity-95"
                            animate={{
                              opacity: hoveredStep === idx ? [0.9, 1, 0.9] : 0.95,
                            }}
                            transition={{
                              duration: 3,
                              repeat: hoveredStep === idx ? Infinity : 0,
                            }}
                          >
                            {s.description}
                          </motion.p>
                        </div>

                        {/* Sparkle Effects */}
                        <AnimatePresence>
                          {hoveredStep === idx && (
                            <>
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className={`absolute w-1 h-1 ${s.sparkle} rounded-full`}
                                  initial={{ 
                                    opacity: 0, 
                                    scale: 0,
                                    x: 300 + i * 15,
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

                      {/* Enhanced Circle on right */}
                      <motion.div 
                        className="absolute right-[-56px] z-10"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="rounded-full shadow-2xl flex items-center justify-center backdrop-blur-xl border-4 border-white/30"
                          style={{ background: 'rgba(255, 255, 255, 0.9)', height: '150px', width: '150px' }}
                        >
                          <motion.div
                            className="rounded-full flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: s.color,       
                              height: '100px',           
                              width: '100px',
                            }}
                            animate={{
                              boxShadow: hoveredStep === idx 
                                ? [`0 0 30px ${s.glow}`, `0 0 50px ${s.glow}`, `0 0 30px ${s.glow}`]
                                : `0 0 15px ${s.glow}`
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {/* Circle Mesh Pattern */}
                            <div 
                              className="absolute inset-0 rounded-full opacity-30"
                              style={{
                                backgroundImage: `radial-gradient(circle at 30% 30%, white 0%, transparent 70%)`
                              }}
                            />
                            <motion.span 
                              className="text-2xl md:text-3xl font-bold text-white relative z-10"
                              animate={{
                                scale: hoveredStep === idx ? [1, 1.1, 1] : 1,
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: hoveredStep === idx ? Infinity : 0,
                              }}
                            >
                              {s.id}
                            </motion.span>
                          </motion.div>
                        </div>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      {/* Enhanced Circle on left */}
                      <motion.div 
                        className="absolute left-[-56px] z-10"
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div
                          className="rounded-full shadow-2xl flex items-center justify-center backdrop-blur-xl border-4 border-white/30"
                          style={{ background: 'rgba(255, 255, 255, 0.9)', height: '150px', width: '150px' }}
                        >
                          <motion.div
                            className="rounded-full flex items-center justify-center relative overflow-hidden"
                            style={{
                              background: s.color,       
                              height: '100px',           
                              width: '100px',
                            }}
                            animate={{
                              boxShadow: hoveredStep === idx 
                                ? [`0 0 30px ${s.glow}`, `0 0 50px ${s.glow}`, `0 0 30px ${s.glow}`]
                                : `0 0 15px ${s.glow}`
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {/* Circle Mesh Pattern */}
                            <div 
                              className="absolute inset-0 rounded-full opacity-30"
                              style={{
                                backgroundImage: `radial-gradient(circle at 30% 30%, white 0%, transparent 70%)`
                              }}
                            />
                            <motion.span 
                              className="text-2xl md:text-3xl font-bold text-white relative z-10"
                              animate={{
                                scale: hoveredStep === idx ? [1, 1.1, 1] : 1,
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: hoveredStep === idx ? Infinity : 0,
                              }}
                            >
                              {s.id}
                            </motion.span>
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Enhanced Card right with creative glassmorphism */}
                      <motion.div
                        whileHover={{ 
                          scale: 1.05, 
                          y: -10,
                          rotateY: -5,
                        }}
                        className="relative rounded-3xl w-full shadow-2xl p-6 pl-[100px] text-white min-h-[120px] flex flex-col justify-center transition-all duration-700 cursor-pointer overflow-hidden backdrop-blur-xl border border-white/20"
                        style={{ 
                          background: hoveredStep === idx 
                            ? `${s.meshGradient}, ${s.color}` 
                            : s.color 
                        }}
                      >
                        {/* Creative Mesh Pattern Background */}
                        <div 
                          className="absolute inset-0 rounded-3xl opacity-20"
                          style={{
                            backgroundImage: `
                              radial-gradient(circle at 20% 20%, ${s.glow} 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, ${s.glow} 0%, transparent 50%)
                            `
                          }}
                        />

                        {/* Animated Geometric Pattern */}
                        <motion.div
                          className="absolute inset-0 rounded-3xl opacity-10"
                          style={{
                            backgroundImage: `
                              linear-gradient(45deg, transparent 40%, white 50%, transparent 60%),
                              linear-gradient(-45deg, transparent 40%, white 50%, transparent 60%)
                            `,
                            backgroundSize: '15px 15px'
                          }}
                          animate={{
                            backgroundPosition: hoveredStep === idx 
                              ? ['0px 0px, 0px 0px', '15px 15px, -15px -15px', '0px 0px, 0px 0px']
                              : '0px 0px, 0px 0px'
                          }}
                          transition={{ duration: 4, repeat: Infinity }}
                        />

                        {/* Shimmer Effect */}
                        <AnimatePresence>
                          {hoveredStep === idx && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
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
                          <motion.h3 
                            className="text-xl md:text-2xl font-bold mb-3"
                            animate={{
                              x: hoveredStep === idx ? [0, -3, 0] : 0,
                            }}
                            transition={{
                              duration: 2,
                              repeat: hoveredStep === idx ? Infinity : 0,
                            }}
                          >
                            {s.title}
                          </motion.h3>
                          <motion.p 
                            className="text-sm leading-relaxed opacity-95"
                            animate={{
                              opacity: hoveredStep === idx ? [0.9, 1, 0.9] : 0.95,
                            }}
                            transition={{
                              duration: 3,
                              repeat: hoveredStep === idx ? Infinity : 0,
                            }}
                          >
                            {s.description}
                          </motion.p>
                        </div>

                        {/* Sparkle Effects */}
                        <AnimatePresence>
                          {hoveredStep === idx && (
                            <>
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className={`absolute w-1 h-1 ${s.sparkle} rounded-full`}
                                  initial={{ 
                                    opacity: 0, 
                                    scale: 0,
                                    x: -20 + i * 15,
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
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
