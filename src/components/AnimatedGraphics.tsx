/**
 * Animated SVG Graphics - Jitter-style motion design
 */

import { motion } from 'motion/react';

export default function AnimatedGraphics() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Background orbs using div-based approach */}
      <motion.div
        className="absolute top-10 left-20 w-80 h-80 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute bottom-40 right-32 w-96 h-96 bg-gradient-to-tl from-blue-500 to-blue-300 rounded-full blur-3xl opacity-15"
        animate={{
          x: [0, -60, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(197,160,89,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(197,160,89,0.03)_1px,transparent_1px)] bg-[size:80px_80px] pointer-events-none" />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-yellow-400 rounded-full opacity-30 blur-sm"
          style={{
            left: `${(i * 12.5) % 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.random() * 60 - 30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 7 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
