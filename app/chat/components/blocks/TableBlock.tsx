'use client';

import { formatPrice } from '@/lib/utils/formatters';
import { cn, debugLog } from '@/lib/utils';
import { useState } from 'react';
import { Car, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Check if this table contains vehicle data
  const isVehicleTable = () => {
    const vehicleColumns = ['make', 'model', 'year', 'vehicle', 'car', 'vin', 'stock'];
    const lowerColumns = columns.map(col => col.toLowerCase());
    return vehicleColumns.some(vcol => 
      lowerColumns.some(col => col.includes(vcol))
    );
  };

  // Extract image URLs from the first row
  const imageUrls = rows[0].map(cell => {
    if (typeof cell === 'string' && cell.match(/!\[.*?\]\((.*?)\)/)) {
      return cell.match(/!\[.*?\]\((.*?)\)/)?.[1] || '';
    }
    return '';
  });

  // Get vehicle images for a specific row
  const getVehicleImages = (row: (string | number)[]): string[] => {
    return row.map(cell => {
      if (typeof cell === 'string' && cell.match(/!\[.*?\]\((.*?)\)/)) {
        return cell.match(/!\[.*?\]\((.*?)\)/)?.[1] || '';
      }
      return '';
    }).filter(Boolean);
  };

  // Get current image for a vehicle
  const getCurrentVehicleImage = (row: (string | number)[], rowIndex: number): string | null => {
    const images = getVehicleImages(row);
    if (images.length === 0) return null;
    
    const currentIndex = currentImageIndex[rowIndex] || 0;
    return images[currentIndex] || images[0];
  };

  // Navigate to next/previous image
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
    
    setCurrentImageIndex(prev => ({
      ...prev,
      [rowIndex]: newIndex
    }));
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

  const hasVehicleData = isVehicleTable();
  const primaryColumns = getPrimaryColumns();

  if (!columns || !rows || rows.length === 0) {
    return (
      <div className={cn(
        "relative text-center py-8 sm:py-12 px-4 sm:px-6 rounded-xl sm:rounded-2xl overflow-hidden",
        "bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl",
        className
      )}>
        {/* Background effects - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-32 sm:h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-xl sm:rounded-2xl flex items-center justify-center border border-blue-400/20 shadow-lg">
            <span className="text-2xl sm:text-3xl">📊</span>
          </div>
          <div className="font-semibold text-white text-base sm:text-lg mb-2">No Data Available</div>
          <div className="text-gray-400 text-sm sm:text-base">Financial comparison data will appear here</div>
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
      return `$${value.toLocaleString()}/mo`;
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
    
    if (colLower.includes('price') || colLower.includes('payment')) {
      return 'text-green-300 font-bold text-base sm:text-lg';
    }
    
    if (colLower === 'make' || colLower === 'model' || colLower.includes('vehicle')) {
      return 'font-semibold text-white';
    }
    
    if (colLower === 'vin' || colLower === 'id' || colLower.includes('stock')) {
      return 'font-mono text-gray-400 text-xs sm:text-sm opacity-75';
    }
    
    if (colLower.includes('rate') || colLower.includes('apr')) {
      return 'text-yellow-300 font-semibold';
    }
    
    return 'text-gray-300';
  };

  const getColumnIcon = (columnName: string): string => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price')) return '💰';
    if (colLower.includes('payment')) return '💳';
    if (colLower.includes('rate') || colLower.includes('apr')) return '📈';
    if (colLower.includes('term')) return '📅';
    if (colLower.includes('mileage')) return '🛣️';
    if (colLower === 'make' || colLower === 'model') return '🚗';
    if (colLower.includes('year')) return '📆';
    
    return '📊';
  };

  return (
    <div className={cn("space-y-4 sm:space-y-6", className)}>
      {/* Enhanced Header - Mobile Optimized */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 p-4 sm:p-6 shadow-2xl">
        {/* Header background effects - Mobile Optimized */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-green-600/5"></div>
        <div className="absolute top-0 left-1/4 w-12 h-12 sm:w-24 sm:h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-10 h-10 sm:w-20 sm:h-20 bg-green-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600/40 to-green-600/40 rounded-lg sm:rounded-xl flex items-center justify-center border border-blue-400/30 shadow-lg">
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
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE DATA</span>
          </div>
        </div>
      </div>
      
      {/* Mobile Card Layout (hidden on desktop) */}
      <div className="block lg:hidden space-y-3">
        {rows.map((row, rowIndex) => {
          const vehicleImages = hasVehicleData ? getVehicleImages(row) : [];
          const currentImage = hasVehicleData ? getCurrentVehicleImage(row, rowIndex) : null;
          const vehicleInfo = hasVehicleData ? getVehicleInfo(row) : {};
          const isExpanded = expandedCards.has(rowIndex);
          
          return (
            <div
              key={rowIndex}
              className="relative overflow-hidden rounded-xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-xl"
            >
              {/* Card background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
              
              <div className="relative z-10">
                {/* Mobile Image Carousel - Full Width */}
                {hasVehicleData && vehicleImages.length > 0 && (
                  <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-900 to-black">
                    {/* Current Image */}
                    <div className="relative w-full h-full">
                      <Image
                        src={currentImage!}
                        alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                        fill
                        className="object-cover object-center transition-all duration-500"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent && parent.querySelector('.fallback-content') === null) {
                            const fallback = document.createElement('div');
                            fallback.className = 'fallback-content w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30';
                            fallback.innerHTML = `
                              <svg class="w-16 h-16 text-white/70 mb-3" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 8 14.5 1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1H6.5c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
                              </svg>
                              <div class="text-white/70 text-sm font-medium">${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}</div>
                              <div class="text-white/50 text-xs mt-1">Vehicle Image</div>
                            `;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    
                    {/* Image Overlay with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>
                    
                    {/* Navigation Arrows - Only show if multiple images */}
                    {vehicleImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage(rowIndex, 'prev');
                          }}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl backdrop-blur-sm border border-white/20"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage(rowIndex, 'next');
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200 active:scale-95 shadow-xl backdrop-blur-sm border border-white/20"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                    
                    {/* Image Counter */}
                    {vehicleImages.length > 1 && (
                      <div className="absolute top-4 right-4 bg-black/80 text-white text-sm px-3 py-1.5 rounded-full font-semibold shadow-xl backdrop-blur-sm border border-white/20">
                        {(currentImageIndex[rowIndex] || 0) + 1} / {vehicleImages.length}
                      </div>
                    )}
                    
                    {/* Photo Indicator Dots - Only show if multiple images */}
                    {vehicleImages.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
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
                              "w-2 h-2 rounded-full transition-all duration-200",
                              (currentImageIndex[rowIndex] || 0) === imageIndex
                                ? "bg-white scale-125 shadow-lg"
                                : "bg-white/50 hover:bg-white/70"
                            )}
                          />
                        ))}
                      </div>
                    )}
                    
                    {/* Vehicle Info Overlay */}
                    <div className="absolute bottom-4 left-4 text-white">
                      <h5 className="text-lg font-bold mb-1 drop-shadow-lg">
                        {hasVehicleData ? (
                          `${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`.trim() || `Option ${rowIndex + 1}`
                        ) : (
                          `Option ${rowIndex + 1}`
                        )}
                      </h5>
                      <div className="flex items-center space-x-2 text-sm text-white/90">
                        <span className="bg-green-500/80 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {vehicleImages.length} {vehicleImages.length === 1 ? 'Photo' : 'Photos'}
                        </span>
                        <span>•</span>
                        <span>{columns.length} Details</span>
                      </div>
                    </div>
                    
                    {/* Live Photo Indicator */}
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-white/90 text-xs font-semibold bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
                        LIVE PHOTOS
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Card Content */}
                <div className="p-4">
                  {/* Card Header - Only show if NO images */}
                  {(!hasVehicleData || vehicleImages.length === 0) && (
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* Fallback Icon */}
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-blue-600/30 to-purple-600/30 border border-white/10 shadow-lg flex-shrink-0 flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Vehicle Title */}
                        <div className="flex-1 min-w-0">
                          <h5 className="text-base font-bold text-white truncate">
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
                      
                      {/* Expand Button */}
                      <button
                        onClick={() => toggleCardExpansion(rowIndex)}
                        className="touch-target flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200 active:scale-95"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Expand Button for cards with images */}
                  {hasVehicleData && vehicleImages.length > 0 && (
                    <div className="flex justify-end mb-3">
                      <button
                        onClick={() => toggleCardExpansion(rowIndex)}
                        className="touch-target flex items-center justify-center w-10 h-10 rounded-xl bg-black/30 border border-white/10 text-white/70 hover:text-white hover:bg-black/50 transition-all duration-200 active:scale-95 shadow-lg backdrop-blur-sm"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  )}
                  
                  {/* Primary Info (Always Visible) */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {primaryColumns.slice(0, 4).map((colIndex) => (
                      <div
                        key={colIndex}
                        className="bg-black/20 rounded-lg p-3 border border-white/10 hover:border-white/20 transition-all duration-200"
                      >
                        <div className="text-xs text-gray-400 flex items-center space-x-1 mb-2">
                          <span>{getColumnIcon(columns[colIndex])}</span>
                          <span className="truncate">{columns[colIndex]}</span>
                        </div>
                        <div className={cn("text-sm font-semibold truncate", getCellClassName(columns[colIndex]))}>
                          {formatCellValue(row[colIndex], columns[colIndex])}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      {columns.map((column, colIndex) => {
                        if (primaryColumns.slice(0, 4).includes(colIndex)) return null;
                        
                        return (
                          <div
                            key={colIndex}
                            className="flex items-center justify-between py-2 px-3 bg-black/10 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span>{getColumnIcon(column)}</span>
                              <span className="truncate">{column}</span>
                            </div>
                            <div className={cn("text-sm font-medium text-right truncate max-w-[60%]", getCellClassName(column))}>
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
      
      {/* Desktop Table Layout (hidden on mobile) */}
      <div className="hidden lg:block relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Table background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-black/40"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/6 w-48 h-48 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/6 w-40 h-40 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 overflow-x-auto scrollbar-thin">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-gradient-to-r from-black/30 via-black/40 to-black/30">
                {/* Add thumbnail column header if we have vehicle data */}
                {hasVehicleData && (
                  <th className="px-6 py-4 text-left text-blue-200 font-bold text-sm tracking-wider uppercase">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🖼️</span>
                      <span>Vehicle</span>
                    </div>
                  </th>
                )}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={cn(
                      "px-6 py-4 text-left transition-all duration-300",
                      "hover:bg-white/5",
                      hoveredCol === index && "bg-white/5",
                      getCellClassName(column, true)
                    )}
                    onMouseEnter={() => setHoveredCol(index)}
                    onMouseLeave={() => setHoveredCol(null)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getColumnIcon(column)}</span>
                      <span>{column}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const vehicleImage = hasVehicleData ? getCurrentVehicleImage(row, rowIndex) : null;
                const vehicleInfo = hasVehicleData ? getVehicleInfo(row) : {};
                
                return (
                  <tr
                    key={rowIndex}
                    className={cn(
                      "border-b border-white/5 transition-all duration-300 group",
                      "hover:bg-gradient-to-r hover:from-white/5 hover:via-white/3 hover:to-white/5",
                      hoveredRow === rowIndex && "bg-gradient-to-r from-blue-600/10 via-blue-600/5 to-blue-600/10"
                    )}
                    onMouseEnter={() => setHoveredRow(rowIndex)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    {/* Vehicle thumbnail column */}
                    {hasVehicleData && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300 group">
                            {vehicleImage ? (
                              <>
                                <Image
                                  src={vehicleImage}
                                  alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                                  fill
                                  className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    debugLog('Image failed to load:', vehicleImage);
                                    // Replace with car icon on error
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && parent.querySelector('.fallback-icon') === null) {
                                      const fallback = document.createElement('div');
                                      fallback.className = 'fallback-icon w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600/30 to-purple-600/30';
                                      fallback.innerHTML = `
                                        <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5 1.5 1.5 0 0 1 1.5-1.5 1.5 1.5 0 0 1 1.5 1.5 1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5 1.5 1.5 0 0 1 6.5 13 1.5 1.5 0 0 1 8 14.5 1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1H6.5c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-8l-2.08-6Z"/>
                                        </svg>
                                      `;
                                      parent.appendChild(fallback);
                                    }
                                  }}
                                  onLoad={() => {
                                    debugLog('Image loaded successfully:', vehicleImage);
                                  }}
                                />
                                
                                {/* Desktop Gallery Navigation Arrows */}
                                {getVehicleImages(row).length > 1 && (
                                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(rowIndex, 'prev');
                                      }}
                                      className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-8 bg-black/80 hover:bg-black text-white rounded flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95"
                                    >
                                      <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        navigateImage(rowIndex, 'next');
                                      }}
                                      className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-8 bg-black/80 hover:bg-black text-white rounded flex items-center justify-center transition-all duration-200 shadow-lg active:scale-95"
                                    >
                                      <ChevronRight className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                                
                                {/* Desktop Image count indicator */}
                                {getVehicleImages(row).length > 1 && (
                                  <div className="absolute bottom-1 left-1 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium shadow-lg">
                                    {(currentImageIndex[rowIndex] || 0) + 1}/{getVehicleImages(row).length}
                                  </div>
                                )}
                                
                                {/* Photo indicator badge */}
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
                                
                                {/* Enhanced thumbnail overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-1 right-1 text-xs text-white font-bold opacity-90">
                                    {getVehicleImages(row).length > 1 ? 'GALLERY' : 'PHOTO'}
                                  </div>
                                </div>
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
                            <div className="text-sm font-bold text-white truncate">
                              {vehicleInfo.year} {vehicleInfo.make}
                            </div>
                            <div className="text-xs text-gray-300 truncate font-medium">
                              {vehicleInfo.model}
                            </div>
                            {vehicleImage && (
                              <div className="text-xs text-green-400 font-semibold mt-0.5">
                                {getVehicleImages(row).length > 1 
                                  ? `📸 ${getVehicleImages(row).length} Photos` 
                                  : '📸 Live Photo'
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    )}
                    
                    {/* Regular data columns */}
                    {row.map((cell, cellIndex) => {
                      const columnName = columns[cellIndex];
                      const isHighlighted = hoveredRow === rowIndex || hoveredCol === cellIndex;
                      
                      return (
                        <td
                          key={cellIndex}
                          className={cn(
                            "px-6 py-4 transition-all duration-300",
                            getCellClassName(columnName),
                            isHighlighted && "transform scale-105 font-bold"
                          )}
                        >
                          <div className={cn(
                            "relative transition-all duration-300",
                            isHighlighted && "drop-shadow-lg"
                          )}>
                            {formatCellValue(cell, columnName)}
                            {isHighlighted && (
                              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded blur opacity-60"></div>
                            )}
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
        
        {/* Table Footer with Stats */}
        <div className="border-t border-white/10 bg-gradient-to-r from-black/40 via-black/30 to-black/40 px-6 py-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4 text-gray-400">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span>Rows: {rows.length}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span>Columns: {columns.length}</span>
              </span>
              {hasVehicleData && (
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  <span>Vehicles: {rows.length}</span>
                </span>
              )}
            </div>
            <div className="text-gray-400 text-xs">
              💡 Hover over cells for enhanced view
              {hasVehicleData && ' • 🚗 Vehicle icons for identification'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}