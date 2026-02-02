import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { vaults, formatTVL } from '../data/vaults'
import { useMarketData } from '../hooks/useMarketData'
import { fetchStrategyTVL, getStrategyCount, type TotalTVL } from '../services/walletBalances'
import { colors, fonts } from '../styles/colors'

// Animated counter component
function AnimatedCounter({ target, suffix = '', prefix = '' }: { target: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          let start = 0
          const duration = 2000
          const increment = target / (duration / 16)
          const timer = setInterval(() => {
            start += increment
            if (start >= target) {
              setCount(target)
              clearInterval(timer)
            } else {
              setCount(Math.floor(start))
            }
          }, 16)
        }
      },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, hasAnimated])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

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
        background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.05) 0%, transparent 60%)',
        pointerEvents: 'none'
      }} />

      {/* Nav */}
      <nav style={{ 
        position: 'fixed', 
        top: 0, 
        width: '100%', 
        zIndex: 50,
        padding: '20px 24px',
        background: 'rgba(250, 250, 250, 0.9)',
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
            fontStyle: 'italic',
            letterSpacing: '0.02em',
            color: colors.text
          }}>Torque</span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <a href="#what" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>About</a>
            <a href="#how" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>How It Works</a>
            <a href="#strategies" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Strategies</a>
            <Link 
              to="/app"
              style={{
                background: colors.accent,
                color: '#ffffff',
                fontWeight: 600,
                padding: '10px 24px',
                borderRadius: '6px',
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
      <section style={{ 
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        background: 'linear-gradient(180deg, #fafafa 0%, #f5f5f0 100%)'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ 
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginBottom: '24px'
            }}>
              Leveraged RWA Strategies
            </div>
            
            <h1 style={{ 
              fontFamily: fonts.logo,
              fontSize: 'clamp(48px, 8vw, 80px)', 
              fontWeight: 500, 
              lineHeight: 1.05,
              marginBottom: '32px',
              letterSpacing: '-0.02em'
            }}>
              Amplified Yield on<br />
              <span style={{ color: colors.accent, fontStyle: 'italic' }}>Real-World Assets</span>
            </h1>
            
            <p style={{ 
              fontSize: '20px', 
              color: colors.textSecondary, 
              maxWidth: '650px', 
              margin: '0 auto 48px',
              lineHeight: 1.7
            }}>
              Automated leverage strategies on Centrifuge tokenized assets. 
              Deposit once, earn enhanced yield through institutional-grade DeFi protocols.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '80px' }}>
              <Link 
                to="/app"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: colors.accent,
                  color: '#ffffff',
                  fontWeight: 600,
                  padding: '18px 40px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  boxShadow: '0 4px 20px rgba(201, 162, 39, 0.3)'
                }}
              >
                View Strategies →
              </Link>
              <a 
                href="#how"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'transparent',
                  color: colors.text,
                  fontWeight: 500,
                  padding: '18px 40px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  border: `2px solid ${colors.border}`
                }}
              >
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              maxWidth: '700px',
              margin: '0 auto',
              padding: '32px',
              background: colors.surface,
              borderRadius: '16px',
              border: `1px solid ${colors.border}`,
              boxShadow: '0 4px 40px rgba(0,0,0,0.06)'
            }}
          >
            {[
              { value: realTVL > 0 ? Math.floor(realTVL / 1000) : 0, prefix: '$', suffix: 'K+', label: 'Total Value Locked' },
              { value: strategyCount, suffix: '', label: 'Active Strategies' },
              { value: Math.floor(realAvgAPY * 10) / 10 || 10, suffix: '%', label: 'Avg Net APY' }
            ].map((stat) => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontFamily: fonts.logo,
                  fontSize: '42px', 
                  fontWeight: 500,
                  color: colors.accent,
                  lineHeight: 1
                }}>
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <div style={{ color: colors.textMuted, fontSize: '13px', marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* What is Torque */}
      <section id="what" style={{ padding: '120px 24px', background: colors.surface }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
            <div>
              <div style={{ 
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: colors.accent,
                marginBottom: '16px'
              }}>
                What is Torque
              </div>
              <h2 style={{ 
                fontFamily: fonts.logo,
                fontSize: '44px', 
                fontWeight: 500, 
                lineHeight: 1.15,
                marginBottom: '24px'
              }}>
                Leverage Without<br />the Complexity
              </h2>
              <p style={{ 
                fontSize: '17px', 
                color: colors.textSecondary, 
                lineHeight: 1.8,
                marginBottom: '24px'
              }}>
                Torque automates leveraged yield strategies on tokenized real-world assets. 
                We handle the complexity of DeFi lending loops so you can focus on what matters: 
                earning enhanced returns on institutional-grade assets.
              </p>
              <p style={{ 
                fontSize: '17px', 
                color: colors.textSecondary, 
                lineHeight: 1.8,
                marginBottom: '32px'
              }}>
                Our strategies use battle-tested protocols like Aave Horizon and Morpho Blue 
                to create leveraged positions on Centrifuge RWAs with transparent, real-time 
                yield calculations.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Automated leverage management',
                  'Real-time yield calculations',
                  'Institutional-grade execution',
                  'Transparent fee structure'
                ].map((item) => (
                  <li key={item} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '12px',
                    fontSize: '15px',
                    color: colors.text
                  }}>
                    <span style={{ color: colors.accent, fontWeight: 600 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Visual card */}
            <div style={{ 
              background: colors.primary,
              borderRadius: '20px',
              padding: '40px',
              border: `1px solid ${colors.border}`
            }}>
              <div style={{ 
                background: colors.surface,
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '20px',
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: colors.textMuted }}>Example: JAAA 3x Strategy</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: colors.accent }}>Live</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Base APY</div>
                    <div style={{ fontSize: '24px', fontWeight: 600 }}>5.48%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: colors.textMuted, marginBottom: '4px' }}>Net APY</div>
                    <div style={{ fontSize: '24px', fontWeight: 600, color: colors.accent }}>13.48%</div>
                  </div>
                </div>
              </div>
              <div style={{ 
                background: colors.surface,
                borderRadius: '12px',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '13px',
                color: colors.textSecondary,
                border: `1px solid ${colors.border}`
              }}>
                <div style={{ color: colors.accent, marginBottom: '8px' }}>// Yield Calculation</div>
                <div>Net APY = Base × Leverage - Borrow × (Lev-1)</div>
                <div style={{ marginTop: '8px' }}>5.48% × 3 - 2.99% × 2 = <span style={{ color: colors.accent }}>13.48%</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works - Numbered */}
      <section id="how" style={{ padding: '120px 24px', background: colors.primary }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ 
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginBottom: '16px'
            }}>
              How It Works
            </div>
            <h2 style={{ 
              fontFamily: fonts.logo,
              fontSize: '44px', 
              fontWeight: 500, 
              lineHeight: 1.15
            }}>
              From Deposit to Yield<br />in Four Steps
            </h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { 
                num: '01', 
                title: 'Choose Your Strategy', 
                desc: 'Select from our curated strategies based on your target asset class, risk appetite, and desired leverage. Each strategy is optimized for a specific Centrifuge RWA.',
                details: ['AAA CLOs, Treasuries, Private Credit', 'Leverage from 1x to 3x', 'Risk ratings and historical performance']
              },
              { 
                num: '02', 
                title: 'Deposit Underlying Asset', 
                desc: 'Deposit your Centrifuge tokens (JAAA, JTRSY, ACRDX, etc.) into the vault. Your assets become collateral for the leverage strategy.',
                details: ['Direct from your wallet', 'No minimum lockup period', 'Gas-optimized transactions']
              },
              { 
                num: '03', 
                title: 'Automated Leverage Loop', 
                desc: 'Torque automatically executes the leverage strategy: depositing to lending protocols, borrowing stablecoins, and reinvesting to amplify your position.',
                details: ['Aave Horizon for institutional rates', 'Morpho Blue for optimized lending', 'Automatic rebalancing']
              },
              { 
                num: '04', 
                title: 'Earn Enhanced Yield', 
                desc: 'Your position earns the leveraged yield continuously. Monitor your returns in real-time and withdraw anytime with your accumulated gains.',
                details: ['Real-time APY tracking', 'Compound automatically', 'Withdraw anytime (T+1 to T+3)']
              },
            ].map((step, idx) => (
              <div 
                key={step.num}
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr 1fr',
                  gap: '48px',
                  padding: '48px 0',
                  borderBottom: idx < 3 ? `1px solid ${colors.border}` : 'none',
                  alignItems: 'start'
                }}
              >
                <div style={{ 
                  fontFamily: fonts.logo,
                  fontSize: '56px',
                  fontWeight: 500,
                  color: colors.accent,
                  lineHeight: 1
                }}>
                  {step.num}
                </div>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '12px' }}>{step.title}</h3>
                  <p style={{ color: colors.textSecondary, lineHeight: 1.7, fontSize: '15px' }}>{step.desc}</p>
                </div>
                <div style={{ 
                  background: colors.surface,
                  borderRadius: '12px',
                  padding: '24px',
                  border: `1px solid ${colors.border}`
                }}>
                  {step.details.map((detail, i) => (
                    <div key={i} style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: i < step.details.length - 1 ? '12px' : 0,
                      fontSize: '14px'
                    }}>
                      <span style={{ color: colors.accent }}>•</span>
                      {detail}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Loop Diagram */}
      <section style={{ padding: '120px 24px', background: colors.surface }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginBottom: '16px'
            }}>
              The Leverage Loop
            </div>
            <h2 style={{ 
              fontFamily: fonts.logo,
              fontSize: '44px', 
              fontWeight: 500
            }}>
              See How Your Yield Is Amplified
            </h2>
          </div>

          {/* Flow Diagram */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '60px',
            position: 'relative'
          }}>
            {/* Connection line */}
            <div style={{ 
              position: 'absolute',
              top: '50%',
              left: '12%',
              right: '12%',
              height: '2px',
              background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.accentLight} 50%, ${colors.accent} 100%)`,
              zIndex: 0
            }} />
            
            {[
              { icon: '📥', title: 'Deposit', desc: 'RWA tokens' },
              { icon: '🏦', title: 'Collateralize', desc: 'Aave/Morpho' },
              { icon: '💵', title: 'Borrow', desc: 'USDC at 3%' },
              { icon: '🔄', title: 'Reinvest', desc: 'Buy more RWA' },
              { icon: '📈', title: 'Earn', desc: 'Leveraged yield' }
            ].map((step) => (
              <div 
                key={step.title}
                style={{ 
                  background: colors.primary,
                  border: `2px solid ${colors.accent}`,
                  borderRadius: '16px',
                  padding: '24px 20px',
                  textAlign: 'center',
                  width: '140px',
                  zIndex: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{step.icon}</div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{step.title}</div>
                <div style={{ fontSize: '12px', color: colors.textMuted }}>{step.desc}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '24px'
          }}>
            {[
              { value: '2.99%', label: 'Borrow Rate', sub: 'Aave Horizon institutional rate' },
              { value: '3x', label: 'Max Leverage', sub: 'On AAA-rated CLOs' },
              { value: '~2.5x', label: 'Yield Multiplier', sub: 'Net of borrow costs' }
            ].map((stat) => (
              <div 
                key={stat.label}
                style={{ 
                  background: colors.primary,
                  borderRadius: '12px',
                  padding: '32px',
                  textAlign: 'center',
                  border: `1px solid ${colors.border}`
                }}
              >
                <div style={{ 
                  fontFamily: fonts.logo,
                  fontSize: '36px', 
                  fontWeight: 500,
                  color: colors.accent,
                  marginBottom: '8px'
                }}>
                  {stat.value}
                </div>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{stat.label}</div>
                <div style={{ fontSize: '13px', color: colors.textMuted }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies */}
      <section id="strategies" style={{ padding: '120px 24px', background: colors.primary }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginBottom: '16px'
            }}>
              Strategies
            </div>
            <h2 style={{ 
              fontFamily: fonts.logo,
              fontSize: '44px', 
              fontWeight: 500,
              marginBottom: '16px'
            }}>
              Choose Your Strategy
            </h2>
            <p style={{ color: colors.textSecondary, fontSize: '17px', maxWidth: '600px', margin: '0 auto' }}>
              From conservative treasury yields to leveraged CLO exposure, 
              find the strategy that matches your risk profile.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {vaults.map((vault) => {
              const vaultData = marketData.vaults[vault.id]
              const displayApy = vaultData?.netApy ?? vault.apy.boosted
              const baseApy = vaultData?.baseApy ?? vault.apy.base
              const isShort = vault.leverage === '-1x'
              const isEquity = vault.assetClass.includes('Equity')
              
              return (
                <Link
                  key={vault.id}
                  to={`/app/vault/${vault.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <motion.div
                    whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                    style={{
                      background: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '16px',
                      padding: '32px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      height: '100%'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <img 
                          src={vault.logo} 
                          alt={vault.underlying}
                          style={{ width: '56px', height: '56px', borderRadius: '12px' }}
                        />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '4px' }}>{vault.name}</div>
                          <div style={{ color: colors.textSecondary, fontSize: '14px' }}>{vault.assetClass}</div>
                        </div>
                      </div>
                      <div style={{ 
                        background: vault.risk === 'Low' ? 'rgba(34, 197, 94, 0.1)' : vault.risk === 'Medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: vault.risk === 'Low' ? colors.success : vault.risk === 'Medium' ? colors.warning : colors.error,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {vault.risk} Risk
                      </div>
                    </div>
                    
                    <p style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', minHeight: '44px' }}>
                      {vault.description.slice(0, 120)}...
                    </p>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>Base</div>
                        <div style={{ fontWeight: 600 }}>{isEquity || isShort ? '—' : `${baseApy.toFixed(2)}%`}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>
                          {isEquity || isShort ? 'Exposure' : 'Net APY'}
                        </div>
                        <div style={{ fontWeight: 600, color: isShort ? colors.error : colors.accent }}>
                          {isEquity || isShort ? vault.leverage : `${displayApy.toFixed(2)}%`}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>Leverage</div>
                        <div style={{ fontWeight: 600 }}>{vault.leverage}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>TVL</div>
                        <div style={{ fontWeight: 600 }}>{formatTVL(vault.metrics.tvl)}</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link 
              to="/app"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: colors.accent,
                color: '#ffffff',
                fontWeight: 600,
                padding: '16px 32px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              View All Strategies →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Torque */}
      <section style={{ padding: '120px 24px', background: colors.dark, color: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ 
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: colors.accent,
              marginBottom: '16px'
            }}>
              Why Torque
            </div>
            <h2 style={{ 
              fontFamily: fonts.logo,
              fontSize: '44px', 
              fontWeight: 500
            }}>
              Built for Serious Investors
            </h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
            {[
              { 
                num: '01', 
                title: 'Institutional-Grade Protocols', 
                desc: 'Built on Aave Horizon and Morpho Blue, the most battle-tested lending protocols in DeFi with billions in TVL.'
              },
              { 
                num: '02', 
                title: 'Real-World Asset Exposure', 
                desc: 'Access tokenized T-bills, AAA CLOs, and private credit through Centrifuge\'s institutional asset network.'
              },
              { 
                num: '03', 
                title: 'Transparent Yield Math', 
                desc: 'Every yield calculation is shown in real-time. Know exactly how your returns are generated and what you\'re paying.'
              },
              { 
                num: '04', 
                title: 'Non-Custodial & Secure', 
                desc: 'Your assets stay in your wallet until deposited. Smart contracts are audited and open-source.'
              },
            ].map((item) => (
              <div 
                key={item.num}
                style={{ 
                  background: colors.darkSurface,
                  borderRadius: '16px',
                  padding: '32px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <div style={{ 
                  fontFamily: fonts.logo,
                  fontSize: '24px',
                  fontWeight: 500,
                  color: colors.accent,
                  marginBottom: '16px'
                }}>
                  {item.num}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, fontSize: '15px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ 
        padding: '120px 24px',
        background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentDark} 100%)`,
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ 
            fontFamily: fonts.logo,
            fontSize: '48px', 
            fontWeight: 500,
            color: '#ffffff',
            marginBottom: '24px'
          }}>
            Ready to Amplify<br />Your Yield?
          </h2>
          <p style={{ 
            fontSize: '18px',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '40px',
            lineHeight: 1.7
          }}>
            Join the next generation of RWA investors earning enhanced returns 
            through automated leverage strategies.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <Link 
              to="/app"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#ffffff',
                color: colors.accentDark,
                fontWeight: 600,
                padding: '18px 40px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px'
              }}
            >
              Launch App
            </Link>
            <a 
              href="https://docs.centrifuge.io"
              target="_blank"
              rel="noopener"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'transparent',
                color: '#ffffff',
                fontWeight: 500,
                padding: '18px 40px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '16px',
                border: '2px solid rgba(255,255,255,0.5)'
              }}
            >
              Read Docs
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '60px 24px', background: colors.dark, color: '#ffffff' }}>
        <div style={{ 
          maxWidth: '1100px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ 
            fontFamily: fonts.logo,
            fontSize: '24px', 
            fontWeight: 500,
            fontStyle: 'italic'
          }}>Torque</span>
          
          <div style={{ display: 'flex', gap: '40px', fontSize: '14px' }}>
            <a href="https://twitter.com" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Twitter</a>
            <a href="https://discord.com" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Discord</a>
            <a href="https://github.com" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>GitHub</a>
            <a href="https://docs.centrifuge.io" target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none' }}>Docs</a>
          </div>
          
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
            © 2026 Torque. Powered by Centrifuge.
          </div>
        </div>
      </footer>
    </div>
  )
}
