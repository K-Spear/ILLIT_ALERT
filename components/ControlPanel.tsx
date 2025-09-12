import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const HelpIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const HelpModal: React.FC<{onClose: () => void; bookmarkletCode: string;}> = ({ onClose, bookmarkletCode }) => {
    const { t } = useLanguage();
    const bookmarkletRef = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (bookmarkletRef.current) {
            bookmarkletRef.current.href = bookmarkletCode;
        }
    }, [bookmarkletCode]);
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg border border-gray-700">
                <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-white">{t('help_modal_title_bookmarklet')}</h3>
                </div>
                <div className="p-6 space-y-4 text-gray-300 max-h-[70vh] overflow-y-auto">
                    <div>
                        <h4 className="font-semibold text-yellow-400">{t('help_modal_step_1_title_bookmarklet')}</h4>
                        <p className="text-sm">{t('help_modal_step_1_text_bookmarklet')}</p>
                        <div className="mt-2 text-center">
                            <a ref={bookmarkletRef} href="#" className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-md cursor-move hover:bg-blue-700 transition">
                                {t('bookmarklet_button')}
                            </a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold text-yellow-400">{t('help_modal_step_2_title_bookmarklet')}</h4>
                        <p className="text-sm">{t('help_modal_step_2_text_bookmarklet')}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-yellow-400">{t('help_modal_step_3_title_bookmarklet')}</h4>
                        <p className="text-sm">{t('help_modal_step_3_text_bookmarklet')}</p>
                    </div>
                </div>
                <div className="p-4 bg-gray-800/50 border-t border-gray-700 text-right rounded-b-lg">
                    <button onClick={onClose} className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-md transition">{t('help_modal_close_button')}</button>
                </div>
            </div>
        </div>
    );
};


interface ControlPanelProps {
  jsonData: string;
  setJsonData: (data: string) => void;
  onProcess: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  jsonData,
  setJsonData,
  onProcess,
}) => {
  const { t } = useLanguage();
  const [showHelp, setShowHelp] = useState(false);

  // Bookmarklet source code
  const bookmarkletJs = `
  (function() {
    'use strict';
    
    function showToast(message, isError = false) {
        let existingToast = document.getElementById('binance-data-toast');
        if (existingToast) existingToast.remove();

        const toast = document.createElement('div');
        toast.id = 'binance-data-toast';
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed', top: '20px', right: '20px', padding: '12px 20px',
            backgroundColor: isError ? '#f44336' : '#4CAF50', color: 'white',
            borderRadius: '8px', zIndex: '999999', fontSize: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'opacity 0.5s ease', opacity: '0'
        });
        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    if (window.isBinanceDataCatcherInstalled) {
        showToast('Data catcher is already active. Refresh page to get data.');
        return;
    }
    window.isBinanceDataCatcherInstalled = true;

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = args[0] instanceof Request ? args[0].url : (typeof args[0] === 'string' ? args[0] : '');
        
        const promise = originalFetch.apply(this, args);

        if (url.includes('/bapi/futures/v1/public/future/leaderboard/getOtherPosition')) {
            promise.then(response => {
                const clonedResponse = response.clone();
                clonedResponse.json().then(data => {
                    const jsonString = JSON.stringify(data, null, 2);
                    navigator.clipboard.writeText(jsonString).then(() => {
                        showToast('✅ ${t('bookmarklet_toast_success')}');
                    }).catch(err => {
                        showToast('❌ ${t('bookmarklet_toast_error')}', true);
                        console.error('Bookmarklet copy error:', err);
                    });
                }).catch(err => console.error('Error parsing JSON from response:', err));
            }).catch(err => console.error('Error fetching response:', err));
        }
        
        return promise;
    };

    showToast('${t('bookmarklet_toast_installed')}');
    
  })();
  `.replace(/\s+/g, ' '); // Minify the JS code

  const bookmarkletCode = `javascript:${encodeURIComponent(bookmarkletJs)}`;


  return (
    <>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} bookmarkletCode={bookmarkletCode}/>}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
        <div>
            <div className="flex items-center justify-between mb-1">
                <label htmlFor="json-input" className="text-sm font-medium text-gray-400">
                    {t('control_panel_json_label')}
                </label>
                <button onClick={() => setShowHelp(true)} className="flex items-center gap-1 text-xs text-yellow-400 hover:underline">
                    <HelpIcon className="w-4 h-4" />
                    {t('control_panel_json_help')}
                </button>
            </div>
            <textarea
            id="json-input"
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder={t('control_panel_json_placeholder')}
            rows={4}
            className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition font-mono text-xs"
            />
        </div>
        <div className="flex justify-end gap-2">
            <button
                onClick={onProcess}
                className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105"
            >
                {t('control_panel_process_button')}
            </button>
        </div>
      </div>
    </>
  );
};