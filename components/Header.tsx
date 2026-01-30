import { Shield, Wallet, Settings, Layers } from 'lucide-react';

interface HeaderProps {
    activeView: 'markets' | 'portfolio' | 'vault';
    onNavigate: (view: 'markets' | 'portfolio' | 'vault') => void;
}

export function Header({ activeView, onNavigate }: HeaderProps) {
    return (
        <header className="border-b border-gray-200 bg-white">
            <div className="max-w-[1800px] mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('markets')}>
                            <Shield className="w-7 h-7 text-purple-600" />
                            <div>
                                <h1 className="text-xl font-semibold text-black">Aleo Markets</h1>
                                <p className="text-xs text-black/60 font-medium">Zero-Knowledge Prediction Markets</p>
                            </div>
                        </div>

                        <nav className="flex gap-1">
                            <button
                                onClick={() => onNavigate('markets')}
                                className={`px-4 py-2 rounded-lg transition-colors font-medium ${activeView === 'markets'
                                    ? 'bg-purple-600/10 text-purple-700'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                    }`}
                            >
                                Markets
                            </button>
                            <button
                                onClick={() => onNavigate('portfolio')}
                                className={`px-4 py-2 rounded-lg transition-colors font-medium ${activeView === 'portfolio'
                                    ? 'bg-purple-600/10 text-purple-700'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                    }`}
                            >
                                Portfolio
                            </button>
                            <button
                                onClick={() => onNavigate('vault')}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${activeView === 'vault'
                                    ? 'bg-purple-600/10 text-purple-700'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                                    }`}
                            >
                                <Layers className="w-4 h-4" />
                                LP Vault
                            </button>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-700 font-medium">Aleo Mainnet</span>
                        </div>

                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
                            <Wallet className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium text-white">Connect Wallet</span>
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Settings className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
