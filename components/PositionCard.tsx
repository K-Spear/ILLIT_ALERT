import React from 'react';
import type { Position } from '../types';
import { PositionSide } from '../types';
import { useLanguage } from '../LanguageContext';

interface PositionCardProps {
  position: Position;
  isNew: boolean;
}

const Stat: React.FC<{ label: string; value: string | React.ReactNode; className?: string }> = ({ label, value, className }) => (
    <div className="flex justify-between items-baseline">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`text-sm font-mono ${className}`}>{value}</p>
    </div>
);

export const PositionCard: React.FC<PositionCardProps> = ({ position, isNew }) => {
  const { t } = useLanguage();
  const isProfit = position.pnl >= 0;
  const pnlColor = isProfit ? 'text-green-400' : 'text-red-400';
  const sideColor = position.side === PositionSide.LONG ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300';
  const cardBorder = isNew ? 'border-yellow-400 animate-pulse' : 'border-gray-700';

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-4 border ${cardBorder} transition-all duration-500`}>
        <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{position.symbol}</span>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${sideColor}`}>
                    {position.side} {position.leverage}x
                </span>
            </div>
            {isNew && <span className="text-xs font-bold text-yellow-400">{t('position_card_new_badge')}</span>}
        </div>

        <div className="mb-4">
            <p className="text-xs text-gray-400">{t('position_card_pnl_label')}</p>
            <p className={`text-2xl font-bold ${pnlColor}`}>{isProfit ? '+' : ''}{position.pnl.toFixed(2)}</p>
            <p className={`text-sm font-semibold ${pnlColor}`}>{t('position_card_roe_label')} {position.roe.toFixed(2)}%</p>
        </div>

        <div className="space-y-1.5 text-gray-300">
            <Stat label={t('position_card_size_label')} value={position.size.toLocaleString()} />
            <Stat label={t('position_card_mark_price_label')} value={position.markPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6})} />
            <Stat label={t('position_card_entry_price_label')} value={position.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6})} />
        </div>
    </div>
  );
};