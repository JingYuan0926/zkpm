import { useState } from 'react';
import { Lock, Shield, AlertCircle, Info, CheckCircle2, Code } from 'lucide-react';
import { ContractType } from './ContractSelector';

interface WorldState {
  id: string;
  bits: string;
  events: { A: boolean; B: boolean; C: boolean };
  probability: number;
  price: number;
}

interface AdvancedTradingPanelProps {
  contractType: ContractType;
  events: Array<{ id: string; name: string }>;
  worlds: WorldState[];
  marginals: { A: number; B: number; C: number };
}

export function AdvancedTradingPanel({
  contractType,
  events,
  worlds,
  marginals
}: AdvancedTradingPanelProps) {
  const [amount, setAmount] = useState<string>('');
  const [selectedOutcomes, setSelectedOutcomes] = useState<{ A: boolean | null; B: boolean | null; C: boolean | null }>({
    A: null,
    B: null,
    C: null
  });
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  const [proofGenerated, setProofGenerated] = useState(false);

  const handleTrade = async () => {
    setIsGeneratingProof(true);
    setProofGenerated(false);
    // Simulate ZK proof generation
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsGeneratingProof(false);
    setProofGenerated(true);
    // Reset after showing success
    setTimeout(() => {
      setProofGenerated(false);
      setAmount('');
    }, 2000);
  };

  // Calculate price based on contract type and selections
  const calculatePrice = (): number => {
    if (contractType === 'marginal') {
      // Price of single event regardless of others
      if (selectedOutcomes.A !== null) {
        return selectedOutcomes.A ? marginals.A : (1 - marginals.A);
      }
      return marginals.A; // default to A=Yes
    } else if (contractType === 'slice') {
      // Price of 2 events regardless of the third
      const matchingWorlds = worlds.filter(w => {
        if (selectedOutcomes.A !== null && w.events.A !== selectedOutcomes.A) return false;
        if (selectedOutcomes.B !== null && w.events.B !== selectedOutcomes.B) return false;
        // Ignore C for this example
        return true;
      });
      return matchingWorlds.reduce((sum, w) => sum + w.probability, 0);
    } else {
      // Corner - exact world
      const exactWorld = worlds.find(w =>
        (selectedOutcomes.A === null || w.events.A === selectedOutcomes.A) &&
        (selectedOutcomes.B === null || w.events.B === selectedOutcomes.B) &&
        (selectedOutcomes.C === null || w.events.C === selectedOutcomes.C)
      );
      return exactWorld?.probability || 0.5;
    }
  };

  const price = calculatePrice();
  const shares = amount && parseFloat(amount) > 0 ? parseFloat(amount) / price : 0;
  const potentialPayout = shares * 1; // $1 per share
  const potentialProfit = potentialPayout - (parseFloat(amount) || 0);

  // Get affected worlds
  const getAffectedWorlds = (): string[] => {
    if (contractType === 'marginal' && selectedOutcomes.A !== null) {
      return worlds
        .filter(w => w.events.A === selectedOutcomes.A)
        .map(w => w.bits);
    } else if (contractType === 'slice') {
      return worlds
        .filter(w => {
          if (selectedOutcomes.A !== null && w.events.A !== selectedOutcomes.A) return false;
          if (selectedOutcomes.B !== null && w.events.B !== selectedOutcomes.B) return false;
          return true;
        })
        .map(w => w.bits);
    } else if (contractType === 'corner') {
      return worlds
        .filter(w =>
          (selectedOutcomes.A === null || w.events.A === selectedOutcomes.A) &&
          (selectedOutcomes.B === null || w.events.B === selectedOutcomes.B) &&
          (selectedOutcomes.C === null || w.events.C === selectedOutcomes.C)
        )
        .map(w => w.bits);
    }
    return [];
  };

  const affectedWorlds = getAffectedWorlds();

  return (
    <div className="bg-[var(--card)] border border-border rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold">Place Trade</h3>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 text-xs rounded-lg">
          <Lock className="w-3 h-3" />
          <span>ZK Private</span>
        </div>
      </div>

      {/* Outcome Selection based on Contract Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {contractType === 'marginal' && 'Select Event (Others Ignored)'}
          {contractType === 'slice' && 'Select 2 Events (Third Ignored)'}
          {contractType === 'corner' && 'Select Exact Scenario (All 3)'}
        </label>
        
        <div className="space-y-2">
          {events.map((event, idx) => {
            const key = event.id as 'A' | 'B' | 'C';
            const isDisabled = contractType === 'marginal' && idx > 0;
            const isOptional = contractType === 'slice' && idx === 2;
            
            return (
              <div key={event.id} className={isDisabled ? 'opacity-30' : ''}>
                <p className="text-xs text-muted-foreground mb-1">
                  {event.id}: {event.name}
                  {isOptional && <span className="ml-1 text-yellow-400">(Ignored for slice)</span>}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={isDisabled}
                    onClick={() => setSelectedOutcomes(prev => ({ ...prev, [key]: true }))}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-all text-sm ${
                      selectedOutcomes[key] === true
                        ? 'bg-green-500/10 border-green-500 text-green-400'
                        : 'bg-muted/50 border-border text-gray-300 hover:border-gray-700'
                    } ${isDisabled ? 'cursor-not-allowed' : ''}`}
                  >
                    Yes
                  </button>
                  <button
                    disabled={isDisabled}
                    onClick={() => setSelectedOutcomes(prev => ({ ...prev, [key]: false }))}
                    className={`flex-1 px-3 py-2 rounded-lg border transition-all text-sm ${
                      selectedOutcomes[key] === false
                        ? 'bg-red-500/10 border-red-500 text-red-400'
                        : 'bg-muted/50 border-border text-gray-300 hover:border-gray-700'
                    } ${isDisabled ? 'cursor-not-allowed' : ''}`}
                  >
                    No
                  </button>
                  {!isDisabled && !isOptional && (
                    <button
                      onClick={() => setSelectedOutcomes(prev => ({ ...prev, [key]: null }))}
                      className="px-3 py-2 rounded-lg border border-border text-muted-foreground hover:border-gray-700 text-sm"
                    >
                      Any
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Affected Worlds Display */}
      {affectedWorlds.length > 0 && (
        <div className="mb-6 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
          <div className="flex items-start gap-2">
            <Code className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-blue-400 font-medium mb-1">Basket Trade (Corner-Space)</p>
              <p className="text-xs text-muted-foreground">
                Buying worlds: <span className="font-mono text-blue-400">{affectedWorlds.join(', ')}</span>
              </p>
            </div>
          </div>
        </div>
      )}

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
          </div>
        </div>
      </div>

      {/* Trade Summary */}
      {amount && parseFloat(amount) > 0 && (
        <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Contract Price</span>
            <span className="text-foreground font-medium">${price.toFixed(4)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shares Received</span>
            <span className="text-foreground font-medium">{shares.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Potential Payout ($1/share)</span>
            <span className="text-foreground font-medium">${potentialPayout.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-700">
            <span className="text-muted-foreground">Potential Profit</span>
            <span className={`font-medium ${potentialProfit > 0 ? 'text-green-400' : 'text-muted-foreground'}`}>
              +${potentialProfit.toFixed(2)} ({((potentialProfit / parseFloat(amount)) * 100).toFixed(1)}%)
            </span>
          </div>
        </div>
      )}

      {/* Aleo ZK Proof Generation */}
      <div className={`mb-6 p-4 rounded-lg border transition-all ${
        proofGenerated
          ? 'bg-green-500/5 border-green-500/30'
          : isGeneratingProof
          ? 'bg-yellow-500/5 border-yellow-500/30'
          : 'bg-muted/50 border-border'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              proofGenerated
                ? 'bg-green-500/10'
                : isGeneratingProof
                ? 'bg-yellow-500/10'
                : 'bg-purple-500/10'
            }`}>
              {proofGenerated ? (
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              ) : (
                <Lock className="w-4 h-4 text-purple-400" />
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${
                proofGenerated ? 'text-green-400' : 'text-foreground'
              }`}>
                {proofGenerated ? 'ZK Proof Generated' : 'Aleo zk-SNARK Proof'}
              </p>
              <p className="text-xs text-muted-foreground">
                {isGeneratingProof
                  ? 'Generating proof in Leo...'
                  : proofGenerated
                  ? 'Trade executed privately'
                  : 'Ready to prove & execute'}
              </p>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${
            proofGenerated
              ? 'bg-green-500'
              : isGeneratingProof
              ? 'bg-yellow-500 animate-pulse'
              : 'bg-purple-500'
          }`} />
        </div>
      </div>

      {/* Trade Button */}
      <button
        onClick={handleTrade}
        disabled={!amount || parseFloat(amount) <= 0 || isGeneratingProof || proofGenerated}
        className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed text-foreground font-semibold rounded-lg transition-colors"
      >
        {isGeneratingProof ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Generating ZK Proof...
          </span>
        ) : proofGenerated ? (
          'Trade Executed ✓'
        ) : (
          'Generate Proof & Execute'
        )}
      </button>

      {/* Privacy Disclaimer */}
      <div className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <p>
          Your trade executes privately on Aleo. Position, identity, and strategy remain hidden. 
          Only aggregated world probabilities update publicly.
        </p>
      </div>
    </div>
  );
}
