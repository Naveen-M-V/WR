import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";
import { API_BASE_URL } from "../config";

const STORAGE_KEY = "whichrenewables_floating_newsletter_state";

export default function FloatingNewsletter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed?.isOpen === "boolean") setIsOpen(parsed.isOpen);
      if (typeof parsed?.isVisible === "boolean") setIsVisible(parsed.isVisible);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isOpen, isVisible }));
    } catch {
      // ignore
    }
  }, [isOpen, isVisible]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert("You're successfully subscribed to Which Renewables newsletter.");
        setEmail("");
        // Optionally auto-close after a short delay
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        alert("Failed to subscribe: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Newsletter error", error);
      alert("Failed to subscribe.");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-[130px] z-[60]">
      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="newsletter-open"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-[280px] sm:w-[320px] rounded-2xl overflow-hidden border border-white/15 bg-black/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
              <div className="flex items-center gap-2 min-w-0">
                <Mail className="w-4 h-4 text-emerald-300" />
                <span className="text-xs font-semibold text-white">Newsletter</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-2 py-1 text-[11px] text-white/80 hover:text-white hover:bg-white/10 rounded-md transition"
                >
                  Minimize
                </button>
              </div>
            </div>

            <div className="p-4 bg-black/40">
              <p className="text-white/70 text-xs mb-3">
                Get the latest renewable energy insights and updates delivered to your inbox.
              </p>
              <form onSubmit={handleSubmit} className="space-y-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-white/10 border border-white/15 rounded-lg text-white text-xs placeholder-white/40 focus:outline-none focus:border-emerald-500/50 disabled:opacity-50"
                  required
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : 'Subscribe'}
                </button>
              </form>
              <p className="text-white/40 text-[10px] text-center mt-2">
                No spam, unsubscribe anytime
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.button
            key="newsletter-minimized"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 rounded-2xl border border-white/15 bg-black/60 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] px-3 py-2 text-white"
          >
            <Mail className="w-4 h-4 text-emerald-300" />
            <span className="text-xs font-semibold">Newsletter</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
