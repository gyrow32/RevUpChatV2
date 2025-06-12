import React from 'react';
import { TableBlock as TableBlockType } from '@/app/lib/types';

interface TableBlockProps {
  block?: TableBlockType;
  columns?: string[];
  rows?: (string | number)[][];
  className?: string;
}

export default function TableBlock({ block, columns, rows, className = '' }: TableBlockProps) {
  const tableColumns = block?.columns || columns;
  const tableRows = block?.rows || rows;

  if (!tableColumns || !tableRows || tableRows.length === 0) {
    return (
      <div className={`table-block ${className}`} data-testid="table-block">
        <h2>Vehicle Comparison</h2>
        <p>No data available.</p>
      </div>
    );
  }

  return (
    <div className={`table-block ${className}`} data-testid="table-block">
      <h2>Vehicle Comparison</h2>
      <table>
        <thead>
          <tr>
            {tableColumns.map((column, i) => (
              <th key={i}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{String(cell)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 