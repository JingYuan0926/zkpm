import { Box, Info } from 'lucide-react';
import { useState } from 'react';

interface WorldState {
  id: string;
  bits: string;
  events: { A: boolean; B: boolean; C: boolean };
  probability: number;
  price: number;
}

interface WorldTableProps {
  events: Array<{ id: string; name: string }>;
  worlds: WorldState[];
}

export function WorldTable({ events, worlds }: WorldTableProps) {
  const [hoveredWorld, setHoveredWorld] = useState<string | null>(null);

  const getWorldLabel = (world: WorldState) => {
    const labels = [];
    if (world.events.A) labels.push(events[0]?.name || 'A');
    if (world.events.B) labels.push(events[1]?.name || 'B');
    if (world.events.C) labels.push(events[2]?.name || 'C');
    return labels.length > 0 ? labels.join(' + ') : 'None';
  };

  // Sort by probability descending
  const sortedWorlds = [...worlds].sort((a, b) => b.probability - a.probability);

  return (
    <div className="bg-[var(--card)] border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Box className="w-5 h-5 text-purple-700" />
          <h3 className="text-lg font-semibold">World Table</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 text-xs rounded-lg">
          <Info className="w-3 h-3" />
          <span>Single Source of Truth</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        All 8 possible world states for this joint-outcome market. Marginal and slice prices are derived from these corners.
      </p>

      {/* World Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {sortedWorlds.map((world) => (
          <div
            key={world.id}
            onMouseEnter={() => setHoveredWorld(world.id)}
            onMouseLeave={() => setHoveredWorld(null)}
            className={`bg-muted/50 border rounded-lg p-4 transition-all cursor-pointer ${hoveredWorld === world.id
              ? 'border-purple-500 bg-purple-500/5'
              : 'border-gray-200 hover:border-gray-700'
              }`}
          >
            <div className="flex items-center gap-1 mb-3">
              <span className="text-sm font-semibold text-purple-700">Outcome {world.id}</span>
            </div>

            {/* Event labels */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 mb-1">Scenario:</p>
              <p className="text-sm font-medium line-clamp-2">{getWorldLabel(world)}</p>
            </div>

            {/* Probability bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">Probability</span>
                <span className="text-foreground font-medium">{(world.probability * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                  style={{ width: `${world.probability * 100}%` }}
                />
              </div>
            </div>

            {/* Price */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Corner Price</span>
                <span className="text-sm font-semibold">${world.price.toFixed(3)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Probability Sum Check */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Probability (must equal 1.0)</span>
          <span className="text-lg font-semibold text-green-400">
            {worlds.reduce((sum, w) => sum + w.probability, 0).toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
