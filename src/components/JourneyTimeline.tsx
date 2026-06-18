"use client";

import React from "react";
import { motion } from "framer-motion";
import { Eye, ShieldAlert, Award, TrendingUp, BarChart2 } from "lucide-react";

interface Stage {
  num: string;
  title: string;
  desc: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stages: Stage[] = [
  {
    num: "01",
    title: "Financial Awareness",
    desc: "Understanding current assets, liabilities, and monthly cash flow metrics while debunking popular financial fallacies.",
    color: "from-secondary to-teal-400",
    icon: Eye,
  },
  {
    num: "02",
    title: "Investment Planning",
    desc: "Defining targets, risk tolerances, and mapping specific asset allocation structures tailored to long-term goals.",
    color: "from-accent to-indigo-400",
    icon: BarChart2,
  },
  {
    num: "03",
    title: "Risk Management",
    desc: "Securing capital preservation matrices, hedging trades, and insuring core assets to guard against extreme volatility.",
    color: "from-highlight to-pink-400",
    icon: ShieldAlert,
  },
  {
    num: "04",
    title: "Portfolio Growth",
    desc: "Engaging in strategic equity investments and derivatives mentorship to consistently capture alpha.",
    color: "from-primary to-amber-500",
    icon: TrendingUp,
  },
  {
    num: "05",
    title: "Wealth Creation",
    desc: "Establishing compounding flywheels and independent cash flow systems that produce generational wealth.",
    color: "from-emerald-500 to-teal-300",
    icon: Award,
  },
];

export default function JourneyTimeline() {
  return (
    <div className="relative border-l border-white/10 ml-4 md:ml-32 py-6 space-y-12">
      {stages.map((stage, idx) => {
        const Icon = stage.icon;
        return (
          <motion.div
            key={idx}
            className="relative pl-8 md:pl-16 group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-120px" }}
            transition={{ duration: 0.7, delay: idx * 0.1 }}
          >
            {/* Timeline node node */}
            <div className="absolute -left-[7px] top-2.5 w-3.5 h-3.5 rounded-full bg-[#07111F] border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:scale-125">
              <div className="w-1.5 h-1.5 rounded-full bg-white transition-all duration-300 group-hover:bg-primary" />
            </div>

            {/* Glowing aura */}
            <div className={`absolute left-4 top-0 w-80 h-36 bg-gradient-to-r ${stage.color} opacity-0 group-hover:opacity-[0.03] blur-3xl transition-opacity duration-500 pointer-events-none`} />

            {/* Glass panel */}
            <div className="glass-card p-6 rounded-xl border border-white/5 max-w-2xl relative transition-all duration-300 hover:border-white/15 hover:shadow-xl hover:shadow-primary/5">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-2xl font-extrabold bg-gradient-to-r ${stage.color} bg-clip-text text-transparent`}>
                  {stage.num}
                </span>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${stage.color} bg-opacity-20 text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors duration-300">
                {stage.title}
              </h3>
              <p className="text-muted-custom text-xs sm:text-sm leading-relaxed font-normal">
                {stage.desc}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
