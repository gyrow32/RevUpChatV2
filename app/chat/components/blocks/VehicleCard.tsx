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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowModal(false)}>
          <div 
            className="relative max-w-4xl w-full max-h-[90vh] bg-gradient-to-b from-gray-900/95 via-gray-900/98 to-black/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Premium Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
            >
              <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
            </button>
            
            {/* Top Image Carousel with Thumbnails */}
            <div className="relative">
              {/* Main Image Display */}
              <div className="relative h-[200px] lg:h-[250px] w-full bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden">
                {allImages.length > 0 ? (
                  <>
                    <img
                      src={allImages[currentImageIndex]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover object-center transition-opacity duration-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-car.jpg';
                      }}
                    />
                    
                    {/* Gradient Overlays for Drama */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
                    
                    {/* Premium Navigation Arrows */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
                        >
                          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/20 hover:scale-110 transition-all duration-300 group"
                        >
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <Car className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                
                {/* Vehicle Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                  <div className="max-w-3xl">
                    <h1 className="text-2xl lg:text-3xl font-black text-white mb-1 drop-shadow-xl">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h1>
                    {vehicle.trim && (
                      <p className="text-sm lg:text-base font-semibold text-gray-300 drop-shadow-lg">{vehicle.trim}</p>
                    )}
                    <div className="flex items-baseline gap-3 mt-2 flex-wrap">
                      <span className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
                        {formatPrice(vehicle.price)}
                      </span>
                      {vehicle.payment && (
                        <span className="text-base lg:text-lg font-bold text-green-400 drop-shadow-lg">
                          {formatPayment(vehicle.payment)}/mo
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10">
                  <div className="flex gap-1 p-2 overflow-x-auto scrollbar-hide">
                    {allImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={cn(
                          "relative flex-shrink-0 w-12 h-10 rounded overflow-hidden border transition-all duration-300",
                          currentImageIndex === index
                            ? "border-blue-400 scale-110 shadow-lg shadow-blue-500/50"
                            : "border-white/20 hover:border-white/40 opacity-70 hover:opacity-100"
                        )}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-car.jpg';
                          }}
                        />
                        {currentImageIndex === index && (
                          <div className="absolute inset-0 bg-blue-500/20"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Premium Content Section */}
            <div className="p-4 lg:p-5 space-y-4 max-h-[calc(90vh-250px)] overflow-y-auto">
              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {(vehicle.vin || vehicle.id) && (
                  <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 backdrop-blur-md rounded-lg p-2 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-500/20 rounded">
                        <Hash className="w-3 h-3 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-blue-300 font-medium">VIN</div>
                        <div className="text-xs font-mono text-white truncate">{vehicle.vin || vehicle.id}</div>
                      </div>
                    </div>
                  </div>
                )}
                {vehicle.stock && (
                  <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 backdrop-blur-md rounded-lg p-2 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-green-500/20 rounded">
                        <FileText className="w-3 h-3 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-green-300 font-medium">Stock</div>
                        <div className="text-xs font-bold text-white">#{vehicle.stock}</div>
                      </div>
                    </div>
                  </div>
                )}
                {vehicle.mileage && (
                  <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 backdrop-blur-md rounded-lg p-2 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-purple-500/20 rounded">
                        <Gauge className="w-3 h-3 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-purple-300 font-medium">Mileage</div>
                        <div className="text-xs font-bold text-white">{formatMileage(vehicle.mileage)}</div>
                      </div>
                    </div>
                  </div>
                )}
                {vehicle.ageDays !== undefined && (
                  <div className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 backdrop-blur-md rounded-lg p-2 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 hover:scale-105">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-orange-500/20 rounded">
                        <Calendar className="w-3 h-3 text-orange-400" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-orange-300 font-medium">Age</div>
                        <div className="text-xs font-bold text-white">{vehicle.ageDays} days</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Financing Section - Premium Card Design */}
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-3 border border-white/10 shadow-xl">
                <h2 className="text-base font-black text-white mb-3 flex items-center gap-2">
                  <div className="p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                  </div>
                  Complete Financing Details
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {/* Each financial metric as a premium card */}
                  <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                    <div className="text-xs text-gray-400 font-medium mb-1">Sale Price</div>
                    <div className="text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                      {formatPrice(vehicle.price)}
                    </div>
                  </div>
                  {vehicle.payment && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">Monthly</div>
                      <div className="text-base font-black text-green-400">
                        {formatPayment(vehicle.payment)}
                      </div>
                    </div>
                  )}
                  {vehicle.downPayment !== undefined && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">Down</div>
                      <div className="text-base font-black text-yellow-400">
                        {vehicle.downPayment === 0 ? '$0' : formatPrice(vehicle.downPayment)}
                      </div>
                    </div>
                  )}
                  {vehicle.loanTermMonths && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">Term</div>
                      <div className="text-base font-black text-purple-400">
                        {vehicle.loanTermMonths}<span className="text-sm font-semibold text-purple-300">mo</span>
                      </div>
                    </div>
                  )}
                  {vehicle.ltv && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">LTV</div>
                      <div className="text-base font-black text-red-400">
                        {formatPercentage(vehicle.ltv)}
                      </div>
                    </div>
                  )}
                  {vehicle.amountFinanced && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">Financed</div>
                      <div className="text-base font-black text-cyan-400">
                        {formatPrice(vehicle.amountFinanced)}
                      </div>
                    </div>
                  )}
                  {vehicle.profit && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">Profit</div>
                      <div className="text-base font-black text-emerald-400">
                        {formatPrice(vehicle.profit)}
                      </div>
                    </div>
                  )}
                  {vehicle.interestRate && (
                    <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5 hover:border-white/20 transition-all duration-300">
                      <div className="text-xs text-gray-400 font-medium mb-1">APR</div>
                      <div className="text-base font-black text-orange-400">
                        {formatPercentage(vehicle.interestRate)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Specifications Grid */}
              {(vehicle.fuel || vehicle.drivetrain || vehicle.bodyStyle) && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                  {vehicle.fuel && (
                    <div className="bg-gradient-to-br from-green-900/20 to-transparent backdrop-blur-md rounded-lg p-3 border border-green-500/20 hover:border-green-400/40 transition-all duration-300 group">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-green-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <Fuel className="w-4 h-4 text-green-400" />
                        </div>
                        <div>
                          <div className="text-xs text-green-300 font-medium">Fuel Type</div>
                          <div className="text-sm font-bold text-white">{vehicle.fuel}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {vehicle.drivetrain && (
                    <div className="bg-gradient-to-br from-purple-900/20 to-transparent backdrop-blur-md rounded-lg p-3 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 group">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-purple-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <Settings className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <div className="text-xs text-purple-300 font-medium">Drivetrain</div>
                          <div className="text-sm font-bold text-white">{vehicle.drivetrain}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {vehicle.bodyStyle && (
                    <div className="bg-gradient-to-br from-orange-900/20 to-transparent backdrop-blur-md rounded-lg p-3 border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300 group">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-orange-500/20 rounded-lg group-hover:scale-110 transition-transform">
                          <Car className="w-4 h-4 text-orange-400" />
                        </div>
                        <div>
                          <div className="text-xs text-orange-300 font-medium">Body Style</div>
                          <div className="text-sm font-bold text-white">{vehicle.bodyStyle}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Dealer Information */}
              {vehicle.dealer && (
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-md rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-gray-700/30 rounded-lg">
                      <MapPin className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 font-medium">Dealership</div>
                      <div className="text-sm font-bold text-white">{vehicle.dealer}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Premium Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleViewDetails}
                  disabled={!vehicle["Vehicle Link"]}
                  className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25 group"
                >
                  <span className="text-sm">View on Dealer Website</span>
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-gray-800/80 backdrop-blur hover:bg-gray-700/80 text-white font-bold text-sm rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20 shadow-xl"
                >
                  Close
                </button>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
          </div>
        </div>
      )}
    </>
  );
}