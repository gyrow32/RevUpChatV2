import { formatPrice } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Car } from 'lucide-react';

interface TableBlockProps {
  columns: string[];
  rows: (string | number)[][];
  className?: string;
}

export default function TableBlock({ columns, rows, className = '' }: TableBlockProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // Check if this table contains vehicle data
  const isVehicleTable = () => {
    const vehicleColumns = ['make', 'model', 'year', 'vehicle', 'car', 'vin', 'stock'];
    const lowerColumns = columns.map(col => col.toLowerCase());
    return vehicleColumns.some(vcol => 
      lowerColumns.some(col => col.includes(vcol))
    );
  };

  // Extract vehicle image from row data
  const getVehicleImage = (row: (string | number)[], rowIndex: number): string | null => {
    // Look for common image column names (matching real data structure)
    const imageColumnNames = [
      'image', 'image url', 'image urls', 'photo', 'picture', 'img',
      'vehicle image', 'car image', 'thumbnail', 'pic', 'imageurl',
      'vehicleimage', 'carimage'
    ];
    
    for (let i = 0; i < columns.length; i++) {
      const colName = columns[i].toLowerCase().trim();
      
      // Check for exact matches and partial matches
      if (imageColumnNames.some(imgCol => 
        colName === imgCol || 
        colName.includes(imgCol) || 
        imgCol.includes(colName)
      )) {
        const value = row[i];
        
        if (typeof value === 'string' && value.trim()) {
          let imageUrl = value.trim();
          
          // Handle comma-separated URLs (take first one)
          if (imageUrl.includes(',')) {
            imageUrl = imageUrl.split(',')[0].trim();
          }
          
          // Handle array-like strings [url1, url2] 
          if (imageUrl.startsWith('[') && imageUrl.includes('http')) {
            const match = imageUrl.match(/https?:\/\/[^\s,\]]+/);
            if (match) {
              imageUrl = match[0];
            }
          }
          
          // Validate it's a proper URL
          if (imageUrl.startsWith('http') || imageUrl.startsWith('data:')) {
            return imageUrl;
          }
        }
      }
    }
    
    // Also check for columns that might contain JSON-like data with images
    for (let i = 0; i < columns.length; i++) {
      const value = row[i];
      if (typeof value === 'string' && value.includes('http') && 
          (value.includes('.jpg') || value.includes('.jpeg') || 
           value.includes('.png') || value.includes('.webp'))) {
        // Extract URL from string
        const urlMatch = value.match(/https?:\/\/[^\s,"'\]]+\.(jpg|jpeg|png|webp|gif)/i);
        if (urlMatch) {
          return urlMatch[0];
        }
      }
    }
    
    return null;
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

  const hasVehicleData = isVehicleTable();

  if (!columns || !rows || rows.length === 0) {
    return (
      <div className={cn(
        "relative text-center py-12 px-6 rounded-2xl overflow-hidden",
        "bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl",
        className
      )}>
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-purple-600/5"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600/30 to-purple-600/30 rounded-2xl flex items-center justify-center border border-blue-400/20 shadow-lg">
            <span className="text-3xl">📊</span>
          </div>
          <div className="font-semibold text-white text-lg mb-2">No Data Available</div>
          <div className="text-gray-400">Financial comparison data will appear here</div>
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
      return 'text-blue-200 font-bold text-sm tracking-wider uppercase';
    }
    
    if (colLower.includes('price') || colLower.includes('payment')) {
      return 'text-green-300 font-bold text-lg';
    }
    
    if (colLower === 'make' || colLower === 'model' || colLower.includes('vehicle')) {
      return 'font-semibold text-white';
    }
    
    if (colLower === 'vin' || colLower === 'id' || colLower.includes('stock')) {
      return 'font-mono text-gray-400 text-sm opacity-75';
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
    <div className={cn("space-y-6", className)}>
      {/* Enhanced Header */}
      <div className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 p-6 shadow-2xl">
        {/* Header background effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-transparent to-green-600/5"></div>
        <div className="absolute top-0 left-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
        <div className="absolute top-0 right-1/4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600/40 to-green-600/40 rounded-xl flex items-center justify-center border border-blue-400/30 shadow-lg">
              <span className="text-2xl">{hasVehicleData ? '🚗' : '📊'}</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
                {hasVehicleData ? 'Vehicle Financial Comparison' : 'Financial Comparison'}
              </h4>
              <p className="text-sm text-gray-400">
                {rows.length} option{rows.length !== 1 ? 's' : ''} • Updated just now
                {hasVehicleData && ' • Vehicle identification included'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">LIVE DATA</span>
          </div>
        </div>
      </div>
      
      {/* Spectacular Table */}
      <div className="relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl">
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
                const vehicleImage = hasVehicleData ? getVehicleImage(row, rowIndex) : null;
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
                          <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                            {vehicleImage ? (
                              <>
                                <img
                                  src={vehicleImage}
                                  alt={`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    console.log('Image failed to load:', vehicleImage);
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
                                    console.log('Image loaded successfully:', vehicleImage);
                                  }}
                                />
                                
                                {/* Photo indicator badge */}
                                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full shadow-lg animate-pulse"></div>
                                
                                {/* Enhanced thumbnail overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-1 left-1 text-xs text-white font-bold opacity-90">PHOTO</div>
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
                          
                          {/* Enhanced Vehicle quick info */}
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-white truncate">
                              {vehicleInfo.year} {vehicleInfo.make}
                            </div>
                            <div className="text-xs text-gray-300 truncate font-medium">
                              {vehicleInfo.model}
                            </div>
                            {vehicleImage && (
                              <div className="text-xs text-green-400 font-semibold mt-0.5">
                                📸 Live Photo
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