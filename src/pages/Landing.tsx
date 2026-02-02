import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { vaults, formatTVL } from '../data/vaults'
import { useMarketData } from '../hooks/useMarketData'
import { fetchStrategyTVL, getStrategyCount, type TotalTVL } from '../services/walletBalances'
import { colors, fonts } from '../styles/colors'

export default function Landing() {
  const marketData = useMarketData()
  const [tvlData, setTvlData] = useState<TotalTVL | null>(null)
  
  useEffect(() => {
    fetchStrategyTVL().then(setTvlData)
  }, [])
  
  const realAvgAPY = Object.values(marketData.vaults).length > 0
    ? Object.values(marketData.vaults)
        .filter(v => v.leverage > 0)
        .reduce((sum, v) => sum + v.netApy, 0) / 
      Object.values(marketData.vaults).filter(v => v.leverage > 0).length
    : 0
  
  const realTVL = tvlData?.totalUsd || 0
  const strategyCount = getStrategyCount()
    
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.primary, 
      color: colors.text,
      fontFamily: fonts.body
    }}>
      {/* Subtle gradient */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 82, 255, 0.06) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Nav */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 50,
        padding: '20px 24px',
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border}`
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{ 
            fontFamily: fonts.logo,
            fontSize: '28px', 
            fontWeight: 500, 
            letterSpacing: '0.02em',
            color: colors.text
          }}>Torque</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <a href="#strategies" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Strategies</a>
            <a href="https://docs.centrifuge.io" target="_blank" rel="noopener" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Docs</a>
            <Link 
              to="/app"
              style={{
                background: colors.accent,
                color: colors.text,
                fontWeight: 600,
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px'
              }}
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ paddingTop: '160px', paddingBottom: '80px', padding: '160px 24px 80px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{ 
              fontSize: 'clamp(40px, 6vw, 64px)', 
              fontWeight: 600, 
              lineHeight: 1.1,
              marginBottom: '24px',
              letterSpacing: '-0.03em'
            }}>
              Leveraged Yield on<br />
              <span style={{ color: colors.accent }}>Real-World Assets</span>
            </h1>
            
            <p style={{ 
              fontSize: '18px', 
              color: colors.textSecondary, 
              maxWidth: '600px', 
              margin: '0 auto 40px',
              lineHeight: 1.6
            }}>
              Automated leverage strategies on Centrifuge tokenized assets. 
              Institutional-grade execution via Aave Horizon and Morpho Blue.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
              <Link 
                to="/app"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: colors.accent,
                  color: colors.text,
                  fontWeight: 600,
                  padding: '16px 32px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '16px'
                }}
              >
                View Strategies
              </Link>
              <a 
                href="https://app.rwa.xyz"
                target="_blank"
                rel="noopener"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: colors.textSecondary,
                  fontWeight: 500,
                  padding: '16px 32px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  border: `1px solid ${colors.border}`
                }}
              >
                RWA Analytics
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '48px',
          textAlign: 'center'
        }}>
          {[
            { value: realTVL > 0 ? `$${(realTVL / 1000).toFixed(0)}K` : '$0', label: 'Total Value Locked' },
            { value: strategyCount.toString(), label: 'Strategies' },
            { value: `${realAvgAPY.toFixed(1)}%`, label: 'Avg Net APY', highlight: true }
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 600, 
                marginBottom: '8px',
                color: stat.highlight ? colors.accent : colors.text
              }}>
                {stat.value}
              </div>
              <div style={{ color: colors.textMuted, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Strategies */}
      <section id="strategies" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '12px', letterSpacing: '-0.02em' }}>
              Strategies
            </h2>
            <p style={{ color: colors.textSecondary, fontSize: '16px' }}>
              Select a vault to view details and deposit
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {vaults.map((vault) => {
              const vaultData = marketData.vaults[vault.id]
              const displayApy = vaultData?.netApy ?? vault.apy.boosted
              const baseApy = vaultData?.baseApy ?? vault.apy.base
              
              return (
                <Link
                  key={vault.id}
                  to={`/app/vault/${vault.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ backgroundColor: colors.surfaceHover }}
                    style={{
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '12px',
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                  >
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img 
                        src={vault.logo} 
                        alt={vault.underlying}
                        style={{ width: '48px', height: '48px', borderRadius: '10px' }}
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{vault.name}</div>
                        <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
                          {vault.underlying} · {vault.leverage}
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle */}
                    <div style={{ display: 'flex', gap: '48px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Base APY</div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{baseApy.toFixed(2)}%</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>TVL</div>
                        <div style={{ fontWeight: 500, fontSize: '14px' }}>{formatTVL(vault.metrics.tvl)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '4px' }}>Risk</div>
                        <div style={{ 
                          fontWeight: 500, 
                          fontSize: '14px',
                          color: vault.risk === 'Low' ? colors.success : vault.risk === 'Medium' ? colors.warning : colors.error
                        }}>
                          {vault.risk}
                        </div>
                      </div>
                    </div>
                    
                    {/* Right - APY */}
                    <div style={{ textAlign: 'right', minWidth: '100px' }}>
                      <div style={{ 
                        fontSize: '24px', 
                        fontWeight: 600,
                        color: colors.accent
                      }}>
                        {displayApy.toFixed(2)}%
                      </div>
                      <div style={{ color: colors.textMuted, fontSize: '12px' }}>Net APY</div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 600, marginBottom: '48px', letterSpacing: '-0.02em' }}>
            How it works
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { num: '01', title: 'Select Strategy', desc: 'Choose a vault based on your risk appetite and target asset class.' },
              { num: '02', title: 'Deposit', desc: 'Deposit the underlying Centrifuge token. We handle the rest.' },
              { num: '03', title: 'Earn', desc: 'Your position compounds automatically. Withdraw anytime.' },
            ].map((step) => (
              <div key={step.num}>
                <div style={{ 
                  color: colors.accent, 
                  fontSize: '14px', 
                  fontWeight: 600, 
                  marginBottom: '16px',
                  fontFamily: 'monospace'
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{step.title}</h3>
                <p style={{ color: colors.textSecondary, lineHeight: 1.6, fontSize: '14px' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', borderTop: `1px solid ${colors.border}` }}>
        <div style={{ 
          maxWidth: '1000px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ 
            fontFamily: fonts.logo,
            fontSize: '20px', 
            fontWeight: 500,
            color: colors.text
          }}>Torque</span>
          
          <div style={{ display: 'flex', gap: '32px', fontSize: '14px' }}>
            <a href="#" style={{ color: colors.textMuted, textDecoration: 'none' }}>Twitter</a>
            <a href="#" style={{ color: colors.textMuted, textDecoration: 'none' }}>Discord</a>
            <a href="#" style={{ color: colors.textMuted, textDecoration: 'none' }}>GitHub</a>
          </div>
          
          <div style={{ color: colors.textMuted, fontSize: '14px' }}>
            © 2026 Torque
          </div>
        </div>
      </footer>
    </div>
  )
}
