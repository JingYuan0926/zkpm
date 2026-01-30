import { useState } from 'react';
import { Layers, DollarSign, TrendingUp, Users, Activity, Plus, Minus, Info, AlertCircle } from 'lucide-react';

export function LPVault() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');

  // Mock LP data
  const vaultStats = {
    totalLiquidity: 2450000,
    yourDeposit: 50000,
    yourShare: 2.04,
    totalFees24h: 4250,
    yourFees24h: 86.7,
    apr: 18.5,
    utilizationRate: 62.5,
    activeMarkets: 12
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Layers className="w-8 h-8 text-purple-400" />
          <h1 className="text-3xl font-semibold">LP Vault</h1>
        </div>
        <p className="text-muted-foreground">
          Provide liquidity to back the vAMM across all joint-outcome markets. Earn fees from every trade.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">Total Vault Liquidity</span>
          </div>
          <p className="text-2xl font-semibold">${(vaultStats.totalLiquidity / 1000000).toFixed(2)}M</p>
          <p className="text-sm text-muted-foreground mt-1">{vaultStats.activeMarkets} active markets</p>
        </div>

        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Your Deposit</span>
          </div>
          <p className="text-2xl font-semibold">${vaultStats.yourDeposit.toLocaleString()}</p>
          <p className="text-sm text-purple-400 mt-1">{vaultStats.yourShare}% of pool</p>
        </div>

        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Estimated APR</span>
          </div>
          <p className="text-2xl font-semibold text-green-400">{vaultStats.apr}%</p>
          <p className="text-sm text-muted-foreground mt-1">Based on 30d fees</p>
        </div>

        <div className="bg-[var(--card)] border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-sm">Your Fees (24h)</span>
          </div>
          <p className="text-2xl font-semibold">${vaultStats.yourFees24h.toFixed(2)}</p>
          <p className="text-sm text-green-400 mt-1">+${(vaultStats.yourFees24h * 7).toFixed(2)} est. weekly</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deposit/Withdraw Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--card)] border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Manage Position</h3>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('deposit')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'deposit'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Plus className="w-4 h-4" />
                Deposit
              </button>
              <button
                onClick={() => setActiveTab('withdraw')}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'withdraw'
                    ? 'bg-purple-500/10 text-purple-400'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                <Minus className="w-4 h-4" />
                Withdraw
              </button>
            </div>

            {activeTab === 'deposit' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deposit Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300">
                      MAX
                    </button>
                  </div>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="text-foreground font-medium">
                      {depositAmount ? `${parseFloat(depositAmount).toFixed(2)} LP shares` : '0 LP shares'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your new pool share</span>
                    <span className="text-foreground font-medium">
                      {depositAmount
                        ? `${(((vaultStats.yourDeposit + parseFloat(depositAmount)) / (vaultStats.totalLiquidity + parseFloat(depositAmount))) * 100).toFixed(2)}%`
                        : `${vaultStats.yourShare}%`}
                    </span>
                  </div>
                </div>

                <button
                  disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground font-semibold rounded-lg transition-colors"
                >
                  Deposit USDC
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Withdraw Amount (USDC)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      max={vaultStats.yourDeposit}
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button
                      onClick={() => setWithdrawAmount(vaultStats.yourDeposit.toString())}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-purple-400 hover:text-purple-300"
                    >
                      MAX
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Available: ${vaultStats.yourDeposit.toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted/50 border border-border rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">You will receive</span>
                    <span className="text-foreground font-medium">
                      {withdrawAmount ? `${parseFloat(withdrawAmount).toFixed(2)} USDC` : '0 USDC'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your new pool share</span>
                    <span className="text-foreground font-medium">
                      {withdrawAmount
                        ? `${Math.max(0, ((vaultStats.yourDeposit - parseFloat(withdrawAmount)) / vaultStats.totalLiquidity) * 100).toFixed(2)}%`
                        : `${vaultStats.yourShare}%`}
                    </span>
                  </div>
                </div>

                <button
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > vaultStats.yourDeposit}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground font-semibold rounded-lg transition-colors"
                >
                  Withdraw USDC
                </button>
              </div>
            )}
          </div>

          {/* How It Works */}
          <div className="mt-6 bg-blue-500/5 border border-blue-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-400 mb-2">How LP Vault Works</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li>• Your USDC backs the vAMM across all markets</li>
                  <li>• Earn fees from every trade (0.2% of volume)</li>
                  <li>• vAMM uses LS-LMSR for efficient pricing</li>
                  <li>• Withdraw anytime (subject to utilization)</li>
                  <li>• Risk: potential impermanent loss on volatile markets</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Performance & Metrics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Chart Placeholder */}
          <div className="bg-[var(--card)] border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Fee Revenue (Last 30 Days)</h3>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <p>Performance chart visualization would go here</p>
            </div>
          </div>

          {/* Market Breakdown */}
          <div className="bg-[var(--card)] border border-border rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Liquidity Distribution</h3>
            <div className="space-y-3">
              {[
                { name: 'Middle East Escalation Cluster', liquidity: 625000, utilization: 78, apy: 22.1 },
                { name: 'US Election 2028 Pools', liquidity: 890000, utilization: 65, apy: 19.3 },
                { name: 'Crypto Price Predictions', liquidity: 485000, utilization: 55, apy: 15.8 },
                { name: 'Climate & Energy Markets', liquidity: 450000, utilization: 48, apy: 12.4 }
              ].map((market, idx) => (
                <div key={idx} className="bg-muted/50 border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{market.name}</h4>
                    <span className="text-sm text-green-400">{market.apy}% APY</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Allocated</p>
                      <p className="text-sm font-medium">${(market.liquidity / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Utilization</p>
                      <p className="text-sm font-medium">{market.utilization}%</p>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                      style={{ width: `${market.utilization}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Warning */}
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-yellow-400 mb-2">Risk Disclosure</h4>
                <p className="text-xs text-muted-foreground">
                  Providing liquidity carries risk. In extreme market movements, the vAMM may accumulate inventory imbalances. 
                  The safety mechanisms (volatility spreads, inventory skewing, vault cap) protect against catastrophic losses, 
                  but LPs should understand they may experience temporary impermanent loss during high volatility periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
