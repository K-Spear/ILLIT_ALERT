import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ko';

const translations = {
  en: {
    header_title: 'Binance Position Monitor',
    header_subtitle: 'Real-time tracking of futures positions',
    header_logout: 'Logout',
    control_panel_uid_label: 'Binance Encrypted UID',
    control_panel_uid_placeholder: 'Enter your encrypted UID here...',
    control_panel_start: 'Start Monitoring',
    control_panel_stop: 'Stop Monitoring',
    positions_grid_no_positions_title: 'No Open Positions',
    positions_grid_no_positions_text: 'Enter a UID and start monitoring to see positions.',
    positions_grid_title: 'Open Positions',
    position_card_new_badge: 'NEW',
    position_card_pnl_label: 'PNL (USDT)',
    position_card_roe_label: 'ROE',
    position_card_size_label: 'Size (USDT)',
    position_card_mark_price_label: 'Mark Price',
    position_card_entry_price_label: 'Entry Price',
    log_panel_title: 'Activity Log',
    log_panel_placeholder: 'Logs will appear here...',
    login_title: 'Binance Futures Leaderboard Tracker',
    login_disclaimer_title: 'Disclaimer:',
    login_disclaimer_text: 'This is a third-party tool and is not affiliated with Binance. Use at your own risk.',
    login_button: 'Agree & Continue'
  },
  ko: {
    header_title: '바이낸스 포지션 모니터',
    header_subtitle: '선물 포지션 실시간 추적',
    header_logout: '로그아웃',
    control_panel_uid_label: '바이낸스 암호화된 UID',
    control_panel_uid_placeholder: '암호화된 UID를 입력하세요...',
    control_panel_start: '모니터링 시작',
    control_panel_stop: '모니터링 중지',
    positions_grid_no_positions_title: '오픈된 포지션 없음',
    positions_grid_no_positions_text: 'UID를 입력하고 모니터링을 시작하여 포지션을 확인하세요.',
    positions_grid_title: '오픈 포지션',
    position_card_new_badge: '신규',
    position_card_pnl_label: '손익 (USDT)',
    position_card_roe_label: '수익률',
    position_card_size_label: '크기 (USDT)',
    position_card_mark_price_label: '시장 평균가',
    position_card_entry_price_label: '진입 가격',
    log_panel_title: '활동 로그',
    log_panel_placeholder: '로그가 여기에 표시됩니다...',
    login_title: '바이낸스 선물 리더보드 트래커',
    login_disclaimer_title: '면책 조항:',
    login_disclaimer_text: '이것은 제3자 도구이며 바이낸스와 관련이 없습니다. 자신의 책임하에 사용하십시오.',
    login_button: '동의 및 계속'
  }
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: TranslationKey) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
