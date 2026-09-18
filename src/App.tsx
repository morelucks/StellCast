import React, { useState } from 'react';
import { WalletProvider } from './context/WalletContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MarketDiscovery } from './components/MarketDiscovery';
import { TradingModal } from './components/TradingModal';
import { CreateMarketModal } from './components/CreateMarketModal';
import { PortfolioView } from './components/PortfolioView';
import { INITIAL_MARKETS } from './data/mockMarkets';
import { MarketItem } from './types/market';
import { Sparkles, Github, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'markets' | 'portfolio' | 'analytics'>('markets');
  const [markets, setMarkets] = useState<MarketItem[]>(INITIAL_MARKETS);
  const [selectedMarket, setSelectedMarket] = useState<MarketItem | null>(null);
  const [initialOutcome, setInitialOutcome] = useState<'YES' | 'NO'>('YES');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Track user positions in state
  const [userPositions, setUserPositions] = useState<
    { marketId: string; outcome: 'YES' | 'NO'; shares: number; invested: number }[]
  >([
    { marketId: '1', outcome: 'YES', shares: 147.05, invested: 100 },
    { marketId: '2', outcome: 'YES', shares: 297.61, invested: 250 },
    { marketId: '4', outcome: 'NO', shares: 178.57, invested: 50 },
  ]);

  const handleOpenTrade = (market: MarketItem, outcome: 'YES' | 'NO' = 'YES') => {
    setSelectedMarket(market);
    setInitialOutcome(outcome);
  };

  const handleTradeSuccess = (marketId: string, outcome: 'YES' | 'NO', amount: number, shares: number) => {
    // Update user positions
    setUserPositions(prev => {
      const existing = prev.find(p => p.marketId === marketId && p.outcome === outcome);
      if (existing) {
        return prev.map(p =>
          p.marketId === marketId && p.outcome === outcome
            ? { ...p, shares: p.shares + shares, invested: p.invested + amount }
            : p
        );
      }
      return [...prev, { marketId, outcome, shares, invested: amount }];
    });

    // Update market volume
    setMarkets(prev =>
      prev.map(m => (m.id === marketId ? { ...m, volume: m.volume + amount } : m))
    );
  };

  const handleCreateMarketSuccess = (newMarket: MarketItem) => {
    setMarkets(prev => [newMarket, ...prev]);
  };

  return (
    <WalletProvider>
      <div className="min-h-screen bg-stell-bg text-slate-100 flex flex-col justify-between selection:bg-stell-cyan selection:text-black">
        
        <div>
          {/* Top Navbar */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
          />

          {/* Main Content Body */}
          <main>
            {activeTab === 'markets' && (
              <>
                <HeroBanner />
                <MarketDiscovery 
                  markets={markets} 
                  onSelectMarket={handleOpenTrade} 
                />
              </>
            )}

            {activeTab === 'portfolio' && (
              <PortfolioView 
                markets={markets} 
                userPositions={userPositions} 
                onSelectMarket={handleOpenTrade}
              />
            )}

            {activeTab === 'analytics' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <div className="glass-panel p-8 rounded-3xl border border-stell-border text-center max-w-2xl mx-auto space-y-4">
                  <Zap className="w-12 h-12 text-stell-cyan mx-auto glow-cyan" />
                  <h2 className="text-2xl font-bold font-heading text-white">StellCast Analytics & LMSR Simulator</h2>
                  <p className="text-slate-400 text-sm">
                    Soroban Logarithmic Market Scoring Rule (LMSR) liquidity depth, price sensitivity curves, and automated resolution oracle analytics are active.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-left font-mono text-xs pt-4 border-t border-stell-border">
                    <div className="p-4 bg-slate-900 rounded-xl">
                      <div className="text-slate-400">Smart Contract</div>
                      <div className="text-stell-cyan font-bold truncate">stellcast-contract v0.1.0</div>
                    </div>
                    <div className="p-4 bg-slate-900 rounded-xl">
                      <div className="text-slate-400">Soroban Target</div>
                      <div className="text-emerald-400 font-bold truncate">wasm32-unknown-unknown</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modals */}
        {selectedMarket && (
          <TradingModal
            market={selectedMarket}
            initialOutcome={initialOutcome}
            onClose={() => setSelectedMarket(null)}
            onTradeSuccess={handleTradeSuccess}
          />
        )}

        {isCreateModalOpen && (
          <CreateMarketModal
            onClose={() => setIsCreateModalOpen(false)}
            onCreateMarketSuccess={handleCreateMarketSuccess}
          />
        )}

        {/* Footer */}
        <footer className="mt-20 border-t border-stell-border/60 bg-stell-card/40 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-stell-cyan" />
              <span>StellCast Protocol © 2026 — Built on Stellar & Soroban</span>
            </div>

            <div className="flex items-center gap-6">
              <a href="https://github.com/morelucks/StellCast" target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Soroban Audited</span>
              </span>
            </div>
          </div>
        </footer>

      </div>
    </WalletProvider>
  );
}
