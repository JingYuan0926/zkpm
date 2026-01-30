import { useState } from 'react';
import { MarketCard } from './MarketCard';
import { Search, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface Market {
  id: string;
  title: string;
  description: string;
  category: string;
  totalLiquidity: number;
  outcomes: {
    name: string;
    probability: number;
    change24h: number;
  }[];
  volume24h: number;
  traders: number;
  deadline: string;
  correlatedEvents?: string[];
  logo: string;
}

const MOCK_MARKETS: Market[] = [
  {
    id: '1',
    title: 'Middle East Escalation Cluster',
    description: 'Joint-outcome market pooling Iran strike, US response, and oil price predictions with correlated probabilities',
    category: 'Geopolitics',
    totalLiquidity: 2450000,
    outcomes: [
      { name: 'All Escalate', probability: 0.10, change24h: 12.3 },
      { name: 'Strike+Response', probability: 0.25, change24h: 8.1 },
      { name: 'No Escalation', probability: 0.20, change24h: -5.2 }
    ],
    volume24h: 185000,
    traders: 1247,
    deadline: '2026-06-30',
    correlatedEvents: ['Iran Strike', 'US Response', 'Oil >$120'],
    logo: '/titlePic/middleeast.png'
  },
  {
    id: '2',
    title: 'US Election 2028 Multi-Outcome Pool',
    description: 'Unified market for primary winner, general election outcome, and turnout threshold',
    category: 'Politics',
    totalLiquidity: 5200000,
    outcomes: [
      { name: 'Dem Primary Win + General Win', probability: 0.35, change24h: 2.1 },
      { name: 'Rep Primary Win + General Win', probability: 0.28, change24h: -1.3 },
      { name: 'Split Outcome', probability: 0.37, change24h: -0.8 }
    ],
    volume24h: 420000,
    traders: 3241,
    deadline: '2028-11-07',
    correlatedEvents: ['Dem Primary', 'General Election', 'Turnout >65%'],
    logo: '/titlePic/uselection.png'
  },
  {
    id: '3',
    title: 'SpaceX Mars Mission Cluster',
    description: 'Joint probability across launch success, safe landing, and mission duration milestones',
    category: 'Science',
    totalLiquidity: 890000,
    outcomes: [
      { name: 'Full Success', probability: 0.18, change24h: 1.5 },
      { name: 'Launch+Land', probability: 0.37, change24h: 0.8 },
      { name: 'Launch Only', probability: 0.28, change24h: -0.3 }
    ],
    volume24h: 67000,
    traders: 892,
    deadline: '2030-12-31',
    correlatedEvents: ['Launch Success', 'Safe Landing', 'Duration >90d'],
    logo: '/titlePic/spacex.png'
  },
  {
    id: '4',
    title: 'AI Safety Milestone Cluster',
    description: 'Multi-outcome market for AGI benchmarks, safety certifications, and regulatory approval',
    category: 'Technology',
    totalLiquidity: 1750000,
    outcomes: [
      { name: 'All Achieved', probability: 0.22, change24h: 4.2 },
      { name: 'Benchmark+Cert', probability: 0.41, change24h: 2.1 },
      { name: 'Benchmark Only', probability: 0.24, change24h: -1.5 }
    ],
    volume24h: 142000,
    traders: 1876,
    deadline: '2027-12-31',
    correlatedEvents: ['AGI Benchmark', 'Safety Cert', 'Regulatory OK'],
    logo: '/titlePic/aisafety.png'
  },
  {
    id: '5',
    title: 'Climate Tipping Points',
    description: 'Unified market for temperature threshold, Arctic ice loss, and emissions target outcomes',
    category: 'Climate',
    totalLiquidity: 620000,
    outcomes: [
      { name: 'All Breach', probability: 0.31, change24h: 0.9 },
      { name: 'Temp+Ice', probability: 0.30, change24h: 0.4 },
      { name: 'None Breach', probability: 0.18, change24h: -0.6 }
    ],
    volume24h: 45000,
    traders: 567,
    deadline: '2026-12-31',
    correlatedEvents: ['>1.5°C', 'Arctic Ice <4M km²', 'Emissions Miss'],
    logo: '/titlePic/climatetipping.png'
  },
  {
    id: '6',
    title: 'Trump Administration Policy Cluster',
    description: 'Unified market for trade tariff implementation, energy deregulation, and fiscal reform outcomes',
    category: 'Politics',
    totalLiquidity: 1340000,
    outcomes: [
      { name: 'Tariffs + Dereg + Reform', probability: 0.15, change24h: -2.1 },
      { name: 'Tariffs + Dereg', probability: 0.29, change24h: -0.8 },
      { name: 'Partial Success', probability: 0.44, change24h: 1.9 }
    ],
    volume24h: 98000,
    traders: 1432,
    deadline: '2026-12-31',
    correlatedEvents: ['Trade Tariffs', 'Energy Dereg', 'Fiscal Reform'],
    logo: '/titlePic/trump.png'
  }
];

interface MarketsOverviewProps {
  onSelectMarket: (marketId: string) => void;
}

export function MarketsOverview({ onSelectMarket }: MarketsOverviewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Geopolitics', 'Politics', 'Science', 'Technology', 'Climate', 'Finance'];

  const filteredMarkets = MOCK_MARKETS.filter(market => {
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || market.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[var(--card)] border border-gray-200 rounded-xl text-foreground placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-3 rounded-xl whitespace-nowrap transition-colors ${selectedCategory === category
                ? 'bg-purple-500/20 text-purple-700 border border-purple-500/30'
                : 'bg-[var(--card)] text-gray-600 border border-gray-200 hover:border-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Markets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredMarkets.map(market => (
          <MarketCard
            key={market.id}
            market={market}
            onClick={() => onSelectMarket(market.id)}
          />
        ))}
      </div>

      {filteredMarkets.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600">No markets found matching your criteria</p>
        </div>
      )}
    </div>
  );
}