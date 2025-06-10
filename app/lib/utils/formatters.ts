// Based on HTML prototype formatting logic

export function formatPrice(price: string | number): string {
  const num = typeof price === 'string' 
    ? parseFloat(price.replace(/[^0-9.-]+/g, ''))
    : price;
    
  if (isNaN(num)) return 'Price N/A';
  
  // Use simple string formatting instead of Intl.NumberFormat for consistency
  return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatMileage(mileage: string | number): string {
  const num = typeof mileage === 'string' 
    ? parseInt(mileage.replace(/[^0-9]/g, ''))
    : mileage;
    
  if (isNaN(num)) return 'N/A';
  
  // Use custom formatting instead of toLocaleString
  const formatted = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${formatted} mi`;
}

export function formatPayment(payment: string | number): string {
  const num = typeof payment === 'string' 
    ? parseFloat(payment.replace(/[^0-9.-]+/g, ''))
    : payment;
    
  if (isNaN(num)) return 'N/A';
  
  // Use simple string formatting instead of toLocaleString
  return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/mo';
}

export function formatYear(year: string | number): number {
  return typeof year === 'string' ? parseInt(year) : year;
}

export function formatPercentage(value: string | number): string {
  const num = typeof value === 'string' 
    ? parseFloat(value)
    : value;
    
  if (isNaN(num)) return 'N/A';
  
  // Remove decimal places for cleaner look
  return `${Math.round(num)}%`;
}