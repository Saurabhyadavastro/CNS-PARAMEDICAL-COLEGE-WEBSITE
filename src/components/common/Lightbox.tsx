import React, { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { GalleryImage } from '../../content/gallery';
import { Badge } from '../ui/Badge';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;

  const goToNext = useCallback(() => {
    if (!hasMultiple) return;
    onNavigate((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  const goToPrevious = useCallback(() => {
    if (!hasMultiple) return;
    onNavigate((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, hasMultiple, onNavigate]);

  // Save previous active element to restore focus on close
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      // Focus close button on open
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (previousActiveElementRef.current) {
        previousActiveElementRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Keyboard Navigation: Arrow Left/Right, Esc, and Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
        return;
      }

      // Focus trap for Tab and Shift+Tab
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, goToNext, goToPrevious, onClose]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartXRef.current;
    const deltaY = touchEndY - touchStartYRef.current;

    // Trigger swipe only if horizontal movement is dominant and > 50px
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }

    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  if (!isOpen || !currentImage) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${currentImage.caption}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity duration-300 p-2 sm:p-4 md:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      ref={modalRef}
    >
      {/* Top Bar with Counter, Category & Close Button */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3">
          <Badge variant="accent" size="sm">
            {currentImage.categoryName}
          </Badge>
          <span className="text-xs sm:text-sm font-semibold text-slate-300">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <button
          ref={closeButtonRef}
          onClick={onClose}
          type="button"
          className="p-2 sm:p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white focus-ring transition-colors"
          aria-label="Close image lightbox (Esc)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        </button>
      </div>

      {/* Previous Button (Desktop & Tablet) */}
      {hasMultiple && (
        <button
          onClick={goToPrevious}
          type="button"
          className="hidden sm:flex absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-brand text-white border border-white/10 focus-ring transition-all hover:scale-105"
          aria-label="Previous image (Left arrow key)"
        >
          <ChevronLeft className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* Main Image Container */}
      <div
        className="relative max-w-5xl w-full flex flex-col items-center justify-center my-auto select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="w-full relative aspect-[16/10] sm:aspect-[16/9] max-h-[72vh] rounded-lg overflow-hidden bg-navy-dark shadow-2xl border border-white/10 flex items-center justify-center">
          <img
            src={currentImage.src}
            alt={currentImage.alt}
            className="w-full h-full object-contain"
            loading="eager"
          />
        </div>

        {/* Caption & Accessibility Details */}
        <div className="w-full mt-3 sm:mt-4 px-2 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-2 text-white">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              {currentImage.caption}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 line-clamp-2">
              {currentImage.alt}
            </p>
          </div>

          <div className="text-xs text-slate-400 shrink-0 flex items-center gap-2">
            <span className="hidden md:inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded">
              <Info className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              Use <kbd className="font-mono text-white">←</kbd> <kbd className="font-mono text-white">→</kbd> keys or swipe
            </span>
          </div>
        </div>
      </div>

      {/* Next Button (Desktop & Tablet) */}
      {hasMultiple && (
        <button
          onClick={goToNext}
          type="button"
          className="hidden sm:flex absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/50 hover:bg-brand text-white border border-white/10 focus-ring transition-all hover:scale-105"
          aria-label="Next image (Right arrow key)"
        >
          <ChevronRight className="w-6 h-6" aria-hidden="true" />
        </button>
      )}

      {/* Mobile Navigation Buttons Bar */}
      {hasMultiple && (
        <div className="sm:hidden absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6 z-20">
          <button
            onClick={goToPrevious}
            type="button"
            className="p-3 rounded-full bg-black/70 border border-white/20 text-white focus-ring active:bg-brand"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>
          <span className="text-xs font-semibold text-slate-300 bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            onClick={goToNext}
            type="button"
            className="p-3 rounded-full bg-black/70 border border-white/20 text-white focus-ring active:bg-brand"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
};
