import React, { createContext, useState, useContext, useMemo } from 'react';

const translations = {
  en: {
    header_title: 'Binance Futures Position Alerter',
    header_subtitle: 'Real-time alerts for trader positions.',
    header_logout: 'Logout',
    login_title: 'Welcome to the Position Alerter',
    login_button: 'Login with Binance (Simulated)',
    login_disclaimer_title: 'Important Note: ',
    login_disclaimer_text: 'This application fetches real data by using a local backend server to scrape Binance. Please ensure you have started the backend server as instructed in the README file to proceed.',
    control_panel_uid_label: 'Binance User Encrypted UID',
    control_panel_uid_placeholder: 'Enter user UID to monitor',
    control_panel_start: 'Start',
    control_panel_stop: 'Stop',
    positions_grid_title: 'Current Open Positions',
    positions_grid_no_positions_title: 'No Open Positions',
    positions_grid_no_positions_text: 'Start monitoring to see the trader\'s positions here.',
    position_card_pnl_label: 'Unrealized PNL (USDT)',
    position_card_roe_label: 'ROE',
    position_card_size_label: 'Size',
    position_card_mark_price_label: 'Mark Price',
    position_card_entry_price_label: 'Entry Price',
    position_card_new_badge: 'NEW',
    log_panel_title: 'Alert Log',
    log_panel_placeholder: 'Logs will appear here...',
    log_monitoring_started: '🚀 Monitoring started...',
    log_monitoring_stopped: '🛑 Monitoring stopped.',
    log_error_fetching: '❌ Error fetching position data.',
    log_enter_uid: '⚠️ Please enter a User UID.',
    log_new_position: '🟢 NEW',
    log_closed_position: '🔴 CLOSED',
  },
  ko: {
    header_title: '바이낸스 선물 포지션 알리미',
    header_subtitle: '트레이더 포지션에 대한 실시간 알림',
    header_logout: '로그아웃',
    login_title: '포지션 알리미에 오신 것을 환영합니다',
    login_button: '바이낸스로 로그인 (시뮬레이션)',
    login_disclaimer_title: '중요 안내: ',
    login_disclaimer_text: '이 애플리케이션은 바이낸스 데이터를 스크래핑하는 로컬 백엔드 서버를 통해 실제 데이터를 가져옵니다. 계속 진행하려면 README 파일의 안내에 따라 백엔드 서버를 먼저 시작해야 합니다.',
    control_panel_uid_label: '바이낸스 사용자 암호화된 UID',
    control_panel_uid_placeholder: '모니터링할 사용자 UID를 입력하세요',
    control_panel_start: '시작',
    control_panel_stop: '중지',
    positions_grid_title: '현재 열린 포지션',
    positions_grid_no_positions_title: '열린 포지션 없음',
    positions_grid_no_positions_text: '모니터링을 시작하여 트레이더의 포지션을 확인하세요.',
    position_card_pnl_label: '미실현 손익 (USDT)',
    position_card_roe_label: 'ROE',
    position_card_size_label: '크기',
    position_card_mark_price_label: '시장 평균가',
    position_card_entry_price_label: '진입 가격',
    position_card_new_badge: '신규',
    log_panel_title: '알림 로그',
    log_panel_placeholder: '로그가 여기에 표시됩니다...',
    log_monitoring_started: '🚀 모니터링 시작됨...',
    log_monitoring_stopped: '🛑 모니터링 중지됨.',
    log_error_fetching: '❌ 포지션 데이터를 가져오는 중 오류 발생.',
    log_enter_uid: '⚠️ 사용자 UID를 입력해주세요.',
    log_new_position: '🟢 신규',
    log_closed_position: '🔴 종료',
  }
};

type Language = 'en' | 'ko';
type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko'); // Default to Korean

  const t = useMemo(() => (key: TranslationKey): string => {
    return translations[language][key] || translations.en[key];
  }, [language]);

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
