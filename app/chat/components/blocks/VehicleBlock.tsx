'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VehicleCard from './VehicleCard';
import type { VehicleData } from '@/types';
import { cn } from '@/lib/utils';

interface VehicleBlockProps {
  vehicles: VehicleData[];
  className?: string;
}

export default function VehicleBlock({ vehicles, className = '' }: VehicleBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Responsive: detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const vehiclesPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50; // minimum distance for swipe
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < vehicles.length - vehiclesPerPage) {
      goToNext();
    }
    if (isRightSwipe && currentIndex > 0) {
      goToPrevious();
    }

    // Reset touch positions
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={cn(
        "text-center text-gray-500 dark:text-gray-400 py-20 px-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-inner",
        className
      )}>
        <div className="text-9xl mb-8 opacity-40">🔍</div>
        <div className="font-bold text-3xl mb-4 text-gray-800 dark:text-gray-200">No vehicles found</div>
        <div className="text-xl text-gray-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
          Try adjusting your search criteria or contact our specialists for personalized recommendations
        </div>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, vehicles.length - vehiclesPerPage));
  };

  // For mobile, show only one card at a time, for desktop, show 3
  const getCurrentVehicles = () => {
    const start = currentIndex;
    const end = start + vehiclesPerPage;
    return vehicles.slice(start, end);
  };

  // Calculate carousel width
  const cardWidth = 308 + 16; // card width (increased by 10%) + gap
  const carouselWidth = isMobile ? cardWidth : cardWidth * 3;

  return (
    <section
      className={cn(
        "w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-8 py-6 sm:py-10",
        "rounded-3xl border border-gray-300 dark:border-gray-800 shadow-lg shadow-gray-300/40 dark:shadow-2xl dark:shadow-black/70 bg-white dark:bg-gradient-to-br dark:from-gray-950 dark:to-black/90 backdrop-blur-xl",
        className
      )}
    >
      {/* Premium Black Glass Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 dark:bg-black/20 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl shadow-gray-200/50 dark:shadow-black/30">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-500/70 dark:from-blue-600/70 to-blue-600/70 dark:to-blue-700/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-400/20">
            <span className="text-white text-xl">🚗</span>
          </div>
          <div>
            <h4 className="font-black text-xl text-gray-900 dark:text-white leading-tight drop-shadow-lg">
              Found {vehicles.length} Premium Vehicle{vehicles.length !== 1 ? 's' : ''}
            </h4>
          </div>
        </div>
        
        {/* Page indicator with black glass */}
        {totalPages > 1 && (
          <div className="px-4 py-2 bg-white/80 dark:bg-black/30 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-lg">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {currentIndex + 1}
            </span>
            <span className="text-gray-600 dark:text-gray-300 mx-2">of</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {totalPages}
            </span>
          </div>
        )}
      </div>

      {/* Premium Black Glass Carousel */}
      <div className="relative flex items-center p-6 bg-white/80 dark:bg-black/10 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-black/30">
        {/* Left Arrow with Glass Effect */}
        {vehicles.length > vehiclesPerPage && (
          <button
            onClick={goToPrevious}
            className="absolute left-2 z-10 p-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-xl hover:bg-white/90 dark:hover:bg-black/60 border border-gray-200/50 dark:border-white/10 hover:border-gray-300/50 dark:hover:border-white/20 transition-all duration-300 transform -translate-y-1/2 top-1/2 disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={currentIndex === 0}
            aria-label="Previous Vehicles"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors drop-shadow-lg" />
          </button>
        )}

        <div 
          ref={carouselRef}
          className="relative overflow-hidden touch-pan-x" 
          style={{ width: `${carouselWidth}px`, margin: '0 auto' }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="flex transition-transform duration-700 ease-out gap-4 items-stretch min-h-[360px]"
            style={{ 
              transform: `translateX(-${currentIndex * (cardWidth)}px)`
            }}
          >
            {vehicles.map((vehicle, vehicleIndex) => (
              <div 
                key={`${vehicle.id || vehicle.stock || vehicleIndex}`}
                className="flex-shrink-0"
                style={{ width: '308px' }}
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow with Glass Effect */}
        {vehicles.length > vehiclesPerPage && (
          <button
            onClick={goToNext}
            className="absolute right-2 z-10 p-3 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md shadow-xl hover:bg-white/90 dark:hover:bg-black/60 border border-gray-200/50 dark:border-white/10 hover:border-gray-300/50 dark:hover:border-white/20 transition-all duration-300 transform -translate-y-1/2 top-1/2 disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={currentIndex >= vehicles.length - vehiclesPerPage}
            aria-label="Next Vehicles"
          >
            <ChevronRight className="w-6 h-6 text-gray-700 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors drop-shadow-lg" />
          </button>
        )}
      </div>

      {/* Premium Black Glass Page Indicators */}
      {vehicles.length > vehiclesPerPage && (
        <div className="flex justify-center items-center gap-3 pt-4">
          {Array.from({ length: vehicles.length - vehiclesPerPage + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "transition-all duration-300 rounded-full border backdrop-blur-sm",
                index === currentIndex 
                  ? "bg-blue-500/70 dark:bg-blue-600/70 border-blue-400/50 w-8 h-3 shadow-lg shadow-blue-500/25" 
                  : "bg-white/80 dark:bg-black/30 border-gray-200/50 dark:border-white/20 hover:bg-white/90 dark:hover:bg-black/50 hover:border-gray-300/50 dark:hover:border-white/30 w-3 h-3"
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}