import { formatPrice } from '@/lib/utils/formatters';
import { cn } from '@/lib/utils';

interface TableBlockProps {
  columns: string[];
  rows: (string | number)[][];
  className?: string;
}

export default function TableBlock({ columns, rows, className = '' }: TableBlockProps) {
  if (!columns || !rows || rows.length === 0) {
    return (
      <div className={cn(
        "text-center text-gray-500 dark:text-gray-400 py-8 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg",
        className
      )}>
        <div className="text-4xl mb-2">📊</div>
        <div className="font-medium">No comparison data available</div>
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
    
    return String(value);
  };

  const getCellClassName = (columnName: string): string => {
    const colLower = columnName.toLowerCase();
    
    if (colLower.includes('price')) {
      return 'text-blue-600 dark:text-blue-400 font-semibold';
    }
    
    if (colLower === 'make' || colLower === 'model') {
      return 'font-medium text-gray-900 dark:text-gray-100';
    }
    
    if (colLower === 'vin' || colLower === 'id' || colLower.includes('stock')) {
      return 'font-mono text-gray-500 dark:text-gray-400 text-xs';
    }
    
    return 'text-gray-700 dark:text-gray-300';
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">📊</span>
        <h4 className="font-medium text-gray-900 dark:text-gray-100">
          Vehicle Comparison ({rows.length} vehicle{rows.length !== 1 ? 's' : ''})
        </h4>
      </div>
      
      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {row.map((cell, cellIndex) => {
                  const columnName = columns[cellIndex];
                  return (
                    <td
                      key={cellIndex}
                      className={cn(
                        "px-4 py-3 text-sm whitespace-nowrap",
                        getCellClassName(columnName)
                      )}
                    >
                      {formatCellValue(cell, columnName)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}