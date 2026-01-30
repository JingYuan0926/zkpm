import { BookOpen, Bot, User, TrendingUp, TrendingDown } from 'lucide-react';

interface Order {
  price: number;
  size: number;
  type: 'vamm' | 'user';
  username?: string;
}

interface OrderBookProps {
  contractName: string;
  bids: Order[];
  asks: Order[];
  lastPrice: number;
  change24h: number;
}

export function OrderBook({ contractName, bids, asks, lastPrice, change24h }: OrderBookProps) {
  const maxSize = Math.max(
    ...bids.map(o => o.size),
    ...asks.map(o => o.size)
  );

  const renderOrder = (order: Order, side: 'bid' | 'ask') => {
    const widthPercent = (order.size / maxSize) * 100;
    const isBid = side === 'bid';

    return (
      <div
        key={`${order.price}-${order.size}`}
        className="relative group hover:bg-muted/30 transition-colors"
      >
        {/* Background bar */}
        <div
          className={`absolute inset-y-0 ${isBid ? 'right-0' : 'left-0'} ${
            isBid ? 'bg-green-500/10' : 'bg-red-500/10'
          } transition-all`}
          style={{ width: `${widthPercent}%` }}
        />

        {/* Order row */}
        <div className="relative flex items-center justify-between px-3 py-1.5 text-sm">
          <div className="flex items-center gap-2">
            <span className={`font-mono ${isBid ? 'text-green-400' : 'text-red-400'}`}>
              ${order.price.toFixed(3)}
            </span>
            {order.type === 'vamm' ? (
              <Bot className="w-3 h-3 text-purple-700" />
            ) : (
              <User className="w-3 h-3 text-blue-400" />
            )}
          </div>
          <span className="text-gray-600 font-mono">{order.size.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[var(--card)] border border-gray-200 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-700" />
            <h3 className="font-semibold">Order Book</h3>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-600/10 rounded">
              <Bot className="w-3 h-3 text-purple-700" />
              <span className="text-purple-700">vAMM</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded">
              <User className="w-3 h-3 text-blue-400" />
              <span className="text-blue-400">User</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-600">{contractName}</p>
        </div>
      </div>

      {/* Column Headers */}
      <div className="px-3 py-2 bg-muted/50 flex justify-between text-xs text-gray-600 font-medium">
        <span>Price (USDC)</span>
        <span>Size (Shares)</span>
      </div>

      {/* Order Book */}
      <div className="max-h-[500px] overflow-y-auto">
        {/* Asks (Sell orders - Red) */}
        <div className="border-b border-gray-200">
          {asks.slice().reverse().map((ask, idx) => (
            <div key={idx}>{renderOrder(ask, 'ask')}</div>
          ))}
        </div>

        {/* Spread / Last Price */}
        <div className="px-3 py-3 bg-gray-100 border-y-2 border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold">${lastPrice.toFixed(3)}</span>
              <span className={`text-sm flex items-center gap-1 ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
              </span>
            </div>
            <span className="text-xs text-gray-600">Last Price</span>
          </div>
          {asks.length > 0 && bids.length > 0 && (
            <div className="mt-2 flex justify-between text-xs text-gray-600">
              <span>Spread: ${(asks[0].price - bids[0].price).toFixed(3)}</span>
              <span>{(((asks[0].price - bids[0].price) / lastPrice) * 100).toFixed(2)}%</span>
            </div>
          )}
        </div>

        {/* Bids (Buy orders - Green) */}
        <div>
          {bids.map((bid, idx) => (
            <div key={idx}>{renderOrder(bid, 'bid')}</div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-3 py-2 bg-muted/50 border-t border-gray-200 text-xs text-gray-600">
        <p>vAMM ladder orders update automatically via LS-LMSR pricing</p>
      </div>
    </div>
  );
}
