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
        "group relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black/80 backdrop-blur-xl rounded-3xl border border-gray-300 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-500 w-[308px] min-h-[420px]",
        "shadow-lg shadow-gray-300/40 dark:shadow-2xl dark:shadow-black/70 hover:shadow-blue-200/60 dark:hover:shadow-black/80",
        "transform hover:-translate-y-2 hover:scale-[1.02]",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-blue-100/10 before:via-transparent before:to-purple-100/5 before:pointer-events-none dark:before:from-white/5 dark:before:to-black/10",
        className
      )}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/50 dark:from-white/5 via-transparent to-gray-200/50 dark:to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Hero Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
        {hasImage ? (
          <Image
            src={primaryImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-car.jpg';
              target.className = target.className.replace('object-cover', 'object-contain opacity-60');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        {/* Premium Badges */}
        <div className="absolute top-2 left-2 right-12 flex justify-between items-start">
          <div className="bg-white/80 dark:bg-black/40 backdrop-blur-md text-gray-800 dark:text-white px-2 py-1 rounded-lg border border-gray-200/50 dark:border-white/20 shadow-lg">
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              <span className="font-bold text-xs">{vehicle.year}</span>
            </div>
          </div>
          
          {vehicle.stock && (
            <div className="bg-blue-500/80 dark:bg-blue-600/70 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-blue-400/30 shadow-lg">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium opacity-90">STOCK</span>
                <span className="font-bold text-xs">#{vehicle.stock}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Premium Price Overlay */}
        {vehicle.price > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/90 dark:from-black via-gray-900/70 dark:via-black/70 to-transparent p-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-gray-300 dark:text-white/70 text-xs font-medium">Price</div>
                <div className="text-white font-bold text-lg">{formatPrice(vehicle.price)}</div>
              </div>
              {vehicle.payment && vehicle.payment > 0 && (
                <div className="text-right">
                  <div className="text-gray-300 dark:text-white/70 text-xs font-medium">Payment</div>
                  <div className="text-white font-bold">{formatPayment(vehicle.payment)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Premium Content Section */}
      <div className="p-3 space-y-3 flex flex-col justify-between">
        {/* Title */}
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight min-h-[2.5em]">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <p className="text-gray-600 dark:text-white/70 text-sm font-medium min-h-[1.5em]">
            {vehicle.trim || '\u00A0'}
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 min-h-[70px]">
          {vehicle.mileage ? (
            <div className="bg-gradient-to-br from-purple-100/80 dark:from-purple-900/30 to-purple-50/80 dark:to-purple-900/10 backdrop-blur-md rounded-lg p-2 border border-purple-200/50 dark:border-purple-500/20">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span className="text-xs text-purple-700 dark:text-purple-300 font-medium">Mileage</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{formatMileage(vehicle.mileage)}</div>
            </div>
          ) : <div className="min-h-[48px]" />}
          {vehicle.fuel ? (
            <div className="bg-gradient-to-br from-green-100/80 dark:from-green-900/30 to-green-50/80 dark:to-green-900/10 backdrop-blur-md rounded-lg p-2 border border-green-200/50 dark:border-green-500/20">
              <div className="flex items-center gap-1">
                <Fuel className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-700 dark:text-green-300 font-medium">Fuel</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{vehicle.fuel}</div>
            </div>
          ) : <div className="min-h-[48px]" />}
          {vehicle.drivetrain ? (
            <div className="bg-gradient-to-br from-orange-100/80 dark:from-orange-900/30 to-orange-50/80 dark:to-orange-900/10 backdrop-blur-md rounded-lg p-2 border border-orange-200/50 dark:border-orange-500/20">
              <div className="flex items-center gap-1">
                <Settings className="w-3 h-3 text-orange-600 dark:text-orange-400" />
                <span className="text-xs text-orange-700 dark:text-orange-300 font-medium">Drivetrain</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{vehicle.drivetrain}</div>
            </div>
          ) : <div className="min-h-[48px]" />}
          {vehicle.dealer ? (
            <div className="bg-gradient-to-br from-red-100/80 dark:from-red-900/30 to-red-50/80 dark:to-red-900/10 backdrop-blur-md rounded-lg p-2 border border-red-200/50 dark:border-red-500/20">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-600 dark:text-red-400" />
                <span className="text-xs text-red-700 dark:text-red-300 font-medium">Dealer</span>
              </div>
              <div className="text-xs font-bold text-gray-900 dark:text-white">{vehicle.dealer}</div>
            </div>
          ) : <div className="min-h-[48px]" />}
        </div>
        
        {/* Action Button */}
        <div className="mt-auto">
          <button 
            className="w-full bg-gradient-to-r from-blue-500/80 dark:from-blue-600/70 via-blue-600/80 dark:via-blue-700/70 to-indigo-600/80 dark:to-indigo-700/70 backdrop-blur-sm hover:from-blue-600 dark:hover:from-blue-700 hover:via-blue-700 dark:hover:via-blue-800 hover:to-indigo-700 dark:hover:to-indigo-800 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group/button relative overflow-hidden border border-white/10"
            onClick={handleViewDetails}
            disabled={!vehicle["Vehicle Link"]}
          >
            {/* Button shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] group-hover/button:translate-x-[100%] transition-transform duration-700" />
            
            <div className="relative flex items-center justify-center gap-1.5">
              <span className="text-xs">View Full Details</span>
              <ExternalLink className="w-3 h-3 group-hover/button:translate-x-1 group-hover/button:-translate-y-0.5 transition-transform duration-300" />
            </div>
          </button>
        </div>
      </div>
      
      {/* Premium Glass Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />
    </div>
  );
}