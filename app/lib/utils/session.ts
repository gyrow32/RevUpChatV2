// Session management utility functions

// Generate a unique session ID
export function generateSessionId(): string {
  // Since we can't use UUID directly due to dependency issues, we'll create a simple implementation
  return 'session-' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Get stored session ID from localStorage
export function getStoredSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('revup_session_id');
}

// Store session ID in localStorage
export function storeSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('revup_session_id', sessionId);
}

// Clear stored session data
export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('revup_session_id');
}