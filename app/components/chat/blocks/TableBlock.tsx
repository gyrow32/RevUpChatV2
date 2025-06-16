'use client';

import { formatPrice } from '@/app/lib/utils/formatters';
import { cn } from '@/app/lib/utils';
import { useState, useEffect, useRef } from 'react';

interface TableBlockProps {
  columns: string[];
  rows: (string | number)[][];
}

export default function TableBlock({ columns, rows }: TableBlockProps) {
  const tableRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  
  useEffect(() => {
    const checkScroll = () => {
      if (tableRef.current) {
        const { scrollWidth, clientWidth } = tableRef.current;
        setIsScrollable(scrollWidth > clientWidth);
      }
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    
    return () => {
      window.removeEventListener('resize', checkScroll);
    };
  }, []);
  
  // Format cell value if it's a price or number
  const formatCell = (value: string | number, columnName: string) => {
    if (typeof value === 'number') {
      if (
        columnName.toLowerCase().includes('price') || 
        columnName.toLowerCase().includes('payment') ||
        columnName.toLowerCase().includes('cost') ||
        columnName.toLowerCase().includes('financed')
      ) {
        return formatPrice(value);
      }
      return value.toLocaleString();
    }
    return value;
  };

  // Determine the best deal based on available criteria
  const getBestDealIndex = () => {
    if (rows.length === 0) return -1;

    // Find column indices for different criteria
    const profitIndex = columns.findIndex(col => 
      col.toLowerCase().includes('profit')
    );
    const paymentIndex = columns.findIndex(col => 
      col.toLowerCase().includes('payment') && 
      col.toLowerCase().includes('monthly')
    );
    const residualIndex = columns.findIndex(col => 
      col.toLowerCase().includes('residual')
    );

    let bestIndex = -1;
    let bestValue = null;

    // Priority 1: Highest profit (if available)
    if (profitIndex !== -1) {
      rows.forEach((row, index) => {
        const profit = typeof row[profitIndex] === 'number' ? row[profitIndex] : 
                      typeof row[profitIndex] === 'string' ? parseFloat(row[profitIndex].toString().replace(/[$,]/g, '')) : 0;
        if (bestValue === null || profit > bestValue) {
          bestValue = profit;
          bestIndex = index;
        }
      });
    }
    // Priority 2: Lowest monthly payment (if no profit column)
    else if (paymentIndex !== -1) {
      rows.forEach((row, index) => {
        const payment = typeof row[paymentIndex] === 'number' ? row[paymentIndex] : 
                       typeof row[paymentIndex] === 'string' ? parseFloat(row[paymentIndex].toString().replace(/[$,]/g, '')) : Infinity;
        if (bestValue === null || payment < bestValue) {
          bestValue = payment;
          bestIndex = index;
        }
      });
    }
    // Priority 3: Highest residual value (for leases)
    else if (residualIndex !== -1) {
      rows.forEach((row, index) => {
        const residual = typeof row[residualIndex] === 'number' ? row[residualIndex] : 
                        typeof row[residualIndex] === 'string' ? parseFloat(row[residualIndex].toString().replace(/[%$,]/g, '')) : 0;
        if (bestValue === null || residual > bestValue) {
          bestValue = residual;
          bestIndex = index;
        }
      });
    }

    return bestIndex;
  };

  const bestDealIndex = getBestDealIndex();

  // Get the criteria used for "best deal"
  const getBestDealCriteria = () => {
    const profitIndex = columns.findIndex(col => col.toLowerCase().includes('profit'));
    const paymentIndex = columns.findIndex(col => 
      col.toLowerCase().includes('payment') && col.toLowerCase().includes('monthly')
    );
    const residualIndex = columns.findIndex(col => col.toLowerCase().includes('residual'));

    if (profitIndex !== -1) return 'Highest Profit';
    if (paymentIndex !== -1) return 'Lowest Payment';
    if (residualIndex !== -1) return 'Best Residual';
    return 'Best Deal';
  };
  
  return (
    <div className="w-full">
      <div 
        ref={tableRef}
        className={cn(
          "w-full overflow-x-auto",
          isScrollable && "pb-2"
        )}
      >
        <table className="min-w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              {columns.map((column, i) => (
                <th 
                  key={i}
                  className="py-2 px-3 text-sm font-semibold text-gray-700 dark:text-gray-300"
                >
                  {column}
                </th>
              ))}
              {/* Add a column for the best deal badge */}
              <th className="py-2 px-3 text-sm font-semibold text-gray-700 dark:text-gray-300 text-center">
                Best Deal
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const isBestDeal = rowIndex === bestDealIndex;
              
              return (
                <tr 
                  key={rowIndex}
                  className={cn(
                    "border-t border-gray-200 dark:border-gray-700 transition-colors",
                    isBestDeal 
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700" 
                      : rowIndex % 2 === 0 
                        ? "bg-white dark:bg-black/20" 
                        : "bg-gray-50 dark:bg-black/10"
                  )}
                >
                  {row.map((cell, cellIndex) => (
                    <td 
                      key={cellIndex}
                      className={cn(
                        "py-2 px-3 text-sm",
                        isBestDeal 
                          ? "text-gray-900 dark:text-gray-100 font-medium" 
                          : "text-gray-800 dark:text-gray-200"
                      )}
                    >
                      {formatCell(cell, columns[cellIndex])}
                    </td>
                  ))}
                  {/* Best deal badge column */}
                  <td className="py-2 px-3 text-center">
                    {isBestDeal && (
                      <div className="inline-flex items-center gap-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Best
                        </span>
                        <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                          {getBestDealCriteria()}
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {isScrollable && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          ↔️ Scroll horizontally to see more
        </div>
      )}

      {/* Legend for best deal criteria */}
      {bestDealIndex !== -1 && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          <span className="inline-flex items-center gap-1">
            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Best deal determined by: {getBestDealCriteria()}
          </span>
        </div>
      )}
    </div>
  );
}