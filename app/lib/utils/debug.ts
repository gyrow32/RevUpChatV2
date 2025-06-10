export function debugLog(message: string, ...args: unknown[]): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, ...args);
  }
}
