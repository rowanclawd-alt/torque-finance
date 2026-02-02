import { Link } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { vaults, formatTVL } from '../data/vaults'
import { useMarketData } from '../hooks/useMarketData'
import { fetchStrategyTVL, getStrategyCount, type TotalTVL } from '../services/walletBalances'
import { colors, fonts } from '../styles/colors'

export default function AppPage() {
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
        background: 'radial-gradient(ellipse at 50% 0%, rgba(0, 82, 255, 0.04) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 50,
        padding: '16px 24px',
        background: 'rgba(10, 10, 10, 0.9)',
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
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ 
              fontFamily: fonts.logo,
              fontSize: '24px', 
              fontWeight: 500,
              color: colors.text
            }}>Torque</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/app" style={{ color: colors.text, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Vaults</Link>
            <a href="#" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '14px' }}>Portfolio</a>
            <a href="https://docs.centrifuge.io" target="_blank" rel="noopener" style={{ color: colors.textMuted, textDecoration: 'none', fontSize: '14px' }}>Docs</a>
          </div>
          
          <ConnectButton />
        </div>
      </header>

      {/* Main */}
      <main style={{ paddingTop: '100px', padding: '100px 24px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          {/* Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(4, 1fr)', 
            gap: '16px', 
            marginBottom: '48px' 
          }}>
            {[
              { label: 'Total Value Locked', value: realTVL > 0 ? `$${(realTVL / 1000).toFixed(1)}K` : '$0' },
              { label: 'Strategies', value: strategyCount.toString() },
              { label: 'Avg Net APY', value: `${realAvgAPY.toFixed(1)}%`, highlight: true },
              { label: 'Protocols', value: '4' }
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >
                <div style={{ color: colors.textMuted, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 600, color: stat.highlight ? colors.accent : colors.text }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '24px' 
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Vaults</h1>
          </div>

          {/* Vault List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {vaults.map((vault, i) => {
              const vaultData = marketData.vaults[vault.id]
              const displayApy = vaultData?.netApy ?? vault.apy.boosted
              const baseApy = vaultData?.baseApy ?? vault.apy.base
              
              return (
              <motion.div
                key={vault.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Link
                  to={`/app/vault/${vault.id}`}
                  style={{
                    display: 'block',
                    background: colors.surface,
                    border: `1px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '20px 24px',
                    textDecoration: 'none',
                    color: colors.text,
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = colors.surfaceHover}
                  onMouseOut={(e) => e.currentTarget.style.background = colors.surface}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {/* Left */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img 
                        src={vault.logo} 
                        alt={vault.underlying}
                        style={{ width: '44px', height: '44px', borderRadius: '10px' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px' }}>{vault.name}</span>
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 500,
                            background: vault.risk === 'Low' ? colors.successMuted : vault.risk === 'Medium' ? colors.warningMuted : colors.errorMuted,
                            color: vault.risk === 'Low' ? colors.success : vault.risk === 'Medium' ? colors.warning : colors.error,
                          }}>
                            {vault.risk}
                          </span>
                        </div>
                        <div style={{ color: colors.textSecondary, fontSize: '13px' }}>
                          {vault.underlying} · {vault.leverage} · {vault.chain}
                        </div>
                      </div>
                    </div>

                    {/* Middle Stats */}
                    <div style={{ display: 'flex', gap: '40px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '2px' }}>TVL</div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{formatTVL(vault.metrics.tvl)}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '2px' }}>Base APY</div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>{baseApy.toFixed(2)}%</div>
                      </div>
                    </div>

                    {/* Right - APY + Button */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '2px' }}>Net APY</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.accent }}>
                          {displayApy.toFixed(2)}%
                        </div>
                      </div>
                      <button style={{
                        background: colors.accent,
                        color: colors.text,
                        fontWeight: 600,
                        padding: '10px 20px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}>
                        Deposit
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )})}
          </div>

          {/* Info */}
          <div style={{
            marginTop: '32px',
            padding: '20px',
            background: colors.accentMuted,
            border: `1px solid ${colors.accentBorder}`,
            borderRadius: '10px'
          }}>
            <p style={{ fontSize: '14px', color: colors.textSecondary, margin: 0, lineHeight: 1.6 }}>
              <strong style={{ color: colors.text }}>About Torque:</strong> Each vault deploys automated leverage strategies on Centrifuge tokenized real-world assets using Aave Horizon and Morpho Blue for capital-efficient borrowing.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
