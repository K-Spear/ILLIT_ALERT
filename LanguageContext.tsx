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
    login_disclaimer_title: 'Developer Note:',
    login_disclaimer_text: 'This app bypasses browser restrictions by using a local backend server to fetch real data. Please ensure you have followed the README instructions to install and run the server before proceeding.',
    login_button: 'Agree & Continue',
    
    // New / Updated Logs
    log_monitoring_stopped: 'Monitoring stopped.',
    log_error_uid_required: 'Error: Encrypted UID is required.',
    log_monitoring_started_for: 'Starting monitoring for UID:',
    log_fetching_data: 'Fetching position data...',
    log_new_position: 'New position opened:',
    log_closed_position: 'Position closed:',
    log_fetch_success: 'Successfully fetched {{count}} position(s).',
    log_error_fetching: 'Error fetching data:',
    log_error_unknown: 'An unknown error occurred.',
    log_next_check_in: 'Next check in',
    log_seconds_suffix: 's',
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
    login_disclaimer_title: '개발자 참고:',
    login_disclaimer_text: '이 앱은 브라우저의 제약을 우회하기 위해 로컬 백엔드 서버를 사용하여 실제 데이터를 가져옵니다. 계속하기 전에 README 안내에 따라 서버를 설치하고 실행했는지 확인해주세요.',
    login_button: '동의 및 계속',

    // New / Updated Logs
    log_monitoring_stopped: '모니터링이 중지되었습니다.',
    log_error_uid_required: '오류: 암호화된 UID가 필요합니다.',
    log_monitoring_started_for: 'UID에 대한 모니터링 시작:',
    log_fetching_data: '포지션 데이터를 가져오는 중...',
    log_new_position: '새 포지션 열림:',
    log_closed_position: '포지션 종료됨:',
    log_fetch_success: '{{count}}개의 포지션을 성공적으로 가져왔습니다.',
    log_error_fetching: '데이터를 가져오는 중 오류 발생:',
    log_error_unknown: '알 수 없는 오류가 발생했습니다.',
    log_next_check_in: '다음 확인까지',
    log_seconds_suffix: '초',
  }
};

type TranslationKey = keyof typeof translations.en;
type TranslationParams = { [key: string]: string | number };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ko');

  const t = (key: TranslationKey, params?: TranslationParams) => {
    let translation = translations[language][key] || key;
    if (params) {
        Object.keys(params).forEach(paramKey => {
            const regex = new RegExp(`{{${paramKey}}}`, 'g');
            translation = translation.replace(regex, String(params[paramKey]));
        });
    }
    return translation;
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
