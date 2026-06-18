"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Shield,
  BookOpen,
  Layers,
  Landmark,
  Check,
  Mail,
  Phone,
  ArrowRight,
  Menu,
  X,
  Clock,
  Target,
  Compass,
  Award,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  BarChart2,
  Loader2
} from "lucide-react";
import TiltCard from "@/components/TiltCard";
import TestimonialSlider from "@/components/TestimonialSlider";
import ScrollReveal from "@/components/ScrollReveal";
import CountUp from "@/components/CountUp";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Magnetic Button Wrapper
function MagneticButton({
  children,
  className = "",
  href = "",
  onClick,
  target,
  rel
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Magnetic shift (max 8px)
    setPosition({ x: x * 0.12, y: y * 0.12 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      onClick={onClick}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 25, mass: 0.5 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.a>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // GSAP Timeline Ref and Scroll Hooks
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const timelineProgressRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Subtle Parallax (max 18px shift)
  const yParallax = useTransform(scrollY, [0, 900], [0, -18]);

  // Monitor scroll for navbar transitions and active section hashing
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      // Simple active nav tracker based on viewport bounds
      const sections = ["home", "about", "services", "courses", "contact"];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveNav(section);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // GSAP Timeline fill trigger
  useEffect(() => {
    if (!timelineProgressRef.current || !timelineContainerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        timelineProgressRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineContainerRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const scriptUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_SCRIPT_URL;

    if (!scriptUrl) {
      console.warn("Google Sheets Script URL is not set in environment variables. Simulating form submission.");
      // Fallback: simulate API call if the environment variable is missing
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
        setContactForm({ name: "", phone: "", email: "", service: "", message: "" });
        setTimeout(() => {
          setIsSubmitted(false);
        }, 3000);
      }, 1500);
      return;
    }

    try {
      const serviceLabels: Record<string, string> = {
        academy: "Wealth Mentorship Academy",
        planning: "Portfolio & Investment Planning",
        options: "Option Strategies & Trading",
        angel: "Angel One Platform Support",
        awareness: "Financial Awareness Initiative",
        other: "Other Inquiry"
      };

      const payload = {
        name: contactForm.name,
        phone: contactForm.phone,
        email: contactForm.email,
        service: serviceLabels[contactForm.service] || contactForm.service || "",
        message: contactForm.message,
        timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
      };

      // We send request as JSON. Using 'no-cors' mode is required for Google Apps Script Web Apps
      // to bypass browser CORS redirection policies on 302 redirects.
      await fetch(scriptUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "text/plain"
        },
        body: JSON.stringify(payload)
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      setContactForm({ name: "", phone: "", email: "", service: "", message: "" });
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError("Failed to submit request. Please try again or contact us directly.");
      setIsSubmitting(false);
    }
  };

  // Split word anim helper
  const headingWords = "Financial Guidance Built on Trust, Knowledge & Long-Term Relationships".split(" ");

  return (
    <div className="min-h-screen bg-white text-gray-900 bg-grid-pattern relative overflow-hidden">

      {/* Background Graphic Lines (<3% opacity) */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] overflow-hidden z-0">
        <svg className="w-full h-full min-h-[4000px]" viewBox="0 0 1440 3000" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 450C300 380 500 120 900 280C1200 350 1300 220 1440 50" stroke="currentColor" strokeWidth="2.5" strokeDasharray="8 8" />
          <path d="M0 900C250 820 620 540 850 670C1050 780 1250 420 1440 520" stroke="currentColor" strokeWidth="1.5" />
          <path d="M0 1600C400 1400 800 1700 1100 1450C1300 1300 1400 1480 1440 1350" stroke="currentColor" strokeWidth="2" strokeDasharray="12 6" />
        </svg>
      </div>

      {/* NAVBAR */}
      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-white/95 border-b border-gray-200 shadow-sm py-4"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#home" className="flex items-center space-x-3 group">
            <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full" />
            <span className="font-serif font-bold text-lg tracking-wider text-gray-900 group-hover:text-primary transition-colors">
              Deepam Financial
            </span>
          </a>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wider uppercase relative">
            {["home", "about", "services", "courses", "contact"].map((link) => (
              <a
                key={link}
                href={`#${link}`}
                className="text-gray-600 hover:text-primary transition-colors duration-300 relative py-1"
              >
                {link}
                {activeNav === link && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton
              href="#contact"
              className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider border border-gray-200 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
            >
              Book Appointment
            </MagneticButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-900 hover:text-primary focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200 p-6 shadow-lg flex flex-col space-y-4 md:hidden"
          >
            {["home", "about", "services", "courses", "contact"].map((link) => (
              <a
                key={link}
                href={`#${link}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-gray-600 hover:text-primary"
              >
                {link}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-lg text-xs font-bold uppercase border border-gray-200 hover:border-primary text-gray-900"
            >
              Book Appointment
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section id="home" className="min-h-screen pt-32 pb-20 px-6 flex items-center justify-center bg-[#FCFCFA] relative">
        <div className="max-w-4xl mx-auto w-full">
          {/* Centered Hero Content */}
          <motion.div
            style={{ y: yParallax }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center space-y-8 w-full"
          >
            {/* Animated Role Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase mb-2"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span>Deepam Financial Services</span>
            </motion.div>

            {/* Centered Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-gray-900 leading-tight tracking-tight max-w-3xl">
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-2 sm:mr-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Centered Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed text-center"
            >
              Helping individuals build financial confidence through education, investment planning, and responsible wealth creation.
            </motion.p>

            {/* Centered CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <MagneticButton
                href="#contact"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-primary text-white hover:bg-primary/95 hover:shadow-md transition-all text-center cursor-pointer"
              >
                Book Consultation
              </MagneticButton>
              <MagneticButton
                href="#courses"
                className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-bold text-xs uppercase tracking-wider border border-border-custom bg-transparent text-gray-900 hover:bg-background-soft hover:border-gray-600 transition-all text-center cursor-pointer"
              >
                Explore Courses
              </MagneticButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 px-6 bg-[#F8F7F4] border-t border-b border-border-custom relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Column Image with Zoom Hover */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: "0 15px 35px -5px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="w-[280px] sm:w-[350px] aspect-[4/5] rounded-2xl border border-border-custom bg-white overflow-hidden p-3 shadow-md cursor-pointer"
            >
              <img
                src="/assets/profile.png"
                alt="Deepan S B - Mentorship"
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          </div>

          {/* Right Column Content */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">About Deepan S B</span>

            </div>
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900">
              Proprietor & Principal Mentor
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
              As the Proprietor of Deepam Financial Services, Deepan S B is a dedicated wealth management practitioner and stock market educator. He guides retail investors, corporate professionals, and students with structural rules designed for capital preservation and rule-based market execution.
            </p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-sans">
              Through transparency and systematic mentoring, Deepan helps clients align long-term compounding targets with concrete risk strategies rather than speculative cycles.
            </p>

            {/* Angel One Partnership Highlight Callout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-start gap-4 p-4 rounded-xl border border-secondary/10 bg-secondary/5 mt-2"
            >
              <div className="p-1.5 rounded-lg bg-white border border-secondary/15 shrink-0 mt-0.5 flex items-center justify-center">
                <img src="/assets/angelone.svg" alt="Angel One Logo" className="h-5 w-auto object-contain" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-secondary">Angel One Authorized Partner</h4>
                <p className="text-[12px] text-gray-600 font-sans leading-relaxed">
                  Deepam Financial Services is officially authorized with Angel One, offering secure account setup, portfolio support, and transaction execution guidance.
                </p>
              </div>
            </motion.div>

            {/* Statistics grid with CountUp */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-border-custom">
              <div>
                <h4 className="text-3xl font-serif font-bold text-gray-900">
                  <CountUp end={10} suffix="+" />
                </h4>
                <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Years Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-gray-900">
                  <CountUp end={15000} suffix="+" />
                </h4>
                <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Students Mentored</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-gray-900">
                  <CountUp end={50} suffix="+" />
                </h4>
                <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Awareness Programs</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-gray-900">
                  <CountUp end={500} suffix="+" />
                </h4>
                <p className="text-gray-500 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mt-1">Client Relations</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* GSAPstory TIMELINE SECTION */}
      <section className="py-24 px-6 bg-[#FCFCFA] z-10 relative" ref={timelineContainerRef}>
        <ScrollReveal className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Foundational Journey</span>
            <h2 className="text-3xl font-serif text-gray-900 mt-2">The Financial Story</h2>
          </div>

          {/* Progress filled Vertical Timeline */}
          <div className="relative border-l border-border-custom ml-4 md:ml-32 py-4 space-y-12">

            {/* GSAP Progress Line */}
            <div
              ref={timelineProgressRef}
              className="absolute left-[-1px] top-0 bottom-0 w-[2px] bg-primary origin-top"
              style={{ transform: "scaleY(0)" }}
            />

            {[
              {
                title: "Financial Awareness",
                desc: "To structure stable wealth management blueprints that assist families in capturing compounds safely over long-term timelines.",
                icon: Target,
              },
              {
                title: "Investment Planning",
                desc: "Cultivating widespread financial literacy across tiers of retail traders, helping them apply rule-based execution platforms.",
                icon: Compass,
              },
              {
                title: "Risk Management",
                desc: "Transparency, compliance, and strict downside protection modeling. We advocate for safety metrics first.",
                icon: Shield,
              },
              {
                title: "Portfolio Building",
                desc: "Empowering everyday individuals to build reliable, independent financial decisions free from speculation biases.",
                icon: Layers,
              },
              {
                title: "Wealth Creation",
                desc: "Reaching compounds independence and secure compounding flywheels that produce generation-level cash flow.",
                icon: Award,
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="relative pl-8 md:pl-16 group">

                  {/* Timeline node */}
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border border-border-custom flex items-center justify-center transition-all group-hover:border-primary group-hover:scale-125 z-10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ECE8E1] transition-colors group-hover:bg-primary" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="p-2 rounded-lg bg-[#F8F7F4] text-gray-600 border border-border-custom group-hover:text-primary group-hover:border-primary/20 transition-all shrink-0 w-fit">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm mt-1.5 leading-relaxed font-sans">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="py-24 px-6 bg-[#FCFCFA] border-t border-b border-border-custom relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Portfolio & Mentoring</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mt-2">
              Professional Financial Services
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-3 max-w-md mx-auto">
              Unbiased advisory and training services built around risk audits and capital compounding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Financial Planning",
                desc: "Structuring systematic cash flow blueprints, retirements, and personalized tax optimization models.",
                icon: Shield,
              },
              {
                title: "Investment Guidance",
                desc: "Objective structures for capital deployment across mutual funds, debt structures, and assets.",
                icon: Landmark,
              },
              {
                title: "Portfolio Support",
                desc: "Regular audits, performance analytics, and dynamic rebalancing aligned with market conditions.",
                icon: Layers,
              },
              {
                title: "Stock Market Mentoring",
                desc: "Systematic, rule-based training modules from basic technical analysis to advanced option spreads.",
                icon: BookOpen,
              },
              {
                title: "Wealth Management Awareness",
                desc: "Educational seminars and workshops targeted to assist families in avoiding speculative capital decay.",
                icon: Compass,
              },
              {
                title: "Angel One Support",
                desc: "Professional platform setup, authorized accounts management, and transaction execution guidance.",
                icon: Landmark,
              },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -6 }}
                  className="premium-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer bg-white border border-border-custom hover:border-primary/30 hover:shadow-[0_8px_30px_rgba(232,110,45,0.04)] transition-all duration-300"
                >
                  {/* Subtle Expanding Orange Accent Line */}
                  <div className="absolute top-0 left-0 w-0 h-[3.5px] bg-primary group-hover:w-full transition-all duration-400 ease-out" />

                  <div className="w-10 h-10 rounded-lg bg-[#F8F7F4] border border-border-custom flex items-center justify-center mb-4 text-gray-600 group-hover:text-primary transition-all group-hover:scale-105 duration-300">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-gray-900 text-base mb-2 group-hover:text-primary transition-colors duration-300">{service.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </ScrollReveal>
      </section>

      {/* COURSES SECTION */}
      <section id="courses" className="py-24 px-6 bg-white relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Academy Enrollment</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mt-2">
              Systematic Training Programs
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-3 max-w-md mx-auto">
              Curriculums engineered to transition candidates from foundational basics into options strategies development.
            </p>
          </div>

          {/* Courses swipeable list on mobile, grid on desktop */}
          <div className="flex overflow-x-auto md:overflow-visible pt-6 pb-6 md:pb-0 gap-6 scrollbar-none snap-x snap-mandatory flex-nowrap md:flex-wrap md:grid md:grid-cols-3">
            {[
              {
                title: "Full Course Program",
                price: "₹23,456",
                desc: "End-to-end framework covers cash markets, technical price structures, and derivates trading strategies.",
                duration: "6 Months",
                level: "Beginner to Advanced",
                featured: false,
              },
              {
                title: "Elite Course",
                price: "₹9,999",
                subtitle: "Strategy Building & Reverse Engineering",
                desc: "Deep-dive program focused on systematic options execution, custom indicator setup, and backtesting models.",
                duration: "3 Months",
                level: "Advanced",
                featured: true,
              },
              {
                title: "Futures & Options",
                price: "₹5,678",
                desc: "Designed strictly around spreads hedging, margins reductions, and live options adjustment adjustments.",
                duration: "3 Months",
                level: "Intermediate to Advanced",
                featured: false,
              },
              {
                title: "Technicals Blueprint",
                price: "₹7,899",
                desc: "Price action modeling, pivots analysis, trend indicators, and high-fidelity chart reading models.",
                duration: "2 Months",
                level: "Intermediate",
                featured: false,
              },
              {
                title: "Pure Option Course",
                price: "₹6,789",
                desc: "Focuses on options buying strategies, theta decay equations, and implied volatility tracking templates.",
                duration: "2 Months",
                level: "Intermediate",
                featured: false,
              },
              {
                title: "Basics & Equity / Commodity",
                price: "₹2,345",
                desc: "Ideal setup program for beginners. Covers stock operations, leverage limits, and commodity futures contracts.",
                duration: "1 Month",
                level: "Beginner",
                featured: false,
              },
            ].map((course, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                className={`min-w-[85vw] sm:min-w-[380px] md:min-w-0 snap-center rounded-2xl bg-white p-6 border flex flex-col justify-between shadow-sm relative group cursor-pointer transition-all duration-350 hover:border-primary/40 hover:shadow-[0_8px_30px_rgba(26,26,26,0.03)] ${course.featured
                  ? "border-primary/80 featured-border-pulse shadow-md"
                  : "border-border-custom"
                  }`}
              >
                {course.featured && (
                  <span className="absolute -top-3.5 right-6 bg-primary text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                    MOST POPULAR
                  </span>
                )}
                <div className="flex flex-col flex-grow">
                  {/* Title & Subtitle container with min-height to align all cards in the row */}
                  <div className="min-h-[58px] flex flex-col justify-start">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors duration-300">
                      {course.title}
                    </h3>
                    {course.subtitle && (
                      <p className="text-primary text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                        {course.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Description container with min-height to keep following stats grid aligned */}
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mt-3 font-sans min-h-[60px] line-clamp-3">
                    {course.desc}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-6 py-4 border-t border-b border-border-custom text-xs font-sans">
                    <div>
                      <span className="text-gray-500 font-semibold block uppercase text-[9px]">Duration</span>
                      <span className="text-gray-900 font-medium mt-0.5 block">{course.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-semibold block uppercase text-[9px]">Skill Level</span>
                      <span className="text-gray-900 font-medium mt-0.5 block">{course.level}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6">
                  <span className="text-xl font-extrabold text-gray-900 font-sans">{course.price}</span>
                  <MagneticButton
                    href={`https://wa.me/918680806448?text=${encodeURIComponent(
                      `Hi, I am looking for the ${course.title.toLowerCase().includes("course") || course.title.toLowerCase().includes("program")
                        ? course.title
                        : `${course.title} course`
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${course.featured
                      ? "bg-primary text-white hover:bg-primary/95"
                      : "bg-[#F8F7F4] border border-border-custom hover:border-gray-600 text-gray-900"
                      }`}
                  >
                    Enroll Now
                  </MagneticButton>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-24 px-6 bg-[#FCFCFA] border-t border-b border-border-custom relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Value Proposition</span>
            <h2 className="text-3xl font-serif text-gray-900">
              Why Choose Deepam Financial Services?
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed font-sans">
              We stand for educational structures and personalized advisories built on transparency, avoiding commission conflicts.
            </p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Client-Centric */}
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Fiduciary Duty</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Client-Centric Approach</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans min-h-[72px]">
                  We focus on individual risk profiles and targets, designing customized financial roadmaps that preserve capital and compile sustainable client wealth.
                </p>
              </div>
            </motion.div>

            {/* Card 2: Ethical Practices */}
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-widest block mb-2">Integrity</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ethical Practices</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans min-h-[72px]">
                  Zero transaction-churn and commission bias. Unbiased recommendations aligned with standard fiduciary duties.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Financial Literacy */}
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-[#4F8A5B] uppercase tracking-widest block mb-2">Education</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Literacy Focus</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans min-h-[72px]">
                  We prioritize educating you. Making clients self-reliant in stock market analysis and systematic money management.
                </p>
              </div>
            </motion.div>

            {/* Card 4: Market Experience */}
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Expertise</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Active Market Experience</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans min-h-[72px]">
                  Deepan S B brings years of active chart analysis, options strategy development, and commodity hedging experience to guide your practical market operations.
                </p>
              </div>
            </motion.div>

            {/* Card 5: Transparent Guidance */}
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Honesty</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Transparent Guidance</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans min-h-[72px]">
                  No hidden agendas or fee configurations. All details, drawdowns, and expenses are presented clearly.
                </p>
              </div>
            </motion.div>

            {/* Card 6: Long-Term Support */}
            <motion.div
              whileHover={{ y: -6, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.04)" }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 sm:p-8 rounded-2xl border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-2">Relationship</span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ongoing Support</h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans min-h-[72px]">
                  Enrolled students and advisory clients receive continuous updates and periodic review sessions.
                </p>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>
      </section>

      {/* ANGEL ONE PARTNERSHIP */}
      <section className="py-24 px-6 bg-white text-center border-b border-border-custom relative z-10">
        <ScrollReveal className="max-w-3xl mx-auto flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Corporate Alliances</span>

          {/* Logo Frame */}
          <div className="my-6 p-6 rounded-2xl border border-border-custom bg-[#F8F7F4] w-56 h-24 flex items-center justify-center shadow-sm">
            <img
              src="/assets/angelone.svg"
              alt="Angel One Authorized Partner Logo"
              className="w-full h-full object-contain"
            />
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-4">
            Angel One Authorised Partner
          </h2>

          <p className="text-gray-600 text-sm leading-relaxed max-w-xl font-sans">
            Deepam Financial Services is an authorized partner associated with Angel One. We provide clients with secure setup channels, professional analytics integrations, and execution facilities using Angel One’s broker portals.
          </p>
        </ScrollReveal>
      </section>

      {/* TESTIMONIALS SLIDER SECTION */}
      <section className="py-24 px-6 bg-background-soft relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Client Feedback</span>
            <h2 className="text-3xl font-serif text-gray-900 mt-2">Wall of Trust</h2>
          </div>

          <TestimonialSlider />
        </ScrollReveal>
      </section>

      {/* FINANCIAL AWARENESS INITIATIVE */}
      <section className="py-24 px-6 bg-white border-t border-b border-border-custom relative z-10">
        <ScrollReveal className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Social Impact Campaigns</span>
            <h2 className="text-3xl sm:text-4xl font-serif text-gray-900 mt-2">
              Financial Awareness Initiative
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-3 max-w-md mx-auto">
              We conduct free informational seminars and college workshops to expand personal money management skills in tier-2 areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Free Seminars",
                desc: "Open physical community meetups structured to simplify debt management, savings habits, and mutual funds selections.",
                theme: "Free Community Workshops",
              },
              {
                title: "Student Programs",
                desc: "Direct college and university modules educating young graduates on basic compounding models and tax-saving frameworks.",
                theme: "Young Adults Curriculum",
              },
              {
                title: "Investor Sessions",
                desc: "Special sessions for retail stock traders to explain margin rules, leverage limits, and speculative warning cycles.",
                theme: "Risk Awareness Drive",
              },
            ].map((initiative, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="bg-[#F8F7F4] rounded-2xl p-6 border border-border-custom shadow-sm flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest block mb-2">
                    {initiative.theme}
                  </span>
                  <h4 className="text-lg font-bold text-gray-900 mb-3">{initiative.title}</h4>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-sans">{initiative.desc}</p>
                </div>
                <a
                  href="#contact"
                  className="mt-6 text-xs text-gray-900 hover:text-primary font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  Join Program <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 px-6 bg-white max-w-7xl mx-auto relative z-10">
        <ScrollReveal className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">

          {/* Left Side Simple Enquiry Form */}
          <div className="lg:col-span-6 border border-border-custom rounded-2xl p-8 bg-white shadow-sm flex flex-col justify-between relative">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">Enquiry Portal</span>
              <h3 className="text-2xl font-serif text-gray-900 mt-2 mb-6">Book Consultation</h3>

              <form onSubmit={handleContactSubmit} className="space-y-6">

                {/* Floating Label for Full Name */}
                <div className="relative pt-4">
                  <label
                    htmlFor="name"
                    className={`absolute left-0 top-0 transition-all duration-300 pointer-events-none text-[10px] font-bold uppercase tracking-wider ${focusedInput === "name" || contactForm.name
                      ? "text-primary -translate-y-1 scale-95"
                      : "text-gray-500 translate-y-6 scale-100"
                      }`}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={contactForm.name}
                    onFocus={() => setFocusedInput("name")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full bg-white border-b border-border-custom focus:border-primary px-0 py-3 text-xs sm:text-sm text-gray-900 placeholder-transparent outline-none transition-all duration-300"
                  />
                </div>

                {/* Floating Label for Phone */}
                <div className="relative pt-4">
                  <label
                    htmlFor="phone"
                    className={`absolute left-0 top-0 transition-all duration-300 pointer-events-none text-[10px] font-bold uppercase tracking-wider ${focusedInput === "phone" || contactForm.phone
                      ? "text-primary -translate-y-1 scale-95"
                      : "text-gray-500 translate-y-6 scale-100"
                      }`}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={contactForm.phone || ""}
                    onFocus={() => setFocusedInput("phone")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    className="w-full bg-white border-b border-border-custom focus:border-primary px-0 py-3 text-xs sm:text-sm text-gray-900 placeholder-transparent outline-none transition-all duration-300"
                  />
                </div>

                {/* Floating Label for Email Address */}
                <div className="relative pt-4">
                  <label
                    htmlFor="email"
                    className={`absolute left-0 top-0 transition-all duration-300 pointer-events-none text-[10px] font-bold uppercase tracking-wider ${focusedInput === "email" || contactForm.email
                      ? "text-primary -translate-y-1 scale-95"
                      : "text-gray-500 translate-y-6 scale-100"
                      }`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={contactForm.email}
                    onFocus={() => setFocusedInput("email")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-white border-b border-border-custom focus:border-primary px-0 py-3 text-xs sm:text-sm text-gray-900 placeholder-transparent outline-none transition-all duration-300"
                  />
                </div>

                {/* Dropdown for Service Interested In */}
                <div className="relative pt-4">
                  <label
                    htmlFor="service"
                    className="absolute left-0 top-0 text-[10px] font-bold uppercase tracking-wider text-primary"
                  >
                    Service Interested In
                  </label>
                  <select
                    id="service"
                    required
                    value={contactForm.service || ""}
                    onFocus={() => setFocusedInput("service")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                    className="w-full bg-white border-b border-border-custom focus:border-primary px-0 py-3 text-xs sm:text-sm text-gray-900 outline-none transition-all duration-300 cursor-pointer"
                  >
                    <option value="" disabled>Select a Service</option>
                    <option value="academy">Wealth Mentorship Academy</option>
                    <option value="planning">Portfolio & Investment Planning</option>
                    <option value="options">Option Strategies & Trading</option>
                    <option value="angel">Angel One Platform Support</option>
                    <option value="awareness">Financial Awareness Initiative</option>
                    <option value="other">Other Inquiry</option>
                  </select>
                </div>

                {/* Floating Label for Message */}
                <div className="relative pt-4">
                  <label
                    htmlFor="message"
                    className={`absolute left-0 top-0 transition-all duration-300 pointer-events-none text-[10px] font-bold uppercase tracking-wider ${focusedInput === "message" || contactForm.message
                      ? "text-primary -translate-y-1 scale-95"
                      : "text-gray-500 translate-y-6 scale-100"
                      }`}
                  >
                    Message / Inquiry Details
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={contactForm.message}
                    onFocus={() => setFocusedInput("message")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-white border-b border-border-custom focus:border-primary px-0 py-3 text-xs sm:text-sm text-gray-900 placeholder-transparent outline-none transition-all duration-300 resize-none"
                  />
                </div>

                {submitError && (
                  <div className="text-red-600 text-xs font-semibold font-sans mt-2 text-center bg-red-50 p-2 rounded-lg border border-red-100">
                    {submitError}
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={isSubmitting ? {} : { y: -2 }}
                  whileTap={isSubmitting ? {} : { scale: 0.97 }}
                  className={`w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white hover:shadow-md transition-all text-center border-0 outline-none flex items-center justify-center gap-2 ${isSubmitting
                    ? "bg-primary/70 cursor-not-allowed"
                    : "bg-primary hover:bg-primary/95 cursor-pointer"
                    }`}
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isSubmitting ? "Sending Request..." : "Send Consultation Request"}
                </motion.button>
              </form>
            </div>

            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white rounded-2xl flex flex-col justify-center items-center p-8 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900">Consultation Requested</h4>
                  <p className="text-gray-600 text-xs sm:text-sm mt-2">
                    Thank you. We will connect with you via email or WhatsApp within 24 business hours.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Side Maps & Channels */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            {/* Direct Channels panel */}
            <div className="border border-border-custom rounded-2xl p-6 bg-background-soft space-y-5">
              <h4 className="font-bold text-xs text-gray-900 uppercase tracking-wider">Direct Contacts</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border-custom bg-white flex flex-col justify-between space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Primary Advisory</span>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-gray-900 font-sans">
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <a href="tel:+918680806448" className="hover:text-primary transition-colors font-sans">+91 86808 06448</a>
                  </div>
                  <a
                    href="https://wa.me/918680806448"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[10px] text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider pt-1"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>

                <div className="p-4 rounded-xl border border-border-custom bg-white flex flex-col justify-between space-y-2 shadow-sm">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Mentorship & Academy</span>
                  <div className="flex items-center space-x-2 text-xs font-semibold text-gray-900 font-sans">
                    <Phone className="w-4 h-4 text-secondary shrink-0" />
                    <a href="tel:+919361187559" className="hover:text-secondary transition-colors font-sans">+91 93611 87559</a>
                  </div>
                  <a
                    href="https://wa.me/919361187559"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-[10px] text-emerald-600 hover:text-emerald-700 font-bold uppercase tracking-wider pt-1"
                  >
                    💬 Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-border-custom">
                <a
                  href="mailto:deepamfinserve@gmail.com"
                  className="p-3.5 rounded-xl border border-border-custom bg-white hover:border-primary hover:text-primary transition-all flex items-center justify-between text-xs font-semibold shadow-sm group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors" />
                    <span className="font-sans">deepamfinserve@gmail.com</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
                </a>
              </div>
            </div>

            {/* Google Map Frame */}
            <div className="flex-1 min-h-[260px] rounded-2xl border border-border-custom overflow-hidden shadow-sm relative">
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.326284566723!2d76.9582121!3d11.012111!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859ab2f9746e3%3A0x6b772c2eb8c83bbd!2sGandhipuram%2C%20Coimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1718592000000!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>
      <section className="max-w-5xl mx-auto px-6 py-16">
  <h2 className="text-3xl font-bold mb-8">
    Frequently Asked Questions
  </h2>

  <div className="space-y-8">

    <div>
      <h3 className="text-xl font-semibold">
        What is Deepam Finance?
      </h3>
      <p className="mt-2 text-gray-600">
        Deepam Finance is a financial education and stock market training
        institute that helps students, professionals, and investors learn
        about financial markets, investing, technical analysis, and trading
        strategies.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        What services does Deepam Finance provide?
      </h3>
      <p className="mt-2 text-gray-600">
        Deepam Finance provides stock market education, technical analysis
        training, options trading education, investment guidance, financial
        literacy programs, and wealth-building knowledge.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Who can join Deepam Finance courses?
      </h3>
      <p className="mt-2 text-gray-600">
        Deepam Finance courses are designed for students, working
        professionals, aspiring traders, investors, entrepreneurs, and
        anyone interested in learning about financial markets.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Does Deepam Finance teach stock market investing?
      </h3>
      <p className="mt-2 text-gray-600">
        Yes. Deepam Finance offers educational programs covering stock
        market investing, portfolio management concepts, risk management,
        market analysis, and long-term wealth creation principles.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Does Deepam Finance teach options trading?
      </h3>
      <p className="mt-2 text-gray-600">
        Yes. Deepam Finance provides educational content related to options
        trading, derivatives, technical analysis, market strategies, and
        trading psychology.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Is Deepam Finance suitable for beginners?
      </h3>
      <p className="mt-2 text-gray-600">
        Yes. Deepam Finance offers beginner-friendly learning programs that
        introduce fundamental concepts of investing, financial markets,
        stock analysis, and trading.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        Why choose Deepam Finance?
      </h3>
      <p className="mt-2 text-gray-600">
        Deepam Finance focuses on practical financial education,
        structured learning, market awareness, and helping learners
        develop a strong understanding of investing and trading concepts.
      </p>
    </div>

    <div>
      <h3 className="text-xl font-semibold">
        What topics are covered by Deepam Finance?
      </h3>
      <p className="mt-2 text-gray-600">
        Deepam Finance covers stock market fundamentals, technical
        analysis, candlestick patterns, options trading, risk management,
        financial planning, investing principles, and wealth creation
        strategies.
      </p>
    </div>

  </div>
</section>

      {/* FOOTER */}
      <footer className="bg-[#1A1A1A] text-white py-16 px-6 border-t border-white/10 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-white/10 pb-12">

          {/* Company Info */}
          <div className="md:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
              <img src="/assets/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />
              <span className="font-serif font-bold text-lg tracking-wider">
                DEEPAM FINANCIAL
              </span>
            </div>
            <p className="text-gray-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Professional money advisory and mentoring systems dedicated to risk control, transparency, and compounds education.
            </p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Mon - Sat: 10:00 AM - 6:00 PM</p>
              <p>Gandhipuram, Coimbatore, Tamil Nadu, India</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-primary mb-4">Quick Links</h4>
            <div className="flex flex-col space-y-2 text-xs sm:text-sm text-gray-400 font-sans">
              {["Home", "About", "Services", "Courses", "Contact"].map((link) => (
                <a key={link} href={`#${link.toLowerCase()}`} className="hover:text-white transition-colors">
                  {link}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 font-sans">
            <h4 className="font-bold text-xs uppercase tracking-widest text-primary mb-4 font-serif">Communications</h4>
            <div className="space-y-3 text-xs sm:text-sm text-gray-400">
              <p className="flex items-center space-x-2">
                <span className="text-primary font-bold">✉</span>
                <a href="mailto:deepamfinserve@gmail.com" className="hover:text-white transition-colors">deepamfinserve@gmail.com</a>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-primary font-bold">☏</span>
                <a href="tel:+918680806448" className="hover:text-white transition-colors">+91 86808 06448</a>
              </p>
              <p className="flex items-center space-x-2">
                <span className="text-primary font-bold">☏</span>
                <a href="tel:+919361187559" className="hover:text-white transition-colors">+91 93611 87559</a>
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-[10px] text-gray-500 leading-relaxed">
          <p className="max-w-2xl text-center sm:text-left">
            Disclaimer: Deepam Financial Services is an educational mentorship academy and an authorized business partner associated with Angel One. We do not provide guaranteed returns. Investments in the securities market are subject to market risks. Read all scheme-related documents carefully before investing. Past performance is not indicative of future results. Registration granted by SEBI, membership of BASL and certification from NISM in no way guarantee performance of the intermediary or provide any assurance of returns to investors.
          </p>
          <p className="shrink-0 text-gray-500">
            © {new Date().getFullYear()} Deepam Financial Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
