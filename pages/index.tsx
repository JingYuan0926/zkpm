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
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Shield className="w-7 h-7 text-purple-600" />
                <div>
                  <h1 className="text-xl font-semibold text-black">Aleo Markets</h1>
                  <p className="text-xs text-black/60 font-medium">Zero-Knowledge Prediction Markets</p>
                </div>
              </div>

              <nav className="flex gap-1">
                <button
                  onClick={() => {
                    setActiveView('markets');
                    setSelectedMarketId(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${activeView === 'markets'
                    ? 'bg-purple-600/10 text-purple-700'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                >
                  Markets
                </button>
                <button
                  onClick={() => {
                    setActiveView('portfolio');
                    setSelectedMarketId(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors font-medium ${activeView === 'portfolio'
                    ? 'bg-purple-600/10 text-purple-700'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                >
                  Portfolio
                </button>
                <button
                  onClick={() => {
                    setActiveView('vault');
                    setSelectedMarketId(null);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${activeView === 'vault'
                    ? 'bg-purple-600/10 text-purple-700'
                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                    }`}
                >
                  <Layers className="w-4 h-4" />
                  LP Vault
                </button>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-700 font-medium">Aleo Mainnet</span>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                <Wallet className="w-4 h-4 text-white" />
                <span className="text-sm font-medium text-white">Connect Wallet</span>
              </button>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-gray-600" />
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
