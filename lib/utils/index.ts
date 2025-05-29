// Utility function to merge class names
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export { scrollToTop } from './scroll';
export { debugLog } from './debug';
