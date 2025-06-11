interface IPortfolioPosition {
  instrumentId: number;
  instrumentName: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  pnlPercent: number;
}

export interface IPortfolioResponse {
  availableCash: number;
  positions: IPortfolioPosition[];
  totalValue: number;
}