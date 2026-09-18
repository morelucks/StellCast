import React from 'react';
import { TrendingUp, ShieldCheck, Zap, Coins } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <div className="relative overflow-hidden pt-10 pb-12 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-stell-cyan/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-stell-purple/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stell-card border border-stell-border text-stell-cyan text-xs font-medium glow-cyan">
            <Zap className="w-3.5 h-3.5 text-stell-cyan" />
            <span>Stellar Soroban Smart Contracts V22 Live</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white font-heading leading-tight">
            Decentralized <span className="text-gradient">Prediction Markets</span> on Stellar
          </h1>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Forecast real-world outcomes with micro-cent transaction fees, instant finality, and automated market maker liquidity on Soroban.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          <div className="glass-panel p-5 rounded-2xl border border-stell-border text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-xl bg-stell-cyan/10 text-stell-cyan">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">$4.28M</div>
            <div className="text-xs text-slate-400 font-medium">Total Volume</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-stell-border text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-xl bg-stell-purple/10 text-stell-purple">
              <Coins className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">$1.12M</div>
            <div className="text-xs text-slate-400 font-medium">Total Value Locked</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-stell-border text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-xl bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">34 Active</div>
            <div className="text-xs text-slate-400 font-medium">Verified Markets</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-stell-border text-center">
            <div className="flex items-center justify-center w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500/10 text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-heading text-white">&lt; 3.5s</div>
            <div className="text-xs text-slate-400 font-medium">Settlement Speed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
