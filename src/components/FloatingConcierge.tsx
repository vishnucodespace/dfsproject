"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X, ArrowUpRight } from "lucide-react";

export default function FloatingConcierge() {
  const [showLabel, setShowLabel] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedLabel, setDismissedLabel] = useState(false);

  // Show "Need Financial Guidance?" after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!dismissedLabel) {
        setShowLabel(true);
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [dismissedLabel]);

  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (showLabel) {
      setShowLabel(false);
    }
  };

  const handleDismissLabel = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowLabel(false);
    setDismissedLabel(true);
  };

  const whatsappIcon = (
    <svg className="w-4 h-4 fill-current text-[#25D366]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.59 1.97 14.12 1.05 11.5 1.05c-5.44 0-9.866 4.372-9.87 9.802 0 1.626.43 3.208 1.25 4.616l-.993 3.626 3.76-.988zM16.518 14.22c-.27-.135-1.597-.788-1.846-.877-.25-.09-.432-.135-.613.135-.18.27-.7.877-.857 1.058-.158.18-.317.202-.587.067-.27-.135-1.14-.42-2.172-1.34-1.03-.92-1.725-2.056-1.927-2.4-.202-.34-.022-.523.148-.692.153-.153.34-.397.51-.595.17-.198.227-.33.34-.55.114-.22.057-.412-.028-.58-.085-.17-.613-1.477-.84-2.023-.222-.534-.486-.462-.667-.472l-.57-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.018-1.04 2.485 0 1.467 1.07 2.885 1.218 3.085.15.2 2.1 3.2 5.09 4.5 2.99 1.3 2.99.866 3.526.82.534-.047 1.596-.653 1.823-1.282.227-.63.227-1.17.159-1.283-.068-.113-.25-.203-.52-.338z" />
    </svg>
  );

  const instagramIcon = (
    <svg className="w-4 h-4 fill-current text-[#E1306C]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );

  return (
    <div className="fixed z-50 bottom-6 right-6 flex flex-col items-end space-y-4 select-none">

      {/* Concierge Submenu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white/95 backdrop-blur-md border border-border-custom p-4 rounded-2xl shadow-xl w-60 text-left flex flex-col space-y-3.5"
            style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
          >
            <div className="border-b border-border-custom pb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Concierge Connect</span>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-900 cursor-pointer outline-none">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-col space-y-2.5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/918680806448"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-border-custom hover:border-primary/20 hover:bg-background-soft transition-all group"
              >
                <div className="flex items-center space-x-2.5 text-xs font-semibold text-gray-900">
                  <div className="w-6 h-6 rounded-full bg-[#25D366]/10 flex items-center justify-center">
                    {whatsappIcon}
                  </div>
                  <span>WhatsApp Chat</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/deepamfs2k/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-border-custom hover:border-primary/20 hover:bg-background-soft transition-all group"
              >
                <div className="flex items-center space-x-2.5 text-xs font-semibold text-gray-900">
                  <div className="w-6 h-6 rounded-full bg-[#E1306C]/10 flex items-center justify-center">
                    {instagramIcon}
                  </div>
                  <span>Instagram Profile</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
              </a>

              {/* Book Appointment */}
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-border-custom hover:border-primary/20 hover:bg-background-soft transition-all group"
              >
                <div className="flex items-center space-x-2.5 text-xs font-semibold text-gray-900">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <span>Book Consultation</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB trigger + Helper label */}
      <div className="flex items-center space-x-3">
        {/* Help label */}
        <AnimatePresence>
          {showLabel && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              className="bg-white border border-border-custom shadow-lg py-2 px-3.5 rounded-xl flex items-center space-x-2 w-auto max-w-[210px] relative text-left"
            >
              <div className="pr-4">
                <p className="text-[10px] font-bold tracking-tight text-gray-900 leading-none">
                  Need Financial Guidance?
                </p>
              </div>
              <button
                onClick={handleDismissLabel}
                className="absolute top-1.5 right-1.5 p-0.5 rounded-full hover:bg-background-soft text-gray-400 hover:text-gray-900 transition-colors cursor-pointer outline-none"
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FAB button */}
        <motion.button
          onClick={handleToggleOpen}
          whileHover={{ scale: 1.06, boxShadow: "0 12px 30px -4px rgba(26, 26, 26, 0.08)" }}
          whileTap={{ scale: 0.94 }}
          className="w-12 h-12 rounded-full bg-white border border-border-custom flex items-center justify-center shadow-lg text-primary cursor-pointer outline-none relative transition-shadow"
          style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        >
          {isOpen ? (
            <X className="w-4 h-4 text-gray-900" />
          ) : (
            <span className="text-xl">💬</span>
          )}
        </motion.button>
      </div>

    </div>
  );
}
