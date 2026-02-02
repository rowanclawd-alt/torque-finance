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
            <Link to="/app" className="text-white">Strategies</Link>
            <a href="#" className="hover:text-white transition">Portfolio</a>
            <a href="https://docs.centrifuge.io" target="_blank" rel="noopener" className="hover:text-white transition">Docs</a>
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
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Active Strategies</div>
              <div className="text-3xl font-bold">{vaults.length}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-xl p-6"
            >
              <div className="text-sm text-gray-500 uppercase tracking-wider mb-1">Avg Boosted APY</div>
              <div className="text-3xl font-bold gradient-text">{avgAPY.toFixed(1)}%</div>
            </motion.div>
          </div>

          {/* Strategies Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Strategies</h1>
            <div className="flex items-center gap-4">
              <select className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent">
                <option>All Chains</option>
                <option>Ethereum</option>
                <option>Base</option>
              </select>
              <select className="bg-surface border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-accent">
                <option>All Assets</option>
                <option>JAAA</option>
                <option>ACRDX</option>
                <option>JTRSY</option>
                <option>SPXA</option>
              </select>
            </div>
          </div>

          {/* Strategy List */}
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
                    {/* Left: Strategy Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent/30 to-amber-600/30 flex items-center justify-center font-bold">
                        {vault.underlying}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold group-hover:text-accent transition">
                          {vault.name}
                        </h3>
                        <p className="text-sm text-gray-500">{vault.strategy}</p>
                        <div className="flex gap-2 mt-2">
                          {vault.protocols.map((protocol, idx) => (
                            <span key={protocol} className="text-xs bg-white/5 px-2 py-0.5 rounded">
                              {vault.protocolLogos[idx]} {protocol}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle: Details */}
                    <div className="hidden lg:flex items-center gap-12">
                      <div>
                        <div className="text-xs text-gray-500 uppercase">Leverage</div>
                        <div className="text-sm font-medium">{vault.leverage}</div>
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
                      <div>
                        <div className="text-xs text-gray-500 uppercase">30d Return</div>
                        <div className="text-sm font-medium text-green-400">+{vault.apy.historical30d}%</div>
                      </div>
                    </div>

                    {/* Right: APY + Action */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-gray-500 uppercase">Boosted APY</div>
                        <div className="text-2xl font-bold gradient-text">{vault.apy.boosted}%</div>
                        <div className="text-xs text-gray-500">Base: {vault.apy.base}%</div>
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
