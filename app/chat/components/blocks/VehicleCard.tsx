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
        "group relative overflow-hidden bg-white dark:bg-gradient-to-br dark:from-gray-900 dark:to-black/80 backdrop-blur-xl rounded-3xl border border-gray-300 dark:border-gray-800 hover:border-blue-400 dark:hover:border-blue-400 transition-all duration-500 w-[308px] min-h-[500px] max-h-[500px] flex flex-col",
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
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900/90 dark:from-black via-gray-900/70 dark:via-black/70 to-transparent p-3 pr-6">
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
      <div className="p-3 space-y-2 flex flex-col flex-1 justify-between">
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
        <div className="grid grid-cols-2 gap-2 min-h-[48px] mb-1">
          {vehicle.fuel ? (
            <div className="bg-gradient-to-br from-green-100/80 dark:from-green-900/30 to-green-50/80 dark:to-green-900/10 backdrop-blur-md rounded-lg p-2 border border-green-200/50 dark:border-green-500/20 flex items-center min-h-[48px]">
              <Fuel className="w-3 h-3 text-green-600 dark:text-green-400 mr-1" />
              <span className="text-xs text-green-700 dark:text-green-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Fuel</span>
              <span className="ml-2 text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">{vehicle.fuel}</span>
            </div>
          ) : <div className="min-h-[48px]" />}
          {vehicle.drivetrain ? (
            <div className="bg-gradient-to-br from-orange-100/80 dark:from-orange-900/30 to-orange-50/80 dark:to-orange-900/10 backdrop-blur-md rounded-lg p-2 border border-orange-200/50 dark:border-orange-500/20 flex items-center min-h-[48px]">
              <Settings className="w-3 h-3 text-orange-600 dark:text-orange-400 mr-1" />
              <span className="text-xs text-orange-700 dark:text-orange-300 font-medium whitespace-nowrap overflow-hidden text-ellipsis">Drivetrain</span>
              <span className="ml-2 text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">{vehicle.drivetrain}</span>
            </div>
          ) : <div className="min-h-[48px]" />}
        </div>
        
        {/* 2x2 Meta Grid */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 mt-1 mb-2">
          {/* Age */}
          <div className="flex flex-col justify-center items-start bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-xl p-3 border border-gray-700/40 h-20 w-full min-w-0 overflow-hidden">
            <span className="text-xs text-gray-300 font-medium mb-1 whitespace-nowrap">Age</span>
            <span className="text-lg font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{vehicle.ageDays !== undefined ? `${vehicle.ageDays} days` : '--'}</span>
          </div>
          {/* LTV */}
          <div className="flex flex-col justify-center items-start bg-gradient-to-br from-blue-900/80 to-blue-800/60 rounded-xl p-3 border border-blue-700/40 h-20 w-full min-w-0 overflow-hidden">
            <span className="text-xs text-blue-200 font-medium mb-1 whitespace-nowrap">LTV</span>
            <span className="text-lg font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{vehicle.ltv !== undefined ? `${vehicle.ltv.toFixed(1)}%` : '--'}</span>
          </div>
          {/* Profit */}
          <div className="flex flex-col justify-center items-start bg-gradient-to-br from-green-900/80 to-green-800/60 rounded-xl p-3 border border-green-700/40 h-20 w-full min-w-0 overflow-hidden">
            <span className="text-xs text-green-200 font-medium mb-1 whitespace-nowrap">Profit</span>
            <span className="text-lg font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{vehicle.profit !== undefined ? `$${vehicle.profit.toLocaleString()}` : '--'}</span>
          </div>
          {/* Mileage */}
          <div className="flex flex-col justify-center items-start bg-gradient-to-br from-purple-900/80 to-purple-800/60 rounded-xl p-3 border border-purple-700/40 h-20 w-full min-w-0 overflow-hidden">
            <span className="text-xs text-purple-200 font-medium mb-1 whitespace-nowrap">Mileage</span>
            <span className="text-lg font-bold text-white leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{vehicle.mileage !== undefined ? formatMileage(vehicle.mileage) : '--'}</span>
          </div>
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