import { TrendingUp, TrendingDown, Users, Droplet, ExternalLink, Lock } from 'lucide-react';

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
}

interface MarketCardProps {
  market: Market;
  onClick: () => void;
}

export function MarketCard({ market, onClick }: MarketCardProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    }
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days left`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months left`;
    } else {
      return `${Math.floor(diffDays / 365)} years left`;
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-[var(--card)] border border-border rounded-xl p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-md font-medium">
              {market.category}
            </span>
            <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-md flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Joint-Outcome
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-400 transition-colors mb-1">
            {market.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{market.description}</p>
        </div>
        <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-purple-400 transition-colors ml-4 flex-shrink-0" />
      </div>

      {/* Outcomes - Top 3 World States */}
      <div className="space-y-2 mb-4">
        <p className="text-xs text-muted-foreground mb-2">Top World States (2^N corners):</p>
        {market.outcomes.map((outcome, index) => (
          <div key={index} className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-gray-300 font-mono">{outcome.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {(outcome.probability * 100).toFixed(1)}%
                </span>
                <span
                  className={`text-xs flex items-center gap-0.5 ${
                    outcome.change24h > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {outcome.change24h > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(outcome.change24h).toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${outcome.probability * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Correlated Events */}
      {market.correlatedEvents && market.correlatedEvents.length > 0 && (
        <div className="mb-4 pb-4 border-b border-border">
          <p className="text-xs text-muted-foreground mb-2">Correlated Events:</p>
          <div className="flex flex-wrap gap-1">
            {market.correlatedEvents.map((event, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded border border-blue-500/20"
              >
                {event}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <Droplet className="w-3 h-3" />
            <span>Liquidity</span>
          </div>
          <p className="text-sm font-medium text-foreground">{formatCurrency(market.totalLiquidity)}</p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <TrendingUp className="w-3 h-3" />
            <span>24h Vol</span>
          </div>
          <p className="text-sm font-medium text-foreground">{formatCurrency(market.volume24h)}</p>
        </div>

        <div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-1">
            <Users className="w-3 h-3" />
            <span>Traders</span>
          </div>
          <p className="text-sm font-medium text-foreground">{market.traders.toLocaleString()}</p>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Deadline</p>
          <p className="text-sm font-medium text-foreground">{formatDeadline(market.deadline)}</p>
        </div>
      </div>
    </div>
  );
}