export type MarketCategory = 'CRYPTO' | 'TECH' | 'FINANCE' | 'POLITICS' | 'SPORTS';

export interface MarketItem {
  id: string;
  question: string;
  category: MarketCategory;
  resolutionDate: string;
  status: 'OPEN' | 'RESOLVED' | 'CANCELED';
  yesPrice: number; // 0 to 1
  noPrice: number;  // 0 to 1
  yesShares: number;
  noShares: number;
  volume: number;
  liquidity: number;
  creator: string;
  oracle: string;
  description: string;
  winningOutcome?: 'YES' | 'NO';
}

export interface UserPosition {
  marketId: string;
  yesShares: number;
  noShares: number;
  totalSpent: number;
  currentValue: number;
}

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  xlmBalance: number;
  usdcBalance: number;
  isFreighterDetected: boolean;
}
