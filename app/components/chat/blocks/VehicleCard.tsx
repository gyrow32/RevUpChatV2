'use client';

import Image from 'next/image';
import { Car } from 'lucide-react';
import { formatPrice, formatMileage, formatPayment } from '@/app/lib/utils/formatters';
import type { VehicleData } from '@/app/lib/types';
import { cn } from '@/app/lib/utils';

interface VehicleCardProps {
  vehicle: VehicleData;
  className?: string;
  width?: number;
}

export default function VehicleCard({ vehicle, className = '', width }: VehicleCardProps) {
  console.log('VehicleCard received vehicle:', vehicle);
  console.log('Profit value in VehicleCard:', vehicle.profit);
  console.log('Profit value type:', typeof vehicle.profit);

  const imageUrls = vehicle["Image URLs"];
  const primaryImage = vehicle.image || (Array.isArray(imageUrls) ? imageUrls[0] : undefined);
  const hasImage = primaryImage && primaryImage.trim() !== '';
  
  const handleViewDetails = () => {
    const link = vehicle["Vehicle Link"];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Default card width is 308px, but allow responsive resizing
  const cardWidth = width || 308;
  
  return (
    <div 
      className={cn(
        // Professional design with proper light/dark mode support
        "group relative overflow-hidden rounded-2xl transition-all duration-300 h-[460px] sm:h-[450px] flex flex-col mx-auto",
        // Light mode: crisp white with subtle shadow
        "bg-white/95 backdrop-blur-sm border border-gray-200/80 shadow-lg hover:shadow-xl",
        // Dark mode: elegant dark glass with refined border
        "dark:bg-gray-900/95 dark:backdrop-blur-md dark:border-gray-700/50 dark:shadow-2xl dark:hover:shadow-blue-900/20",
        // Hover effects
        "hover:border-blue-300 dark:hover:border-blue-600/60 hover:-translate-y-1",
        className
      )}
      style={{ width: `${cardWidth}px` }}
    >
      {/* Hero Image Section - MAXIMIZED for mobile */}
      <div className="relative h-[320px] sm:h-56 w-full overflow-hidden rounded-t-2xl bg-gray-100 dark:bg-gray-800">
        {hasImage ? (
          <>
            <Image
              src={primaryImage}
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder-car.jpg';
                target.className = target.className.replace('object-cover', 'object-contain opacity-60');
              }}
            />
            {/* Subtle overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-12 h-12 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        
        {/* Year Badge - More compact on mobile */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
          <div className="bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
            {vehicle.year}
          </div>
        </div>
        
        {/* Stock Badge - More compact on mobile */}
        {vehicle.stock && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
            <div className="bg-blue-600/90 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm font-semibold backdrop-blur-sm">
              #{vehicle.stock}
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section - MINIMIZED padding for mobile */}
      <div className="flex flex-col flex-1 p-1.5 sm:p-6">
        {/* Vehicle Title - More compact on mobile */}
        <div className="mb-1 sm:mb-5">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-lg leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mt-0.5">
              {vehicle.trim}
            </p>
          )}
        </div>
        
        {/* Stats Grid - COMPACT for mobile */}
        <div className="grid grid-cols-2 gap-1 sm:gap-4 mb-1.5 sm:mb-6">
          {/* Age */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-md sm:rounded-xl p-1 sm:p-3 border border-gray-200/50 dark:border-gray-700/30">
            <div className="text-[9px] sm:text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-0.5 sm:mb-1">Age</div>
            <div className="text-xs sm:text-base font-bold text-gray-900 dark:text-white">
              {vehicle.ageDays !== undefined ? `${vehicle.ageDays} days` : '--'}
            </div>
          </div>
          
          {/* LTV */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md sm:rounded-xl p-1 sm:p-3 border border-blue-200/50 dark:border-blue-800/30">
            <div className="text-[9px] sm:text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-0.5 sm:mb-1">LTV</div>
            <div className="text-xs sm:text-base font-bold text-gray-900 dark:text-white">
              {vehicle.ltv !== undefined ? `${Math.round(vehicle.ltv * 10) / 10}%` : '--'}
            </div>
          </div>
          
          {/* Profit */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-md sm:rounded-xl p-1 sm:p-3 border border-emerald-200/50 dark:border-emerald-800/30">
            <div className="text-[9px] sm:text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-0.5 sm:mb-1">Profit</div>
            <div className="text-xs sm:text-base font-bold text-gray-900 dark:text-white">
              {vehicle.profit !== undefined ? `$${vehicle.profit.toLocaleString()}` : '--'}
            </div>
          </div>
          
          {/* Mileage */}
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md sm:rounded-xl p-1 sm:p-3 border border-purple-200/50 dark:border-purple-800/30">
            <div className="text-[9px] sm:text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-0.5 sm:mb-1">Miles</div>
            <div className="text-xs sm:text-base font-bold text-gray-900 dark:text-white">
              {vehicle.mileage !== undefined ? `${vehicle.mileage.toLocaleString()}` : '--'}
            </div>
          </div>
        </div>
        
        {/* Action Button - Compact for mobile */}
        <div className="mt-auto">
          <button 
            className={cn(
              "w-full py-1.5 sm:py-3 px-4 rounded-md sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2",
              "bg-blue-600 hover:bg-blue-700 text-white shadow-md sm:shadow-lg hover:shadow-xl text-sm sm:text-base",
              "dark:bg-blue-600 dark:hover:bg-blue-500",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            )}
            onClick={handleViewDetails}
            disabled={!vehicle["Vehicle Link"]}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}