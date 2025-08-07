// Auto-detect current IP address
export const getCurrentIP = (): string => {
  if (typeof window !== 'undefined') {
    // Get current hostname from browser
    const hostname = window.location.hostname;
    
    // If accessing via IP, use that IP
    if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
      return hostname;
    }
    
    // If localhost, try to detect network IP
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      // Fallback to localhost for local development
      return 'localhost';
    }
    
    // Use whatever hostname we're on
    return hostname;
  }
  
  return 'localhost';
};

export const getAPIBaseURL = (): string => {
  const ip = getCurrentIP();
  return `http://${ip}:8001`;
};

export const getWebSocketURL = (): string => {
  const ip = getCurrentIP();
  return `ws://${ip}:8001`;
};