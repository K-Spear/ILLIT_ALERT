import React, { useState, useEffect, useRef } from 'react';
import type { Position } from './types';
import { fetchUserPositions } from './services/binanceService';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { PositionGrid } from './components/PositionGrid';
import { LogPanel } from './components/LogPanel';
import { LoginScreen } from './components/LoginScreen';
import { useLanguage } from './LanguageContext';

const POLLING_INTERVAL = 5000; // 5 seconds

function App() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [encryptedUid, setEncryptedUid] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedSymbols, setHighlightedSymbols] = useState<Set<string>>(new Set());
  // FIX: Use ReturnType<typeof setInterval> for better portability between Node.js and browser environments.
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const previousPositionsRef = useRef<Map<string, Position>>(new Map());

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const stopMonitoring = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsMonitoring(false);
    addLog('Monitoring stopped.');
  };

  const startMonitoring = async () => {
    if (!encryptedUid.trim()) {
      addLog('Error: Encrypted UID is required.');
      return;
    }

    addLog(`Starting monitoring for UID: ${encryptedUid}`);
    setIsMonitoring(true);
    previousPositionsRef.current.clear();
    setPositions([]);
    setHighlightedSymbols(new Set());
    
    const fetchData = async () => {
      try {
        addLog('Fetching position data...');
        const newPositions = await fetchUserPositions(encryptedUid);

        const currentPositionsMap = new Map<string, Position>();
        newPositions.forEach(p => currentPositionsMap.set(p.symbol, p));

        const newHighlights = new Set<string>();

        // Check for new positions
        for (const position of newPositions) {
          if (!previousPositionsRef.current.has(position.symbol)) {
            addLog(`New position opened: ${position.symbol} (${position.side})`);
            newHighlights.add(position.symbol);
          }
        }
        
        // Check for closed positions
        for (const symbol of previousPositionsRef.current.keys()) {
            if (!currentPositionsMap.has(symbol)) {
                addLog(`Position closed: ${symbol}`);
            }
        }

        setPositions(newPositions);
        setHighlightedSymbols(newHighlights);
        previousPositionsRef.current = currentPositionsMap;

        addLog(`Successfully fetched ${newPositions.length} positions.`);

      } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        addLog(`Error fetching data: ${errorMessage}`);
        stopMonitoring();
      }
    };

    await fetchData(); // Initial fetch
    intervalRef.current = setInterval(fetchData, POLLING_INTERVAL);
  };
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const handleLogin = () => {
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      stopMonitoring();
      setIsLoggedIn(false);
      setEncryptedUid('');
      setPositions([]);
      setLogs([]);
      setHighlightedSymbols(new Set());
  };

  if (!isLoggedIn) {
      return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onLogout={handleLogout} />
        <main className="space-y-6">
          <ControlPanel
            encryptedUid={encryptedUid}
            setEncryptedUid={setEncryptedUid}
            isMonitoring={isMonitoring}
            onStart={startMonitoring}
            onStop={stopMonitoring}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PositionGrid positions={positions} highlightedSymbols={highlightedSymbols} />
            </div>
            <div>
              <LogPanel logs={logs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
