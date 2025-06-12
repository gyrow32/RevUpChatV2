'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Car } from 'lucide-react';
import VehicleCard from './VehicleCard';
import type { VehicleData } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface VehicleBlockProps {
  vehicles: VehicleData[];
  className?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DESKTOP_CARD_WIDTH = 308;
const CARD_GAP = 16;
const SWIPE_MIN_DISTANCE = 50;

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function VehicleBlock({ vehicles, className = '' }: VehicleBlockProps) {
  // Debug logging
  console.log('VehicleBlock received vehicles:', vehicles);
  console.log('First vehicle profit:', vehicles[0]?.profit);

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // ============================================================================
  // REFS
  // ============================================================================

  const carouselRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // ============================================================================
  // RESPONSIVE & LAYOUT CALCULATIONS
  // ============================================================================

  // Detect mobile and update container width
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Layout calculations
  const vehiclesPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const mobileCardWidth = isMobile && containerWidth ? containerWidth - 32 : DESKTOP_CARD_WIDTH;
  const adjustedCardWidth = isMobile ? mobileCardWidth : DESKTOP_CARD_WIDTH;
  const slideWidth = adjustedCardWidth + CARD_GAP;
  const carouselWidth = isMobile ? '100%' : slideWidth * 3;

  // ============================================================================
  // DATA PROCESSING
  // ============================================================================

  // Normalize vehicle data
  const normalizedVehicles = vehicles.map(vehicle => ({
    ...vehicle,
    profit: vehicle.profit ?? vehicle.priceofit ?? 0,
    payment: vehicle.payment ?? vehicle.paymentment ?? 0,
    downPayment: vehicle.downPayment ?? vehicle.downpaymentment ?? 0
  }));

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, vehicles.length - vehiclesPerPage));
  };

  // ============================================================================
  // TOUCH HANDLERS
  // ============================================================================

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > SWIPE_MIN_DISTANCE;
    const isRightSwipe = distance < -SWIPE_MIN_DISTANCE;

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

  // ============================================================================
  // RENDER CONDITIONS
  // ============================================================================

  // Empty state
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={cn(
        "text-center text-gray-500 dark:text-gray-400 py-20 px-12",
        "bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700",
        className
      )}>
        <div className="flex justify-center items-center mb-8">
          <Car className="w-20 h-20 text-gray-400 dark:text-gray-500" />
        </div>
        <div className="font-bold text-2xl mb-4 text-gray-800 dark:text-gray-200">
          No vehicles found
        </div>
        <div className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          Try adjusting your search criteria or contact our specialists for personalized recommendations
        </div>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <section
      ref={containerRef}
      className={cn(
        "w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-12 py-6 sm:py-8",
        "rounded-2xl border shadow-lg",
        // Light mode
        "bg-white/95 backdrop-blur-sm border-gray-200/80",
        // Dark mode
        "dark:!bg-slate-900 dark:backdrop-blur-xl dark:border-slate-700/50 dark:shadow-2xl",
        className
      )}
    >
      {/* ============================================================================ */}
      {/* HEADER SECTION */}
      {/* ============================================================================ */}
      
      <div className="flex items-center justify-between px-4 py-3 mb-4 border-b border-gray-200/50 dark:border-slate-700/30">
        <div>
          <h4 className="font-bold text-xl text-gray-900 dark:text-slate-100">
            {vehicles.length} Vehicle{vehicles.length !== 1 ? 's' : ''} Found
          </h4>
        </div>
        
        {/* Page indicator */}
        {totalPages > 1 && (
          <div className="px-4 py-2 bg-gray-100/80 dark:bg-slate-800/60 rounded-lg text-sm font-semibold text-gray-700 dark:text-slate-300 border border-gray-200/50 dark:border-slate-700/30 backdrop-blur-sm">
            {currentIndex + 1} of {totalPages}
          </div>
        )}
      </div>

      {/* ============================================================================ */}
      {/* CAROUSEL SECTION */}
      {/* ============================================================================ */}
      
      <div className="relative">
        {/* Left Navigation Arrow */}
        {vehicles.length > vehiclesPerPage && (
          <button
            onClick={goToPrevious}
            className="absolute left-0 z-10 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-slate-700/90 border border-gray-200/50 dark:border-slate-600/50 transition-all duration-200 -translate-y-1/2 top-1/2 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-md"
            disabled={currentIndex === 0}
            aria-label="Previous Vehicles"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-slate-200" />
          </button>
        )}

        {/* Carousel Container */}
        <div
          ref={carouselRef}
          className="relative overflow-hidden touch-pan-x mx-auto w-full" 
          style={{ maxWidth: typeof carouselWidth === 'string' ? carouselWidth : `${carouselWidth}px` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Vehicle Cards */}
          <div 
            className="flex transition-transform duration-500 ease-out gap-4 items-stretch min-h-[420px] sm:min-h-[450px]"
            style={{ 
              transform: `translateX(-${currentIndex * slideWidth}px)`
            }}
          >
            {normalizedVehicles.map((vehicle, vehicleIndex) => {
              console.log(`Rendering vehicle ${vehicleIndex} with profit:`, vehicle.profit);
              return (
                <div 
                  key={`${vehicle.id || vehicle.stock || vehicleIndex}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{ width: `${adjustedCardWidth}px` }}
                >
                  <VehicleCard 
                    vehicle={vehicle} 
                    className="h-full max-h-[450px] mx-auto" 
                    width={adjustedCardWidth} 
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Navigation Arrow */}
        {vehicles.length > vehiclesPerPage && (
          <button
            onClick={goToNext}
            className="absolute right-0 z-10 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-lg hover:shadow-xl hover:bg-gray-50 dark:hover:bg-slate-700/90 border border-gray-200/50 dark:border-slate-600/50 transition-all duration-200 -translate-y-1/2 top-1/2 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-md"
            disabled={currentIndex >= vehicles.length - vehiclesPerPage}
            aria-label="Next Vehicles"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-slate-200" />
          </button>
        )}
      </div>

      {/* ============================================================================ */}
      {/* PAGE INDICATORS */}
      {/* ============================================================================ */}
      
      {vehicles.length > vehiclesPerPage && (
        <div className="flex justify-center items-center gap-2 pt-4 pb-2">
          {Array.from({ length: vehicles.length - vehiclesPerPage + 1 }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "transition-all duration-200 rounded-full",
                index === currentIndex 
                  ? "bg-blue-600 dark:bg-blue-500 w-8 h-3 shadow-md" 
                  : "bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500 w-3 h-3"
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}