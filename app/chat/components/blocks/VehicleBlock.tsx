'use client';

import { useState } from 'react';
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
  const vehiclesPerPage = 3;
  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  
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
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const getCurrentVehicles = () => {
    const start = currentIndex * vehiclesPerPage;
    const end = start + vehiclesPerPage;
    return vehicles.slice(start, end);
  };

  return (
    <div className={cn("relative space-y-6", className)}>
      {/* Premium Black Glass Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-black/30">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-gradient-to-br from-blue-600/70 to-blue-700/70 backdrop-blur-sm rounded-2xl shadow-lg border border-blue-400/20">
            <span className="text-white text-xl">🚗</span>
          </div>
          <div>
            <h4 className="font-black text-xl text-white leading-tight drop-shadow-lg">
              Found {vehicles.length} Premium Vehicle{vehicles.length !== 1 ? 's' : ''}
            </h4>
            <p className="text-sm font-semibold text-blue-300 leading-tight">
              Displaying {Math.min(vehicles.length, vehiclesPerPage)} of {vehicles.length} • Page {currentIndex + 1} of {totalPages}
            </p>
          </div>
        </div>
        
        {/* Page indicator with black glass */}
        {totalPages > 1 && (
            <div className="px-4 py-2 bg-black/30 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
              <span className="text-sm font-bold text-white">
                {currentIndex + 1}
              </span>
              <span className="text-gray-300 mx-2">of</span>
              <span className="text-sm font-bold text-white">
                {totalPages}
              </span>
            </div>
        )}
      </div>

      {/* Premium Black Glass Carousel */}
      <div className="relative flex items-center p-6 bg-black/10 backdrop-blur-xl rounded-3xl border border-white/5 shadow-2xl shadow-black/30">
        {/* Left Arrow with Glass Effect */}
        {totalPages > 1 && (
          <button
            onClick={goToPrevious}
            className="absolute left-2 z-10 p-3 rounded-full bg-black/40 backdrop-blur-md shadow-xl hover:bg-black/60 border border-white/10 hover:border-white/20 transition-all duration-300 transform -translate-y-1/2 top-1/2 disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={totalPages <= 1}
            aria-label="Previous Vehicles"
          >
            <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors drop-shadow-lg" />
          </button>
        )}

        <div className="relative overflow-hidden" style={{ width: '872px', margin: '0 auto' }}>
          <div 
            className="flex transition-transform duration-700 ease-out gap-4 items-stretch min-h-[360px]"
            style={{ 
              transform: `translateX(-${currentIndex * 872}px)`
            }}
          >
            {/* Render all vehicles in a single long strip */}
            {vehicles.map((vehicle, index) => (
              <div 
                key={vehicle.id || `vehicle-${index}`}
                className="flex-shrink-0"
              >
                <VehicleCard vehicle={vehicle} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow with Glass Effect */}
        {totalPages > 1 && (
          <button
            onClick={goToNext}
            className="absolute right-2 z-10 p-3 rounded-full bg-black/40 backdrop-blur-md shadow-xl hover:bg-black/60 border border-white/10 hover:border-white/20 transition-all duration-300 transform -translate-y-1/2 top-1/2 disabled:opacity-50 disabled:cursor-not-allowed group"
            disabled={totalPages <= 1}
            aria-label="Next Vehicles"
          >
            <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-400 transition-colors drop-shadow-lg" />
          </button>
        )}
      </div>

      {/* Premium Black Glass Page Indicators */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 pt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "transition-all duration-300 rounded-full border backdrop-blur-sm",
                index === currentIndex 
                  ? "bg-blue-600/70 border-blue-400/50 w-8 h-3 shadow-lg shadow-blue-500/25" 
                  : "bg-black/30 border-white/20 hover:bg-black/50 hover:border-white/30 w-3 h-3"
              )}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}