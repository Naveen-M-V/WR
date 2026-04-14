import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Video } from "lucide-react";
import { useFloatingButton } from "../contexts/FloatingButtonContext";

const STORAGE_KEY = "whichrenewables_floating_ai_video_state";

export default function FloatingAIVideo() {
  const [isVisible, setIsVisible] = useState(true);
  const { activeButton, openVideo, closeAll } = useFloatingButton();
  const isOpen = activeButton === 'video';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed?.isVisible === "boolean") setIsVisible(parsed.isVisible);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isVisible }));
    } catch {
      // ignore
    }
  }, [isVisible]);

  const videoSrc = useMemo(() => {
    return "/ai.mp4";
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[60]">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="ai-video-open"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-white/15 bg-black/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <Video className="w-4 h-4 text-emerald-300" />
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => closeAll()}
                  className="px-2 py-1 text-[11px] text-white/80 hover:text-white hover:bg-white/10 rounded-md transition"
                >
                  Minimize
                </button>
              </div>
            </div>

            <div className="bg-black">
              <video
                src={videoSrc}
                controls
                playsInline
                preload="metadata"
                className="w-full h-[160px] object-cover"
              />
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="ai-video-minimized"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={() => openVideo()}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] px-3 py-2 text-white"
          >
            <Video className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-semibold">AI Video</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
