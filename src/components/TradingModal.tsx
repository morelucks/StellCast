import React, { useState } from 'react';
import { MarketItem } from '../types/market';
import { useWallet } from '../context/WalletContext';
import { X, CheckCircle2, ShieldAlert, ArrowRight, Wallet, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface TradingModalProps {
  market: MarketItem | null;
  initialOutcome?: 'YES' | 'NO';
  onClose: () => void;
  onTradeSuccess: (marketId: string, outcome: 'YES' | 'NO', amount: number, shares: number) => void;
}

export const TradingModal: React.FC<TradingModalProps> = ({
  market,
  initialOutcome = 'YES',
  onClose,
  onTradeSuccess,
}) => {
  if (!market) return null;

  const { isConnected, usdcBalance, connectWallet } = useWallet();
  const [outcome, setOutcome] = useState<'YES' | 'NO'>(initialOutcome);
  const [amount, setAmount] = useState<number>(50);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string>('');

  const currentPrice = outcome === 'YES' ? market.yesPrice : market.noPrice;
  const estimatedShares = amount > 0 ? amount / currentPrice : 0;
  const potentialPayout = estimatedShares * 1.0; // Each share redeems 1 USDC if win
  const potentialProfit = potentialPayout - amount;
  const roi = amount > 0 ? (potentialProfit / amount) * 100 : 0;

  const handlePresetAmount = (preset: number) => {
    setAmount(preset);
  };

  const handleExecuteTrade = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (amount <= 0 || amount > usdcBalance) return;

    setIsSubmitting(true);

    // Simulate Soroban Contract execution (stellcast-contract buy_shares)
    setTimeout(() => {
      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(mockHash);
      setIsSubmitting(false);
      setTxSuccess(true);

      onTradeSuccess(market.id, outcome, amount, estimatedShares);

      setTimeout(() => {
        setTxSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="glass-panel w-full max-w-lg rounded-3xl border border-stell-border overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stell-border">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-semibold bg-stell-cyan/10 text-stell-cyan border border-stell-cyan/30">
              {market.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">Market #{market.id}</span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-bold text-white font-heading leading-snug">
            {market.question}
          </h2>

          {/* Outcome Switcher */}
          <div className="grid grid-cols-2 gap-3 p-1 bg-slate-900/80 rounded-2xl border border-stell-border">
            <button
              onClick={() => setOutcome('YES')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                outcome === 'YES'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-black shadow-lg glow-green font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>YES (${market.yesPrice.toFixed(2)})</span>
            </button>

            <button
              onClick={() => setOutcome('NO')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                outcome === 'NO'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg glow-rose font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span>NO (${market.noPrice.toFixed(2)})</span>
            </button>
          </div>

          {/* Investment Amount Input */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400">Trade Amount (USDC)</span>
              <span className="text-slate-400">
                Balance: <strong className="text-emerald-400">${usdcBalance.toLocaleString('en-US')}</strong>
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(Number(e.target.value))}
                min={1}
                max={usdcBalance}
                className="w-full pl-4 pr-16 py-3.5 bg-stell-bg border border-stell-border rounded-xl text-lg font-bold font-mono text-white focus:outline-none focus:border-stell-cyan transition-colors"
                placeholder="0.00"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-stell-cyan">
                USDC
              </span>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-2">
              {[10, 50, 100, 250, 500].map((preset) => (
                <button
                  key={preset}
                  onClick={() => handlePresetAmount(preset)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors border border-slate-700"
                >
                  ${preset}
                </button>
              ))}
            </div>
          </div>

          {/* Trade Output Calculator */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-stell-border space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-slate-300">
              <span>Avg Share Price:</span>
              <span className="font-bold text-white">${currentPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated Shares Minted:</span>
              <span className="font-bold text-stell-cyan">{estimatedShares.toFixed(2)} {outcome} Shares</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Potential Payout:</span>
              <span className="font-bold text-emerald-400">${potentialPayout.toFixed(2)} USDC (+{roi.toFixed(1)}%)</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800 text-[11px]">
              <span>Soroban Gas Fee:</span>
              <span>&lt; 0.00001 XLM ($0.0000)</span>
            </div>
          </div>

          {/* Action Button */}
          {txSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-center space-y-1 animate-scaleIn">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <Check className="w-5 h-5" />
                <span>Soroban Transaction Confirmed!</span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Tx: {txHash}
              </p>
            </div>
          ) : (
            <button
              onClick={handleExecuteTrade}
              disabled={isSubmitting || amount <= 0}
              className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                outcome === 'YES'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-black hover:brightness-110 glow-green'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:brightness-110 glow-rose'
              } disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]`}
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Executing Soroban Smart Contract...</span>
                </>
              ) : !isConnected ? (
                <>
                  <Wallet className="w-5 h-5" />
                  <span>Connect Wallet to Trade</span>
                </>
              ) : (
                <>
                  <span>Confirm Buy {outcome} Position</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}

        </div>
      </div>
    </div>
  );
};
