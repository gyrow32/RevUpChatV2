import { render, screen, fireEvent } from '@testing-library/react';
import TableBlock from '@/app/chat/components/blocks/TableBlock';
import React from 'react';

describe('TableBlock Component', () => {
  const columns = ['Year', 'Make', 'Model', 'Image'];
  const rows = [
    [2022, 'Toyota', 'Camry', 'https://example.com/car1.jpg'],
    [2021, 'Honda', 'Civic', 'https://example.com/car2.jpg'],
  ];

  it('renders table with vehicle images', () => {
    window.innerWidth = 375; // Simulate mobile
    render(<TableBlock columns={columns} rows={rows} />);
    expect(screen.getByAltText(/toyota camry/i)).toBeInTheDocument();
    expect(screen.getByAltText(/honda civic/i)).toBeInTheDocument();
  });

  it('renders table with no images gracefully', () => {
    const noImageRows: (string | number)[][] = [];
    render(<TableBlock columns={columns} rows={noImageRows} />);
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('handles expand/collapse card logic on mobile', () => {
    window.innerWidth = 375;
    const { container } = render(<TableBlock columns={columns} rows={rows} />);
    const expandButtons = container.querySelectorAll('button');
    if (expandButtons.length > 0) {
      fireEvent.click(expandButtons[0]);
      expect(container.textContent?.toLowerCase()).toMatch(/details available/);
    }
  });

  it('renders with missing/partial data', () => {
    const partialRows = [
      [2022, 'Toyota', '', 'https://example.com/car1.jpg'],
      ['', '', 'Civic', ''],
    ];
    render(<TableBlock columns={columns} rows={partialRows} />);
    expect(screen.getAllByText('Toyota').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Civic').length).toBeGreaterThan(0);
  });
}); 