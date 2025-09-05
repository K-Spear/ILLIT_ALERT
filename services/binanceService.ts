import type { Position } from '../types';

// This URL points to the local backend server.
// Make sure you have the server running by following the README.md instructions.
const API_BASE_URL = 'http://localhost:3001';

export const fetchUserPositions = async (uid: string): Promise<Position[]> => {
  if (!uid) {
    return [];
  }
  
  const response = await fetch(`${API_BASE_URL}/api/positions/${uid}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Server responded with status: ${response.status}`);
  }
  
  const data: Position[] = await response.json();
  return data;
};