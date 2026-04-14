import React from "react";
import { CircularTestimonials } from './circular-testimonials';

const testimonials = [
  {
    quote:
      "Leading the renewable transition through solar storage and green infrastructure. Our innovative approach combines cutting-edge technology with sustainable practices.",
    name: "Emerald Energy Solutions",
    designation: "Green Infrastructure",
    src:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "Innovating with AI and smart systems to accelerate sustainable energy deployment. Our intelligent solutions optimize performance and maximize efficiency.",
    name: "SolarNova Technologies",
    designation: "AI Energy Systems",
    src:
      "https://images.unsplash.com/photo-1559028012-cdad4cb271e2?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "R&D for next-gen PV materials and ultra-light modules. Pushing the boundaries of solar technology with breakthrough innovations in photovoltaic materials.",
    name: "SolarNova Labs",
    designation: "Solar R&D",
    src:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const CircularTestimonialsDemo = () => (
  <section>
    {/* Dark testimonials section matching the existing theme */}
    <div className="bg-[#051f46] p-16 rounded-lg min-h-[300px] flex flex-wrap gap-6 items-center justify-center relative">
      <div
        className="items-center justify-center relative flex"
        style={{ maxWidth: "1024px" }}
      >
        <CircularTestimonials
          testimonials={testimonials}
          autoplay={true}
          colors={{
            name: "#f7f7ff",
            designation: "#e1e1e1",
            testimony: "#f1f1f7",
            arrowBackground: "#0582CA",
            arrowForeground: "#141414",
            arrowHoverBackground: "#f7f7ff",
          }}
          fontSizes={{
            name: "28px",
            designation: "20px",
            quote: "20px",
          }}
        />
      </div>
    </div>
  </section>
);

export default CircularTestimonialsDemo;
