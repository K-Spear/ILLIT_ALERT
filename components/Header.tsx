import React from 'react';
import { useLanguage } from '../LanguageContext';
import { LanguageSwitcher } from './LanguageSwitcher';

const BinanceIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
        <path d="M16.624 11.9999L12 7.37589L7.376 11.9999L12 16.6239L16.624 11.9999Z" fill="currentColor"></path>
        <path d="M21.25 11.9999L16.624 7.37589L12 11.9999L16.624 16.6239L21.25 11.9999Z" fill="currentColor"></path>
        <path d="M12 2.75L7.376 7.37589L2.75 11.9999L7.376 16.6239L12 21.2499L16.624 16.6239L21.25 11.9999L16.624 7.37589L12 2.75ZM12 4.51219L15.488 7.99989L12 11.4879L8.512 7.99989L12 4.51219ZM4.512 11.9999L8.00001 15.4879L4.512 18.9759V11.9999ZM12 19.4879L8.512 15.9999L12 12.5119L15.488 15.9999L12 19.4879ZM19.488 11.9999V18.9759L16 15.4879L19.488 11.9999Z" fill="currentColor"></path>
    </svg>
);

const LogoutIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);


interface HeaderProps {
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { t } = useLanguage();
  return (
    <header className="mb-6 flex items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
            <BinanceIcon />
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{t('header_title')}</h1>
                <p className="text-gray-400">{t('header_subtitle')}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <button
                onClick={onLogout}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-700 transition-colors group text-sm font-medium text-gray-300 hover:text-white"
                aria-label="Logout"
            >
                <span className="hidden sm:inline">{t('header_logout')}</span>
                <LogoutIcon className="w-5 h-5" />
            </button>
        </div>
    </header>
  );
};