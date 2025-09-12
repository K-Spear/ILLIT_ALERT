import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ko';

const translations = {
  en: {
    header_title: 'Binance Position Monitor',
    header_subtitle: 'Real-time tracking of futures positions',
    header_logout: 'Logout',
    control_panel_json_label: 'Binance Position Data (JSON)',
    control_panel_json_placeholder: 'Paste the JSON data from the clipboard here...',
    control_panel_json_help: 'How to get the data?',
    control_panel_process_button: 'Process Data',
    positions_grid_no_positions_title: 'No Positions Displayed',
    positions_grid_no_positions_text: 'Use the bookmarklet on Binance and paste the data here to see positions.',
    positions_grid_title: 'Open Positions',
    position_card_new_badge: 'NEW',
    position_card_pnl_label: 'PNL (USDT)',
    position_card_roe_label: 'ROE',
    position_card_size_label: 'Size (USDT)',
    position_card_mark_price_label: 'Mark Price',
    position_card_entry_price_label: 'Entry Price',
    position_card_live_indicator_tooltip: 'Live PNL Update',
    log_panel_title: 'Activity Log',
    log_panel_placeholder: 'Logs will appear here...',
    login_title: 'Binance Futures Leaderboard Tracker',
    login_disclaimer_title: 'Developer Note:',
    login_disclaimer_text: 'This is a pure frontend application and does not require a backend server. You will manually copy data from Binance to monitor positions.',
    login_button: 'Agree & Continue',
    
    help_modal_title_bookmarklet: 'How to Get Position Data (Easy Way)',
    help_modal_step_1_title_bookmarklet: 'Step 1: Add the Bookmarklet (One-time setup)',
    help_modal_step_1_text_bookmarklet: "Drag the button below to your browser's bookmarks bar. This will create a new bookmark.",
    help_modal_step_2_title_bookmarklet: 'Step 2: Get Data from Binance',
    help_modal_step_2_text_bookmarklet: "Go to the Binance Futures leaderboard page. Click the 'Get Binance Data' bookmark you just created. The page will refresh, and a confirmation message will appear.",
    help_modal_step_3_title_bookmarklet: 'Step 3: Paste and Process',
    help_modal_step_3_text_bookmarklet: "The position data is now in your clipboard. Come back here, paste it into the text area (Ctrl+V or Cmd+V), and click 'Process Data'.",
    help_modal_close_button: 'Close',
    
    bookmarklet_button: 'Get Binance Data',
    bookmarklet_toast_installed: 'Data catcher installed! The page will now refresh.',
    bookmarklet_toast_success: 'Position data copied to clipboard!',
    bookmarklet_toast_error: 'Could not copy data. See console for error.',
    
    // Logs
    log_processing_data: 'Processing pasted data...',
    log_process_success: 'Successfully processed {{count}} position(s).',
    log_error_processing: 'Error processing data:',
    log_error_no_data: 'Error: No data pasted to process.',
    log_error_invalid_json: 'Invalid JSON format or unrecognized structure.',
    log_error_private_positions: 'Error: These positions are private. You must be logged into Binance in the browser you are copying data from.',
    log_error_user_not_found: 'Error: User not found or leaderboard sharing is disabled.',
    log_new_position: 'New position opened:',
    log_closed_position: 'Position closed:',
    log_error_unknown: 'An unknown error occurred.',
    log_websocket_connecting: 'Connecting to real-time PNL stream...',
    log_websocket_connected: '✅ Real-time PNL stream connected.',
    log_websocket_disconnected: 'Real-time PNL stream disconnected.',
    log_websocket_error: 'Error with real-time PNL stream.',
  },
  ko: {
    header_title: '바이낸스 포지션 모니터',
    header_subtitle: '선물 포지션 실시간 추적',
    header_logout: '로그아웃',
    control_panel_json_label: '바이낸스 포지션 데이터 (JSON)',
    control_panel_json_placeholder: '클립보드의 JSON 데이터를 여기에 붙여넣으세요...',
    control_panel_json_help: '데이터는 어떻게 얻나요?',
    control_panel_process_button: '데이터 처리',
    positions_grid_no_positions_title: '표시된 포지션 없음',
    positions_grid_no_positions_text: '바이낸스에서 북마크릿을 사용하고 데이터를 붙여넣어 포지션을 확인하세요.',
    positions_grid_title: '오픈 포지션',
    position_card_new_badge: '신규',
    position_card_pnl_label: '손익 (USDT)',
    position_card_roe_label: '수익률',
    position_card_size_label: '크기 (USDT)',
    position_card_mark_price_label: '시장 평균가',
    position_card_entry_price_label: '진입 가격',
    position_card_live_indicator_tooltip: '실시간 손익 업데이트',
    log_panel_title: '활동 로그',
    log_panel_placeholder: '로그가 여기에 표시됩니다...',
    login_title: '바이낸스 선물 리더보드 트래커',
    login_disclaimer_title: '개발자 참고:',
    login_disclaimer_text: '이 앱은 순수 프론트엔드 애플리케이션이며 백엔드 서버가 필요 없습니다. 바이낸스에서 직접 데이터를 복사하여 포지션을 모니터링합니다.',
    login_button: '동의 및 계속',

    help_modal_title_bookmarklet: '포지션 데이터 가져오기 (간편한 방법)',
    help_modal_step_1_title_bookmarklet: '1단계: 북마크릿 추가 (최초 1회 설정)',
    help_modal_step_1_text_bookmarklet: "아래 버튼을 브라우저의 북마크 바로 드래그하세요. 새로운 북마크가 생성됩니다.",
    help_modal_step_2_title_bookmarklet: '2단계: 바이낸스에서 데이터 가져오기',
    help_modal_step_2_text_bookmarklet: "바이낸스 선물 리더보드 페이지로 이동한 후, 방금 추가한 '데이터 가져오기' 북마크를 클릭하세요. 페이지가 새로고침되며 확인 메시지가 나타납니다.",
    help_modal_step_3_title_bookmarklet: '3단계: 붙여넣기 및 처리',
    help_modal_step_3_text_bookmarklet: "이제 포지션 데이터가 클립보드에 복사되었습니다. 이 앱으로 돌아와 텍스트 영역에 붙여넣기(Ctrl+V 또는 Cmd+V)하고 '데이터 처리' 버튼을 클릭하세요.",
    help_modal_close_button: '닫기',
    
    bookmarklet_button: '데이터 가져오기',
    bookmarklet_toast_installed: '데이터 캐쳐가 설치되었습니다! 페이지를 새로고침합니다.',
    bookmarklet_toast_success: '✅ 포지션 데이터가 클립보드에 복사되었습니다!',
    bookmarklet_toast_error: '❌ 데이터를 복사할 수 없습니다. 콘솔을 확인하세요.',
    
    // Logs
    log_processing_data: '붙여넣은 데이터 처리 중...',
    log_process_success: '{{count}}개의 포지션을 성공적으로 처리했습니다.',
    log_error_processing: '데이터 처리 중 오류 발생:',
    log_error_no_data: '오류: 처리할 데이터가 없습니다.',
    log_error_invalid_json: '잘못된 JSON 형식이거나 인식할 수 없는 구조입니다.',
    log_error_private_positions: '오류: 비공개 포지션입니다. 데이터를 복사하는 브라우저에서 바이낸스에 로그인되어 있어야 합니다.',
    log_error_user_not_found: '오류: 사용자를 찾을 수 없거나 리더보드 공유가 비활성화되어 있습니다.',
    log_new_position: '새 포지션 열림:',
    log_closed_position: '포지션 종료됨:',
    log_error_unknown: '알 수 없는 오류가 발생했습니다.',
    log_websocket_connecting: '실시간 손익 스트림에 연결 중...',
    log_websocket_connected: '✅ 실시간 손익 스트림에 연결되었습니다.',
    log_websocket_disconnected: '실시간 손익 스트림 연결이 끊어졌습니다.',
    log_websocket_error: '실시간 손익 스트림 오류 발생.',
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