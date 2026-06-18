"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X } from "lucide-react";

export default function SocialWidget() {
  const [showHelper, setShowHelper] = useState(false);
  const [helperDismissed, setHelperDismissed] = useState(false);
  const [isHoveredWa, setIsHoveredWa] = useState(false);
  const [isHoveredInsta, setIsHoveredInsta] = useState(false);
  const [pulseTrigger, setPulseTrigger] = useState(false);
  const [highlightWa, setHighlightWa] = useState(false);

  const { scrollY } = useScroll();

  // Shrink the widget scale slightly as user scrolls down
  const widgetScale = useTransform(scrollY, [0, 600], [1, 0.92]);

  useEffect(() => {
    const handleScroll = () => {
      // 30% scroll trigger for the guidance label
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight > 0) {
        const scrolledPercent = window.scrollY / pageHeight;
        if (scrolledPercent >= 0.3 && !helperDismissed) {
          setShowHelper(true);
        } else {
          setShowHelper(false);
        }
      }

      // Contact section bounds check to highlight WhatsApp
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        const rect = contactSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75 && rect.bottom >= window.innerHeight * 0.25) {
          setHighlightWa(true);
        } else {
          setHighlightWa(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [helperDismissed]);

  // Subtle pulse loop every 15 seconds
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseTrigger(true);
      setTimeout(() => setPulseTrigger(false), 1200);
    }, 15000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleDismissHelper = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowHelper(false);
    setHelperDismissed(true);
  };

  const whatsappIcon = (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 1.05 11.5 1.05c-5.44 0-9.866 4.372-9.87 9.802 0 1.626.43 3.208 1.25 4.616l-.993 3.626 3.76-.988zM16.518 14.22c-.27-.135-1.597-.788-1.846-.877-.25-.09-.432-.135-.613.135-.18.27-.7.877-.857 1.058-.158.18-.317.202-.587.067-.27-.135-1.14-.42-2.172-1.34-1.03-.92-1.725-2.056-1.927-2.4-.202-.34-.022-.523.148-.692.153-.153.34-.397.51-.595.17-.198.227-.33.34-.55.114-.22.057-.412-.028-.58-.085-.17-.613-1.477-.84-2.023-.222-.534-.486-.462-.667-.472l-.57-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.018-1.04 2.485 0 1.467 1.07 2.885 1.218 3.085.15.2 2.1 3.2 5.09 4.5 2.99 1.3 2.99.866 3.526.82.534-.047 1.596-.653 1.823-1.282.227-.63.227-1.17.159-1.283-.068-.113-.25-.203-.52-.338z" />
    </svg>
  );

  const instagramIcon = (
    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
      style={{ scale: widgetScale }}
      className="fixed z-50 flex flex-col items-end space-y-3 right-4 bottom-6 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:right-6 select-none"
    >
      {/* Dismissible Help Helper Notification */}
      <AnimatePresence>
        {showHelper && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            className="bg-white border border-gray-200 shadow-md p-3 rounded-lg max-w-[210px] relative text-left hidden md:block"
          >
            <p className="text-[11px] font-bold tracking-tight text-gray-900 pr-4">
              Need Financial Guidance?
            </p>
            <p className="text-[10px] text-gray-500 mt-1 leading-snug font-normal">
              Connect with Deepan for options trading and investment planning.
            </p>
            <button
              onClick={handleDismissHelper}
              className="absolute top-2 right-2 p-0.5 rounded-full hover:bg-background-soft text-gray-400 hover:text-gray-900 transition-colors cursor-pointer outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute right-4 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-gray-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Pill Wrapper Container */}
      <motion.div
        animate={{
          scale: pulseTrigger ? [1, 1.03, 1] : 1,
        }}
        transition={{ duration: 0.8 }}
        className="flex flex-col space-y-2 bg-white/70 backdrop-blur-md border border-gray-200 p-2 rounded-full shadow-lg"
      >
        {/* WhatsApp Pill Button */}
        <motion.a
          href="https://wa.me/919489484848"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHoveredWa(true)}
          onMouseLeave={() => setIsHoveredWa(false)}
          animate={{
            width: isHoveredWa ? 120 : 38,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className={`h-9 rounded-full flex items-center justify-start overflow-hidden px-2.5 cursor-pointer relative shadow-sm border ${
            highlightWa
              ? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20"
              : "bg-white border-gray-200 text-gray-900 hover:bg-emerald-500 hover:border-emerald-500 hover:text-white"
          }`}
        >
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            {whatsappIcon}
          </div>
          {isHoveredWa && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold uppercase tracking-wider ml-2.5 whitespace-nowrap"
            >
              Chat Now
            </motion.span>
          )}
        </motion.a>

        {/* Instagram Pill Button */}
        <motion.a
          href="https://instagram.com/deepamfinancial"
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setIsHoveredInsta(true)}
          onMouseLeave={() => setIsHoveredInsta(false)}
          animate={{
            width: isHoveredInsta ? 120 : 38,
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="h-9 rounded-full flex items-center justify-start overflow-hidden px-2.5 cursor-pointer bg-white border border-gray-200 text-gray-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-600 hover:text-white hover:border-transparent transition-colors shadow-sm"
        >
          <div className="w-4 h-4 flex items-center justify-center shrink-0">
            {instagramIcon}
          </div>
          {isHoveredInsta && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold uppercase tracking-wider ml-2.5 whitespace-nowrap"
            >
              Follow Us
            </motion.span>
          )}
        </motion.a>
      </motion.div>
    </motion.div>
  );
}
