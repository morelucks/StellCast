import React, { useState } from 'react';
import { MarketCategory } from '../types/market';
import { X, PlusCircle, Check, RefreshCw } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface CreateMarketModalProps {
  onClose: () => void;
  onCreateMarketSuccess: (newMarket: any) => void;
}

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ onClose, onCreateMarketSuccess }) => {
  const { isConnected, connectWallet } = useWallet();
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<MarketCategory>('CRYPTO');
  const [resolutionDate, setResolutionDate] = useState('2026-12-31');
  const [initialLiquidity, setInitialLiquidity] = useState(500);
  const [description, setDescription] = useState('');
  const [oracle, setOracle] = useState('Reflector Soroban Oracle');

  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedSuccess, setDeployedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      connectWallet();
      return;
    }
    if (!question || initialLiquidity <= 0) return;

    setIsDeploying(true);

    // Simulate Soroban create_market smart contract deployment
    setTimeout(() => {
      setIsDeploying(false);
      setDeployedSuccess(true);

      const createdMarket = {
        id: Math.floor(Math.random() * 9000 + 1000).toString(),
        question,
        category,
        resolutionDate,
        status: 'OPEN',
        yesPrice: 0.50,
        noPrice: 0.50,
        yesShares: initialLiquidity,
        noShares: initialLiquidity,
        volume: initialLiquidity,
        liquidity: initialLiquidity,
        creator: 'G...YOU_CURRENT_USER',
        oracle,
        description: description || 'No detailed description provided.',
      };

      onCreateMarketSuccess(createdMarket);

      setTimeout(() => {
        setDeployedSuccess(false);
        onClose();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="glass-panel w-full max-w-xl rounded-3xl border border-stell-border overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-stell-border">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-stell-cyan" />
            <h2 className="text-xl font-bold text-white font-heading">Create Prediction Market</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Market Question</label>
            <input
              type="text"
              required
              placeholder="e.g. Will XLM reach $2.00 before end of 2026?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-3 bg-stell-bg border border-stell-border rounded-xl text-sm text-white focus:outline-none focus:border-stell-cyan"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-3 bg-stell-bg border border-stell-border rounded-xl text-sm text-white focus:outline-none focus:border-stell-cyan cursor-pointer"
              >
                <option value="CRYPTO">CRYPTO</option>
                <option value="TECH">TECH</option>
                <option value="FINANCE">FINANCE</option>
                <option value="POLITICS">POLITICS</option>
                <option value="SPORTS">SPORTS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Resolution Date</label>
              <input
                type="date"
                required
                value={resolutionDate}
                onChange={(e) => setResolutionDate(e.target.value)}
                className="w-full px-4 py-3 bg-stell-bg border border-stell-border rounded-xl text-sm text-white focus:outline-none focus:border-stell-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Initial Liquidity Deposit (USDC)</label>
            <input
              type="number"
              min={100}
              required
              value={initialLiquidity}
              onChange={(e) => setInitialLiquidity(Number(e.target.value))}
              className="w-full px-4 py-3 bg-stell-bg border border-stell-border rounded-xl text-sm font-mono text-white focus:outline-none focus:border-stell-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">Resolution Criteria / Description</label>
            <textarea
              rows={3}
              placeholder="Specify exact rules and verification sources for resolving this market."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-stell-bg border border-stell-border rounded-xl text-sm text-white focus:outline-none focus:border-stell-cyan"
            />
          </div>

          {deployedSuccess ? (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-center text-emerald-400 font-bold text-sm flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>Soroban Market Created & Deployed!</span>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isDeploying}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-stell-cyan to-stell-purple text-black font-bold text-sm glow-cyan hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isDeploying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Deploying Soroban Smart Contract...</span>
                </>
              ) : (
                <span>Initialize & Deploy Market</span>
              )}
            </button>
          )}

        </form>
      </div>
    </div>
  );
};
