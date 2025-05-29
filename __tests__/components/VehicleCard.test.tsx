import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VehicleCard from '@/app/chat/components/blocks/VehicleCard';
import type { VehicleData } from '@/types';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
});

describe('VehicleCard Component', () => {
  const mockVehicle: VehicleData = {
    id: '1',
    year: 2020,
    make: 'Toyota',
    model: 'Camry',
    trim: 'XLE',
    price: 25000,
    image: 'https://example.com/car.jpg',
    stock: 'A123',
    mileage: 50000,
    fuel: 'Gasoline',
    drivetrain: 'FWD',
    dealer: 'Local Toyota',
    payment: 350,
    "Vehicle Link": 'https://example.com/vehicle/1'
  };

  beforeEach(() => {
    mockWindowOpen.mockClear();
  });

  it('renders vehicle basic information correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText('2020 Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('XLE')).toBeInTheDocument();
    expect(screen.getByText('$25,000')).toBeInTheDocument();
    expect(screen.getByText('$350/mo')).toBeInTheDocument();
  });

  it('renders vehicle specs correctly', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText('50,000 miles')).toBeInTheDocument();
    expect(screen.getByText('Gasoline')).toBeInTheDocument();
    expect(screen.getByText('FWD')).toBeInTheDocument();
    expect(screen.getByText('Local Toyota')).toBeInTheDocument();
  });

  it('shows stock number when available', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText('#A123')).toBeInTheDocument();
  });

  it('opens vehicle link when View Details button is clicked', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    const viewDetailsButton = screen.getByText('View Full Details');
    fireEvent.click(viewDetailsButton);
    
    expect(mockWindowOpen).toHaveBeenCalledWith(
      'https://example.com/vehicle/1',
      '_blank',
      'noopener,noreferrer'
    );
  });

  it('disables button when no vehicle link is provided', () => {
    const vehicleWithoutLink = { ...mockVehicle, "Vehicle Link": undefined };
    render(<VehicleCard vehicle={vehicleWithoutLink} />);
    
    const viewDetailsButton = screen.getByRole('button', { name: /view full details/i });
    expect(viewDetailsButton).toBeDisabled();
  });

  it('handles missing optional fields gracefully', () => {
    const minimalVehicle: VehicleData = {
      id: '2',
      year: 2015,
      make: 'Honda',
      model: 'Civic',
      price: 15000,
    };
    
    render(<VehicleCard vehicle={minimalVehicle} />);
    
    expect(screen.getByText('2015 Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('$15,000')).toBeInTheDocument();
    
    // Should not show fields that aren't provided
    expect(screen.queryByText('miles')).not.toBeInTheDocument();
    expect(screen.queryByText('/mo')).not.toBeInTheDocument();
  });

  it('shows placeholder when no image is provided', () => {
    const vehicleWithoutImage = { ...mockVehicle, image: undefined, "Image URLs": undefined };
    render(<VehicleCard vehicle={vehicleWithoutImage} />);
    
    // Should show Car icon as placeholder
    const carIcon = document.querySelector('svg');
    expect(carIcon).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <VehicleCard vehicle={mockVehicle} className="custom-test-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-test-class');
  });
}); 