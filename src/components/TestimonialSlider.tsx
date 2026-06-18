"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Amit Sharma",
    role: "Software Architect & Active Trader",
    text: "Deepan's mentorship completely changed my approach to options trading. His strategies on risk containment are both practical and highly structured.",
  },
  {
    name: "Rajesh Kumar",
    role: "Proprietor, RK Enterprises",
    text: "Under Deepam Financial Services, my family assets grew steadily. Their approach is focused on capital protection first.",
  },
  {
    name: "Priya Sundar",
    role: "Senior Financial Analyst",
    text: "Highly professional wealth planning guidance. Deepan doesn't just manage portfolio options; he educates on money ethics and long-term values.",
  },
  {
    name: "Sneha Patel",
    role: "Full-Time Derivatives Trader",
    text: "The Elite Futures & Options course is a masterpiece. I went from trading randomly to designing rule-based strategy architectures.",
  },
  {
    name: "Vikram Malhotra",
    role: "VP Finance, Tech Corp",
    text: "Transparent, reliable, and modern. Deepan has been instrumental in restructuring our family trust planning and mutual fund allocations.",
  },
];

export default function TestimonialSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Autoplay effect with pause-on-hover
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const active = testimonials[activeIndex];

  return (
    <div 
      className="w-full max-w-4xl mx-auto px-4 py-8 flex flex-col items-center"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Editorial Quotation Marks */}
      <span className="text-[120px] font-serif leading-none text-primary/10 select-none -mb-8">
        “
      </span>
      
      <div className="text-center min-h-[160px] flex flex-col justify-center max-w-2xl">
        <p className="text-xl sm:text-2xl font-serif text-gray-900 leading-relaxed italic mb-6">
          {active.text}
        </p>
        <div>
          <h4 className="font-bold text-base text-gray-900">{active.name}</h4>
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mt-1">
            {active.role}
          </p>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="flex items-center space-x-6 mt-8">
        <button
          onClick={handlePrev}
          className="p-2.5 rounded-full border border-border-custom bg-white hover:border-primary text-gray-900 hover:text-primary transition-colors cursor-pointer outline-none"
          aria-label="Previous testimonial"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-gray-500 font-medium tracking-widest uppercase select-none">
          {activeIndex + 1} / {testimonials.length}
        </span>
        <button
          onClick={handleNext}
          className="p-2.5 rounded-full border border-border-custom bg-white hover:border-primary text-gray-900 hover:text-primary transition-colors cursor-pointer outline-none"
          aria-label="Next testimonial"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
