import React, { useState, useRef, useEffect } from 'react';
import type { Position } from './types';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { PositionGrid } from './components/PositionGrid';
import { LogPanel } from './components/LogPanel';
import { LoginScreen } from './components/LoginScreen';
import { useLanguage } from './LanguageContext';
import { PositionSide } from './types';


function App() {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [highlightedSymbols, setHighlightedSymbols] = useState<Set<string>>(new Set());
  
  const previousPositionsRef = useRef<Map<string, Position>>(new Map());
  const websocketRef = useRef<WebSocket | null>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 100)); // Keep last 100 logs
  };

  useEffect(() => {
    // Cleanup WebSocket connection when component unmounts
    return () => {
        if (websocketRef.current) {
            websocketRef.current.close();
        }
    };
  }, []);
  
  const handleProcessData = () => {
    if (websocketRef.current) {
        websocketRef.current.onclose = null; // Prevent onclose handler from firing on manual close
        websocketRef.current.close();
        addLog(t('log_websocket_disconnected'));
    }

    if (!jsonData.trim()) {
      addLog(t('log_error_no_data'));
      return;
    }
    
    addLog(t('log_processing_data'));

    try {
        const parsedData = JSON.parse(jsonData);

        if (typeof parsedData !== 'object' || parsedData === null || !parsedData.success || !parsedData.data || !Array.isArray(parsedData.data.otherPositionRetList)) {
            if (parsedData.code === '90001001') {
                throw new Error(t('log_error_private_positions'));
            }
             if (parsedData.code === '90001006') { 
                throw new Error(t('log_error_user_not_found'));
            }
            throw new Error(t('log_error_invalid_json'));
        }
        
        const newPositions: Position[] = parsedData.data.otherPositionRetList.map((p: any) => {
            const size = parseFloat(p.amount);
            return {
                symbol: p.symbol,
                side: size >= 0 ? PositionSide.LONG : PositionSide.SHORT,
                leverage: p.leverage,
                size: Math.abs(size), 
                entryPrice: parseFloat(p.entryPrice),
                markPrice: parseFloat(p.markPrice),
                pnl: parseFloat(p.pnl),
                roe: parseFloat(p.roe) * 100, 
            };
        });

        const currentPositionsMap = new Map<string, Position>();
        newPositions.forEach(p => currentPositionsMap.set(p.symbol, p));

        const newHighlights = new Set<string>();

        // Check for new positions
        for (const position of newPositions) {
            if (previousPositionsRef.current.size > 0 && !previousPositionsRef.current.has(position.symbol)) {
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

        addLog(t('log_process_success', { count: newPositions.length }));

        // Setup WebSocket for real-time PNL updates
        if (newPositions.length > 0) {
            const symbols = newPositions.map(p => p.symbol.toLowerCase() + '@markPrice').join('/');
            const wsUrl = `wss://fstream.binance.com/stream?streams=${symbols}`;
            addLog(t('log_websocket_connecting'));
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                addLog(t('log_websocket_connected'));
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.data && message.data.s) {
                    const symbol = message.data.s;
                    const newMarkPrice = parseFloat(message.data.p);

                    setPositions(prevPositions => {
                        return prevPositions.map(p => {
                           if (p.symbol === symbol) {
                                const newPnl = (newMarkPrice - p.entryPrice) * p.size * (p.side === PositionSide.LONG ? 1 : -1);
                                const newRoe = (newPnl / (p.size * p.entryPrice / p.leverage)) * 100;
                                return {
                                    ...p,
                                    markPrice: newMarkPrice,
                                    pnl: newPnl,
                                    roe: newRoe,
                                };
                           }
                           return p;
                        });
                    });
                }
            };
            
            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
                addLog(t('log_websocket_error'));
            };

            ws.onclose = () => {
                if (websocketRef.current) { // only log if it was not manually closed
                  addLog(t('log_websocket_disconnected'));
                }
            };

            websocketRef.current = ws;
        }


    } catch (error) {
        let errorMessage = t('log_error_unknown');
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        addLog(`${t('log_error_processing')} ${errorMessage}`);
    }
  };

  const handleLogin = () => {
      setIsLoggedIn(true);
  };

  const handleLogout = () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      setIsLoggedIn(false);
      setJsonData('');
      setPositions([]);
      setLogs([]);
      setHighlightedSymbols(new Set());
      previousPositionsRef.current.clear();
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
            jsonData={jsonData}
            setJsonData={setJsonData}
            onProcess={handleProcessData}
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