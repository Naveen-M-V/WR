import React from "react";
import { motion } from "framer-motion";

const ClientsSection = () => {
  const clients = [
    { name: "Google", logo: "/logos/logo1.PNG" },
    { name: "Amazon", logo: "/logos/logo2.PNG" },
    { name: "Pinterest", logo: "/logos/logo3.PNG" },
    { name: "Instagram", logo: "/logos/logo4.PNG" },
    
  ];

  // Duplicate list for seamless looping
  const repeatedClients = [...clients, ...clients];

  return (
    <section className="relative px-4 sm:px-6 lg:px-10 py-16 bg-[#051f46] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent mb-6 leading-tight"
          >
            Our Clients
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg text-white/80 max-w-4xl mx-auto leading-relaxed"
          >
            Partnering with leading organizations in the renewable energy sector
          </motion.p>
        </motion.div>
      </div>

      {/* Auto-scroll carousel */}
      <div className="relative w-full overflow-hidden">
        <div className="flex items-center justify-start gap-12 animate-scroll">
          {repeatedClients.map((client, index) => (
            <div key={index} className="flex-shrink-0">
              <img
                src={client.logo}
                className="w-28 h-auto filter grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS animation */}
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          width: max-content;
          display: flex;
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default ClientsSection;
