'use client';

import { formatPrice } from '@/lib/utils/formatters';
import { cn, debugLog } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { Car, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ArrowUpDown, Filter, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface TableBlockProps {
  columns: string[];
  rows: (string | number)[][];
  className?: string;
}

export default function TableBlock({ columns, rows, className = '' }: TableBlockProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadingImages, setLoadingImages] = useState<Record<string, boolean>>({});
  const imageContainerRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  const handleImageError = (src: string) => {
    setImageErrors(prev => ({ ...prev, [src]: true }));
  };

  const handleImageLoad = (src: string) => {
    setLoadingImages(prev => ({ ...prev, [src]: false }));
  };

  const prepareImageLoad = (src: string) => {
    setLoadingImages(prev => ({ ...prev, [src]: true }));
  };

  // Check if this table contains vehicle data
  const isVehicleTable = () => {
    const vehicleColumns = ['make', 'model', 'year', 'vehicle', 'car', 'vin', 'stock'];
    const lowerColumns = columns.map(col => col.toLowerCase());
    return vehicleColumns.some(vcol => 
      lowerColumns.some(col => col.includes(vcol))
    );
  };

  // Safe access to rows data
  const hasRows = Array.isArray(rows) && rows.length > 0;
  const firstRow = hasRows ? rows[0] : [];

  // Extract image URLs from the first row (safely)
  const imageUrls = hasRows ? firstRow.map(cell => {
    if (typeof cell === 'string' && cell.match(/!\[.*?\]\((.*?)\)/)) {
      return cell.match(/!\[.*?\]\((.*?)\)/)?.[1] || '';
    }
    return '';
  }).filter(Boolean) : [];

  // Get vehicle images for a specific row - enhanced to detect image URLs directly
  const getVehicleImages = (row: (string | number)[]): string[] => {
    // First, try to find explicit image markdown format
    const markdownImages = row.map(cell => {
      if (typeof cell === 'string' && cell.match(/!\[.*?\]\((.*?)\)/)) {
        return cell.match(/!\[.*?\]\((.*?)\)/)?.[1] || '';
      }
      return '';
    }).filter(Boolean);
    
    if (markdownImages.length > 0) {
      return markdownImages;
    }
    
    // Otherwise, look for any URL columns that might contain image links
    const imageUrls = row.map((cell, index) => {
      const colName = columns[index]?.toLowerCase() || '';
      if (typeof cell === 'string' && 
         (colName.includes('image') || colName.includes('photo') || colName.includes('pic') || colName.includes('url') || colName.includes('img')) &&
         (cell.startsWith('http') || cell.startsWith('https')) &&
         (cell.endsWith('.jpg') || cell.endsWith('.jpeg') || cell.endsWith('.png') || cell.endsWith('.webp') || 
          cell.includes('dealer.com') || cell.includes('dealercdn') || cell.includes('cloudfront.net') || 
          cell.includes('images') || cell.includes('photos'))) {
        return cell;
      }
      return '';
    }).filter(Boolean);
    
    return imageUrls;
  };

  // Get current image for a vehicle
  const getCurrentVehicleImage = (row: (string | number)[], rowIndex: number): string | null => {
    const images = getVehicleImages(row);
    if (images.length === 0) return null;
    
    const currentIndex = currentImageIndex[rowIndex] || 0;
    return images[currentIndex] || images[0];
  };

  // Navigate to next/previous image with enhanced transitions
  const navigateImage = (rowIndex: number, direction: 'next' | 'prev') => {
    const images = getVehicleImages(rows[rowIndex]);
    if (images.length <= 1) return;
    
    const currentIndex = currentImageIndex[rowIndex] || 0;
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    }
    
    // Pre-load the next image
    prepareImageLoad(images[newIndex]);
    
    // Animate transition
    const imageContainer = imageContainerRefs.current[rowIndex];
    if (imageContainer) {
      imageContainer.classList.add('opacity-50');
      setTimeout(() => {
        setCurrentImageIndex(prev => ({
          ...prev,
          [rowIndex]: newIndex
        }));
        setTimeout(() => {
          imageContainer.classList.remove('opacity-50');
        }, 50);
      }, 150);
    } else {
      setCurrentImageIndex(prev => ({
        ...prev,
        [rowIndex]: newIndex
      }));
    }
  };

  // Get vehicle info for thumbnail display
  const getVehicleInfo = (row: (string | number)[]): { make?: string, model?: string, year?: string } => {
    const makeIndex = columns.findIndex(col => col.toLowerCase().includes('make'));
    const modelIndex = columns.findIndex(col => col.toLowerCase().includes('model'));
    const yearIndex = columns.findIndex(col => col.toLowerCase().includes('year'));
    
    return {
      make: makeIndex >= 0 ? String(row[makeIndex]) : undefined,
      model: modelIndex >= 0 ? String(row[modelIndex]) : undefined,
      year: yearIndex >= 0 ? String(row[yearIndex]) : undefined,
    };
  };

  // Get primary columns (most important for mobile)
  const getPrimaryColumns = (): number[] => {
    const priorityColumns = ['make', 'model', 'year', 'price', 'payment', 'mileage'];
    const primaryIndices: number[] = [];
    
    priorityColumns.forEach(priority => {
      const index = columns.findIndex(col => 
        col.toLowerCase().includes(priority)
      );
      if (index >= 0) {
        primaryIndices.push(index);
      }
    });
    
    // If we don't have enough primary columns, add the first few
    if (primaryIndices.length < 3) {
      for (let i = 0; i < Math.min(3, columns.length); i++) {
        if (!primaryIndices.includes(i)) {
          primaryIndices.push(i);
        }
      }
    }
    
    return primaryIndices;
  };

  const toggleCardExpansion = (rowIndex: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(rowIndex)) {
      newExpanded.delete(rowIndex);
    } else {
      newExpanded.add(rowIndex);
    }
    setExpandedCards(newExpanded);
  };

  // Get colors for specific column types
  const getColumnColors = (columnName: string): { text: string, bg: string, icon: string } => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price')) {
      return {
        text: 'text-green-300',
        bg: 'from-green-500/10 to-emerald-500/10',
        icon: 'text-green-400'
      };
    }
    
    if (colLower.includes('payment')) {
      return {
        text: 'text-blue-300',
        bg: 'from-blue-500/10 to-indigo-500/10',
        icon: 'text-blue-400'
      };
    }
    
    if (colLower.includes('rate') || colLower.includes('apr')) {
      return {
        text: 'text-yellow-300',
        bg: 'from-yellow-500/10 to-amber-500/10',
        icon: 'text-yellow-400'
      };
    }

    if (colLower.includes('mileage') || colLower.includes('miles')) {
      return {
        text: 'text-purple-300',
        bg: 'from-purple-500/10 to-fuchsia-500/10',
        icon: 'text-purple-400'
      };
    }

    if (colLower === 'make' || colLower === 'model' || colLower.includes('vehicle')) {
      return {
        text: 'text-white',
        bg: 'from-indigo-500/10 to-blue-500/10',
        icon: 'text-indigo-400'
      };
    }
    
    // Default colors
    return {
      text: 'text-gray-300',
      bg: 'from-indigo-500/5 to-blue-500/5',
      icon: 'text-gray-400'
    };
  };

  // Force vehicle data treatment if any row has image URLs
  const hasImages = rows.some(row => getVehicleImages(row).length > 0);
  const hasVehicleData = isVehicleTable() || hasImages;
  const primaryColumns = getPrimaryColumns();

  // Add keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hoveredRow === null) return;
      
      if (e.key === 'ArrowLeft') {
        navigateImage(hoveredRow, 'prev');
      } else if (e.key === 'ArrowRight') {
        navigateImage(hoveredRow, 'next');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredRow]);

  if (!hasRows || !columns || columns.length === 0) {
    return (
      <div className={cn(
        "relative text-center py-8 sm:py-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl overflow-hidden",
        "bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl",
        className
      )}>
        {/* Background effects - Enhanced with modern gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-blue-500/15 rounded-full blur-2xl animate-pulse duration-5000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-purple-500/15 rounded-full blur-2xl animate-pulse duration-7000"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-600/40 to-purple-600/40 rounded-xl sm:rounded-2xl flex items-center justify-center border border-blue-400/20 shadow-lg transform hover:rotate-3 transition-transform duration-300">
            <span className="text-2xl sm:text-3xl">📊</span>
          </div>
          <h3 className="font-bold text-white text-base sm:text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">No Data Available</h3>
          <p className="text-gray-400 text-sm sm:text-base">Financial comparison data will appear here</p>
        </div>
      </div>
    );
  }

  const formatCellValue = (value: string | number, columnName: string): string => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price') && typeof value === 'number') {
      return formatPrice(value);
    }
    
    if (colLower.includes('mileage') && typeof value === 'number') {
      return `${value.toLocaleString()} mi`;
    }
    
    if (colLower.includes('payment') && typeof value === 'number') {
      return `$${Math.round(value).toLocaleString()}/mo`;
    }
    
    if (colLower.includes('rate') && typeof value === 'number') {
      return `${value}%`;
    }
    
    return String(value);
  };

  const getCellClassName = (columnName: string, isHeader = false): string => {
    const colLower = columnName.toLowerCase();
    
    if (isHeader) {
      return 'text-blue-200 font-bold text-xs sm:text-sm tracking-wider uppercase';
    }
    
    return getColumnColors(columnName).text;
  };

  const getColumnIcon = (columnName: string): React.ReactNode => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price')) return '💰';
    if (colLower.includes('payment')) return '💳';
    if (colLower.includes('rate') || colLower.includes('apr')) return '📈';
    if (colLower.includes('term')) return '📅';
    if (colLower.includes('mileage')) return '🛣️';
    if (colLower === 'make' || colLower === 'model') return '🚗';
    if (colLower.includes('year')) return '📆';
    if (colLower.includes('link')) return <ExternalLink className="w-3 h-3" />;
    if (colLower.includes('compare')) return <ArrowUpDown className="w-3 h-3" />;
    if (colLower.includes('filter')) return <Filter className="w-3 h-3" />;
    
    return '📊';
  };

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Enhanced Header - Modern 3D Card Design */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl backdrop-blur-xl border border-white/20 shadow-[0_10px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_20px_rgba(0,0,0,0.4)]">
        {/* Header background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-purple-600/10"></div>
        <div className="absolute top-0 left-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500/15 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-10 h-10 sm:w-20 sm:h-20 bg-purple-500/15 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-white/20 flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform duration-300">
                <span className="text-lg sm:text-2xl">{hasVehicleData ? '🚗' : '📊'}</span>
              </div>
              <div>
                <h4 className="text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                  {hasVehicleData ? 'Vehicle Comparison' : 'Financial Comparison'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-400">
                  {rows.length} option{rows.length !== 1 ? 's' : ''} • Updated now
                  {hasVehicleData && ' • Vehicle ID included'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 self-start sm:self-auto">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute opacity-75"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full relative"></div>
              </div>
              <span className="text-xs text-green-400 font-medium tracking-wide">LIVE DATA</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modern Mobile Card Layout (hidden on desktop) */}
      <div className="block lg:hidden space-y-4">
        {rows.map((row, rowIndex) => {
          const vehicleImages = hasVehicleData ? getVehicleImages(row) : [];
          const currentImage = hasVehicleData ? getCurrentVehicleImage(row, rowIndex) : null;
          const vehicleInfo = hasVehicleData ? getVehicleInfo(row) : {};
          const isExpanded = expandedCards.has(rowIndex);
          
          return (
            <div
              key={rowIndex}
              className="relative overflow-hidden rounded-xl bg-gradient-to-br from-black/20 via-black/10 to-black/20 backdrop-blur-xl border border-white/10 shadow-[0_8px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] transform hover:translate-y-[-2px] transition-all duration-300"
              data-testid={`vehicle-row-${rowIndex}`}
            >
              {/* Card background effects */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-1/6 w-24 h-24 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/6 w-20 h-20 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl"></div>
              </div>
              
              <div className="relative z-10">
                {/* Mobile Image Carousel - Enhanced with smooth transitions */}
                {hasVehicleData && vehicleImages.length > 0 && (
                  <div 
                    className="relative h-52 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black transition-opacity duration-300"
                    ref={(el: HTMLDivElement | null): void => {
                      imageContainerRefs.current[rowIndex] = el;
                    }}
                  >
                    {/* Loading Indicator */}
                    {loadingImages[currentImage!] && (
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/50">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  
                    {/* Current Image */}
                    <div className="relative w-full h-full">
                      {!imageErrors[currentImage!] ? (
                        <Image
                          src={currentImage!}
                          alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                          fill
                          className={cn(
                            "object-cover object-center transition-all duration-700 transform hover:scale-105",
                            loadingImages[currentImage!] ? "opacity-0" : "opacity-100"
                          )}
                          onError={() => handleImageError(currentImage!)}
                          onLoad={() => handleImageLoad(currentImage!)}
                          data-testid={`vehicle-${vehicleInfo.make?.toLowerCase() || ''}-${vehicleInfo.model?.toLowerCase() || ''}-image`}
                        />
                      ) : (
                        <div className="fallback-content w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30">
                          <Car className="w-16 h-16 text-white/70 mb-3" />
                          <div className="text-white/70 text-sm font-medium">
                            {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model}
                          </div>
                          <div className="text-white/50 text-xs mt-1">Vehicle Image</div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                    
                    {/* Modern Navigation Controls */}
                    {vehicleImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage(rowIndex, 'prev');
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl backdrop-blur-sm border border-white/20 z-10"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage(rowIndex, 'next');
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl backdrop-blur-sm border border-white/20 z-10"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter - Modern pill design */}
                    {vehicleImages.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-xl backdrop-blur-sm border border-white/20 z-10">
                        {(currentImageIndex[rowIndex] || 0) + 1} / {vehicleImages.length}
                      </div>
                    )}
                    
                    {/* Modern indicator dots */}
                    {vehicleImages.length > 1 && (
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-1 z-10">
                        {vehicleImages.map((_, imageIndex) => (
                          <button
                            key={imageIndex}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImageIndex(prev => ({
                                ...prev,
                                [rowIndex]: imageIndex
                              }));
                            }}
                            className={cn(
                              "w-8 h-1.5 rounded-full transition-all duration-300",
                              (currentImageIndex[rowIndex] || 0) === imageIndex
                                ? "bg-white shadow-lg"
                                : "bg-white/40 hover:bg-white/60"
                            )}
                            aria-label={`Go to image ${imageIndex + 1}`}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Vehicle Info Overlay - Enhanced with gradient text */}
                    <div className="absolute bottom-4 left-4 text-white z-10">
                      <h5 className="text-lg font-bold mb-1 drop-shadow-lg text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
                        {hasVehicleData ? (
                          `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`.trim() || `Option ${rowIndex + 1}`
                        ) : (
                          `Option ${rowIndex + 1}`
                        )}
                      </h5>
                      <div className="flex items-center space-x-2 text-sm text-white/90">
                        <span className="bg-gradient-to-r from-green-500/90 to-emerald-500/90 px-2 py-0.5 rounded-full text-xs font-semibold shadow-sm">
                          {vehicleImages.length} {vehicleImages.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                        <span>•</span>
                        <span>{columns.length} Details</span>
                      </div>
                    </div>
                    
                    {/* Live Photo Indicator */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2 z-10">
                      <div className="relative">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute opacity-75"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full relative"></div>
                      </div>
                      <span className="text-white/90 text-xs font-semibold bg-black/60 px-2 py-1 rounded-full backdrop-blur-sm">
                        LIVE PHOTOS
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Card Content */}
                <div className="p-4">
                  {/* Card Header - Only show if NO images */}
                  {(!hasVehicleData || vehicleImages.length === 0) && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Fallback Icon with gradient */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-500/30 to-blue-500/30 border border-white/10 shadow-lg flex-shrink-0 flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Vehicle Title with gradient text */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-bold truncate text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
                            {hasVehicleData ? (
                              `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`.trim() || `Option ${rowIndex + 1}`
                            ) : (
                              `Option ${rowIndex + 1}`
                            )}
                          </h5>
                          <p className="text-xs text-gray-400 truncate">
                            {columns.length} details available
                          </p>
                        </div>
                      </div>
                      
                      {/* Improved Expand Button */}
                      <button
                        onClick={() => toggleCardExpansion(rowIndex)}
                        className="touch-target flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-white/10 text-white/80 hover:text-white backdrop-blur-sm transition-all duration-200 transform hover:scale-105 active:scale-95"
                        aria-label={isExpanded ? "Collapse details" : "Expand details"}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-white/90" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/90" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Expand Button for cards with images - Improved position and style */}
                  {hasVehicleData && vehicleImages.length > 0 && (
                    <button
                      onClick={() => toggleCardExpansion(rowIndex)}
                      className="absolute right-3 top-3 flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/20 to-blue-500/20 text-white/80 hover:text-white backdrop-blur-sm border border-white/10 transition-all duration-200 transform hover:scale-105 active:scale-95 z-20"
                      aria-label={isExpanded ? "Collapse details" : "Expand details"}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-white/90" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-white/90" />
                      )}
                    </button>
                  )}
                  
                  {/* Primary Info (Always Visible) - Enhanced grid with better visuals */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {primaryColumns.slice(0, 4).map((colIndex) => {
                      const columnColors = getColumnColors(columns[colIndex]);
                      return (
                        <div
                          key={colIndex}
                          className={cn(
                            "bg-gradient-to-br rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all duration-300 transform hover:translate-y-[-2px] hover:shadow-lg",
                            `bg-gradient-to-br ${columnColors.bg}`
                          )}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className={cn(
                              "w-7 h-7 rounded-full flex items-center justify-center text-xs",
                              `bg-gradient-to-br from-black/30 to-black/10 ${columnColors.icon}`
                            )}>
                              {getColumnIcon(columns[colIndex])}
                            </div>
                            <span className="text-xs text-gray-400 font-medium truncate">{columns[colIndex]}</span>
                          </div>
                          <div className={cn(
                            "text-sm font-semibold truncate",
                            columnColors.text
                          )}>
                            {formatCellValue(row[colIndex], columns[colIndex])}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Expanded Details - with animation and better styling */}
                  {isExpanded && (
                    <div className="space-y-2 pt-3 px-1 pb-2 border-t border-white/10 animate-fadeIn">
                      {columns.map((column, colIndex) => {
                        if (primaryColumns.slice(0, 4).includes(colIndex)) return null;
                        
                        const columnColors = getColumnColors(column);
                        return (
                          <div
                            key={colIndex}
                            className="flex items-center justify-between py-2 px-3 bg-black/10 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300 transform hover:translate-y-[-1px] hover:shadow-md"
                          >
                            <div className="flex items-center space-x-2">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                                `bg-gradient-to-br from-black/20 to-black/5 ${columnColors.icon}`
                              )}>
                                {getColumnIcon(column)}
                              </div>
                              <span className="text-xs text-gray-400 font-medium truncate">{column}</span>
                            </div>
                            <div className={cn(
                              "text-sm font-medium text-right truncate max-w-[60%]",
                              columnColors.text
                            )}>
                              {formatCellValue(row[colIndex], column)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Enhanced Desktop Table Layout (hidden on mobile) */}
      <div className="hidden lg:block relative overflow-hidden rounded-2xl backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Table background effects - More dynamic */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/6 w-48 h-48 bg-gradient-to-r from-blue-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse duration-7000"></div>
          <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse duration-5000 delay-1000"></div>
        </div>
        
        <div className="relative z-10 overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-gradient-to-r from-indigo-900/20 via-black/40 to-indigo-900/20">
                {/* Add thumbnail column header if we have vehicle data */}
                {hasVehicleData && (
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center space-x-2">
                      <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-white/10">
                        <span className="text-lg">🖼️</span>
                      </span>
                      <span className="text-blue-200 font-bold text-sm tracking-wider uppercase">Vehicle</span>
                    </div>
                  </th>
                )}
                {columns.map((column, index) => {
                  const columnColors = getColumnColors(column);
                  return (
                    <th
                      key={index}
                      className={cn(
                        "px-6 py-4 text-left transition-all duration-300",
                        "hover:bg-white/5",
                        hoveredCol === index && "bg-white/5"
                      )}
                      onMouseEnter={() => setHoveredCol(index)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      <div className="flex items-center space-x-2">
                        <span className={cn(
                          "w-7 h-7 flex items-center justify-center rounded-lg bg-gradient-to-br border border-white/10",
                          `from-black/20 to-black/5 ${columnColors.icon}`
                        )}>
                          {getColumnIcon(column)}
                        </span>
                        <span className="text-blue-200 font-bold text-sm tracking-wider uppercase">{column}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const vehicleImage = hasVehicleData ? getCurrentVehicleImage(row, rowIndex) : null;
                const vehicleInfo = hasVehicleData ? getVehicleInfo(row) : {};
                const vehicleImages = hasVehicleData ? getVehicleImages(row) : [];
                
                return (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-white/5 transition-all duration-300 group",
                      "hover:bg-gradient-to-r hover:from-indigo-600/10 hover:via-blue-600/5 hover:to-indigo-600/10",
                      hoveredRow === rowIndex && "bg-gradient-to-r from-indigo-600/15 via-blue-600/10 to-indigo-600/15"
                    )}
                    onMouseEnter={() => setHoveredRow(rowIndex)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Enhanced Vehicle thumbnail column */}
                    {hasVehicleData && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-800/50 to-blue-900/50 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300 cursor-pointer group">
                            {vehicleImage ? (
                              <>
                                {!imageErrors[vehicleImage] ? (
                                  <Image
                                    src={vehicleImage}
                                    alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                                    fill
                                    className="object-cover object-center group-hover:scale-110 transition-all duration-500 brightness-90 group-hover:brightness-100"
                                    onError={() => handleImageError(vehicleImage)}
                                    data-testid={`vehicle-${vehicleInfo.make?.toLowerCase() || ''}-${vehicleInfo.model?.toLowerCase() || ''}-image`}
                                  />
                                ) : (
                                  <div className="fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30">
                                    <Car className="w-6 h-6 text-white" />
                                  </div>
                                )}
                                
                                {/* Desktop Gallery Navigation Arrows */}
                                {vehicleImages.length > 1 && (
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(rowIndex, 'prev');
                                      }}
                                      className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-8 bg-black/80 hover:bg-black text-white rounded flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95"
                                      aria-label="Previous image"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(rowIndex, 'next');
                                      }}
                                      className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-8 bg-black/80 hover:bg-black text-white rounded flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95"
                                      aria-label="Next image"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                
                                {/* Desktop Image count indicator */}
                                {vehicleImages.length > 1 && (
                                  <div className="absolute bottom-1 left-1 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                                    {(currentImageIndex[rowIndex] || 0) + 1}/{vehicleImages.length}
                                  </div>
                                )}
                                
                                {/* Photo indicator badge */}
                                <div className="absolute top-1 right-1">
                                  <div className="relative">
                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-ping absolute opacity-75"></div>
                                    <div className="w-2 h-2 bg-green-400 rounded-full relative"></div>
                                  </div>
                                </div>
                                
                                {/* Enhanced thumbnail overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-1 right-1 text-xs text-white font-bold opacity-90">
                                    {vehicleImages.length > 1 ? 'GALLERY' : 'PHOTO'}
                                  </div>
                                </div>
                                
                                {/* Subtle blue glow on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-blue-500/10 transition-opacity duration-300 pointer-events-none"></div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30 relative">
                                <Car className="w-7 h-7 text-white" />
                                {/* Icon indicator */}
                                <div className="absolute top-1 right-1 w-2 h-2 bg-gray-400 rounded-full"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* Enhanced Vehicle quick info with gallery indicator */}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-white truncate text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white">
                              {vehicleInfo.year} {vehicleInfo.make}
                            </div>
                            <div className="text-xs text-gray-300 truncate font-medium">
                              {vehicleInfo.model}
                            </div>
                            {vehicleImage && (
                              <div className="text-xs text-green-400 font-semibold mt-0.5 flex items-center space-x-1">
                                <span className="relative">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping absolute opacity-75"></span>
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full relative"></span>
                                </span>
                                <span>
                                  {vehicleImages.length > 1 
                                    ? `${vehicleImages.length} Photos` 
                                    : 'Live Photo'
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                    
                    {/* Regular table cells - without highlight effects */}
                    {row.map((cell, cellIndex) => {
                      const columnName = columns[cellIndex];
                      const columnColors = getColumnColors(columnName);
                      
                      return (
                        <td
                          key={cellIndex}
                          className={cn(
                            "px-6 py-4 transition-all duration-300",
                            columnColors.text
                          )}
                        >
                          <div className="relative">
                            {formatCellValue(cell, columnName)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Enhanced Table Footer with Stats */}
        <div className="border-t border-white/10 bg-gradient-to-r from-indigo-900/20 via-black/30 to-indigo-900/20 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <span className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
                <span>Rows: {rows.length}</span>
              </span>
              <span className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span>Columns: {columns.length}</span>
              </span>
              {hasVehicleData && (
                <span className="flex items-center space-x-2">
                  <div className="relative">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></div>
                  </div>
                  <span>Vehicles: {rows.length}</span>
                </span>
              )}
            </div>
            <div className="text-gray-400 text-xs">
              {hasVehicleData && '🚗 Hover over images to browse gallery'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}