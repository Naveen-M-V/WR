import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Linkedin } from 'lucide-react';

// Scrollbar styles for the popup
const ScrollbarStyles = () => {
  useEffect(() => {
    const styleId = 'team-member-scrollbar-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .scrollbar-themed::-webkit-scrollbar {
        width: 8px;
      }
      .scrollbar-themed::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
      }
      .scrollbar-themed::-webkit-scrollbar-thumb {
        background: rgba(16, 185, 129, 0.5);
        border-radius: 4px;
      }
      .scrollbar-themed::-webkit-scrollbar-thumb:hover {
        background: rgba(16, 185, 129, 0.7);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      const existing = document.getElementById(styleId);
      if (existing) existing.remove();
    };
  }, []);
  
  return null;
};

const TeamMember = ({ member, index, delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const linkedinUrl = member?.linkedin
    ? `https://www.linkedin.com/in/${member.linkedin}`
    : null;

  const getColorTheme = (position) => {
    const positionLower = position.toLowerCase();
    
    if (positionLower.includes('managing director')) {
      return {
        primary: 'green',
        gradient: 'from-green-400/20 to-emerald-500/20',
        border: 'border-green-400/50',
        text: 'text-green-600',
        badge: 'text-green-700',
        bgGradient: 'bg-gradient-to-br from-green-50 to-emerald-50',
        social: 'rgba(16, 185, 129, 0.2)',
        glow: 'rgba(16, 185, 129, 0.1)',
        sparkle: 'bg-green-400',
        hoverBg: 'hover:bg-green-100/50'
      };
    } else if (positionLower.includes('sustainability')) {
      return {
        primary: 'blue',
        gradient: 'from-blue-400/20 to-indigo-500/20',
        border: 'border-blue-400/50',
        text: 'text-blue-600',
        badge: 'text-blue-700',
        bgGradient: 'bg-gradient-to-br from-blue-50 to-indigo-50',
        social: 'rgba(59, 130, 246, 0.2)',
        glow: 'rgba(59, 130, 246, 0.1)',
        sparkle: 'bg-blue-400',
        hoverBg: 'hover:bg-blue-100/50'
      };
    } else if (positionLower.includes('internet technology') || positionLower.includes('it')) {
      return {
        primary: 'orange',
        gradient: 'from-orange-400/20 to-amber-500/20',
        border: 'border-orange-400/50',
        text: 'text-orange-600',
        badge: 'text-orange-700',
        bgGradient: 'bg-gradient-to-br from-orange-50 to-amber-50',
        social: 'rgba(249, 115, 22, 0.2)',
        glow: 'rgba(249, 115, 22, 0.1)',
        sparkle: 'bg-orange-400',
        hoverBg: 'hover:bg-orange-100/50'
      };
    } else if (positionLower.includes('coordinator') || positionLower.includes('content')) {
      return {
        primary: 'pink',
        gradient: 'from-pink-400/20 to-rose-500/20',
        border: 'border-pink-400/50',
        text: 'text-pink-600',
        badge: 'text-pink-700',
        bgGradient: 'bg-gradient-to-br from-pink-50 to-rose-50',
        social: 'rgba(236, 72, 153, 0.2)',
        glow: 'rgba(236, 72, 153, 0.1)',
        sparkle: 'bg-pink-400',
        hoverBg: 'hover:bg-pink-100/50'
      };
    } else if (positionLower.includes('global power') || positionLower.includes('energy')) {
      return {
        primary: 'purple',
        gradient: 'from-purple-400/20 to-violet-500/20',
        border: 'border-purple-400/50',
        text: 'text-purple-600',
        badge: 'text-purple-700',
        bgGradient: 'bg-gradient-to-br from-purple-50 to-violet-50',
        social: 'rgba(147, 51, 234, 0.2)',
        glow: 'rgba(147, 51, 234, 0.1)',
        sparkle: 'bg-purple-400',
        hoverBg: 'hover:bg-purple-100/50'
      };
    } else if (positionLower.includes('legal')) {
      return {
        primary: 'red',
        gradient: 'from-red-400/20 to-rose-500/20',
        border: 'border-red-400/50',
        text: 'text-red-600',
        badge: 'text-red-700',
        bgGradient: 'bg-gradient-to-br from-red-50 to-rose-50',
        social: 'rgba(239, 68, 68, 0.2)',
        glow: 'rgba(239, 68, 68, 0.1)',
        sparkle: 'bg-red-400',
        hoverBg: 'hover:bg-red-100/50'
      };
    } else if (positionLower.includes('finance')) {
      return {
        primary: 'cyan',
        gradient: 'from-cyan-400/20 to-teal-500/20',
        border: 'border-cyan-400/50',
        text: 'text-cyan-600',
        badge: 'text-cyan-700',
        bgGradient: 'bg-gradient-to-br from-cyan-50 to-teal-50',
        social: 'rgba(34, 211, 238, 0.2)',
        glow: 'rgba(34, 211, 238, 0.1)',
        sparkle: 'bg-cyan-400',
        hoverBg: 'hover:bg-cyan-100/50'
      };
    }
    
    return {
      primary: 'indigo',
      gradient: 'from-indigo-400/20 to-purple-500/20',
      border: 'border-indigo-400/50',
      text: 'text-indigo-600',
      badge: 'text-indigo-700',
      bgGradient: 'bg-gradient-to-br from-indigo-50 to-purple-50',
      social: 'rgba(99, 102, 241, 0.2)',
      glow: 'rgba(99, 102, 241, 0.1)',
      sparkle: 'bg-indigo-400',
      hoverBg: 'hover:bg-indigo-100/50'
    };
  };

  const theme = getColorTheme(member.position);
  const rotateDirection = index % 2 === 0 ? 1 : -1;

  return (
    <>
      <ScrollbarStyles />
      <motion.div 
        initial={{ opacity: 0, y: 50, rotateY: rotateDirection * -15 }}
        whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
        transition={{ duration: 0.8, delay }}
        viewport={{ once: true }}
        className="relative h-full"
      >
      {/* Card Container */}
      <motion.div
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ y: -8, scale: 1.02 }}
        className="relative backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer h-full flex flex-col"
        style={{
          background: `linear-gradient(135deg, rgba(255, 255, 255, 0.1), ${theme.glow}, rgba(255, 255, 255, 0.05))`
        }}
      >
        {/* Animated Background Gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{ duration: 6, repeat: Infinity, type: "tween" }}
        />

        {/* Profile Section */}
        <div className="relative z-10 p-6 sm:p-8 flex-1 flex flex-col">
          {/* Image */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.3 }}
            >
              {/* Rotating Ring */}
              <motion.div
                className={`absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 ${theme.border}`}
                animate={{ rotate: rotateDirection * 360 }}
                transition={{ duration: 20 - index * 2, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/40 shadow-lg">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Sparkle */}
              <motion.div
                className={`absolute -top-1 -right-1 w-3 h-3 ${theme.sparkle} rounded-full`}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + index * 0.2,
                  repeat: Infinity,
                  repeatDelay: 1 + index * 0.3,
                  type: "tween",
                }}
              />
            </motion.div>
          </div>

          {/* Name and Position */}
          <motion.h3 
            className={`text-lg sm:text-xl font-bold ${theme.text} text-center mb-2`}
            whileHover={{ scale: 1.05 }}
          >
            {member.name}
          </motion.h3>
          
          <motion.div
            className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 ${theme.bgGradient} backdrop-blur-sm border ${theme.border} rounded-full mb-4 mx-auto`}
            whileHover={{ scale: 1.05 }}
          >
            <div className={`w-2 h-2 ${theme.sparkle} rounded-full animate-pulse`} />
            <p className={`${theme.badge} font-semibold text-xs sm:text-sm`}>{member.position}</p>
          </motion.div>

          {/* Description */}
          <p className={`text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3`}>
            {member.description}
          </p>

          {/* Contact Info - Always Visible */}
          <div className="space-y-2 mt-auto">
            {linkedinUrl && (
              <motion.a
                href={linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center gap-2 text-xs sm:text-sm ${theme.text} group/contact`}
                whileHover={{ x: 4 }}
              >
                <Linkedin size={16} className="flex-shrink-0" />
                <span className="hover:underline truncate">{member.linkedin}</span>
              </motion.a>
            )}
            <motion.div 
              className={`flex items-center gap-2 text-xs sm:text-sm ${theme.text} group/contact`}
              whileHover={{ x: 4 }}
            >
              <Mail size={16} className="flex-shrink-0" />
              <a href={`mailto:${member.email}`} className="hover:underline truncate">
                {member.email}
              </a>
            </motion.div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}
        />
      </motion.div>

      {/* Expanded Details Modal */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="backdrop-blur-2xl border border-white/30 rounded-2xl max-w-xl w-full max-h-[70vh] overflow-y-auto shadow-2xl scrollbar-themed"
              style={{
                background: `linear-gradient(135deg, rgba(255, 255, 255, 0.15), ${theme.glow}, rgba(255, 255, 255, 0.05))`,
                scrollbarWidth: 'thin',
                scrollbarColor: `${theme.social} rgba(255,255,255,0.1)`
              }}
            >
              {/* Glassmorphism Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} rounded-2xl`}
                animate={{
                  opacity: [0.05, 0.1, 0.05],
                }}
                transition={{ duration: 6, repeat: Infinity, type: "tween" }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="p-5 sm:p-6 border-b border-white/20 backdrop-blur-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={member.image}
                        alt={member.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 border-white/40 shadow-lg"
                      />
                      <div>
                        <h2 className={`text-xl sm:text-2xl font-bold ${theme.text}`}>
                          {member.name}
                        </h2>
                        <p className={`${theme.badge} font-semibold text-sm sm:text-base`}>
                          {member.position}
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsExpanded(false)}
                      className={`text-xl sm:text-2xl ${theme.text} hover:opacity-70 flex-shrink-0`}
                    >
                      ✕
                    </motion.button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Full Description */}
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold ${theme.text} mb-2`}>About</h3>
                    <p className="text-white/80 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">
                      {member.description}
                    </p>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className={`text-base sm:text-lg font-bold ${theme.text} mb-2`}>Contact</h3>
                    <div className="space-y-2">
                      <motion.a 
                        href={`mailto:${member.email}`}
                        className={`flex items-center gap-2 p-2.5 sm:p-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300`}
                        whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                      >
                        <Mail size={18} className="text-white/80 flex-shrink-0" />
                        <span className="text-white/90 hover:text-white font-medium text-xs sm:text-sm truncate">
                          {member.email}
                        </span>
                      </motion.a>
                      {linkedinUrl && (
                        <motion.a
                          href={linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-2 p-2.5 sm:p-3 backdrop-blur-sm bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300`}
                          whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                        >
                          <Linkedin size={18} className="text-white/80 flex-shrink-0" />
                          <span className="text-white/90 hover:text-white font-medium text-xs sm:text-sm truncate">
                            {member.linkedin}
                          </span>
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
    </>
  );
};

export default TeamMember;
