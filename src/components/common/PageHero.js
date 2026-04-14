import React from "react";

const PageHero = ({ title, imageUrl }) => {
  return (
    <section className="shadow-lg shadow-black/30 relative w-full h-[320px] sm:h-[420px] md:h-[520px] lg:h-[620px] flex items-center justify-center text-center text-white overflow-hidden rounded-none">
      <img
        src={imageUrl}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover brightness-75 shadow-inner"
      />
      {/* Light shadow overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />
      <h1 className="relative px-4 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold z-10 drop-shadow-[0_8px_30px_rgba(0,0,0,0.7)]">
        {title}
      </h1>
    </section>
  );
};

export default PageHero;
