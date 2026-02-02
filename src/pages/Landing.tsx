import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { vaults, formatTVL, totalTVL, avgAPY } from '../data/vaults'

export default function Landing() {
  return (
    <div className="min-h-screen bg-primary">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold gradient-text">TORQUE</div>
          <div className="hidden md:flex items-center gap-8 text-gray-400">
            <a href="#about" className="hover:text-white transition">About</a>
            <a href="#vaults" className="hover:text-white transition">Vaults</a>
            <a href="https://docs.centrifuge.io" target="_blank" rel="noopener" className="hover:text-white transition">Docs</a>
          </div>
          <Link 
            to="/app"
            className="bg-accent hover:bg-amber-400 text-black font-semibold px-6 py-2.5 rounded-lg transition"
          >
            Open App
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6">
              <span className="gradient-text">TORQUE</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-300 mb-4">
              Force Multiplier for Yield
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              Automated DeFi strategies for Centrifuge tokenized assets. 
              Leverage loops on JAAA, ACRDX, JTRSY and more — powered by Morpho, Aave Horizon, and institutional-grade RWAs.
            </p>
            <Link 
              to="/app"
              className="inline-flex items-center gap-2 bg-accent hover:bg-amber-400 text-black font-semibold px-8 py-4 rounded-xl text-lg transition transform hover:scale-105"
            >
              Launch App
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {formatTVL(totalTVL)}
              </div>
              <div className="text-gray-500 uppercase tracking-wider text-sm">Total Value Locked</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">{vaults.length}</div>
              <div className="text-gray-500 uppercase tracking-wider text-sm">Active Strategies</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                {avgAPY.toFixed(1)}%
              </div>
              <div className="text-gray-500 uppercase tracking-wider text-sm">Avg Boosted APY</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Choose Strategy', desc: 'Select a vault based on your risk appetite. Each strategy targets different Centrifuge RWAs with optimized leverage.' },
              { step: '02', title: 'Deposit Assets', desc: 'Deposit the underlying Centrifuge token (JAAA, ACRDX, etc). Torque handles the looping strategy automatically.' },
              { step: '03', title: 'Earn Boosted Yield', desc: 'Your position is continuously optimized. Withdraw anytime with no lock-ups. Monitor real-time performance.' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-8 text-center"
              >
                <div className="text-accent text-5xl font-bold mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vault Preview */}
      <section id="vaults" className="py-24 px-6 bg-surface/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Strategies</h2>
          <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
            Leverage strategies for Centrifuge tokenized assets
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {vaults.map((vault, i) => (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover:border-accent/50 transition group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-amber-600/30 flex items-center justify-center text-lg font-bold">
                      {vault.underlying}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{vault.name}</h3>
                      <p className="text-sm text-gray-500">{vault.leverage} on {vault.protocols[1]}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    vault.risk === 'Low' ? 'bg-green-500/20 text-green-400' :
                    vault.risk === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {vault.risk}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">{vault.strategyDetail}</p>
                
                {/* Protocol badges */}
                <div className="flex gap-2 mb-4">
                  {vault.protocols.map((protocol, idx) => (
                    <span key={protocol} className="text-xs bg-white/5 px-2 py-1 rounded flex items-center gap-1">
                      <span>{vault.protocolLogos[idx]}</span>
                      {protocol}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-end pt-4 border-t border-white/10">
                  <div>
                    <div className="text-xs text-gray-500 uppercase">TVL</div>
                    <div className="text-lg font-semibold">{formatTVL(vault.tvl)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 uppercase">Boosted APY</div>
                    <div className="text-2xl font-bold gradient-text">{vault.apy.boosted}%</div>
                    <div className="text-xs text-gray-500">Base: {vault.apy.base}%</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link 
              to="/app"
              className="inline-flex items-center gap-2 bg-accent hover:bg-amber-400 text-black font-semibold px-8 py-3 rounded-xl transition"
            >
              View All Strategies
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Powered By */}
      <section className="py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 mb-8 uppercase tracking-wider text-sm">Built on</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-2xl font-semibold text-gray-600">
            <span className="hover:text-white transition">🔷 Centrifuge</span>
            <span className="hover:text-white transition">🦋 Morpho</span>
            <span className="hover:text-white transition">👻 Aave</span>
            <span className="hover:text-white transition">⟠ Ethereum</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold gradient-text">TORQUE</div>
          <div className="flex gap-6 text-gray-500">
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">Discord</a>
            <a href="https://github.com/rowanclawd-alt/torque-finance" className="hover:text-white transition">GitHub</a>
            <a href="https://docs.centrifuge.io" className="hover:text-white transition">Docs</a>
          </div>
          <div className="text-gray-600 text-sm">
            © 2026 Torque Finance
          </div>
        </div>
      </footer>
    </div>
  )
}
