"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface BlobProps {
  src: string;
  className?: string;
  duration?: number;
  xPath?: string[];
  yPath?: string[];
}

export default function Blob({ 
  src, 
  className = "",
  duration = 30,
  xPath = ["0vw", "50vw", "0vw"],
  yPath = ["0vh", "70vh", "0vh"]
}: BlobProps) {
  return (
    <motion.img
      src={src}
      alt="Decorative blob"
      className={`fixed pointer-events-none object-contain ${className}`}
      initial={{ x: xPath[0], y: yPath[0] }} 
      animate={{
        x: xPath,
        y: yPath,
        scale: [1, 1.2, 0.9, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        filter: "blur(60px)",
      }}
    />
  );
}