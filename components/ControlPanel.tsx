import React from 'react';
import { useLanguage } from '../LanguageContext';

interface ControlPanelProps {
  encryptedUid: string;
  setEncryptedUid: (uid: string) => void;
  isMonitoring: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  encryptedUid,
  setEncryptedUid,
  isMonitoring,
  onStart,
  onStop,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-grow w-full">
        <label htmlFor="uid-input" className="text-sm font-medium text-gray-400 mb-1 block">
          {t('control_panel_uid_label')}
        </label>
        <input
          id="uid-input"
          type="text"
          value={encryptedUid}
          onChange={(e) => setEncryptedUid(e.target.value)}
          placeholder={t('control_panel_uid_placeholder')}
          disabled={isMonitoring}
          className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        {!isMonitoring ? (
          <button
            onClick={onStart}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            {t('control_panel_start')}
          </button>
        ) : (
          <button
            onClick={onStop}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
          >
            {t('control_panel_stop')}
          </button>
        )}
      </div>
    </div>
  );
};