
export enum PositionSide {
  LONG = 'LONG',
  SHORT = 'SHORT',
}

export interface Position {
  symbol: string;
  pnl: number;
  roe: number;
  size: number;
  entryPrice: number;
  markPrice: number;
  leverage: number;
  side: PositionSide;
}
