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
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr 
                key={rowIndex}
                className={cn(
                  "border-t border-gray-200 dark:border-gray-700",
                  rowIndex % 2 === 0 ? "bg-white dark:bg-black/20" : "bg-gray-50 dark:bg-black/10"
                )}
              >
                {row.map((cell, cellIndex) => (
                  <td 
                    key={cellIndex}
                    className="py-2 px-3 text-sm text-gray-800 dark:text-gray-200"
                  >
                    {formatCell(cell, columns[cellIndex])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isScrollable && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          ↔️ Scroll horizontally to see more
        </div>
      )}
    </div>
  );
}