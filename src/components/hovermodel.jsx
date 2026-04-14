"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HoverModal({ children }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative"
    >
      {children}

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full mt-2 left-0 right-0
                        bg-white/30 backdrop-blur-md border border-white/20
                        rounded-lg p-4 shadow-lg z-50"
          >
            <p className="text-green-800 font-semibold">
              Hello there! I’m your frosted glass tooltip.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
