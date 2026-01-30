import { useState } from 'react';
import { Lock, Shield, AlertCircle, TrendingUp, Info } from 'lucide-react';

interface Outcome {
  name: string;
  probability: number;
  change24h: number;
}

interface TradingPanelProps {
  outcomes: Outcome[];
  marketTitle: string;
}

export function TradingPanel({ outcomes, marketTitle }: TradingPanelProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<number>(0);
  const [amount, setAmount] = useState<string>('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);

  const handleTrade = async () => {
    setIsGeneratingProof(true);
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGeneratingProof(false);
    // Reset form
    setAmount('');
  };

  const calculatePayout = () => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    const probability = outcomes[selectedOutcome].probability;
    return parseFloat(amount) / probability;
  };

  const calculatePotentialProfit = () => {
    const payout = calculatePayout();
    const amountNum = parseFloat(amount) || 0;
    return payout - amountNum;
  };

  return (
    <div className="bg-[var(--card)] border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold">Place Trade</h3>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs rounded-lg">
          <Lock className="w-3 h-3" />
          <span>Zero-Knowledge</span>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-400 font-medium mb-1">Private Trading</p>
            <p className="text-xs text-muted-foreground">
              Your position, identity, and strategy remain completely private. Only aggregated market prices are public.
            </p>
          </div>
        </div>
      </div>

      {/* Outcome Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Select Outcome
        </label>
        <div className="space-y-2">
          {outcomes.map((outcome, index) => (
            <button
              key={index}
              onClick={() => setSelectedOutcome(index)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                selectedOutcome === index
                  ? 'bg-purple-500/10 border-purple-500 text-purple-400'
                  : 'bg-muted/50 border-border text-gray-300 hover:border-gray-700'
              }`}
            >
              <span className="font-medium">{outcome.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm">
                  {(outcome.probability * 100).toFixed(1)}%
                </span>
                <span
                  className={`text-xs flex items-center gap-1 ${
                    outcome.change24h > 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <TrendingUp className={`w-3 h-3 ${outcome.change24h < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(outcome.change24h).toFixed(1)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Amount (USDC)
        </label>
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              onClick={() => setAmount('100')}
              className="px-2 py-1 bg-muted hover:bg-gray-700 text-xs rounded transition-colors"
            >
              100
            </button>
            <button
              onClick={() => setAmount('500')}
              className="px-2 py-1 bg-muted hover:bg-gray-700 text-xs rounded transition-colors"
            >
              500
            </button>
            <button
              onClick={() => setAmount('1000')}
              className="px-2 py-1 bg-muted hover:bg-gray-700 text-xs rounded transition-colors"
            >
              1K
            </button>
          </div>
        </div>
      </div>

      {/* Trade Summary */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Potential Payout</span>
            <span className="text-foreground font-medium">
              {calculatePayout().toFixed(2)} USDC
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Potential Profit</span>
            <span className={`font-medium ${calculatePotentialProfit() > 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
              +{calculatePotentialProfit().toFixed(2)} USDC
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Implied Probability</span>
            <span className="text-foreground font-medium">
              {(outcomes[selectedOutcome].probability * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* ZK Proof Status */}
      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">ZK Proof Generation</p>
              <p className="text-xs text-muted-foreground">
                {isGeneratingProof ? 'Generating proof...' : 'Ready to verify privately'}
              </p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${isGeneratingProof ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
        </div>
      </div>

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={!amount || parseFloat(amount) <= 0 || isGeneratingProof}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground font-semibold rounded-lg transition-colors"
      >
        {isGeneratingProof ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating ZK Proof...
          </span>
        ) : (
          'Place Anonymous Trade'
        )}
      </button>

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Your trade will be executed using zero-knowledge proofs. No one can see your position, not even the protocol operators.
        </p>
      </div>
    </div>
  );
}
