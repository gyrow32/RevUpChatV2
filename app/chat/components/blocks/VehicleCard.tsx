'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Car, Gauge, Fuel, Settings, ExternalLink, Star, MapPin, Calendar, DollarSign, X, ChevronLeft, ChevronRight, Info, Hash, FileText, Wrench } from 'lucide-react';
import { formatPrice, formatMileage, formatPayment, formatPercentage } from '@/lib/utils/formatters';
import type { VehicleData } from '@/types';
import { cn } from '@/lib/utils';

import VehicleDetailCard from "./VehicleDetailCard";
interface VehicleCardProps {
  vehicle: VehicleData;
  className?: string;
}

export default function VehicleCard({ vehicle, className = '' }: VehicleCardProps) {
  const [showModal, setShowModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const primaryImage = vehicle.image || vehicle["Image URLs"]?.[0];
  const hasImage = primaryImage && primaryImage.trim() !== '';
  const allImages = vehicle["Image URLs"] || (vehicle.image ? [vehicle.image] : []);
  
  const handleViewDetails = () => {
    const link = vehicle["Vehicle Link"];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleCardClick = () => {
    setShowModal(true);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  
  return (
    <>
      <div 
        onClick={handleCardClick}
        className={cn(
          "group relative overflow-hidden bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 hover:border-white/20 transition-all duration-500 w-[280px] cursor-pointer",
          "shadow-2xl shadow-black/30 hover:shadow-black/50",
          "transform hover:-translate-y-2 hover:scale-[1.02]",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:via-transparent before:to-black/10 before:pointer-events-none",
          "after:absolute after:inset-[1px] after:bg-gradient-to-br after:from-white/5 after:via-transparent after:to-transparent after:rounded-3xl after:pointer-events-none",
          className
        )}
      >
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        
        {/* Click indicator */}
        <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Info className="w-3 h-3" />
        </div>
        
        {/* Hero Image Section */}
        <div className="relative h-32 w-full bg-gradient-to-br from-gray-900/30 via-black/20 to-gray-800/30 overflow-hidden">
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
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5">
            <div className="text-white space-y-0.5">
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black tracking-tight text-white drop-shadow-lg">
                  {formatPrice(vehicle.price)}
                </span>
              </div>
              {vehicle.payment && (
                <div className="flex items-center gap-1.5 text-blue-200">
                  <span className="text-sm font-semibold">{formatPayment(vehicle.payment)}</span>
                  <span className="w-0.5 h-0.5 bg-blue-300 rounded-full"></span>
                  <span className="text-xs font-medium">
                    {vehicle.downPayment === 0 ? 'No money down' : formatPrice(vehicle.downPayment || 0) + ' down'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Premium Content Section */}
        <div className="relative p-3 space-y-3 bg-black/10 backdrop-blur-sm">
          {/* Vehicle Identity */}
          <div className="space-y-0.5">
            <h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors duration-300 leading-tight drop-shadow-lg">
              {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.trim && (
              <p className="text-sm font-semibold text-gray-300 leading-tight">
                {vehicle.trim}
              </p>
            )}
          </div>
          
          {/* Premium Specs Section */}
          <div className="grid grid-cols-2 gap-2">
            {vehicle.mileage && (
              <div className="group/spec flex items-center gap-1.5 p-2 bg-black/30 backdrop-blur-sm rounded-md border border-blue-500/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300">
                <div className="p-1 bg-blue-600/70 backdrop-blur-sm rounded-sm group-hover/spec:scale-110 transition-transform duration-300 shadow-lg">
                  <Gauge className="w-2.5 h-2.5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-blue-300">
                    {formatMileage(vehicle.mileage)}
                  </div>
                  <div className="text-xs text-blue-400/70 font-medium">
                    Odometer
                  </div>
                </div>
              </div>
            )}
            
            {vehicle.fuel && (
              <div className="group/spec flex items-center gap-1.5 p-2 bg-black/30 backdrop-blur-sm rounded-md border border-green-500/20 hover:border-green-400/40 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300">
                <div className="p-1 bg-green-600/70 backdrop-blur-sm rounded-sm group-hover/spec:scale-110 transition-transform duration-300 shadow-lg">
                  <Fuel className="w-2.5 h-2.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-green-300 truncate">
                    {vehicle.fuel}
                  </div>
                  <div className="text-xs text-green-400/70 font-medium">
                    Fuel Type
                  </div>
                </div>
              </div>
            )}
            
            {vehicle.drivetrain && (
              <div className="group/spec flex items-center gap-1.5 p-2 bg-black/30 backdrop-blur-sm rounded-md border border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="p-1 bg-purple-600/70 backdrop-blur-sm rounded-sm group-hover/spec:scale-110 transition-transform duration-300 shadow-lg">
                  <Settings className="w-2.5 h-2.5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-purple-300">
                    {vehicle.drivetrain}
                  </div>
                  <div className="text-xs text-purple-400/70 font-medium">
                    Drivetrain
                  </div>
                </div>
              </div>
            )}
            
            {vehicle.bodyStyle && (
              <div className="group/spec flex items-center gap-1.5 p-2 bg-black/30 backdrop-blur-sm rounded-md border border-orange-500/20 hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
                <div className="p-1 bg-orange-600/70 backdrop-blur-sm rounded-sm group-hover/spec:scale-110 transition-transform duration-300 shadow-lg">
                  <Car className="w-2.5 h-2.5 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-orange-300">
                    {vehicle.bodyStyle}
                  </div>
                  <div className="text-xs text-orange-400/70 font-medium">
                    Body Style
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Premium Financial Section */}
          <div className="p-3 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 shadow-inner">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="p-1 bg-blue-600/70 backdrop-blur-sm rounded-md shadow-lg">
                <DollarSign className="w-3 h-3 text-white" />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Financing Details
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {/* Monthly Payment */}
              {vehicle.payment && (
                <div className="text-center p-2 bg-black/15 backdrop-blur-sm rounded-md border border-white/5 shadow-sm">
                  <div className="text-sm font-black text-blue-400 mb-0.5">
                    {formatPayment(vehicle.payment)}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Monthly Payment
                  </div>
                </div>
              )}
              
              {/* Down Payment */}
              <div className="text-center p-2 bg-black/15 backdrop-blur-sm rounded-md border border-white/5 shadow-sm">
                <div className="text-sm font-black text-green-400 mb-0.5">
                  {vehicle.downPayment === 0 ? '$0' : formatPrice(vehicle.downPayment || 0)}
                </div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  Down Payment
                </div>
              </div>
              
              {/* Loan Term */}
              {vehicle.loanTermMonths && (
                <div className="text-center p-2 bg-black/15 backdrop-blur-sm rounded-md border border-white/5 shadow-sm">
                  <div className="text-sm font-black text-purple-400 mb-0.5">
                    {vehicle.loanTermMonths}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Months
                  </div>
                </div>
              )}
              
              {/* Interest Rate */}
              {vehicle.interestRate && (
                <div className="text-center p-2 bg-black/15 backdrop-blur-sm rounded-md border border-white/5 shadow-sm">
                  <div className="text-sm font-black text-orange-400 mb-0.5">
                    {formatPercentage(vehicle.interestRate)}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Interest Rate
                  </div>
                </div>
              )}
              
              {/* Loan to Value */}
              {vehicle.ltv && (
                <div className="text-center p-2 bg-black/15 backdrop-blur-sm rounded-md border border-white/5 shadow-sm">
                  <div className="text-sm font-black text-red-400 mb-0.5">
                    {formatPercentage(vehicle.ltv)}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Loan to Value
                  </div>
                </div>
              )}
              
              {/* Tax Rate */}
              {vehicle.taxRate && (
                <div className="text-center p-2 bg-black/15 backdrop-blur-sm rounded-md border border-white/5 shadow-sm">
                  <div className="text-sm font-black text-indigo-400 mb-0.5">
                    {formatPercentage(vehicle.taxRate)}
                  </div>
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Tax Rate
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Dealer Location */}
          {vehicle.dealer && (
            <div className="flex items-center gap-1.5 p-2 bg-black/20 backdrop-blur-sm rounded-md border border-white/10">
              <div className="p-1 bg-gray-600/70 backdrop-blur-sm rounded-sm shadow-lg">
                <MapPin className="w-2.5 h-2.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-gray-300 truncate">
                  {vehicle.dealer}
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Dealership
                </div>
              </div>
            </div>
          )}
          
          {/* Premium CTA Button */}
          <button 
            className="w-full bg-gradient-to-r from-blue-600/70 via-blue-700/70 to-indigo-700/70 backdrop-blur-sm hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 text-white font-bold py-2 px-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed group/button relative overflow-hidden border border-white/10"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
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
      
        {/* Enhanced Detail Modal - World Class Design */}
        {showModal && (
          <VehicleDetailCard vehicle={vehicle} onClose={() => setShowModal(false)} />
        )}

    </>
  );
}