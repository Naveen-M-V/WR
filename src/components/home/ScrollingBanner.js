import React from 'react';
import { motion } from 'framer-motion';
import { Sprout, Zap, Link, Recycle, Globe } from 'lucide-react';

const ScrollingBanner = () => {
  const bannerItems = [
    { text: "Driving B2B Partnerships for a Sustainable Energy Future", icon: Sprout },
    { text: "Connecting Trusted Renewable Businesses and solutions", icon: Zap },
    { text: "Green Innovators + Investors • Building the Future Together", icon: Link },
    { text: "Connecting Visionaries to Shape the Planet’s Tomorrow", icon: Recycle },
    { text: "Together - We Power a Cleaner Tomorrow", icon: Globe }
  ];

  return (
    <div className="fixed top-0 left-0 w-full text-xs bg-gradient-to-r from-[#000814] via-[#001a2e] to-[#000814] sm:text-sm py-3 overflow-hidden whitespace-nowrap z-50 shadow-lg border-b border-green-500/20">
      {/* Animated background gradient */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-green-600/20 via-blue-600/20 to-purple-600/20"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="relative">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="flex items-center gap-8 sm:gap-12 text-white font-medium"
        >
          {/* Repeat items multiple times for seamless scrolling */}
          {[...Array(4)].map((_, repeatIndex) => (
            <React.Fragment key={repeatIndex}>
              {bannerItems.map((item, index) => (
                <motion.div
                  key={`${repeatIndex}-${index}`}
                  className="flex items-center gap-2 px-4"
                  whileHover={{ scale: 1.05 }}
                >
                  <motion.div
                    className="flex items-center justify-center"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                  >
                    
                  </motion.div>
                  <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent font-semibold">
                    {item.text}
                  </span>
                  {index < bannerItems.length - 1 && (
                    <motion.div 
                      className="w-1 h-1 bg-green-400 rounded-full mx-4"
                      animate={{ 
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 1.5,
                        repeat: Infinity,
                        delay: index * 0.3
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </motion.div>
      </div>
      
      {/* Bottom border with animated gradient */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

export default ScrollingBanner;
