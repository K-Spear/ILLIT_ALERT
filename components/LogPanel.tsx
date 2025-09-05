import React from 'react';
import { useLanguage } from '../LanguageContext';

interface LogPanelProps {
  logs: string[];
}

export const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-inner h-96 flex flex-col">
      <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">{t('log_panel_title')}</h2>
      <div className="overflow-y-auto flex-grow pr-2">
        {logs.length === 0 ? (
            <p className="text-gray-500 text-center pt-8">{t('log_panel_placeholder')}</p>
        ) : (
            <div className="space-y-2 font-mono text-sm">
            {logs.map((log, index) => (
              <p key={index} className="text-gray-300 animate-fade-in">{log}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};