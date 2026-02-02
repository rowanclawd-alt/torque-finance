import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { motion, AnimatePresence } from 'framer-motion'
import { vaults, formatTVL } from '../data/vaults'

export default function VaultDetail() {
  const { id } = useParams()
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'deposit' | 'redeem'>('deposit')
  const [amount, setAmount] = useState('')
  const [showSignature, setShowSignature] = useState(false)
  const [isSigning, setIsSigning] = useState(false)

  const vault = vaults.find(v => v.id === id)

  const handleAction = () => {
    setShowSignature(true)
  }

  const handleSign = () => {
    setIsSigning(true)
    setTimeout(() => {
      setIsSigning(false)
      setShowSignature(false)
      setAmount('')
    }, 2000)
  }

  if (!vault) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Strategy not found</h1>
          <Link to="/app" className="text-accent hover:underline">← Back to strategies</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Signature Modal */}
      <AnimatePresence>
        {showSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => !isSigning && setShowSignature(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                {isSigning ? 'Awaiting Signature...' : 'Confirm Transaction'}
              </h3>
              
              {isSigning ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Please sign in your wallet</p>
                </div>
              ) : (
                <>
                  <div className="bg-surface rounded-xl p-4 mb-6 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Action</span>
                      <span className="font-medium capitalize">{activeTab}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Amount</span>
                      <span className="font-medium">{amount || '0'} {vault.underlying}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Strategy</span>
                      <span className="font-medium">{vault.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected APY</span>
                      <span className="font-medium gradient-text">{vault.apy.boosted}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowSignature(false)}
                      className="flex-1 py-3 rounded-xl border border-white/20 hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSign}
                      className="flex-1 py-3 rounded-xl bg-accent hover:bg-amber-400 text-black font-semibold transition"
                    >
                      Sign & {activeTab === 'deposit' ? 'Deposit' : 'Redeem'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 w-full z-40 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold gradient-text">TORQUE</Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400">
            <Link to="/app" className="hover:text-white transition">Strategies</Link>
            <a href="#" className="hover:text-white transition">Portfolio</a>
            <a href="https://docs.centrifuge.io" target="_blank" rel="noopener" className="hover:text-white transition">Docs</a>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link to="/app" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Strategies
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Strategy Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent/30 to-amber-600/30 flex items-center justify-center font-bold text-xl">
                      {vault.underlying}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">{vault.name}</h1>
                      <p className="text-gray-500">{vault.underlyingName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm bg-accent/20 text-accent px-3 py-1 rounded-full font-medium">
                      {vault.leverage}
                    </span>
                    <span className={`text-sm px-3 py-1 rounded-full ${
                      vault.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                      vault.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {vault.risk} Risk
                    </span>
                  </div>
                </div>

                <p className="text-gray-400 mb-8">{vault.description}</p>

                {/* APY Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Base APY</div>
                    <div className="text-2xl font-bold">{vault.apy.base}%</div>
                  </div>
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Boosted APY</div>
                    <div className="text-2xl font-bold gradient-text">{vault.apy.boosted}%</div>
                  </div>
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">30d Historical</div>
                    <div className="text-2xl font-bold text-green-400">{vault.apy.historical30d}%</div>
                  </div>
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Forecast</div>
                    <div className="text-2xl font-bold text-blue-400">{vault.apy.forecast}%</div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">TVL</div>
                    <div className="text-xl font-semibold">{formatTVL(vault.tvl)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Asset</div>
                    <div className="text-xl font-semibold">{vault.underlying}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Chain</div>
                    <div className="text-xl font-semibold">{vault.chain}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Symbol</div>
                    <div className="text-xl font-semibold">{vault.symbol}</div>
                  </div>
                </div>
              </motion.div>

              {/* Strategy Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-lg font-semibold mb-4">Strategy Mechanics</h2>
                <p className="text-gray-400 mb-6">{vault.strategyDetail}</p>
                
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Protocols Used</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {vault.protocols.map((protocol, idx) => (
                    <span key={protocol} className="bg-surface px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                      <span className="text-lg">{vault.protocolLogos[idx]}</span>
                      {protocol}
                    </span>
                  ))}
                </div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">How It Works</h3>
                <ol className="list-decimal list-inside space-y-2 text-gray-400">
                  <li>Deposit {vault.underlying} into the Torque vault</li>
                  <li>Vault deposits as collateral on {vault.protocols[1]}</li>
                  <li>Borrows stablecoin against collateral</li>
                  <li>Swaps borrowed funds for more {vault.underlying}</li>
                  <li>Repeats to achieve {vault.leverage} leverage</li>
                  <li>Continuously monitors and rebalances positions</li>
                </ol>
              </motion.div>

              {/* Backtesting */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-lg font-semibold mb-4">Backtesting Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Period</div>
                    <div className="text-lg font-semibold">{vault.backtesting.period}</div>
                  </div>
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Total Return</div>
                    <div className="text-lg font-semibold text-green-400">+{vault.backtesting.return}%</div>
                  </div>
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Max Drawdown</div>
                    <div className="text-lg font-semibold text-red-400">{vault.backtesting.maxDrawdown}%</div>
                  </div>
                  <div className="bg-surface rounded-xl p-4">
                    <div className="text-sm text-gray-500 mb-1">Sharpe Ratio</div>
                    <div className="text-lg font-semibold">{vault.backtesting.sharpe}</div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 mt-4">
                  *Backtesting results are simulated and do not guarantee future performance
                </p>
              </motion.div>
            </div>

            {/* Deposit/Redeem Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 h-fit sticky top-24"
            >
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('deposit')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    activeTab === 'deposit' 
                      ? 'bg-accent text-black' 
                      : 'bg-surface text-gray-400 hover:text-white'
                  }`}
                >
                  Deposit
                </button>
                <button
                  onClick={() => setActiveTab('redeem')}
                  className={`flex-1 py-3 rounded-lg font-semibold transition ${
                    activeTab === 'redeem' 
                      ? 'bg-accent text-black' 
                      : 'bg-surface text-gray-400 hover:text-white'
                  }`}
                >
                  Redeem
                </button>
              </div>

              {!isConnected ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Connect your wallet to {activeTab}</p>
                  <ConnectButton />
                </div>
              ) : (
                <>
                  {/* Amount Input */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">
                        {activeTab === 'deposit' ? 'Deposit Amount' : 'Redeem Amount'}
                      </span>
                      <span className="text-gray-400">
                        Balance: 0.00 {activeTab === 'deposit' ? vault.underlying : vault.symbol}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-surface border border-white/10 rounded-xl px-4 py-4 text-xl font-semibold focus:outline-none focus:border-accent"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <span className="text-gray-500 text-sm">{activeTab === 'deposit' ? vault.underlying : vault.symbol}</span>
                        <button className="text-accent text-sm font-semibold hover:underline">
                          MAX
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Boosted APY</span>
                      <span className="gradient-text font-semibold">{vault.apy.boosted}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Leverage</span>
                      <span className="font-semibold">{vault.leverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {activeTab === 'deposit' ? 'You will receive' : 'You will get'}
                      </span>
                      <span className="font-semibold">
                        ~ {amount || '0'} {activeTab === 'deposit' ? vault.symbol : vault.underlying}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    onClick={handleAction}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="w-full bg-accent hover:bg-amber-400 text-black font-semibold py-4 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {activeTab === 'deposit' ? 'Deposit' : 'Redeem'}
                  </button>

                  {/* Your Position */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Your Position</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deposited</span>
                        <span className="font-semibold">0.00 {vault.underlying}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shares</span>
                        <span className="font-semibold">0.00 {vault.symbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Current Value</span>
                        <span className="font-semibold">$0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Earnings</span>
                        <span className="font-semibold text-green-400">+$0.00</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
