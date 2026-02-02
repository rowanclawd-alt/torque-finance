import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { motion } from 'framer-motion'
import { vaults, formatTVL } from '../data/vaults'

export default function VaultDetail() {
  const { id } = useParams()
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'deposit' | 'redeem'>('deposit')
  const [amount, setAmount] = useState('')

  const vault = vaults.find(v => v.id === id)

  if (!vault) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vault not found</h1>
          <Link to="/app" className="text-accent hover:underline">← Back to vaults</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold gradient-text">TORQUE</Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400">
            <Link to="/app" className="hover:text-white transition">Vaults</Link>
            <a href="#" className="hover:text-white transition">Portfolio</a>
            <a href="#" className="hover:text-white transition">Docs</a>
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
            Back to Vaults
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Vault Info */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-8"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-2xl">
                      {vault.asset[0]}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold mb-1">{vault.name}</h1>
                      <p className="text-gray-500">{vault.strategy}</p>
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    vault.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                    vault.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {vault.risk} Risk
                  </span>
                </div>

                <p className="text-gray-400 mb-8">{vault.description}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">APY</div>
                    <div className="text-3xl font-bold gradient-text">{vault.apy}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">TVL</div>
                    <div className="text-2xl font-bold">{formatTVL(vault.tvl)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Asset</div>
                    <div className="text-lg font-semibold">{vault.asset}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Chain</div>
                    <div className="text-lg font-semibold">{vault.chain}</div>
                  </div>
                </div>
              </motion.div>

              {/* Protocols Used */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-lg font-semibold mb-4">Protocols Used</h2>
                <div className="flex flex-wrap gap-3">
                  {vault.protocols.map(protocol => (
                    <span key={protocol} className="bg-surface px-4 py-2 rounded-lg text-sm">
                      {protocol}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Strategy Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-8"
              >
                <h2 className="text-lg font-semibold mb-4">Strategy Details</h2>
                <div className="space-y-4 text-gray-400">
                  <p>
                    This vault employs automated strategies to maximize yield while managing risk.
                    The strategy is continuously monitored and rebalanced by Torque's execution engine.
                  </p>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Automated position management</li>
                    <li>Real-time health factor monitoring</li>
                    <li>Gas-optimized rebalancing</li>
                    <li>No lock-up periods</li>
                  </ul>
                </div>
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
                        Balance: 0.00 {activeTab === 'deposit' ? vault.asset : 'shares'}
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
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-accent text-sm font-semibold hover:underline">
                        MAX
                      </button>
                    </div>
                  </div>

                  {/* Info Row */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current APY</span>
                      <span className="gradient-text font-semibold">{vault.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        {activeTab === 'deposit' ? 'You will receive' : 'You will get'}
                      </span>
                      <span className="font-semibold">
                        ~ {amount || '0'} {activeTab === 'deposit' ? 'shares' : vault.asset}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button className="w-full bg-accent hover:bg-amber-400 text-black font-semibold py-4 rounded-xl transition">
                    {activeTab === 'deposit' ? 'Deposit' : 'Redeem'}
                  </button>

                  {/* Your Position */}
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm text-gray-500 uppercase tracking-wider mb-3">Your Position</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Deposited</span>
                        <span className="font-semibold">0.00 {vault.asset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Shares</span>
                        <span className="font-semibold">0.00</span>
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
