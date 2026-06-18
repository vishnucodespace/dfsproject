"use client";

import React from "react";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // Kept for backwards compatibility
}

export default function TiltCard({
  children,
  className = "",
}: TiltCardProps) {
  return (
    <div className={`premium-card rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}
