import React from 'react';
import Image from 'next/image';
import { VehicleData } from '@/app/lib/types';
import { Car } from 'lucide-react';

interface VehicleCardProps {
  vehicle: VehicleData;
  onClick?: () => void;
  className?: string;
}

export default function VehicleCard({ vehicle, onClick, className = '' }: VehicleCardProps) {
  const hasLink = Boolean(vehicle["Vehicle Link"]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (hasLink) {
      window.open(vehicle["Vehicle Link"], '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className={`vehicle-card ${className}`}
      data-testid="vehicle-card"
    >
      {vehicle.image ? (
        <Image 
          src={vehicle.image} 
          alt={`${vehicle.make} ${vehicle.model}`} 
          className="vehicle-image"
          width={300}
          height={200}
        />
      ) : (
        <div className="vehicle-image-placeholder flex items-center justify-center h-32 w-full bg-gray-100">
          <Car size={48} />
        </div>
      )}
      <div className="vehicle-details">
        <h3>{`${vehicle.year} ${vehicle.make} ${vehicle.model}`}</h3>
        {vehicle.trim && <p className="trim">{vehicle.trim}</p>}
        {vehicle.stock && <p className="stock">#{vehicle.stock}</p>}
        <p className="price">${vehicle.price.toLocaleString()}</p>
        {vehicle.mileage !== undefined && (
          <p className="mileage">{vehicle.mileage.toLocaleString()} mi</p>
        )}
        {vehicle.payment && (
          <p className="payment">${vehicle.payment.toLocaleString()}/mo</p>
        )}
        <button
          type="button"
          disabled={!hasLink}
          onClick={handleClick}
          className="view-details-btn"
        >
          View Details
        </button>
      </div>
    </div>
  );
} 