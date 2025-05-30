'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Calendar,
  Car,
  Gauge,
  MapPin,
  Phone,
  Tag,
  Link as LinkIcon,
  ExternalLink,
  Star,
  DollarSign,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Hash,
  FileText,
  Wrench,
  Fuel,
  Settings
} from 'lucide-react';
import { formatPrice, formatMileage, formatPayment } from '@/lib/utils/formatters';
import type { VehicleData } from '@/types';
import { cn } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: VehicleData;
  className?: string;
}

export default function VehicleCard({ vehicle, className = '' }: VehicleCardProps) {
  const primaryImage = vehicle.image || vehicle["Image URLs"]?.[0];
  const hasImage = primaryImage && primaryImage.trim() !== '';
  
  const handleViewDetails = () => {
    const link = vehicle["Vehicle Link"];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  
  return (
    <div 
      className={cn(
        "group relative overflow-hidden bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 w-[308px] h-[480px] flex flex-col",
        "shadow-md hover:shadow-lg dark:shadow-lg dark:shadow-black/20",
        className
      )}
    >
      {/* Hero Image Section */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-xl">
        {hasImage ? (
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
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Car className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {/* Year Badge - Simplified */}
        <div className="absolute top-3 left-3">
          <div className="bg-white/90 dark:bg-black/70 text-gray-800 dark:text-white px-2 py-1 rounded-md text-xs font-bold">
            {vehicle.year}
          </div>
        </div>
        
        {/* Stock Badge - Simplified */}
        {vehicle.stock && (
          <div className="absolute top-3 right-3">
            <div className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              #{vehicle.stock}
            </div>
          </div>
        )}
        
        {/* Price/Payment Overlay - Cleaner & Consistent */}
        {vehicle.price > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/90 to-gray-900/60 py-3 px-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-300 text-xs uppercase tracking-wide">Price</div>
                <div className="text-white font-bold text-lg">{formatPrice(vehicle.price)}</div>
              </div>
              {vehicle.payment && vehicle.payment > 0 && (
                <div className="text-right">
                  <div className="text-gray-300 text-xs uppercase tracking-wide">Payment</div>
                  <div className="text-white font-bold text-lg">{formatPayment(vehicle.payment)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Content Section - Minimalist & Balanced */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        {/* Title - Cleaner Typography */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight mb-1">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {vehicle.trim}
            </p>
          )}
        </div>
        
        {/* 2x2 Meta Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-3 my-4">
          {/* Age - Styled Box */}
          <div className="flex flex-col justify-center items-start rounded-lg p-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-0.5 uppercase tracking-wide">Age</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {vehicle.ageDays !== undefined ? `${vehicle.ageDays} days` : '--'}
            </span>
          </div>
          
          {/* LTV - Styled Box */}
          <div className="flex flex-col justify-center items-start rounded-lg p-2.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50">
            <span className="text-xs text-blue-600 dark:text-blue-300 font-medium mb-0.5 uppercase tracking-wide">LTV</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {vehicle.ltv !== undefined ? `${Math.round(vehicle.ltv * 10) / 10}%` : '--'}
            </span>
          </div>
          
          {/* Profit - Styled Box */}
          <div className="flex flex-col justify-center items-start rounded-lg p-2.5 bg-green-50 dark:bg-green-900/30 border border-green-100 dark:border-green-800/50">
            <span className="text-xs text-green-600 dark:text-green-300 font-medium mb-0.5 uppercase tracking-wide">Profit</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {vehicle.profit !== undefined ? `$${Math.round(vehicle.profit).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}` : '--'}
            </span>
          </div>
          
          {/* Mileage - Styled Box */}
          <div className="flex flex-col justify-center items-start rounded-lg p-2.5 bg-purple-50 dark:bg-purple-900/30 border border-purple-100 dark:border-purple-800/50">
            <span className="text-xs text-purple-600 dark:text-purple-300 font-medium mb-0.5 uppercase tracking-wide">Mileage</span>
            <span className="text-sm font-bold text-gray-800 dark:text-white">
              {vehicle.mileage !== undefined ? formatMileage(vehicle.mileage) : '--'}
            </span>
          </div>
        </div>
        
        {/* Action Button - Simplified */}
        <div className="mt-auto">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            onClick={handleViewDetails}
            disabled={!vehicle["Vehicle Link"]}
          >
            <span>View Details</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}