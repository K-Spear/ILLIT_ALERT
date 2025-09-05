import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { PositionGrid } from './components/PositionGrid';
import { LogPanel } from './components/LogPanel';
import { LoginScreen } from './components/LoginScreen';
import { fetchUserPositions } from './services/binanceService';
import type { Position } from './types';
import { useLanguage } from './LanguageContext';

const POLLING_INTERVAL_MS = 5000; // 5 seconds
const NOTIFICATION_SOUND_URL = 'https://actions.google.com/sounds/v1/alarms/notification_high_intensity.ogg';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [encryptedUid, setEncryptedUid] = useState('14EA12E7412DC5A21DFF5E7EAC6013B9');
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState<Set<string>>(new Set());
  
  const previousPositionsRef = useRef<Map<string, Position>>(new Map());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedMonitoring = useRef(false);
  const { t } = useLanguage();

  useEffect(() => {
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
  }, []);

  const playNotification = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  }, []);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prevLogs => [`[${timestamp}] ${message}`, ...prevLogs.slice(0, 99)]);
  }, []);

  const checkPositions = useCallback(async () => {
    try {
      const newPositionsArray = await fetchUserPositions(encryptedUid);
      const newPositionsMap = new Map(newPositionsArray.map(p => [p.symbol, p]));
      const oldPositionsMap = previousPositionsRef.current;
      const newHighlighted = new Set<string>();

      // Check for new or modified positions
      for (const [symbol, newPos] of newPositionsMap.entries()) {
        if (!oldPositionsMap.has(symbol)) {
          const message = `${t('log_new_position')} ${newPos.side} | ${symbol} | ${t('position_card_size_label')}: ${newPos.size}`;
          addLog(message);
          playNotification();
          newHighlighted.add(symbol);
        }
      }

      // Check for closed positions
      for (const [symbol, oldPos] of oldPositionsMap.entries()) {
        if (!newPositionsMap.has(symbol)) {
          const message = `${t('log_closed_position')} ${oldPos.side} | ${symbol} | PNL: ${oldPos.pnl.toFixed(2)} USDT`;
          addLog(message);
          playNotification();
        }
      }

      setPositions(newPositionsArray);
      setHighlighted(newHighlighted);
      previousPositionsRef.current = newPositionsMap;

    } catch (error) {
      console.error("Failed to fetch positions:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`${t('log_error_fetching')} ${errorMessage}`);
      setIsMonitoring(false);
    }
  }, [encryptedUid, addLog, playNotification, t]);


  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    if (isMonitoring) {
      hasStartedMonitoring.current = true;
      addLog(t('log_monitoring_started'));
      checkPositions(); // Initial check
      intervalId = setInterval(checkPositions, POLLING_INTERVAL_MS);
    } else {
      if (hasStartedMonitoring.current) {
        addLog(t('log_monitoring_stopped'));
      }
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring, addLog, checkPositions, t]);

  const handleStart = () => {
    if (encryptedUid.trim()) {
      setIsMonitoring(true);
      previousPositionsRef.current = new Map();
      setPositions([]);
    } else {
        addLog(t('log_enter_uid'));
    }
  };

  const handleStop = () => {
    setIsMonitoring(false);
  };
  
  const handleLogout = () => {
    setIsMonitoring(false);
    setPositions([]);
    setLogs([]);
    previousPositionsRef.current.clear();
    hasStartedMonitoring.current = false;
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header onLogout={handleLogout} />
        <ControlPanel
          encryptedUid={encryptedUid}
          setEncryptedUid={setEncryptedUid}
          isMonitoring={isMonitoring}
          onStart={handleStart}
          onStop={handleStop}
        />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PositionGrid positions={positions} highlightedSymbols={highlighted} />
          </div>
          <div>
            <LogPanel logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
