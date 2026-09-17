/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight, Maximize2, Tag } from 'lucide-react';

export interface LightboxImageItem {
  url: string;
  alt?: string;
  title?: string;
  tag?: string;
}

interface ImageLightboxModalProps {
  isOpen: boolean;
  images: LightboxImageItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  lang?: 'en' | 'kh';
}

export default function ImageLightboxModal({
  isOpen,
  images,
  currentIndex,
  onClose,
  onNavigate,
  lang = 'kh'
}: ImageLightboxModalProps) {
  const currentImage = images[currentIndex] || images[0];

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prevIndex);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    onNavigate(nextIndex);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Disable body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !currentImage) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 backdrop-blur-xl select-none">
        {/* Backdrop overlay click */}
        <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

        {/* Top Controls Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs sm:text-sm font-semibold">
              {currentIndex + 1} / {images.length}
            </div>
            {currentImage.tag && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-gold/20 text-brand-gold text-xs font-medium border border-brand-gold/30">
                <Tag size={12} />
                {currentImage.tag}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="pointer-events-auto p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white/90 hover:text-white transition border border-white/15 shadow-lg cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous image"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 shadow-2xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronLeft size={24} className="sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Main Image Container */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative max-w-[92vw] max-h-[82vh] z-10 flex flex-col items-center justify-center p-2 pointer-events-none"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt || 'PSIS Gallery Photo'}
            className="max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Caption / Title */}
          {(currentImage.title || currentImage.alt) && (
            <div className="mt-3 px-4 py-2 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-center max-w-xl pointer-events-auto">
              <p className="text-white/90 text-sm sm:text-base font-khmer leading-snug">
                {currentImage.title || currentImage.alt}
              </p>
            </div>
          )}
        </motion.div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next image"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-10 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/20 shadow-2xl backdrop-blur-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <ChevronRight size={24} className="sm:w-7 sm:h-7" />
          </button>
        )}

        {/* Thumbnail bar at bottom */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 px-4 pointer-events-auto overflow-x-auto max-w-2xl mx-auto py-2">
            {images.slice(0, 10).map((img, idx) => (
              <button
                key={idx}
                onClick={() => onNavigate(idx)}
                className={`w-11 h-11 sm:w-13 sm:h-13 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                  currentIndex === idx
                    ? 'border-brand-gold scale-110 shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                    : 'border-white/20 opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
}
