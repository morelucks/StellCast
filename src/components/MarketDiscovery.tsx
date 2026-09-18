import React, { useState } from 'react';
import { MarketItem, MarketCategory } from '../types/market';
import { MarketCard } from './MarketCard';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

interface MarketDiscoveryProps {
  markets: MarketItem[];
  onSelectMarket: (market: MarketItem, initialOutcome?: 'YES' | 'NO') => void;
}

export const MarketDiscovery: React.FC<MarketDiscoveryProps> = ({ markets, onSelectMarket }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'volume' | 'liquidity' | 'newest'>('volume');

  const categories = ['ALL', 'CRYPTO', 'TECH', 'FINANCE', 'POLITICS', 'SPORTS'];

  const filteredMarkets = markets
    .filter(m => {
      const matchesSearch = m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            m.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'volume') return b.volume - a.volume;
      if (sortBy === 'liquidity') return b.liquidity - a.liquidity;
      return b.id.localeCompare(a.id);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Search & Category Filter Control Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-stell-border flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search prediction markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stell-bg border border-stell-border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-stell-cyan transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-stell-cyan to-stell-purple text-black shadow-lg glow-cyan font-bold'
                  : 'bg-stell-bg text-slate-400 hover:text-white border border-stell-border hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <ArrowUpDown className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-stell-bg border border-stell-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-stell-cyan cursor-pointer"
          >
            <option value="volume">Highest Volume</option>
            <option value="liquidity">Highest Liquidity</option>
            <option value="newest">Newest Markets</option>
          </select>
        </div>

      </div>

      {/* Markets Grid */}
      {filteredMarkets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMarkets.map((market) => (
            <MarketCard key={market.id} market={market} onSelectMarket={onSelectMarket} />
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-3">
          <Filter className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No prediction markets found</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Try adjusting your search filters or create a new prediction market on Soroban!
          </p>
        </div>
      )}

    </div>
  );
};
