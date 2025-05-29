export function debugLog(...args: any[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
}
