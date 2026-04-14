"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin, Globe, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import DocumentModal from "./common/DocumentModal";
import { API_BASE_URL } from "../config";

export default function Footer() {
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const legalDocs = [
    { title: "Acceptable Content & Community Guidelines", file: "/ACCEPTABLE CONTENT AND COMMUNITY GUIDELINES.docx" },
    { title: "Cookies Policy", file: "/COOKIES POLICY.docx" },
    { title: "Data Processing Addendum (DPA)", file: "/DATA PROCESSING ADDENDUM (DPA).docx" },
    { title: "User Content & License", file: "/USER CONTENT & LICENSE.docx" },
    { title: "User Content Acceptable Use Policy", file: "/USER CONTENT ACCEPTABLE USE POLICY.docx" },
    { title: "Complaints & Content Takedown Policy", file: "/COMPLAINTS & CONTENT TAKEDOWN POLICY.docx" },
    { title: "Terms and Conditions", file: "/Terms and Conditions.docx" },
    { title: "Privacy Policy", file: "/Privacy Policy.docx" },
  ];

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
    setModalOpen(true);
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;

    setIsSubscribing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/contact/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert("You're successfully subscribed to Which Renewables newsletter.");
        setNewsletterEmail("");
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

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-grteay-950 to-black">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-40 left-1/2 h-96 w-[48rem] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-56 left-0 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute -bottom-56 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12">
            <motion.h3
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl font-semibold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif", fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Our Clients
            </motion.h3>

            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black/70 to-transparent" />
              <div className="flex items-center gap-10 px-6 py-5 animate-scroll-footer">
                {[...Array(2)].map((_, repeatIndex) => (
                  <React.Fragment key={repeatIndex}>
                    <img src="/logos/1.png" alt="Client Logo 2" className="h-10 w-28 object-contain" />
                    <img src="/logos/2.png" alt="Client Logo 3" className="h-10 w-28 object-contain" />
                    <img src="/logos/3.png" alt="Client Logo 5" className="h-10 w-28 object-contain" />
                    <img src="/logos/4.png" alt="Client Logo 6" className="h-10 w-28 object-contain" />
                    <img src="/logos/5.png" alt="Client Logo 7" className="h-10 w-28 object-contain" />
                    <img src="/logos/6.png" alt="Client Logo 8" className="h-10 w-28 object-contain" />
                    <img src="/logos/7.png" alt="Client Logo 9" className="h-10 w-28 object-contain" />
                    <img src="/logos/8.png" alt="Client Logo 10" className="h-10 w-28 object-contain" />
                    <img src="/logos/9.png" alt="Client Logo 11" className="h-10 w-28 object-contain" />
                    <img src="/logos/10.png" alt="Client Logo 12" className="h-10 w-28 object-contain" />
                    <img src="/logos/11.png" alt="Client Logo 13" className="h-10 w-28 object-contain" />
                    <img src="/logos/12.png" alt="Client Logo 14" className="h-10 w-28 object-contain" />
                  </React.Fragment>
                ))}
              </div>
            </div>

            <style>{`
              @keyframes scroll-footer {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll-footer {
                width: max-content;
                display: flex;
                animation: scroll-footer 32s linear infinite;
              }
            `}</style>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {/* Column 1: Logo & Address */}
          <div className="flex flex-col gap-4">
            {/* Top: Logo */}
            <div>
              <div className="flex items-center px-2 gap-3">
                <img src="/wr.png" alt="Which Renewables Logo" className="h-20 w-auto" />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-emerald-200/90 bg-emerald-400/10 border border-emerald-300/15 px-2 py-0.5 rounded-full text-[11px] tracking-wide">
                  Renewable Energy
                </span>
                <span className="text-teal-200/90 bg-teal-400/10 border border-teal-300/15 px-2 py-0.5 rounded-full text-[11px] tracking-wide">
                  Sustainability
                </span>
                <span className="text-sky-200/90 bg-sky-400/10 border border-sky-300/15 px-2 py-0.5 rounded-full text-[11px] tracking-wide">
                  ESG
                </span>
                <span className="text-emerald-200/90 bg-emerald-400/10 border border-emerald-300/15 px-2 py-0.5 rounded-full text-[11px] tracking-wide">
                  Environmental
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

            {/* Bottom: Address */}
            <div>
              <div className="text-white font-semibold text-sm mb-2">Our Offices</div>
              <div className="space-y-1 text-[11px] text-gray-400 leading-relaxed">
                <div>
                  <span className="text-emerald-200 block mb-0.5">Which Renewables Solution Ltd:</span>
                  Registered Office: 1-7 Park Row, Leeds, England, CR3 5TB
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">UK office:</span>
                  Allens Farm, Wivenhoe Rd, Colchester - CO7 7BN
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">NI – ROI office:</span>
                  Portglenone, Co. Antrim BT44 8BD
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Company & Reach Us */}
          <div className="flex flex-col gap-4">
            {/* Top: Company */}
            <div>
              <div className="text-white font-semibold mb-2 text-sm">Company</div>
              <div className="space-y-1">
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/about">
                  About
                </Link>
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/contact-us">
                  Contact
                </Link>
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/work-with-us">
                  Work With Us
                </Link>
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/meet-our-team">
                  Meet Our Team
                </Link>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

            {/* Bottom: Reach Us */}
            <div>
              <div className="text-white font-semibold text-sm mb-2">Reach Us</div>
              <div className="space-y-1 text-[11px] text-gray-400">
                <div>
                  <span className="text-emerald-200 block mb-0.5">For Sales & Marketing:</span>
                  sales@whichrenewables.com
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">For Support Centre:</span>
                  Support@whichrenewables.com
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">For Financial Enquiries:</span>
                  finance@whichrenewables.com
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">To Work with us:</span>
                  admin@whichrenewables.com
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">Phone:</span>
                  +44 07774878269
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Explore & Company Info */}
          <div className="flex flex-col gap-4">
            {/* Top: Explore */}
            <div>
              <div className="text-white font-semibold mb-2 text-sm">News and Events</div>
              <div className="space-y-1">
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/news-events/todays-industry-news">
                 Today's Industry NEWS Stories
                </Link>
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/news-events/whats-happening-region">
                  What's Happening In Your Region?
                </Link>
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/news-events/trade-shows-events">
                  Trade Shows / Events & Exhibitions
                </Link>
                <Link className="block text-gray-400 hover:text-white transition text-xs" to="/news-events/industry-webinars">
                  Industry Webinars and Podcasts
                </Link>
              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent" />

            {/* Bottom: Company Info */}
            <div>
              <div className="text-white font-semibold text-sm mb-2">Which Renewable Information</div>
              <div className="space-y-1 text-[11px] text-gray-400">
                <div>
                  <span className="text-emerald-200 block mb-0.5">Company Name:</span>
                  Which Renewable Solutions Ltd
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">Company Number:</span>
                  16177786
                </div>
                <div>
                  <span className="text-emerald-200 block mb-0.5">Company VAT Registration Number:</span>
                  505140832
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Legals */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-white font-semibold mb-2 text-sm">Legals</div>
              <div className="space-y-1">
                {legalDocs.map((doc, index) => (
                  <button
                    key={index}
                    onClick={() => handleDocClick(doc)}
                    className="block text-left text-gray-400 hover:text-white transition text-xs w-full"
                  >
                    {doc.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Newsletter Subscription - Small */}
            <div className="mt-2 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="text-white font-semibold text-xs mb-1">Newsletter</div>
              <form className="flex gap-1" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Email"
                  className="px-2 py-1 bg-slate-900/80 border border-emerald-500/30 rounded text-white text-xs placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 flex-1 min-w-0"
                  required
                  disabled={isSubscribing}
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded hover:bg-emerald-400 transition whitespace-nowrap disabled:opacity-50"
                >
                  {isSubscribing ? 'Joining' : 'Join'}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-white/10 pt-4 text-center">
          <div className="text-xs text-gray-500">© {new Date().getFullYear()} Which Renewables. All rights reserved.</div>
        </div>
      </div>

      <DocumentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedDoc?.title || "Document"}
        fileName={selectedDoc?.file}
      />
    </footer>
  );
}
