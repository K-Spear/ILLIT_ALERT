import React from 'react';
import type { Position } from '../types';
import { PositionCard } from './PositionCard';
import { useLanguage } from '../LanguageContext';

interface PositionGridProps {
  positions: Position[];
  highlightedSymbols: Set<string>;
}

export const PositionGrid: React.FC<PositionGridProps> = ({ positions, highlightedSymbols }) => {
  const { t } = useLanguage();
  
  if (positions.length === 0) {
    return (
        <div className="bg-gray-800 p-8 rounded-lg shadow-inner text-center">
            <h2 className="text-xl font-semibold text-white mb-2">{t('positions_grid_no_positions_title')}</h2>
            <p className="text-gray-400">{t('positions_grid_no_positions_text')}</p>
        </div>
    );
  }

  return (
    <div>
        <h2 className="text-xl font-semibold text-white mb-4">{t('positions_grid_title')} ({positions.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {positions.map((position) => (
            <PositionCard key={position.symbol} position={position} isNew={highlightedSymbols.has(position.symbol)} />
        ))}
        </div>
    </div>
  );
};