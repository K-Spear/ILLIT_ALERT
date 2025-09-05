import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';

const GlobeIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A11.953 11.953 0 0112 16.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 013 12c0-.778.099-1.533.284-2.253m0 0" />
    </svg>
);

export const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleLanguage = (lang: 'en' | 'ko') => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors group"
                aria-label="Change language"
            >
                <GlobeIcon />
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 animate-fade-in-down">
                    <ul className="py-1">
                        <li>
                            <button
                                onClick={() => toggleLanguage('en')}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${language === 'en' ? 'font-bold text-yellow-400' : 'text-gray-300'}`}
                            >
                                ENG
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => toggleLanguage('ko')}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${language === 'ko' ? 'font-bold text-yellow-400' : 'text-gray-300'}`}
                            >
                                KOR
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};