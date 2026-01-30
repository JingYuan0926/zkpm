import { Target, Layers, Box } from 'lucide-react';

export type ContractType = 'marginal' | 'slice' | 'corner';

interface ContractOption {
  type: ContractType;
  name: string;
  description: string;
  formula: string;
  example: string;
  icon: React.ReactNode;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  color: string;
}

interface ContractSelectorProps {
  selected: ContractType;
  onChange: (type: ContractType) => void;
  events: Array<{ id: string; name: string }>;
}

export function ContractSelector({ selected, onChange, events }: ContractSelectorProps) {
  const contracts: ContractOption[] = [
    {
      type: 'marginal',
      name: 'Marginal (Single Event)',
      description: 'Bet on one event regardless of others',
      formula: `P(${events[0]?.name || 'A'}=Yes) = sum of all worlds where ${events[0]?.name || 'A'}=1`,
      example: `{100, 101, 110, 111}`,
      icon: <Target className="w-5 h-5" />,
      difficulty: 'Easy',
      color: 'green'
    },
    {
      type: 'slice',
      name: 'Slice (Partial Multi-Event)',
      description: 'Bet on 2+ events, ignore the rest',
      formula: `P(${events[0]?.name || 'A'}=Yes AND ${events[1]?.name || 'B'}=Yes) regardless of ${events[2]?.name || 'C'}`,
      example: `{110, 111}`,
      icon: <Layers className="w-5 h-5" />,
      difficulty: 'Medium',
      color: 'blue'
    },
    {
      type: 'corner',
      name: 'Corner (Exact Scenario)',
      description: 'Bet on exact combination of all events',
      formula: `Exact world state (e.g., ${events[0]?.name || 'A'}=Yes, ${events[1]?.name || 'B'}=Yes, ${events[2]?.name || 'C'}=No)`,
      example: `{110} only`,
      icon: <Box className="w-5 h-5" />,
      difficulty: 'Hard',
      color: 'purple'
    }
  ];

  const colorMap: Record<string, string> = {
    green: 'border-green-500 bg-green-500/10 text-green-400',
    blue: 'border-blue-500 bg-blue-500/10 text-blue-400',
    purple: 'border-purple-500 bg-purple-600/10 text-purple-700',
  };

  const colorMapInactive: Record<string, string> = {
    green: 'border-gray-200 hover:border-green-500/50',
    blue: 'border-gray-200 hover:border-blue-500/50',
    purple: 'border-gray-200 hover:border-purple-500/50',
  };

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-2">Contract Type</h3>
        <p className="text-xs text-gray-600">Choose how you want to bet on this joint-outcome market</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {contracts.map((contract) => {
          const isSelected = selected === contract.type;
          
          return (
            <button
              key={contract.type}
              onClick={() => onChange(contract.type)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? colorMap[contract.color]
                  : `bg-gray-100/30 ${colorMapInactive[contract.color]}`
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isSelected ? 'bg-muted/50' : 'bg-muted'}`}>
                  {contract.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold ${isSelected ? '' : 'text-foreground'}`}>
                      {contract.name}
                    </h4>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      contract.difficulty === 'Easy'
                        ? 'bg-green-500/20 text-green-400'
                        : contract.difficulty === 'Medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {contract.difficulty}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${isSelected ? 'text-gray-800' : 'text-gray-600'}`}>
                    {contract.description}
                  </p>
                  
                  {isSelected && (
                    <div className="space-y-1 mt-3 pt-3 border-t border-gray-700">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Formula:</p>
                        <p className="text-xs font-mono text-gray-800">{contract.formula}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Includes worlds:</p>
                        <p className="text-xs font-mono text-purple-700">{contract.example}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Payout Info */}
      <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
        <p className="text-xs text-blue-400">
          <strong>All contracts pay $1 per share</strong> if the condition is met. More specific bets cost less per share, giving you more shares (and higher payout) if correct.
        </p>
      </div>
    </div>
  );
}
