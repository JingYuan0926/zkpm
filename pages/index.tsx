import { useState } from 'react';
import { MarketsOverview } from '@/components/MarketsOverview';
import { MarketDetail } from '@/components/MarketDetail';
import { Portfolio } from '@/components/Portfolio';
import { LPVault } from '@/components/LPVault';
import { Shield, TrendingUp, Wallet, Settings, Layers } from 'lucide-react';
import Head from 'next/head';

export default function Home() {
  const [activeView, setActiveView] = useState<'markets' | 'portfolio' | 'vault'>('markets');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white text-black">
      <Head>
        <title>Aleo Markets | Zero-Knowledge Prediction Markets</title>
        <meta name="description" content="Unified liquidity multi-dimensional prediction markets on Aleo" />
      </Head>

      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0f1014]">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Shield className="w-7 h-7 text-purple-500" />
                <div>
                  <h1 className="text-xl font-semibold">Aleo Markets</h1>
                  <p className="text-xs text-gray-500">Zero-Knowledge Prediction Markets</p>
                </div>
              </div>

              <nav className="flex gap-1">
                <button
                  onClick={() => {
                    setActiveView('markets');
                    setSelectedMarketId(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'markets'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  Markets
                </button>
                <button
                  onClick={() => {
                    setActiveView('portfolio');
                    setSelectedMarketId(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${activeView === 'portfolio'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => {
                    setActiveView('vault');
                    setSelectedMarketId(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${activeView === 'vault'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                >
                  <Layers className="w-4 h-4" />
                  LP Vault
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-300">Aleo Mainnet</span>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                <Wallet className="w-4 h-4" />
                <span className="text-sm font-medium">Connect Wallet</span>
              </button>

              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        {selectedMarketId ? (
          <MarketDetail
            marketId={selectedMarketId}
            onBack={() => setSelectedMarketId(null)}
          />
        ) : activeView === 'markets' ? (
          <MarketsOverview onSelectMarket={setSelectedMarketId} />
        ) : activeView === 'vault' ? (
          <LPVault />
        ) : (
          <Portfolio onSelectMarket={setSelectedMarketId} />
        )}
      </main>
    </div>
  );
}
