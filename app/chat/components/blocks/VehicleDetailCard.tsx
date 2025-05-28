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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-1 bg-black/90 backdrop-blur-xl" onClick={onClose}>
      <div
        className="relative w-full max-w-xs mx-auto max-h-[95vh] overflow-y-auto bg-gradient-to-b from-gray-900/95 via-gray-900/98 to-black/95 backdrop-blur-2xl rounded-lg shadow-2xl shadow-black/50 border border-white/10 overflow-hidden"
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
        <div className="relative cursor-zoom-in">
          <div className="aspect-[2/1] w-full bg-black overflow-hidden">
            {hasImage ? (
              <img
                src={allImages[currentImageIndex]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="object-contain w-full h-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder-car.jpg';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
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

        <div className="p-2 space-y-2">
          {/* Title */}
          <div>
            <h1 className="text-base font-black text-white mb-1">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            {vehicle.trim && (
              <p className="text-xs font-semibold text-gray-300">{vehicle.trim}</p>
            )}
            <div className="flex items-baseline gap-2 mt-1 flex-wrap">
              <span className="text-sm font-black text-blue-400">
                {formatPrice(vehicle.price)}
              </span>
              {vehicle.payment && (
                <span className="text-sm font-semibold text-green-400">
                  {formatPayment(vehicle.payment)}/mo
                </span>
              )}
            </div>
          </div>

          {/* Financing Grid */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-lg p-2 border border-white/10 shadow-xl">
            <h2 className="text-xs font-bold text-white mb-2 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-blue-400" />
              Financing
            </h2>
            <div className="grid grid-cols-2 gap-2 text-base">
              <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                <div className="text-xs text-gray-400 font-medium">Sale</div>
                <div className="font-bold text-blue-400">{formatPrice(vehicle.price)}</div>
              </div>
              {vehicle.payment && (
                <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                  <div className="text-xs text-gray-400 font-medium">Monthly</div>
                  <div className="font-bold text-green-400">{formatPayment(vehicle.payment)}</div>
                </div>
              )}
              <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                <div className="text-xs text-gray-400 font-medium">Down</div>
                <div className="font-bold text-yellow-400">{vehicle.downPayment === 0 ? '$0' : formatPrice(vehicle.downPayment ?? 0)}</div>
              </div>
              {vehicle.loanTermMonths && (
                <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                  <div className="text-xs text-gray-400 font-medium">Term</div>
                  <div className="font-bold text-purple-400">{vehicle.loanTermMonths}<span className="text-xs">mo</span></div>
                </div>
              )}
              {vehicle.ltv && (
                <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                  <div className="text-xs text-gray-400 font-medium">LTV</div>
                  <div className="font-bold text-red-500">{formatPercentage(vehicle.ltv)}</div>
                </div>
              )}
              {vehicle.profit && (
                <div className="text-center p-2 bg-black/40 rounded border border-white/5">
                  <div className="text-xs text-gray-400 font-medium">Profit</div>
                  <div className="font-bold text-emerald-400">{formatPrice(vehicle.profit)}</div>
                </div>
              )}
            </div>
          </div>

          {/* Meta Badges */}
          <div className="grid grid-cols-2 gap-2">
            {(vehicle.vin || vehicle.id) && (
              <div className="bg-gradient-to-br from-blue-900/30 to-blue-900/10 backdrop-blur-md rounded-lg p-2 border border-blue-500/20">
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-300 font-medium">VIN</span>
                </div>
                <div className="text-xs font-mono text-white truncate">{vehicle.vin || vehicle.id}</div>
              </div>
            )}
            {vehicle.stock && (
              <div className="bg-gradient-to-br from-green-900/30 to-green-900/10 backdrop-blur-md rounded-lg p-2 border border-green-500/20">
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-300 font-medium">STOCK</span>
                </div>
                <div className="text-xs font-bold text-white">#{vehicle.stock}</div>
              </div>
            )}
            {vehicle.mileage && (
              <div className="bg-gradient-to-br from-purple-900/30 to-purple-900/10 backdrop-blur-md rounded-lg p-2 border border-purple-500/20">
                <div className="flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">Mileage</span>
                </div>
                <div className="text-xs font-bold text-white">{formatMileage(vehicle.mileage)}</div>
              </div>
            )}
            {vehicle.year && (
              <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-900/10 backdrop-blur-md rounded-lg p-2 border border-yellow-500/20">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-yellow-300 font-medium">Year</span>
                </div>
                <div className="text-xs font-bold text-white">{vehicle.year}</div>
              </div>
            )}
          </div>

          {/* External Link */}
          {vehicle["Vehicle Link"] && (
            <a
              href={vehicle["Vehicle Link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full p-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all duration-300 group"
            >
              <span className="font-semibold text-sm">View Full Details</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          )}
        </div>

        <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-x-1/2 translate-y-1/2 pointer-events-none"></div>
      </div>
    </div>
  );
}
