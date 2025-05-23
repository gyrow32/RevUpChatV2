import VehicleCard from './VehicleCard';
import type { VehicleData } from '@/types';
import { cn } from '@/lib/utils';

interface VehicleBlockProps {
  vehicles: VehicleData[];
  className?: string;
}

export default function VehicleBlock({ vehicles, className = '' }: VehicleBlockProps) {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className={cn(
        "text-center text-gray-500 dark:text-gray-400 py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg",
        className
      )}>
        <div className="text-4xl mb-2">🔍</div>
        <div className="font-medium">No vehicles found</div>
        <div className="text-sm mt-1">Try adjusting your search criteria</div>
      </div>
    );
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚗</span>
          <h4 className="font-medium text-gray-900 dark:text-gray-100">
            Found {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}
          </h4>
        </div>
      </div>
      
      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle, index) => (
          <VehicleCard 
            key={vehicle.id || `vehicle-${index}`} 
            vehicle={vehicle}
          />
        ))}
      </div>
    </div>
  );
}