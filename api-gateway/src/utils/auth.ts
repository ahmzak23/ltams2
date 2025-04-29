import { Request } from 'express';

export const getClientId = (req: Request): string | null => {
  // First try to get client ID from JWT token
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    try {
      // In a real implementation, you would verify the JWT token here
      // and extract the client ID from it
      return 'authenticated-client';
    } catch (error) {
      return null;
    }
  }
  
  // Fallback to IP address if no token
  return req.ip || req.connection.remoteAddress || 'unknown';
}; 