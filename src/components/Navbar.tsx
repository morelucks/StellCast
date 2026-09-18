import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Sparkles, Wallet, PlusCircle, Layers, BarChart3, ChevronRight, Activity } from 'lucide-react';

interface NavbarProps {
  activeTab: 'markets' | 'portfolio' | 'analytics';
  setActiveTab: (tab: 'markets' | 'portfolio' | 'analytics') => void;
  onOpenCreateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCreateModal }) => {
  const { isConnected, address, usdcBalance, connectWallet, disconnectWallet, isLoading } = useWallet();

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-stell-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('markets')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-stell-purple via-stell-cyan to-cyan-400 p-[1px] glow-cyan">
              <div className="w-full h-full bg-stell-card rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-stell-cyan animate-pulse" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold font-heading tracking-tight text-white">
                Stell<span className="text-gradient">Cast</span>
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>SOROBAN TESTNET</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-stell-card/80 p-1.5 rounded-2xl border border-stell-border">
            <button
              onClick={() => setActiveTab('markets')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'markets'
                  ? 'bg-gradient-to-r from-stell-cyan/20 to-stell-purple/20 text-stell-cyan border border-stell-cyan/30 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Markets</span>
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'portfolio'
                  ? 'bg-gradient-to-r from-stell-cyan/20 to-stell-purple/20 text-stell-cyan border border-stell-cyan/30 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Portfolio</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-stell-cyan/20 to-stell-purple/20 text-stell-cyan border border-stell-cyan/30 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>

          {/* Actions: Create Market & Wallet */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCreateModal}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stell-card hover:bg-stell-hover border border-stell-border text-white text-sm font-medium transition-all hover:border-stell-cyan/40"
            >
              <PlusCircle className="w-4 h-4 text-stell-cyan" />
              <span>Create Market</span>
            </button>

            {isConnected ? (
              <div className="flex items-center gap-2 bg-stell-card p-1.5 pl-4 rounded-2xl border border-stell-border">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-mono text-emerald-400 font-semibold">
                    ${usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} USDC
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{address}</div>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 border border-slate-700 text-xs font-medium text-slate-300 transition-all"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-stell-cyan to-blue-600 text-black font-semibold text-sm transition-all hover:brightness-110 glow-cyan active:scale-95 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};
