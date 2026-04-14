"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [
  { id: 1, src: "/images/slide1.jpg", alt: "Slide 1" },
  { id: 2, src: "/images/slide2.jpg", alt: "Slide 2" },
  { id: 3, src: "/images/slide3.jpg", alt: "Slide 3" },
];

export default function Carousel() {
  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={15}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ 
          clickable: true,
          dynamicBullets: true
        }}
        autoplay={{ delay: 3000 }}
        loop
        breakpoints={{
          640: {
            spaceBetween: 20,
          },
          768: {
            spaceBetween: 25,
          },
          1024: {
            spaceBetween: 30,
          },
        }}
        className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-lg"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-lg sm:rounded-xl lg:rounded-2xl"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
