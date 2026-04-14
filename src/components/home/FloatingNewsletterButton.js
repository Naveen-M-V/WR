import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, CheckCircle } from 'lucide-react';
import { useFloatingButton } from '../contexts/FloatingButtonContext';

const FloatingNewsletterButton = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { activeButton, openNewsletter, closeAll } = useFloatingButton();
  const isOpen = activeButton === 'newsletter';

  // Show button after user scrolls a bit
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        closeAll();
        setIsSubmitted(false);
        setEmail('');
      }, 2000);
    }
  };

  const toggleOpen = () => {
    if (isOpen) {
      closeAll();
    } else {
      openNewsletter();
    }
    if (isSubmitted) {
      setIsSubmitted(false);
      setEmail('');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 100 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.6
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Main Floating Button */}
          <motion.button
            onClick={toggleOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative group"
          >
            {/* Glassmorphism Container */}
            <div className="relative p-4 bg-gradient-to-r from-white/10 via-white/15 to-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 overflow-hidden">

              {/* Animated Background Gradient */}
              <motion.div
                animate={{
                  background: [
                    'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
                    'linear-gradient(45deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1))',
                    'linear-gradient(45deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-2xl"
              />

              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-3">
                <motion.div
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                  ) : (
                    <Mail className="w-6 h-6 text-emerald-400" />
                  )}
                </motion.div>

                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{
                    opacity: isOpen ? 0 : 1,
                    width: isOpen ? 0 : 'auto'
                  }}
                  className="text-white font-semibold text-sm whitespace-nowrap overflow-hidden"
                >
                  Newsletter
                </motion.span>
              </div>

              {/* Pulse Effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-2xl"
              />
            </div>
          </motion.button>

          {/* Expanded Newsletter Form */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="absolute bottom-20 right-6 sm:right-0 w-72 sm:w-80 max-w-[calc(100vw-3rem)]"
              >
                {/* Glassmorphism Form Container */}
                <div className="relative p-6 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

                  {/* Animated Background */}
                  <motion.div
                    animate={{
                      background: [
                        'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)'
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0"
                  />

                  {/* Form Content */}
                  <div className="relative z-10">
                    {!isSubmitted ? (
                      <>
                        {/* Header */}
                        <div className="text-center mb-6">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                            className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg"
                          >
                            <Mail className="w-6 h-6 text-white" />
                          </motion.div>

                          <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl font-bold text-white mb-2"
                          >
                            Stay Updated!
                          </motion.h3>

                          <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white/70 text-sm"
                          >
                            Get the latest renewable energy insights and updates delivered to your inbox.
                          </motion.p>
                        </div>

                        {/* Form */}
                        <motion.form
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          onSubmit={handleSubmit}
                          className="space-y-4"
                        >
                          {/* Email Input */}
                          <div className="relative">
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              required
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-emerald-400/60 focus:bg-white/15 transition-all duration-300"
                            />
                            <motion.div
                              className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 pointer-events-none"
                              whileFocus={{ opacity: 1 }}
                            />
                          </div>

                          {/* Submit Button */}
                          <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Subscribe Now
                          </motion.button>
                        </motion.form>

                        {/* Footer */}
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="text-xs text-white/50 text-center mt-4"
                        >
                          No spam, unsubscribe anytime
                        </motion.p>
                      </>
                    ) : (
                      /* Success State */
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                          className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                        >
                          <CheckCircle className="w-8 h-8 text-white" />
                        </motion.div>

                        <h3 className="text-xl font-bold text-white mb-2">
                          Thank You!
                        </h3>
                        <p className="text-white/70 text-sm">
                          You've successfully subscribed to our newsletter.
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingNewsletterButton;
