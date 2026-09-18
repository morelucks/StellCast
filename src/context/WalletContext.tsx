import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletState } from '../types/market';
import freighterApi from '@stellar/freighter-api';

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isLoading: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: false,
    address: null,
    xlmBalance: 1450.50,
    usdcBalance: 2840.00,
    isFreighterDetected: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkFreighter();
  }, []);

  const checkFreighter = async () => {
    try {
      const isAllowedFn = (freighterApi as any).isAllowed || (freighterApi as any).isConnected;
      if (isAllowedFn) {
        const res = await isAllowedFn();
        if (res) setWallet(prev => ({ ...prev, isFreighterDetected: true }));
      }
    } catch {
      // Freighter check fallback
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if ((freighterApi as any).requestAccess) {
        await (freighterApi as any).requestAccess();
      }
      if ((freighterApi as any).getAddress) {
        const res = await (freighterApi as any).getAddress();
        if (res && res.address) {
          setWallet({
            isConnected: true,
            address: `${res.address.slice(0, 4)}...${res.address.slice(-4)}`,
            xlmBalance: 2450.75,
            usdcBalance: 5200.00,
            isFreighterDetected: true,
          });
          setIsLoading(false);
          return;
        }
      }
    } catch (e) {
      console.log('Freighter connection fallback to mock wallet:', e);
    }

    // Fallback mock wallet connection for testing and development
    setTimeout(() => {
      setWallet({
        isConnected: true,
        address: 'GCX7...STELLCAST9281',
        xlmBalance: 1250.00,
        usdcBalance: 3400.00,
        isFreighterDetected: false,
      });
      setIsLoading(false);
    }, 500);
  };

  const disconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      xlmBalance: 0,
      usdcBalance: 0,
      isFreighterDetected: false,
    });
  };

  return (
    <WalletContext.Provider value={{ ...wallet, connectWallet, disconnectWallet, isLoading }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
