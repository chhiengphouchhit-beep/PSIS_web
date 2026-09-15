/**
 * Enhanced Hero Section with Jitter-style Motion Graphics
 */

import { motion } from 'motion/react';
import AnimatedGraphics from './AnimatedGraphics';
import AnimatedText from './AnimatedText';

interface HeroMotionProps {
  title: string;
  subtitle: string;
  lang: 'en' | 'kh';
}

export default function HeroMotion({ title, subtitle, lang }: HeroMotionProps) {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center py-20">
      
      {/* Subtle animated background graphics */}
      <div className="absolute inset-0 opacity-40">
        <AnimatedGraphics />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200 text-purple-600 text-xs font-bold uppercase tracking-widest mb-8"
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            ✨
          </motion.span>
          {lang === 'en' ? 'Future-Ready Education' : 'ការអប់រំលំដាប់នូវចាប់ផ្តើម'}
        </motion.div>

        {/* Animated Title - Bold and impactful like Jitter */}
        <motion.h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-black mb-8 leading-tight font-sans-body">
          <AnimatedText text={title} className="font-black" delay={0.3} />
        </motion.h1>

        {/* Subtitle with refined styling */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
        >
          {subtitle}
        </motion.p>

        {/* CTA Buttons with Jitter-style gradient */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-full shadow-lg shadow-purple-600/30 text-lg hover:shadow-purple-600/50 transition-all"
          >
            {lang === 'en' ? 'Get Started' : 'ចាប់ផ្តើមឥឡូវនេះ'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-gray-100 text-gray-900 font-bold rounded-full border-2 border-gray-200 hover:bg-gray-200 text-lg transition-all"
          >
            {lang === 'en' ? 'Learn More' : 'ស្វាគមន៍'}
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-16 flex justify-center"
        >
          <div className="text-gray-400 text-sm font-medium">
            {lang === 'en' ? 'Scroll to explore' : 'រុំដើរចុះក្រោម'}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating decorative elements - subtle */}
      <motion.div
        className="absolute top-32 right-12 w-48 h-48 bg-purple-200/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-32 left-12 w-56 h-56 bg-purple-100/15 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -25, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
