'use client';

import Image from 'next/image';
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
    <div className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700",
      className
    )}>
      {/* Vehicle Image with Stock Badge */}
      {hasImage && (
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
          <img
            src={primaryImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          {vehicle.stock && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 text-xs font-bold rounded">
              Stock #{vehicle.stock}
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        {/* Vehicle Title and Body Style */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            {vehicle.trim && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                {vehicle.trim}
              </p>
            )}
          </div>
          {vehicle.bodyStyle && (
            <div className="ml-2 shrink-0 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded">
              {vehicle.bodyStyle}
            </div>
          )}
        </div>
        
        {/* Price and Payment */}
        <div className="space-y-2 mb-3">
          <p className="font-bold text-xl text-blue-600 dark:text-blue-400">
            {formatPrice(vehicle.price)}
          </p>
          
          {/* Payment info if available */}
          {vehicle.payment && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>est. {formatPayment(vehicle.payment)}</span>
              {vehicle.downPayment !== undefined && (
                <>
                  <span>•</span>
                  <span>{vehicle.downPayment === 0 ? '$0 down' : formatPrice(vehicle.downPayment) + ' down'}</span>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Vehicle Specs */}
        <div className="space-y-2">
          {vehicle.mileage && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-xs">⚙️</span>
              <span>{formatMileage(vehicle.mileage)}</span>
            </div>
          )}
          
          {vehicle.fuel && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {vehicle.fuel.toLowerCase().includes('electric') ? 
                <span className="text-xs">⚡</span> : <span className="text-xs">⛽</span>
              }
              <span>{vehicle.fuel}</span>
            </div>
          )}
          
          {vehicle.drivetrain && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="text-xs">🚗</span>
              <span>{vehicle.drivetrain}</span>
            </div>
          )}
        </div>
        
        {/* Financial Details (if available) */}
        {(vehicle.loanTermMonths || vehicle.ltv || vehicle.interestRate) && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
              Financial Details:
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {vehicle.loanTermMonths && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Term:</span>
                  <span className="font-medium ml-1">{vehicle.loanTermMonths} mo</span>
                </div>
              )}
              
              {vehicle.ltv && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">LTV:</span>
                  <span className="font-medium ml-1">{formatPercentage(vehicle.ltv)}</span>
                </div>
              )}
              
              {vehicle.interestRate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Rate:</span>
                  <span className="font-medium ml-1">{formatPercentage(vehicle.interestRate)}</span>
                </div>
              )}
              
              {vehicle.taxRate && (
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Tax:</span>
                  <span className="font-medium ml-1">{formatPercentage(vehicle.taxRate)}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Dealer Info */}
        {vehicle.dealer && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Dealer: {vehicle.dealer}
          </div>
        )}
      </div>
      
      <div className="p-4 pt-0">
        <button 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
          onClick={handleViewDetails}
          disabled={!vehicle["Vehicle Link"]}
        >
          View Full Details
        </button>
      </div>
    </div>
  );
}