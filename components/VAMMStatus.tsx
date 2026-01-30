import { Bot, AlertTriangle, Activity, TrendingUp, Package } from 'lucide-react';

interface VAMMStatusProps {
  liquidityParameter: number;
  totalVolume: number;
  inventorySkew: {
    outcome: string;
    position: number;
    targetPosition: number;
  }[];
  volatilitySpread: {
    active: boolean;
    baseSpread: number;
    currentSpread: number;
    reason?: string;
  };
  vaultBalance: number;
  vaultCap: number;
}

export function VAMMStatus({
  liquidityParameter,
  totalVolume,
  inventorySkew,
  volatilitySpread,
  vaultBalance,
  vaultCap
}: VAMMStatusProps) {
  const utilizationPercent = (vaultBalance / vaultCap) * 100;

  return (
    <div className="bg-[var(--card)] border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Bot className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold">Active vAMM Status</h3>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Core Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <Activity className="w-4 h-4" />
            <span>Liquidity Parameter (b)</span>
          </div>
          <p className="text-2xl font-semibold">{liquidityParameter.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">LS-LMSR depth</p>
        </div>

        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Total Volume</span>
          </div>
          <p className="text-2xl font-semibold">${(totalVolume / 1000).toFixed(0)}K</p>
          <p className="text-xs text-muted-foreground mt-1">b = α × Volume</p>
        </div>
      </div>

      {/* Volatility Spread */}
      <div className={`p-4 rounded-lg border mb-6 ${
        volatilitySpread.active
          ? 'bg-yellow-500/5 border-yellow-500/30'
          : 'bg-muted/50 border-border'
      }`}>
        <div className="flex items-start gap-3">
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            volatilitySpread.active ? 'text-yellow-400' : 'text-muted-foreground'
          }`} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h4 className={`text-sm font-semibold ${
                volatilitySpread.active ? 'text-yellow-400' : 'text-gray-300'
              }`}>
                Volatility Expansion Spread
              </h4>
              <span className={`px-2 py-0.5 text-xs rounded ${
                volatilitySpread.active
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-muted text-muted-foreground'
              }`}>
                {volatilitySpread.active ? 'ACTIVE' : 'Inactive'}
              </span>
            </div>
            
            {volatilitySpread.active && (
              <p className="text-xs text-yellow-400 mb-3">{volatilitySpread.reason}</p>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Base Spread</p>
                <p className="font-medium">{(volatilitySpread.baseSpread * 100).toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Current Spread</p>
                <p className={`font-medium ${
                  volatilitySpread.active ? 'text-yellow-400' : ''
                }`}>
                  {(volatilitySpread.currentSpread * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Skewing */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Inventory Skewing
        </h4>
        <div className="space-y-2">
          {inventorySkew.map((item, idx) => {
            const skewPercent = ((item.position - item.targetPosition) / item.targetPosition) * 100;
            const isOverweight = skewPercent > 10;
            const isUnderweight = skewPercent < -10;
            
            return (
              <div key={idx} className="bg-muted/50 border border-border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{item.outcome}</span>
                  <span className={`text-xs ${
                    isOverweight
                      ? 'text-red-400'
                      : isUnderweight
                      ? 'text-green-400'
                      : 'text-muted-foreground'
                  }`}>
                    {skewPercent > 0 ? '+' : ''}{skewPercent.toFixed(1)}%
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Position: {item.position.toLocaleString()}</span>
                    <span>Target: {item.targetPosition.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverweight
                          ? 'bg-gradient-to-r from-red-500 to-orange-500'
                          : isUnderweight
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min((Math.abs(item.position) / Math.max(Math.abs(item.position), Math.abs(item.targetPosition))) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vault Status */}
      <div className="bg-muted/50 border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-300">LP Vault Utilization</h4>
          <span className="text-sm font-semibold">{utilizationPercent.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
          <div
            className={`h-full rounded-full transition-all ${
              utilizationPercent > 90
                ? 'bg-gradient-to-r from-red-500 to-orange-500'
                : utilizationPercent > 70
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500'
                : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }`}
            style={{ width: `${utilizationPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Available: ${vaultBalance.toLocaleString()}</span>
          <span>Cap: ${vaultCap.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
