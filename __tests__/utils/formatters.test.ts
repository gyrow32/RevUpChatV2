import { describe, it, expect } from 'vitest';
import { 
  formatPrice, 
  formatMileage, 
  formatPayment, 
  formatYear, 
  formatPercentage 
} from '@/lib/utils/formatters';

describe('Formatter Functions', () => {
  describe('formatPrice', () => {
    it('formats number prices correctly', () => {
      expect(formatPrice(25000)).toBe('$25,000');
      expect(formatPrice(1500.99)).toBe('$1,501');
      expect(formatPrice(0)).toBe('$0');
    });

    it('formats string prices correctly', () => {
      expect(formatPrice('$25,000')).toBe('$25,000');
      expect(formatPrice('25000')).toBe('$25,000');
    });

    it('handles invalid prices', () => {
      expect(formatPrice('invalid')).toBe('Price N/A');
      expect(formatPrice('')).toBe('Price N/A');
      expect(formatPrice('abc')).toBe('Price N/A');
    });

    it('extracts numbers from mixed strings', () => {
      expect(formatPrice('abc123')).toBe('$123');
      expect(formatPrice('Price: $45,000')).toBe('$45,000');
      expect(formatPrice('Total 999 dollars')).toBe('$999');
    });
  });

  describe('formatMileage', () => {
    it('formats number mileage correctly', () => {
      expect(formatMileage(50000)).toBe('50,000 mi');
      expect(formatMileage(1000)).toBe('1,000 mi');
    });

    it('formats string mileage correctly', () => {
      expect(formatMileage('50,000')).toBe('50,000 mi');
      expect(formatMileage('50000')).toBe('50,000 mi');
    });

    it('handles invalid mileage', () => {
      expect(formatMileage('invalid')).toBe('N/A');
      expect(formatMileage('')).toBe('N/A');
    });
  });

  describe('formatPayment', () => {
    it('formats payments correctly', () => {
      expect(formatPayment(299.99)).toBe('$300/mo');
      expect(formatPayment(450)).toBe('$450/mo');
    });

    it('handles invalid payments', () => {
      expect(formatPayment('invalid')).toBe('N/A');
    });
  });

  describe('formatYear', () => {
    it('handles number years', () => {
      expect(formatYear(2020)).toBe(2020);
      expect(formatYear(1995)).toBe(1995);
    });

    it('converts string years to numbers', () => {
      expect(formatYear('2020')).toBe(2020);
      expect(formatYear('1995')).toBe(1995);
    });

    it('handles invalid years', () => {
      expect(formatYear('invalid')).toBeNaN();
      expect(formatYear('')).toBeNaN();
    });
  });

  describe('formatPercentage', () => {
    it('formats number percentages correctly', () => {
      expect(formatPercentage(5.75)).toBe('6%');
      expect(formatPercentage(10.25)).toBe('10%');
      expect(formatPercentage(0)).toBe('0%');
    });

    it('formats string percentages correctly', () => {
      expect(formatPercentage('5.75')).toBe('6%');
      expect(formatPercentage('10')).toBe('10%');
    });

    it('handles invalid percentages', () => {
      expect(formatPercentage('invalid')).toBe('N/A');
      expect(formatPercentage('')).toBe('N/A');
    });

    it('rounds to nearest whole number', () => {
      expect(formatPercentage(5.4)).toBe('5%');
      expect(formatPercentage(5.6)).toBe('6%');
    });
  });
}); 