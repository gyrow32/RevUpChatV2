'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Car } from 'lucide-react';
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
        "text-center text-gray-500 dark:text-gray-400 py-20 px-12 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        className
      )}>
        <div className="flex justify-center items-center mb-8">
          <Car className="w-20 h-20 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="font-bold text-2xl mb-4 text-gray-800 dark:text-gray-200">No vehicles found</div>
        <div className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
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

  // Calculate carousel width
  const cardWidth = 308 + 16; // card width + gap
  const carouselWidth = isMobile ? cardWidth : cardWidth * 3;

  return (
    <section
      className={cn(
        "w-full max-w-7xl mx-auto px-2 sm:px-6 md:px-8 py-6 sm:py-8",
        "rounded-xl border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-lg bg-white dark:bg-gray-900",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 mb-4 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h4 className="font-bold text-lg text-gray-900 dark:text-white">
            {vehicles.length} Vehicle{vehicles.length !== 1 ? 's' : ''} Found
          </h4>
        </div>
        
        {/* Page indicator */}
        {totalPages > 1 && (
          <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentIndex + 1} of {totalPages}
          </div>
        )}
      </div>

      {/* Carousel */}
      <div className="relative flex items-center px-6 py-4">
        {/* Left Arrow */}
        {vehicles.length > vehiclesPerPage && (
          <button
            onClick={goToPrevious}
            className="absolute left-2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors -translate-y-1/2 top-1/2 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentIndex === 0}
            aria-label="Previous Vehicles"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" />
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
            className="flex transition-transform duration-500 ease-out gap-4 items-stretch min-h-[480px]"
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
                <VehicleCard vehicle={vehicle} className="h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {vehicles.length > vehiclesPerPage && (
          <button
            onClick={goToNext}
            className="absolute right-2 z-10 p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors -translate-y-1/2 top-1/2 disabled:opacity-40 disabled:cursor-not-allowed"
            disabled={currentIndex >= vehicles.length - vehiclesPerPage}
            aria-label="Next Vehicles"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-white" />
          </button>
        )}
      </div>

      {/* Page Indicators */}
      {vehicles.length > vehiclesPerPage && (
        <div className="flex justify-center items-center gap-2 pt-3">
          {Array.from({ length: vehicles.length - vehiclesPerPage + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "transition-colors rounded-full",
                index === currentIndex 
                  ? "bg-blue-600 w-6 h-2" 
                  : "bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 w-2 h-2"
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}