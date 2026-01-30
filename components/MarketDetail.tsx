import { useState } from 'react';
import { ArrowLeft, Users, Droplet, Clock, Shield, Lock, Info } from 'lucide-react';
import { WorldTable } from './WorldTable';
import { OrderBook } from './OrderBook';
import { ContractSelector, ContractType } from './ContractSelector';
import { VAMMStatus } from './VAMMStatus';
import { AdvancedTradingPanel } from './AdvancedTradingPanel';
import { PriceChart } from './PriceChart';

interface MarketDetailProps {
  marketId: string;
  onBack: () => void;
}

// Mock comprehensive market data
const MARKET_DATA = {
  '1': {
    id: '1',
    title: 'Middle East Escalation Cluster',
    description: 'Joint-outcome market pooling three correlated geopolitical events in the Middle East',
    events: [
      { id: 'A', name: 'Iran Strike on Israel' },
      { id: 'B', name: 'US Military Response' },
      { id: 'C', name: 'Oil Price >$120/barrel' }
    ],
    totalLiquidity: 2450000,
    volume24h: 185000,
    traders: 1247,
    deadline: '2026-06-30',
    // World table: 8 possible outcomes for 3 binary events
    worlds: [
      { id: '000', bits: '000', events: { A: false, B: false, C: false }, probability: 0.20, price: 0.20 },
      { id: '001', bits: '001', events: { A: false, B: false, C: true }, probability: 0.05, price: 0.05 },
      { id: '010', bits: '010', events: { A: false, B: true, C: false }, probability: 0.15, price: 0.15 },
      { id: '011', bits: '011', events: { A: false, B: true, C: true }, probability: 0.10, price: 0.10 },
      { id: '100', bits: '100', events: { A: true, B: false, C: false }, probability: 0.10, price: 0.10 },
      { id: '101', bits: '101', events: { A: true, B: false, C: true }, probability: 0.05, price: 0.05 },
      { id: '110', bits: '110', events: { A: true, B: true, C: false }, probability: 0.25, price: 0.25 },
      { id: '111', bits: '111', events: { A: true, B: true, C: true }, probability: 0.10, price: 0.10 }
    ],
    vammStatus: {
      liquidityParameter: 45.2,
      totalVolume: 185000,
      inventorySkew: [
        { outcome: 'World 110', position: 1200, targetPosition: 1000 },
        { outcome: 'World 111', position: 800, targetPosition: 1000 },
        { outcome: 'Others', position: 950, targetPosition: 1000 }
      ],
      volatilitySpread: {
        active: true,
        baseSpread: 0.02,
        currentSpread: 0.05,
        reason: 'Price moved from $0.35 to $0.68 in 10 minutes - toxic flow detected'
      },
      vaultBalance: 1250000,
      vaultCap: 2000000
    },
    orderBook: {
      asks: [
        { price: 0.685, size: 500, type: 'vamm' as const },
        { price: 0.690, size: 500, type: 'vamm' as const },
        { price: 0.695, size: 500, type: 'vamm' as const },
        { price: 0.700, size: 300, type: 'user' as const },
        { price: 0.710, size: 500, type: 'vamm' as const },
      ],
      bids: [
        { price: 0.675, size: 500, type: 'vamm' as const },
        { price: 0.670, size: 500, type: 'vamm' as const },
        { price: 0.665, size: 200, type: 'user' as const },
        { price: 0.660, size: 500, type: 'vamm' as const },
        { price: 0.650, size: 500, type: 'vamm' as const },
      ],
      lastPrice: 0.68,
      change24h: 12.3
    },
    historicalData: [
      { date: '2026-01-24', yes: 0.61, no: 0.39 },
      { date: '2026-01-25', yes: 0.63, no: 0.37 },
      { date: '2026-01-26', yes: 0.59, no: 0.41 },
      { date: '2026-01-27', yes: 0.65, no: 0.35 },
      { date: '2026-01-28', yes: 0.67, no: 0.33 },
      { date: '2026-01-29', yes: 0.66, no: 0.34 },
      { date: '2026-01-30', yes: 0.68, no: 0.32 }
    ]
  }
};

export function MarketDetail({ marketId, onBack }: MarketDetailProps) {
  const [contractType, setContractType] = useState<ContractType>('marginal');
  
  const market = MARKET_DATA[marketId as keyof typeof MARKET_DATA] || MARKET_DATA['1'];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate marginal probabilities from world table
  const marginals = {
    A: market.worlds.filter(w => w.events.A).reduce((sum, w) => sum + w.probability, 0),
    B: market.worlds.filter(w => w.events.B).reduce((sum, w) => sum + w.probability, 0),
    C: market.worlds.filter(w => w.events.C).reduce((sum, w) => sum + w.probability, 0),
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Markets</span>
      </button>

      {/* Market Header */}
      <div className="bg-[var(--card)] border border-border rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-sm rounded-md font-medium">
                Joint-Outcome Market
              </span>
              <span className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-md flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Aleo ZK Privacy
              </span>
              <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded-md">
                N=3 Events → 2³ = 8 Worlds
              </span>
            </div>
            <h1 className="text-3xl font-semibold mb-3">{market.title}</h1>
            <p className="text-muted-foreground leading-relaxed mb-4">{market.description}</p>
            
            {/* Correlated Events */}
            <div className="flex flex-wrap gap-2">
              {market.events.map((event, idx) => (
                <div key={event.id} className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg">
                  <span className="text-sm font-medium text-purple-400">{event.id}:</span>
                  <span className="text-sm">{event.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(marginals[event.id as keyof typeof marginals] * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-border">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Droplet className="w-4 h-4" />
              <span>Total Liquidity</span>
            </div>
            <p className="text-xl font-semibold">{formatCurrency(market.totalLiquidity)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Users className="w-4 h-4" />
              <span>Anonymous Traders</span>
            </div>
            <p className="text-xl font-semibold">{market.traders.toLocaleString()}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Clock className="w-4 h-4" />
              <span>Deadline</span>
            </div>
            <p className="text-sm font-medium">{formatDeadline(market.deadline)}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
              <Shield className="w-4 h-4" />
              <span>Privacy Model</span>
            </div>
            <p className="text-sm font-medium text-purple-400">Zero-Knowledge</p>
          </div>
        </div>
      </div>

      {/* Aleo Privacy Notice */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-purple-400 mb-1">Built on Aleo - Programmable Privacy Layer 1</h3>
            <p className="text-sm text-muted-foreground">
              All trades execute privately using zk-SNARKs. Individual bets, positions, and strategies remain completely hidden. 
              Only aggregated world probabilities are public. This protects informed traders and whistleblowers while maintaining market integrity.
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0 mt-1.5" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - World Table & Chart */}
        <div className="xl:col-span-2 space-y-6">
          {/* World Table */}
          <WorldTable events={market.events} worlds={market.worlds} />

          {/* Price Chart */}
          <div className="bg-[var(--card)] border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Marginal A Probability History</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-purple-500/20 text-purple-400 text-sm rounded-lg">
                  7D
                </button>
                <button className="px-3 py-1.5 text-muted-foreground hover:bg-muted text-sm rounded-lg transition-colors">
                  30D
                </button>
              </div>
            </div>
            <PriceChart data={market.historicalData} />
          </div>

          {/* vAMM Status */}
          <VAMMStatus {...market.vammStatus} />
        </div>

        {/* Right Column - Trading Interface */}
        <div className="xl:col-span-1 space-y-6">
          {/* Contract Type Selector */}
          <ContractSelector
            selected={contractType}
            onChange={setContractType}
            events={market.events}
          />

          {/* Order Book */}
          <OrderBook
            contractName={`${market.events[0].name} (Marginal A)`}
            bids={market.orderBook.bids}
            asks={market.orderBook.asks}
            lastPrice={market.orderBook.lastPrice}
            change24h={market.orderBook.change24h}
          />

          {/* Trading Panel */}
          <AdvancedTradingPanel
            contractType={contractType}
            events={market.events}
            worlds={market.worlds}
            marginals={marginals}
          />
        </div>
      </div>

      {/* Resolution Criteria */}
      <div className="bg-[var(--card)] border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold">Resolution Criteria</h2>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <strong className="text-foreground">Event A ({market.events[0].name}):</strong> Resolves "Yes" if Iran conducts a military strike on Israeli territory before the deadline, as confirmed by at least 2 major international news sources.
          </div>
          <div>
            <strong className="text-foreground">Event B ({market.events[1].name}):</strong> Resolves "Yes" if the United States deploys military forces in direct response to Event A within 72 hours, as confirmed by official DoD statements.
          </div>
          <div>
            <strong className="text-foreground">Event C ({market.events[2].name}):</strong> Resolves "Yes" if Brent Crude oil reaches $120/barrel or higher on any major exchange within 7 days of Event A.
          </div>
        </div>
      </div>
    </div>
  );
}
