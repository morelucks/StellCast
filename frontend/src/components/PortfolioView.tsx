import React from 'react';
import { MarketItem } from '../types/market';
import { Wallet, TrendingUp, Award, Layers, ArrowUpRight, CheckCircle2, DollarSign } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface PortfolioViewProps {
  markets: MarketItem[];
  userPositions: { marketId: string; outcome: 'YES' | 'NO'; shares: number; invested: number }[];
  onSelectMarket: (market: MarketItem) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ markets, userPositions, onSelectMarket }) => {
  const { isConnected, usdcBalance, connectWallet } = useWallet();

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="glass-panel rounded-3xl p-12 border border-stell-border space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-stell-cyan/10 flex items-center justify-center text-stell-cyan glow-cyan">
            <Wallet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading text-white">Connect Your Stellar Wallet</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Connect Freighter or simulated wallet to track your active prediction positions, total portfolio value, and claim winning payouts.
          </p>
          <button
            onClick={connectWallet}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-stell-cyan to-stell-purple text-black font-bold text-sm glow-cyan transition-all hover:brightness-110 active:scale-95"
          >
            Connect Wallet Now
          </button>
        </div>
      </div>
    );
  }

  // Calculate totals
  const totalValue = userPositions.reduce((acc, pos) => {
    const market = markets.find(m => m.id === pos.marketId);
    if (!market) return acc;
    const price = pos.outcome === 'YES' ? market.yesPrice : market.noPrice;
    return acc + pos.shares * price;
  }, 0);

  const totalInvested = userPositions.reduce((acc, pos) => acc + pos.invested, 0);
  const totalProfit = totalValue - totalInvested;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Portfolio Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-stell-border">
          <div className="text-xs font-mono text-slate-400 mb-1">Portfolio Valuation</div>
          <div className="text-3xl font-bold font-heading text-white">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            Wallet Balance: ${usdcBalance.toLocaleString('en-US')} USDC
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-stell-border">
          <div className="text-xs font-mono text-slate-400 mb-1">Unrealized P&L</div>
          <div className={`text-3xl font-bold font-heading ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Active Position Return</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-stell-border">
          <div className="text-xs font-mono text-slate-400 mb-1">Claimable Rewards</div>
          <div className="text-3xl font-bold font-heading text-stell-cyan">
            $0.00 USDC
          </div>
          <div className="text-xs text-slate-400 mt-2 font-mono">
            Auto-settled on market resolution
          </div>
        </div>
      </div>

      {/* Active Positions List */}
      <div className="glass-panel rounded-3xl p-6 border border-stell-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-stell-cyan" />
            <span>Your Active Positions ({userPositions.length})</span>
          </h3>
        </div>

        {userPositions.length > 0 ? (
          <div className="space-y-3">
            {userPositions.map((pos, idx) => {
              const market = markets.find(m => m.id === pos.marketId);
              if (!market) return null;
              const currentPrice = pos.outcome === 'YES' ? market.yesPrice : market.noPrice;
              const positionValue = pos.shares * currentPrice;

              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-stell-border flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-stell-cyan/30 transition-all cursor-pointer"
                  onClick={() => onSelectMarket(market)}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        pos.outcome === 'YES' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {pos.outcome} POSITION
                      </span>
                      <span className="text-xs text-slate-400 font-mono">{market.category}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white font-heading">{market.question}</h4>
                  </div>

                  <div className="flex items-center gap-6 font-mono text-xs text-right">
                    <div>
                      <div className="text-slate-400">Shares</div>
                      <div className="font-bold text-white">{pos.shares.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Avg Price</div>
                      <div className="font-bold text-white">${currentPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-slate-400">Value</div>
                      <div className="font-bold text-emerald-400">${positionValue.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400 text-sm">
            You currently hold zero active prediction market shares. Explore open markets to trade!
          </div>
        )}
      </div>

    </div>
  );
};
