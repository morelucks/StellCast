import React from 'react';
import { MarketItem } from '../types/market';
import { Clock, TrendingUp, DollarSign, CheckCircle2, ShieldAlert } from 'lucide-react';

interface MarketCardProps {
  market: MarketItem;
  onSelectMarket: (market: MarketItem, initialOutcome?: 'YES' | 'NO') => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, onSelectMarket }) => {
  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = Math.round(market.noPrice * 100);

  const categoryColors: Record<string, string> = {
    CRYPTO: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    TECH: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    FINANCE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    POLITICS: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    SPORTS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-6 border border-stell-border flex flex-col justify-between h-full group">
      <div>
        {/* Header: Category & Resolution date */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold border ${categoryColors[market.category] || categoryColors.CRYPTO}`}>
            {market.category}
          </span>
          <div className="flex items-center gap-1 text-slate-400 text-xs font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{market.resolutionDate}</span>
          </div>
        </div>

        {/* Question Title */}
        <h3 
          onClick={() => onSelectMarket(market)}
          className="text-lg font-bold text-white font-heading leading-snug group-hover:text-stell-cyan transition-colors cursor-pointer mb-3"
        >
          {market.question}
        </h3>

        {/* Description snippet */}
        <p className="text-slate-400 text-xs line-clamp-2 mb-5 leading-relaxed">
          {market.description}
        </p>
      </div>

      <div>
        {/* YES / NO Probability Bar */}
        <div className="space-y-2 mb-5">
          <div className="flex justify-between text-xs font-mono font-semibold">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> YES {yesPercent}% (${market.yesPrice.toFixed(2)})
            </span>
            <span className="text-rose-400 flex items-center gap-1">
              NO {noPercent}% (${market.noPrice.toFixed(2)}) <ShieldAlert className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex p-[2px] border border-white/5">
            <div 
              style={{ width: `${yesPercent}%` }} 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-l-full transition-all duration-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            />
            <div 
              style={{ width: `${noPercent}%` }} 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-r-full transition-all duration-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
            />
          </div>
        </div>

        {/* Trade Buttons */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button
            onClick={() => onSelectMarket(market, 'YES')}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-xs transition-all hover:scale-[1.02] active:scale-95 glow-green"
          >
            <span>Buy YES</span>
            <span className="font-mono text-[10px] opacity-75">${market.yesPrice.toFixed(2)}</span>
          </button>

          <button
            onClick={() => onSelectMarket(market, 'NO')}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-semibold text-xs transition-all hover:scale-[1.02] active:scale-95 glow-rose"
          >
            <span>Buy NO</span>
            <span className="font-mono text-[10px] opacity-75">${market.noPrice.toFixed(2)}</span>
          </button>
        </div>

        {/* Card Footer Metrics */}
        <div className="pt-3 border-t border-stell-border/50 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-stell-cyan" />
            <span>Vol: ${market.volume.toLocaleString('en-US')}</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-stell-purple" />
            <span>TVL: ${market.liquidity.toLocaleString('en-US')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
