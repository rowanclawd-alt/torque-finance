import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { vaults, formatTVL, totalTVL, avgAPY } from '../data/vaults'

export default function AppPage() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold gradient-text">TORQUE</Link>
          <div className="hidden md:flex items-center gap-8 text-gray-400">
            <Link to="/app" className="text-white">Vaults</Link>
            <a href="#" className="hover:text-white transition">Portfolio</a>
            <a href="#" className="hover:text-white transition">Docs</a>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Total Value Locked</div>
              <div className="text-3xl font-bold">{formatTVL(totalTVL)}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Active Vaults</div>
              <div className="text-3xl font-bold">{vaults.length}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Average APY</div>
              <div className="text-3xl font-bold gradient-text">{avgAPY.toFixed(1)}%</div>
            </motion.div>
          </div>

          {/* Vaults Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Vaults</h1>
            <div className="flex items-center gap-4">
              <select className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent">
                <option>All Chains</option>
                <option>Ethereum</option>
                <option>Base</option>
                <option>Arbitrum</option>
              </select>
              <select className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent">
                <option>All Assets</option>
                <option>USDC</option>
                <option>ETH</option>
              </select>
            </div>
          </div>

          {/* Vault List */}
          <div className="space-y-4">
            {vaults.map((vault, i) => (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/app/vault/${vault.id}`}
                  className="block glass rounded-xl p-6 hover:border-accent/50 transition group"
                >
                  <div className="flex items-center justify-between">
                    {/* Left: Vault Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
                        {vault.asset[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-accent transition">
                          {vault.name}
                        </h3>
                        <p className="text-sm text-gray-500">{vault.strategy}</p>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="hidden md:flex items-center gap-12">
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Chain</div>
                        <div className="text-sm font-medium">{vault.chain}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Risk</div>
                        <span className={`text-sm font-medium ${
                          vault.risk === 'Low' ? 'text-green-400' :
                          vault.risk === 'Medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {vault.risk}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase">TVL</div>
                        <div className="text-sm font-medium">{formatTVL(vault.tvl)}</div>
                      </div>
                    </div>

                    {/* Right: APY + Action */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase">APY</div>
                        <div className="text-2xl font-bold gradient-text">{vault.apy}%</div>
                      </div>
                      <button className="bg-accent hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg transition">
                        Deposit
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
