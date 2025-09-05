import React, { useState, useEffect, useRef } from 'react';
import type { Position } from './types';
import { fetchUserPositions } from './services/binanceService';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { PositionGrid } from './components/PositionGrid';
import { LogPanel } from './components/LogPanel';
import { LoginScreen } from './components/LoginScreen';
import { useLanguage } from './LanguageContext';

// Randomized polling intervals in milliseconds
const POLLING_INTERVALS_MS = [5000, 15000, 31000, 47000, 60000];

function App() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [encryptedUid, setEncryptedUid] = useState('');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedSymbols, setHighlightedSymbols] = useState<Set<string>>(new Set());
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousPositionsRef = useRef<Map<string, Position>>(new Map());
  const monitoringStartedRef = useRef(false); // Ref to track if monitoring has ever started

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  const stopMonitoring = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsMonitoring(false);
    // Only log "stopped" if it was actually started before
    if (monitoringStartedRef.current) {
        addLog(t('log_monitoring_stopped'));
        monitoringStartedRef.current = false;
    }
  };

  const checkPositions = async () => {
    // This function is now part of a recursive loop, it should not check for UID itself.
    try {
      addLog(t('log_fetching_data'));
      const newPositions = await fetchUserPositions(encryptedUid);

      const currentPositionsMap = new Map<string, Position>();
      newPositions.forEach(p => currentPositionsMap.set(p.symbol, p));

      const newHighlights = new Set<string>();

      // Check for new positions
      for (const position of newPositions) {
        if (!previousPositionsRef.current.has(position.symbol)) {
          addLog(`${t('log_new_position')} ${position.symbol} (${position.side})`);
          newHighlights.add(position.symbol);
        }
      }
      
      // Check for closed positions
      for (const symbol of previousPositionsRef.current.keys()) {
          if (!currentPositionsMap.has(symbol)) {
              addLog(`${t('log_closed_position')} ${symbol}`);
          }
      }

      setPositions(newPositions);
      setHighlightedSymbols(newHighlights);
      previousPositionsRef.current = currentPositionsMap;

      addLog(t('log_fetch_success', { count: newPositions.length }));

    } catch (error) {
      let errorMessage = t('log_error_unknown');
      if (error instanceof Error) {
          errorMessage = error.message;
      }
      addLog(`${t('log_error_fetching')} ${errorMessage}`);
      stopMonitoring();
    } finally {
        // Schedule the next check with a random interval if we are still supposed to be monitoring
        if (isMonitoring && timeoutRef.current !== null) {
            const randomInterval = POLLING_INTERVALS_MS[Math.floor(Math.random() * POLLING_INTERVALS_MS.length)];
            addLog(`${t('log_next_check_in')} ${randomInterval / 1000}${t('log_seconds_suffix')}`);
            timeoutRef.current = setTimeout(checkPositions, randomInterval);
        }
    }
  };

  const startMonitoring = () => {
    if (!encryptedUid.trim()) {
      addLog(t('log_error_uid_required'));
      return;
    }
    // Clear previous timeout if any
    if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
    }
    
    addLog(`${t('log_monitoring_started_for')} ${encryptedUid}`);
    setIsMonitoring(true);
    monitoringStartedRef.current = true;
    previousPositionsRef.current.clear();
    setPositions([]);
    setHighlightedSymbols(new Set());
    
    // Set a flag that allows the recursive loop to start
    timeoutRef.current = setTimeout(() => {}, 0); 
    checkPositions(); // Start the first check immediately
  };
  
  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
