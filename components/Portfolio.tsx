import { Lock, TrendingUp, TrendingDown, Eye, EyeOff, Shield, DollarSign, Activity } from 'lucide-react';
import { useState } from 'react';

interface Position {
  id: string;
  marketTitle: string;
  outcome: string;
  amount: number;
  currentValue: number;
  probability: number;
  potentialPayout: number;
  timestamp: string;
  category: string;
}

const MOCK_POSITIONS: Position[] = [
  {
    id: '1',
    marketTitle: 'Will ETH reach $5,000 by Q2 2026?',
    outcome: 'Yes',
    amount: 500,
    currentValue: 545,
    probability: 0.68,
    potentialPayout: 735,
    timestamp: '2026-01-15T10:30:00Z',
    category: 'Crypto'
  },
  {
    id: '2',
    marketTitle: 'AI Model Passes Full Turing Test by 2027',
    outcome: 'Yes',
    amount: 250,
    currentValue: 290,
    probability: 0.73,
    potentialPayout: 342,
    timestamp: '2026-01-20T14:22:00Z',
    category: 'Technology'
  },
  {
    id: '3',
    marketTitle: 'SpaceX Mars Landing Success by 2030',
    outcome: 'Success',
    amount: 300,
    currentValue: 285,
    probability: 0.55,
    potentialPayout: 545,
    timestamp: '2026-01-22T09:15:00Z',
    category: 'Science'
  },
  {
    id: '4',
    marketTitle: 'Next Unicorn IPO Valuation > $100B',
    outcome: 'Below $100B',
    amount: 400,
    currentValue: 435,
    probability: 0.56,
    potentialPayout: 714,
    timestamp: '2026-01-25T16:45:00Z',
    category: 'Finance'
  }
];

interface PortfolioProps {
  onSelectMarket: (marketId: string) => void;
}

export function Portfolio({ onSelectMarket }: PortfolioProps) {
  const [hideAmounts, setHideAmounts] = useState(false);

  const totalInvested = MOCK_POSITIONS.reduce((sum, pos) => sum + pos.amount, 0);
  const totalCurrentValue = MOCK_POSITIONS.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalPnL = totalCurrentValue - totalInvested;
  const totalPnLPercent = (totalPnL / totalInvested) * 100;
  const totalPotentialPayout = MOCK_POSITIONS.reduce((sum, pos) => sum + pos.potentialPayout, 0);

  const formatCurrency = (value: number) => {
    if (hideAmounts) return '•••••';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Privacy Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Your Private Portfolio</h2>
          <p className="text-muted-foreground text-sm">All positions are zero-knowledge encrypted</p>
        </div>
        <button
          onClick={() => setHideAmounts(!hideAmounts)}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-gray-700 rounded-lg transition-colors"
        >
          {hideAmounts ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm">{hideAmounts ? 'Show' : 'Hide'} Values</span>
        </button>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total Invested</span>
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(totalInvested)}</p>
          <div className="flex items-center gap-1 mt-2">
            <Lock className="w-3 h-3 text-purple-400" />
            <span className="text-xs text-purple-400">Private</span>
          </div>
        </div>

        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Current Value</span>
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(totalCurrentValue)}</p>
          <div className={`flex items-center gap-1 mt-2 text-sm ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {totalPnL >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {!hideAmounts && <span>{totalPnL >= 0 ? '+' : ''}{formatCurrency(Math.abs(totalPnL))}</span>}
          </div>
        </div>

        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Total P&L</span>
          </div>
          <p className={`text-2xl font-semibold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {!hideAmounts && (totalPnL >= 0 ? '+' : '')}{hideAmounts ? '•••••' : totalPnLPercent.toFixed(2)}%
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {!hideAmounts && `${totalPnL >= 0 ? '+' : ''}${formatCurrency(Math.abs(totalPnL))}`}
          </p>
        </div>

        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Shield className="w-4 h-4" />
            <span className="text-sm">Max Payout</span>
          </div>
          <p className="text-2xl font-semibold">{formatCurrency(totalPotentialPayout)}</p>
          <p className="text-sm text-muted-foreground mt-2">If all win</p>
        </div>
      </div>

      {/* ZK Privacy Notice */}
      <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-purple-400 mb-1">Zero-Knowledge Privacy Active</h3>
            <p className="text-sm text-muted-foreground">
              Your positions are encrypted using zero-knowledge proofs. Only you can see this portfolio. 
              Not even protocol operators or validators can access your trading data.
            </p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Positions List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Active Positions ({MOCK_POSITIONS.length})</h3>
        <div className="space-y-3">
          {MOCK_POSITIONS.map((position) => {
            const pnl = position.currentValue - position.amount;
            const pnlPercent = (pnl / position.amount) * 100;

            return (
              <div
                key={position.id}
                className="bg-[var(--card)] border border-border rounded-xl p-5 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-md font-medium">
                        {position.category}
                      </span>
                      <span className="text-xs text-muted-foreground">{formatDate(position.timestamp)}</span>
                    </div>
                    <h4 className="font-semibold mb-1">{position.marketTitle}</h4>
                    <p className="text-sm text-muted-foreground">
                      Position: <span className="text-purple-400 font-medium">{position.outcome}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg">
                    <Lock className="w-3 h-3 text-purple-400" />
                    <span className="text-xs text-purple-400">Private</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Invested</p>
                    <p className="font-medium">{formatCurrency(position.amount)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Current Value</p>
                    <p className="font-medium">{formatCurrency(position.currentValue)}</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">P&L</p>
                    <div className={`font-medium ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {!hideAmounts && (
                        <div className="flex items-center gap-1">
                          {pnl >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(1)}%</span>
                        </div>
                      )}
                      {hideAmounts && <span>•••••</span>}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Probability</p>
                    <p className="font-medium">{(position.probability * 100).toFixed(1)}%</p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Max Payout</p>
                    <p className="font-medium">{formatCurrency(position.potentialPayout)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {MOCK_POSITIONS.length === 0 && (
        <div className="bg-[var(--card)] border border-border rounded-xl p-12 text-center">
          <Shield className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Positions</h3>
          <p className="text-muted-foreground mb-6">Start trading on prediction markets to see your portfolio here</p>
          <button
            onClick={() => onSelectMarket('1')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            Browse Markets
          </button>
        </div>
      )}
    </div>
  );
}
