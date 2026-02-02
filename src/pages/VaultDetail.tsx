import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { motion, AnimatePresence } from 'framer-motion'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { vaults } from '../data/vaults'
import { useMarketData } from '../hooks/useMarketData'
import { STRATEGY_WALLETS } from '../config/wallets'
import { colors, fonts } from '../styles/colors'

// Strategy-specific content
const STRATEGY_EXPLAINERS = {
  'leverage_yield': {
    title: 'Leveraged Yield Strategy',
    description: 'Amplify your yield by borrowing against your position. You deposit the asset as collateral, borrow stablecoins at low rates, and purchase more of the asset to increase your yield exposure.',
    howItWorks: [
      'Deposit underlying asset (e.g., JAAA) as collateral',
      'Borrow USDC at institutional rates via Aave Horizon or Morpho',
      'Use borrowed USDC to purchase more of the underlying asset',
      'Repeat to achieve target leverage',
      'Earn yield on full position minus borrow costs'
    ],
    risks: [
      'Liquidation risk if collateral value drops below threshold',
      'Borrow rate changes can impact net yield',
      'Smart contract risk across multiple protocols'
    ],
    chartTitle: 'Backtested Yield Performance (90D)',
    chartSubtitle: 'Based on historical asset yields and borrow rates'
  },
  'treasury_plus': {
    title: 'Treasury + DeFi Yield Strategy',
    description: 'Ultra-safe treasury exposure with additional yield from DeFi lending. No leverage, no liquidation risk. Your capital earns T-bill yields plus a boost from lending idle USDC in blue-chip protocols.',
    howItWorks: [
      'Deposit USDC to receive tokenized T-bill exposure (JTRSY)',
      'Earn base Treasury yield (~4.3% currently)',
      'Idle liquidity deployed to Aave/Compound for additional yield',
      'No borrowing, no leverage - capital preserved',
      'Daily liquidity with T+1 redemption'
    ],
    risks: [
      'Treasury yield fluctuates with Fed policy',
      'Smart contract risk (mitigated by using battle-tested protocols)',
      'Minimal: no leverage or liquidation risk'
    ],
    chartTitle: 'Cumulative Yield Performance (90D)',
    chartSubtitle: 'Treasury yield + DeFi lending boost'
  },
  'momentum': {
    title: 'Adaptive Leverage Equity Strategy',
    description: 'Dynamic exposure to tokenized S&P 500. This is NOT a yield strategy - returns come from price appreciation. Leverage adjusts based on momentum signals to capture upside while limiting drawdowns.',
    howItWorks: [
      'Deposit collateral to gain leveraged SPXA exposure',
      'Position maintained at 1-2x based on momentum signals',
      'Leverage increases in confirmed uptrends',
      'Reduces exposure during high volatility periods',
      'Automatic rebalancing maintains target leverage'
    ],
    risks: [
      '⚠️ NO GUARANTEED YIELD - returns depend on S&P 500 performance',
      'Can lose money if S&P 500 declines',
      'Leverage amplifies both gains AND losses',
      'Rebalancing costs during volatile periods'
    ],
    chartTitle: 'Simulated Performance (90D)',
    chartSubtitle: '⚠️ Based on random S&P simulation - not actual results'
  },
  'short': {
    title: 'Short Exposure Strategy',
    description: 'Profit when the S&P 500 declines. This is an INVERSE position - you make money when prices fall and lose money when prices rise. Use for hedging or bearish bets.',
    howItWorks: [
      'Deposit USDC as collateral on Morpho Blue',
      'Borrow SPXA (tokenized S&P 500) from the lending pool',
      'Immediately sell borrowed SPXA for USDC',
      'If SPXA price drops: buy back cheaper, repay loan, keep difference',
      'If SPXA price rises: position loses value'
    ],
    risks: [
      '⚠️ HIGH RISK - unlimited loss potential if S&P rises significantly',
      'Holding costs eat into position (~3.5%/year)',
      'Liquidation risk if S&P rises too fast',
      'This is speculation, not investment'
    ],
    chartTitle: 'Simulated Short Performance (90D)',
    chartSubtitle: '⚠️ Inverse of S&P - profits on decline, loses on rise'
  }
}

export default function VaultDetail() {
  const { id } = useParams()
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'deposit' | 'redeem'>('deposit')
  const [amount, setAmount] = useState('')
  const [showSignature, setShowSignature] = useState(false)
  const [isSigning, setIsSigning] = useState(false)
  
  const marketData = useMarketData()
  const vaultMarket = id ? marketData.vaults[id] : null
  const strategyWallet = id ? STRATEGY_WALLETS[id] : null

  const vault = vaults.find(v => v.id === id)
  
  const { data: hash, sendTransaction, isPending } = useSendTransaction()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleAction = () => {
    setShowSignature(true)
  }

  const handleSign = async () => {
    if (!strategyWallet || !amount) return
    setIsSigning(true)
    try {
      await sendTransaction({
        to: strategyWallet as `0x${string}`,
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Transaction failed:', error)
    } finally {
      setIsSigning(false)
    }
  }

  if (!vault) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.text, fontFamily: fonts.body }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Strategy not found</h1>
          <Link to="/app" style={{ color: colors.accent }}>← Back to strategies</Link>
        </div>
      </div>
    )
  }

  // Get strategy-specific content
  const strategyType = vaultMarket?.strategyType || 'leverage_yield'
  const strategyContent = STRATEGY_EXPLAINERS[strategyType as keyof typeof STRATEGY_EXPLAINERS] || STRATEGY_EXPLAINERS.leverage_yield
  const isYieldStrategy = vaultMarket?.isYieldStrategy ?? true
  const isShortStrategy = strategyType === 'short'

  const displayApy = vaultMarket?.netApy ?? vault.apy.boosted
  const baseApy = vaultMarket?.baseApy ?? vault.apy.base
  const borrowRate = vaultMarket?.borrowRate ?? 2.99

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.primary, color: colors.text, fontFamily: fonts.body }}>
      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.05) 0%, transparent 50%)', pointerEvents: 'none' }} />

      {/* Signature Modal */}
      <AnimatePresence>
        {showSignature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}
            onClick={() => !isSigning && setShowSignature(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%' }}
              onClick={e => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '24px' }}>
                {isSigning ? 'Confirming...' : 'Confirm Transaction'}
              </h3>
              
              {isSigning ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <div style={{ width: '40px', height: '40px', border: `3px solid ${colors.accent}`, borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                  <p style={{ color: colors.textSecondary }}>Please sign in your wallet</p>
                </div>
              ) : (
                <>
                  <div style={{ background: colors.elevated, borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
                    {[
                      { label: 'Action', value: activeTab },
                      { label: 'Amount', value: `${amount || '0'} ${vault.underlying}` },
                      ...(isYieldStrategy ? [{ label: 'Expected APY', value: `${displayApy.toFixed(2)}%` }] : [{ label: 'Exposure', value: `${vault.leverage} ${vault.underlying}` }])
                    ].map(item => (
                      <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span style={{ color: colors.textMuted }}>{item.label}</span>
                        <span style={{ fontWeight: 500, textTransform: item.label === 'Action' ? 'capitalize' : 'none' }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowSignature(false)} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: `1px solid ${colors.border}`, background: 'transparent', color: colors.text, cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                      Cancel
                    </button>
                    <button onClick={handleSign} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: 'none', background: colors.accent, color: colors.text, cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                      Confirm
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, padding: '16px 24px', background: 'rgba(250, 250, 250, 0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: fonts.logo, fontSize: '24px', fontWeight: 500, color: colors.text }}>Torque</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/app" style={{ color: colors.textSecondary, textDecoration: 'none', fontSize: '14px' }}>Vaults</Link>
          </div>
          <ConnectButton />
        </div>
      </header>

      {/* Main */}
      <main style={{ paddingTop: '100px', padding: '100px 24px 60px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <Link to="/app" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: colors.textSecondary, textDecoration: 'none', marginBottom: '24px', fontSize: '14px' }}>
            ← Back to Vaults
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px' }}>
            {/* Left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Header Card */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <img src={vault.logo} alt={vault.underlying} style={{ width: '64px', height: '64px', borderRadius: '12px' }} />
                  <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 600, margin: '0 0 4px' }}>{vault.name}</h1>
                    <p style={{ color: colors.textSecondary, margin: 0, fontSize: '14px' }}>{vault.underlyingName}</p>
                  </div>
                </div>

                {/* Risk warning for non-yield strategies */}
                {!isYieldStrategy && (
                  <div style={{ background: 'rgba(255, 170, 0, 0.1)', border: '1px solid rgba(255, 170, 0, 0.3)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#ffaa00' }}>
                    ⚠️ {isShortStrategy ? 'This is a SHORT position - you profit when prices fall and lose when prices rise.' : 'This is an equity exposure strategy - returns depend on price movement, not yield.'}
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {isYieldStrategy ? (
                    // Yield strategy metrics
                    <>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Base APY</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>{baseApy.toFixed(2)}%</div>
                      </div>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Net APY</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.accent }}>{displayApy.toFixed(2)}%</div>
                      </div>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Borrow Rate</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>{borrowRate.toFixed(2)}%</div>
                      </div>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Leverage</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>{vault.leverage}</div>
                      </div>
                    </>
                  ) : (
                    // Exposure strategy metrics
                    <>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Exposure</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: isShortStrategy ? '#ff6b6b' : colors.accent }}>{vault.leverage}</div>
                      </div>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Underlying</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>{vault.underlying}</div>
                      </div>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Holding Cost</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: colors.text }}>{(borrowRate + 0.5).toFixed(2)}%/yr</div>
                      </div>
                      <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px' }}>
                        <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '6px', textTransform: 'uppercase' }}>Type</div>
                        <div style={{ fontSize: '20px', fontWeight: 600, color: isShortStrategy ? '#ff6b6b' : colors.text }}>{isShortStrategy ? 'Short' : 'Long'}</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Strategy Explainer */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>{strategyContent.title}</h2>
                <p style={{ color: colors.textSecondary, marginBottom: '24px', lineHeight: 1.7, fontSize: '14px' }}>{strategyContent.description}</p>
                
                <h3 style={{ fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>How It Works</h3>
                <ol style={{ paddingLeft: '20px', marginBottom: '24px' }}>
                  {strategyContent.howItWorks.map((step, idx) => (
                    <li key={idx} style={{ color: colors.textSecondary, fontSize: '13px', marginBottom: '8px', lineHeight: 1.6 }}>{step}</li>
                  ))}
                </ol>

                <h3 style={{ fontSize: '12px', color: colors.textMuted, textTransform: 'uppercase', marginBottom: '12px' }}>Risks</h3>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  {strategyContent.risks.map((risk, idx) => (
                    <li key={idx} style={{ color: risk.startsWith('⚠️') ? '#ffaa00' : colors.textSecondary, fontSize: '13px', marginBottom: '6px', lineHeight: 1.5 }}>{risk}</li>
                  ))}
                </ul>
              </div>

              {/* Yield Calculation (only for yield strategies) */}
              {isYieldStrategy && vaultMarket && (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Yield Calculation</h2>
                  <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: colors.textSecondary, marginBottom: '16px' }}>
                    <div style={{ color: colors.accent, marginBottom: '8px' }}>{vaultMarket.formula}</div>
                    <div>{vaultMarket.breakdown}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: colors.textMuted }}>
                    Sources: {vaultMarket.sources.assetSource} · {vaultMarket.sources.borrowSource}
                  </div>
                </div>
              )}

              {/* P&L Calculation (for exposure strategies) */}
              {!isYieldStrategy && vaultMarket && (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>P&L Calculation</h2>
                  <div style={{ background: colors.elevated, borderRadius: '10px', padding: '16px', fontFamily: 'monospace', fontSize: '13px', color: colors.textSecondary, marginBottom: '16px' }}>
                    <div style={{ color: isShortStrategy ? '#ff6b6b' : colors.accent, marginBottom: '8px' }}>{vaultMarket.formula}</div>
                    <div>{vaultMarket.breakdown}</div>
                  </div>
                  {isShortStrategy && (
                    <div style={{ background: 'rgba(255, 107, 107, 0.1)', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#ff6b6b' }}>
                      <strong>Example:</strong> If S&P drops 10%, position gains ~9.5% (10% - holding costs). If S&P rises 10%, position loses ~10.5%.
                    </div>
                  )}
                </div>
              )}

              {/* Chart */}
              {vaultMarket && vaultMarket.historicalData.length > 0 && (
                <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 4px' }}>{strategyContent.chartTitle}</h2>
                      <p style={{ fontSize: '12px', color: colors.textMuted, margin: 0 }}>{strategyContent.chartSubtitle}</p>
                    </div>
                    <div style={{ fontSize: '14px', color: colors.textSecondary }}>
                      $1,000 → ${vaultMarket.historicalData[vaultMarket.historicalData.length - 1]?.value.toFixed(2)}
                    </div>
                  </div>
                  <div style={{ height: '200px', marginTop: '16px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={vaultMarket.historicalData}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={isShortStrategy ? '#ff6b6b' : colors.accent} stopOpacity={0.2}/>
                            <stop offset="95%" stopColor={isShortStrategy ? '#ff6b6b' : colors.accent} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" tick={{ fill: colors.textMuted, fontSize: 10 }} tickFormatter={(d) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })} interval={20} axisLine={{ stroke: colors.border }} tickLine={false} />
                        <YAxis tick={{ fill: colors.textMuted, fontSize: 10 }} tickFormatter={(v) => `$${v}`} domain={['dataMin - 20', 'dataMax + 20']} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: colors.elevated, border: `1px solid ${colors.border}`, borderRadius: '8px', fontSize: '12px' }} formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Value']} labelFormatter={(label) => new Date(label).toLocaleDateString()} />
                        <Area type="monotone" dataKey="value" stroke={isShortStrategy ? '#ff6b6b' : colors.accent} strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Protocols */}
              <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '32px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Protocols Used</h2>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {vault.protocols.map((protocol, idx) => (
                    <span key={protocol} style={{ background: colors.elevated, padding: '8px 14px', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {vault.protocolLogoUrls[idx] ? <img src={vault.protocolLogoUrls[idx]} alt={protocol} style={{ width: '18px', height: '18px' }} /> : vault.protocolLogos[idx]}
                      {protocol}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right - Deposit Card */}
            <div style={{ background: colors.surface, border: `1px solid ${colors.border}`, borderRadius: '16px', padding: '24px', height: 'fit-content', position: 'sticky', top: '100px' }}>
              {/* Tabs */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                {['deposit', 'redeem'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as 'deposit' | 'redeem')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                      background: activeTab === tab ? (isShortStrategy ? '#ff6b6b' : colors.accent) : colors.elevated,
                      color: colors.text, fontWeight: 600, cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {!isConnected ? (
                <div style={{ textAlign: 'center', padding: '32px 0' }}>
                  <p style={{ color: colors.textMuted, marginBottom: '16px' }}>Connect wallet to {activeTab}</p>
                  <ConnectButton />
                </div>
              ) : (
                <>
                  {/* Wallet Address */}
                  {strategyWallet && (
                    <div style={{ background: colors.elevated, borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '11px', color: colors.textMuted, marginBottom: '4px', textTransform: 'uppercase' }}>Vault Address</div>
                      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: colors.accent, wordBreak: 'break-all' }}>{strategyWallet}</div>
                    </div>
                  )}

                  {/* Tx Status */}
                  {hash && (
                    <div style={{ background: isSuccess ? colors.successMuted : colors.warningMuted, borderRadius: '10px', padding: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '12px', color: isSuccess ? colors.success : colors.warning, marginBottom: '4px' }}>
                        {isConfirming ? '⏳ Confirming...' : isSuccess ? '✅ Confirmed' : '📤 Submitted'}
                      </div>
                      <a href={`https://etherscan.io/tx/${hash}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: colors.accent, fontFamily: 'monospace' }}>
                        {hash.slice(0, 10)}...{hash.slice(-8)}
                      </a>
                    </div>
                  )}

                  {/* Input */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                      <span style={{ color: colors.textMuted }}>Amount</span>
                      <span style={{ color: colors.textMuted }}>Balance: 0.00</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        style={{ width: '100%', background: colors.elevated, border: `1px solid ${colors.border}`, borderRadius: '10px', padding: '16px', paddingRight: '80px', fontSize: '18px', fontWeight: 600, color: colors.text, outline: 'none', boxSizing: 'border-box' }}
                      />
                      <div style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: colors.textMuted, fontSize: '12px' }}>{activeTab === 'deposit' ? vault.underlying : vault.symbol}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ marginBottom: '20px' }}>
                    {isYieldStrategy ? (
                      [
                        { label: 'Net APY', value: `${displayApy.toFixed(2)}%`, highlight: true },
                        { label: 'Leverage', value: vault.leverage },
                        { label: 'You receive', value: `~${amount || '0'} ${activeTab === 'deposit' ? vault.symbol : vault.underlying}` }
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '13px' }}>
                          <span style={{ color: colors.textMuted }}>{item.label}</span>
                          <span style={{ fontWeight: 500, color: item.highlight ? colors.accent : colors.text }}>{item.value}</span>
                        </div>
                      ))
                    ) : (
                      [
                        { label: 'Exposure', value: vault.leverage, highlight: true },
                        { label: 'Holding Cost', value: `${(borrowRate + 0.5).toFixed(2)}%/yr` },
                        { label: 'You receive', value: `~${amount || '0'} ${activeTab === 'deposit' ? vault.symbol : vault.underlying}` }
                      ].map(item => (
                        <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '13px' }}>
                          <span style={{ color: colors.textMuted }}>{item.label}</span>
                          <span style={{ fontWeight: 500, color: item.highlight ? (isShortStrategy ? '#ff6b6b' : colors.accent) : colors.text }}>{item.value}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Button */}
                  <button 
                    onClick={handleAction}
                    disabled={!amount || parseFloat(amount) <= 0 || isPending || isConfirming}
                    style={{
                      width: '100%', padding: '16px', borderRadius: '10px', border: 'none',
                      background: (!amount || parseFloat(amount) <= 0) ? colors.elevated : (isShortStrategy ? '#ff6b6b' : colors.accent),
                      color: colors.text, fontWeight: 600, cursor: (!amount || parseFloat(amount) <= 0) ? 'not-allowed' : 'pointer', fontSize: '15px', textTransform: 'capitalize'
                    }}
                  >
                    {isPending ? 'Sending...' : isConfirming ? 'Confirming...' : activeTab}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
