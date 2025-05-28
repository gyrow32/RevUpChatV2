'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Car, Gauge, Fuel, Settings, ExternalLink, Star, MapPin, Calendar, DollarSign, X, ChevronLeft, ChevronRight, Info, Hash, FileText, Wrench } from 'lucide-react';
import { formatPrice, formatMileage, formatPayment, formatPercentage } from '@/lib/utils/formatters';
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
        "group relative overflow-hidden bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 w-[280px]",
        "shadow-2xl shadow-black/30 hover:shadow-black/50",
        "transform hover:-translate-y-2 hover:scale-[1.02]",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-black/10 before:pointer-events-none",
        "after:absolute after:inset-[1px] after:bg-gradient-to-br after:from-white/5 after:via-transparent after:to-transparent after:rounded-3xl after:pointer-events-none",
        className
      )}
    >
      {/* Glass shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Hero Image Section */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-3xl">
        {hasImage ? (
          <img
            src={primaryImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-car.jpg';
              target.className = target.className.replace('object-cover', 'object-contain opacity-60');
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car className="w-10 h-10 text-gray-500 dark:text-gray-600" />
          </div>
        )}
        
        {/* Premium Badges */}
        <div className="absolute top-2 left-2 right-12 flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-white/20 shadow-lg">
            <div className="flex items-center gap-1">
              <Calendar className="w-2.5 h-2.5" />
              <span className="font-bold text-xs">{vehicle.year}</span>
            </div>
          </div>
          
          {vehicle.stock && (
            <div className="bg-blue-600/70 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-blue-400/30 shadow-lg">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium opacity-90">STOCK</span>
                <span className="font-bold text-xs">#{vehicle.stock}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Premium Price Overlay */}
        {vehicle.price > 0 && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-white/70 text-xs font-medium">Price</div>
                <div className="text-white font-bold text-lg">{formatPrice(vehicle.price)}</div>
              </div>
              {vehicle.payment && vehicle.payment > 0 && (
                <div className="text-right">
                  <div className="text-white/70 text-xs font-medium">Payment</div>
                  <div className="text-white font-bold">{formatPayment(vehicle.payment)}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Premium Content Section */}
      <div className="p-3 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-bold text-white text-lg leading-tight">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          {vehicle.trim && (
            <p className="text-white/70 text-sm font-medium">{vehicle.trim}</p>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          {vehicle.mileage && (
            <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 backdrop-blur-md rounded-lg p-2 border border-purple-500/20">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium">Mileage</span>
              </div>
              <div className="text-xs font-bold text-white">{formatMileage(vehicle.mileage)}</div>
            </div>
          )}
          {vehicle.fuel && (
            <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 backdrop-blur-md rounded-lg p-2 border border-green-500/20">
              <div className="flex items-center gap-1">
                <Fuel className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-300 font-medium">Fuel</span>
              </div>
              <div className="text-xs font-bold text-white">{vehicle.fuel}</div>
            </div>
          )}
          {vehicle.drivetrain && (
            <div className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 backdrop-blur-md rounded-lg p-2 border border-orange-500/20">
              <div className="flex items-center gap-1">
                <Settings className="w-3 h-3 text-orange-400" />
                <span className="text-xs text-orange-300 font-medium">Drivetrain</span>
              </div>
              <div className="text-xs font-bold text-white">{vehicle.drivetrain}</div>
            </div>
          )}
          {vehicle.dealer && (
            <div className="bg-gradient-to-br from-red-900/30 to-red-900/10 backdrop-blur-md rounded-lg p-2 border border-red-500/20">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-400" />
                <span className="text-xs text-red-300 font-medium">Dealer</span>
              </div>
              <div className="text-xs font-bold text-white">{vehicle.dealer}</div>
            </div>
          )}
        </div>
        
        {/* Action Button */}
        <button 
          className="w-full bg-gradient-to-r from-blue-600/70 via-blue-700/70 to-indigo-700/70 backdrop-blur-sm hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group/button relative overflow-hidden border border-white/10"
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
      
      {/* Premium Glass Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-1000 pointer-events-none" />
    </div>
  );
}