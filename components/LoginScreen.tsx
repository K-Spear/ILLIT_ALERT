import React, { useState } from 'react';
import { useLanguage } from '../LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

const BinanceIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`text-yellow-400 ${className}`}>
        <path d="M16.624 11.9999L12 7.37589L7.376 11.9999L12 16.6239L16.624 11.9999Z" fill="currentColor"></path>
        <path d="M21.25 11.9999L16.624 7.37589L12 11.9999L16.624 16.6239L21.25 11.9999Z" fill="currentColor"></path>
        <path d="M12 2.75L7.376 7.37589L2.75 11.9999L7.376 16.6239L12 21.2499L16.624 16.6239L21.25 11.9999L16.624 7.37589L12 2.75ZM12 4.51219L15.488 7.99989L12 11.4879L8.512 7.99989L12 4.51219ZM4.512 11.9999L8.00001 15.4879L4.512 18.9759V11.9999ZM12 19.4879L8.512 15.9999L12 12.5119L15.488 15.9999L12 19.4879ZM19.488 11.9999V18.9759L16 15.4879L19.488 11.9999Z" fill="currentColor"></path>
    </svg>
);

const InfoIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-5 h-5 ${className}`}>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
    </svg>
);


interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    // Simulate a network request
    setTimeout(() => {
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
       <div className="absolute top-4 right-4">
            <LanguageSwitcher />
       </div>
       <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md text-center">
                <BinanceIcon className="mx-auto mb-6" />

                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                    {t('login_title')}
                </h1>
                <p className="text-gray-400 mb-8">{t('header_subtitle')}</p>

                <div className="bg-blue-900/50 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg relative mb-8 text-sm text-left" role="alert">
                    <div className="flex items-start">
                        <InfoIcon className="mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                            <strong className="font-bold">{t('login_disclaimer_title')}</strong>
                            <span className="block sm:inline">{t('login_disclaimer_text')}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-md transition duration-200 ease-in-out transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : null}
                    {t('login_button')}
                </button>
            </div>
       </div>
    </div>
  );
};