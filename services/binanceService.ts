import type { Position } from '../types';

// This function fetches real data from our backend server, which in turn scrapes Binance.
export const fetchUserPositions = async (uid: string): Promise<Position[]> => {
  if (!uid) {
    return [];
  }
  
  // The backend server is expected to be running on localhost:3001
  const response = await fetch(`http://localhost:3001/api/positions/${uid}`);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || `Server responded with status: ${response.status}`);
  }
  
  const data: Position[] = await response.json();
  return data;
};
