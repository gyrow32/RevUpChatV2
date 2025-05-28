import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, DollarSign, Hash, FileText, Gauge, Calendar, Fuel, Settings, Car, MapPin, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice, formatMileage, formatPayment, formatPercentage } from '@/lib/utils/formatters';
import type { VehicleData } from '@/types';

interface VehicleDetailCardProps {
  vehicle: VehicleData;
  onClose: () => void;
}

export default function VehicleDetailCard({ vehicle, onClose }: VehicleDetailCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const primaryImage = vehicle.image || vehicle["Image URLs"]?.[0];
  const hasImage = primaryImage && primaryImage.trim() !== '';
  const allImages = vehicle["Image URLs"] || (vehicle.image ? [vehicle.image] : []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={onClose}>
      <div
        className="relative w-full max-w-screen-lg mx-auto overflow-y-auto h-[calc(100vh-6rem)] bg-gradient-to-b from-gray-900/95 via-gray-900/98 to-black/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-black/50 border border-white/10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 p-2 bg-black/60 backdrop-blur-xl rounded-xl border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all duration-300 group"
        >
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Hero Image */}
        <div className="relative">
          <div className="aspect-[16/6] w-full overflow-hidden">
            {hasImage ? (
              <img
                src={allImages[currentImageIndex]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="object-cover w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <Car className="w-12 h-12 text-gray-600" />
              </div>
            )}
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>
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
          </div>

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

        <div className="p-6 grid gap-4 lg:grid-cols-2">
          {/* Title */}
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-white mb-1 drop-shadow-xl">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.trim && (
              <p className="text-xs lg:text-sm font-semibold text-gray-300 drop-shadow-lg">{vehicle.trim}</p>
            )}
            <div className="flex items-baseline gap-3 mt-2 flex-wrap">
              <span className="text-lg lg:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 drop-shadow-lg">
                {formatPrice(vehicle.price)}
              </span>
              {vehicle.payment && (
                <span className="text-sm lg:text-base font-bold text-green-400 drop-shadow-lg">
                  {formatPayment(vehicle.payment)}/mo
                </span>
              )}
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
            {(vehicle.vin || vehicle.id) && (
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 backdrop-blur-md rounded-lg p-2 border border-blue-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-blue-500/20 rounded">
                    <Hash className="w-3 h-3 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-blue-300 font-medium">VIN</div>
                    <div className="text-[10px] font-mono text-white truncate">{vehicle.vin || vehicle.id}</div>
                  </div>
                </div>
              </div>
            )}
            {vehicle.stock && (
              <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 backdrop-blur-md rounded-lg p-2 border border-green-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-green-500/20 rounded">
                    <FileText className="w-3 h-3 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-green-300 font-medium">Stock</div>
                    <div className="text-[10px] font-bold text-white">#{vehicle.stock}</div>
                  </div>
                </div>
              </div>
            )}
            {vehicle.mileage && (
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 backdrop-blur-md rounded-lg p-2 border border-purple-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-purple-500/20 rounded">
                    <Gauge className="w-3 h-3 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-purple-300 font-medium">Mileage</div>
                    <div className="text-[10px] font-bold text-white">{formatMileage(vehicle.mileage)}</div>
                  </div>
                </div>
              </div>
            )}
            {vehicle.ageDays !== undefined && (
              <div className="bg-gradient-to-br from-orange-900/30 to-orange-900/10 backdrop-blur-md rounded-lg p-2 border border-orange-500/20">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-orange-500/20 rounded">
                    <Calendar className="w-3 h-3 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-orange-300 font-medium">Age</div>
                    <div className="text-[10px] font-bold text-white">{vehicle.ageDays} days</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Financing Grid */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-xl p-3 border border-white/10 shadow-xl lg:col-span-2">
            <h2 className="text-sm font-black text-white mb-3 flex items-center gap-2">
              <div className="p-1 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded">
                <DollarSign className="w-4 h-4 text-blue-400" />
              </div>
              Complete Financing Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5">
                <div className="text-[10px] text-gray-400 font-medium mb-1">Sale Price</div>
                <div className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                  {formatPrice(vehicle.price)}
                </div>
              </div>
              {vehicle.payment && (
                <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-medium mb-1">Monthly</div>
                  <div className="text-sm font-black text-green-400">{formatPayment(vehicle.payment)}</div>
                </div>
              )}
              {vehicle.downPayment !== undefined && (
                <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-medium mb-1">Down</div>
                  <div className="text-sm font-black text-yellow-400">{vehicle.downPayment === 0 ? '$0' : formatPrice(vehicle.downPayment)}</div>
                </div>
              )}
              {vehicle.loanTermMonths && (
                <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-medium mb-1">Term</div>
                  <div className="text-sm font-black text-purple-400">
                    {vehicle.loanTermMonths}<span className="text-[10px] font-semibold text-purple-300">mo</span>
                  </div>
                </div>
              )}
              {vehicle.ltv && (
                <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-medium mb-1">LTV</div>
                  <div className="text-sm font-black text-red-400">{formatPercentage(vehicle.ltv)}</div>
                </div>
              )}
              {vehicle.profit && (
                <div className="bg-black/40 backdrop-blur rounded-lg p-2 border border-white/5">
                  <div className="text-[10px] text-gray-400 font-medium mb-1">Profit</div>
                  <div className="text-sm font-black text-emerald-400">{formatPrice(vehicle.profit)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          {(vehicle.fuel || vehicle.drivetrain || vehicle.bodyStyle) && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
              {vehicle.fuel && (
                <div className="bg-gradient-to-br from-green-900/20 to-transparent backdrop-blur-md rounded-lg p-3 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-500/20 rounded-lg">
                      <Fuel className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-green-300 font-medium">Fuel Type</div>
                      <div className="text-sm font-bold text-white">{vehicle.fuel}</div>
                    </div>
                  </div>
                </div>
              )}
              {vehicle.drivetrain && (
                <div className="bg-gradient-to-br from-purple-900/20 to-transparent backdrop-blur-md rounded-lg p-3 border border-purple-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg">
                      <Settings className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-purple-300 font-medium">Drivetrain</div>
                      <div className="text-sm font-bold text-white">{vehicle.drivetrain}</div>
                    </div>
                  </div>
                </div>
              )}
              {vehicle.bodyStyle && (
                <div className="bg-gradient-to-br from-orange-900/20 to-transparent backdrop-blur-md rounded-lg p-3 border border-orange-500/20">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/20 rounded-lg">
                      <Car className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <div className="text-[10px] text-orange-300 font-medium">Body Style</div>
                      <div className="text-sm font-bold text-white">{vehicle.bodyStyle}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dealer Info */}
          {vehicle.dealer && (
            <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-md rounded-lg p-3 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gray-700/30 rounded-lg">
                  <MapPin className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-gray-400 font-medium">Dealership</div>
                  <div className="text-sm font-bold text-white">{vehicle.dealer}</div>
                </div>
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (vehicle["Vehicle Link"]) {
                  window.open(vehicle["Vehicle Link"], '_blank', 'noopener,noreferrer');
                }
              }}
              disabled={!vehicle["Vehicle Link"]}
              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-blue-500/25"
            >
              <span className="text-sm">View on Dealer Website</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800/80 backdrop-blur hover:bg-gray-700/80 text-white font-bold text-sm rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
            >
              Close
            </button>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </div>
    </div>
  );
}
