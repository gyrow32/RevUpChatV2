// Based on HTML prototype formatting logic

export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.-]+/g, ''))
    : price;
    
  if (isNaN(num)) return 'Price N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

export function formatMileage(mileage: string | number): string {
  const num = typeof mileage === 'string' 
    ? parseInt(mileage.replace(/[^0-9]/g, ''))
    : mileage;
    
  if (isNaN(num)) return 'N/A';
  
  return `${num.toLocaleString()} miles`;
}

export function formatPayment(payment: string | number): string {
  const num = typeof payment === 'string' 
    ? parseFloat(payment.replace(/[^0-9.-]+/g, ''))
    : payment;
    
  if (isNaN(num)) return 'N/A';
  
  return `$${num.toLocaleString()}/mo`;
}

export function formatYear(year: string | number): number {
  return typeof year === 'string' ? parseInt(year) : year;
}

export function formatPercentage(value: string | number): string {
  const num = typeof value === 'string' 
    ? parseFloat(value)
    : value;
    
  if (isNaN(num)) return 'N/A';
  
  return `${num.toFixed(1)}%`;
}