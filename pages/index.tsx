import { useState } from 'react';
import { MarketsOverview } from '@/components/MarketsOverview';
import { MarketDetail } from '@/components/MarketDetail';
import { Portfolio } from '@/components/Portfolio';
import { LPVault } from '@/components/LPVault';
import { Header } from '@/components/Header';
import Head from 'next/head';

export default function Home() {
  const [activeView, setActiveView] = useState<'markets' | 'portfolio' | 'vault'>('markets');
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);

  const handleNavigate = (view: 'markets' | 'portfolio' | 'vault') => {
    setActiveView(view);
    setSelectedMarketId(null);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <Head>
        <title>Aleo Markets | Zero-Knowledge Prediction Markets</title>
        <meta name="description" content="Unified liquidity multi-dimensional prediction markets on Aleo" />
      </Head>

      <Header activeView={activeView} onNavigate={handleNavigate} />

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
