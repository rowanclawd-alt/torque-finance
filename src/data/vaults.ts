export interface Vault {
  id: string
  name: string
  symbol: string
  underlying: string
  underlyingName: string
  logo: string
  assetClass: string
  strategy: string
  strategyDetail: string
  description: string
  leverage: string
  protocols: string[]
  protocolLogos: string[]
  protocolLogoUrls: string[]
  apy: {
    base: number
    boosted: number
    apy7d: number
    apy30d: number
  }
  metrics: {
    tvl: number
    nav: number
    change7d: number
    change30d: number
    managementFee: number
    performanceFee: number
    holders: number
    monthlyVolume: number
  }
  eligibility: string
  minInvestment: string
  redemption: string
  risk: 'Low' | 'Medium' | 'High'
  chain: string
  networks: string[]
  centrifugePoolId: string
  inceptionDate: string
}

export const vaults: Vault[] = [
  {
    id: 'jaaa-loop',
    name: 'JAAA 3x Leverage Vault',
    symbol: 'tqJAAA',
    underlying: 'JAAA',
    underlyingName: 'Janus Henderson Anemoy AAA CLO Fund',
    logo: '/logos/jaaa.svg',
    assetClass: 'AAA-Rated CLOs',
    strategy: 'Recursive Lending Loop',
    strategyDetail: 'Deposits JAAA as collateral on Aave Horizon, borrows USDC at ~3% (institutional rates), swaps to additional JAAA, and repeats to achieve ~3x leveraged exposure to AAA-rated CLO yields.',
    description: 'Amplified yield on institutional-grade AAA CLO exposure. JAAA provides access to Janus Henderson\'s $21B+ CLO portfolio, enhanced through recursive DeFi lending.',
    leverage: '3x',
    protocols: ['Centrifuge', 'Aave Horizon', 'Uniswap'],
    protocolLogos: ['🔷', '👻', '🦄'],
    protocolLogoUrls: ['/logos/centrifuge.svg', '/logos/aave.svg', '/logos/uniswap.svg'],
    apy: {
      base: 5.48,      // From app.centrifuge.io - Anemoy Liquid Yield
      boosted: 13.48,  // 5.48% × 3 - 2.99% × 2 = 16.44 - 5.98 = ~10.5% + base
      apy7d: 5.48,
      apy30d: 5.35
    },
    metrics: {
      tvl: 4200000,
      nav: 1.02,
      change7d: 0.42,
      change30d: -28.81,
      managementFee: 0.40,
      performanceFee: 0,
      holders: 10,
      monthlyVolume: 900282044
    },
    eligibility: 'Non-U.S. Professional Investors',
    minInvestment: '$100,000',
    redemption: 'Daily (T+3)',
    risk: 'Medium',
    chain: 'Ethereum',
    networks: ['Ethereum', 'Base', 'Avalanche'],
    centrifugePoolId: '281474976710663',
    inceptionDate: 'May 2025'
  },
  {
    id: 'acrdx-loop',
    name: 'ACRDX 2x Leverage Vault',
    symbol: 'tqACRDX',
    underlying: 'ACRDX',
    underlyingName: 'Apollo Diversified Credit Fund',
    logo: '/logos/acrdx.svg',
    assetClass: 'Private Credit',
    strategy: 'Morpho Leverage Loop',
    strategyDetail: 'Utilizes Morpho Blue\'s optimized lending rates to create a 2x leveraged position on Apollo\'s diversified credit portfolio with capital-efficient collateral ratios.',
    description: 'Enhanced returns on Apollo\'s institutional-grade diversified credit portfolio. Conservative 2x leverage maintains favorable risk-adjusted returns with lower liquidation risk.',
    leverage: '2x',
    protocols: ['Centrifuge', 'Morpho Blue', '1inch'],
    protocolLogos: ['🔷', '🦋', '🔴'],
    protocolLogoUrls: ['/logos/centrifuge.svg', '/logos/morpho.svg', '/logos/1inch.svg'],
    apy: {
      base: 7.65,     // From app.centrifuge.io - Apollo Credit
      boosted: 12.10, // 7.65% × 2 - 3.2% × 1 = 15.3 - 3.2 = 12.1%
      apy7d: 7.65,
      apy30d: 7.45
    },
    metrics: {
      tvl: 2800000,
      nav: 1.04,
      change7d: 1.24,
      change30d: 8.45,
      managementFee: 0.50,
      performanceFee: 10,
      holders: 6,
      monthlyVolume: 45000000
    },
    eligibility: 'Qualified Purchasers',
    minInvestment: '$250,000',
    redemption: 'Weekly (T+5)',
    risk: 'Low',
    chain: 'Ethereum',
    networks: ['Ethereum'],
    centrifugePoolId: '281474976710664',
    inceptionDate: 'Sep 2025'
  },
  {
    id: 'jtrsy-stable',
    name: 'JTRSY Treasury Yield',
    symbol: 'tqJTRSY',
    underlying: 'JTRSY',
    underlyingName: 'Janus Henderson Anemoy Treasury Fund',
    logo: '/logos/jtrsy.svg',
    assetClass: 'U.S. Treasury Bills',
    strategy: 'Treasury + DeFi Yield',
    strategyDetail: 'Holds tokenized short-term U.S. Treasury Bills (0-3 month maturity) with idle capital deployed to blue-chip DeFi lending protocols for yield enhancement. No leverage, no liquidation risk.',
    description: 'Ultra-safe treasury exposure with DeFi yield optimization. Zero leverage, zero liquidation risk. Direct exposure to T-bills with transparent onchain AUM verification.',
    leverage: '1x',
    protocols: ['Centrifuge', 'Aave', 'Compound'],
    protocolLogos: ['🔷', '👻', '🟢'],
    protocolLogoUrls: ['/logos/centrifuge.svg', '/logos/aave.svg', '/logos/compound.svg'],
    apy: {
      base: 4.32,    // From app.centrifuge.io - Anemoy Treasury (matches T-bill rates)
      boosted: 5.52, // Treasury 4.32% + DeFi boost ~1.2%
      apy7d: 4.32,
      apy30d: 4.28
    },
    metrics: {
      tvl: 8500000,
      nav: 1.09,
      change7d: 12.44,
      change30d: 115.01,
      managementFee: 0.25,
      performanceFee: 0,
      holders: 10,
      monthlyVolume: 301515583
    },
    eligibility: 'Professional Investors',
    minInvestment: '$50,000',
    redemption: 'Daily (T+1)',
    risk: 'Low',
    chain: 'Ethereum',
    networks: ['Ethereum', 'Base', 'Arbitrum', 'Celo', 'Avalanche'],
    centrifugePoolId: '281474976710662',
    inceptionDate: 'Aug 2024'
  },
  {
    id: 'spxa-momentum',
    name: 'SPXA Adaptive Leverage',
    symbol: 'tqSPXA',
    underlying: 'SPXA',
    underlyingName: 'Janus Henderson Anemoy S&P 500 Fund',
    logo: '/logos/spxa.svg',
    assetClass: 'Equity Index',
    strategy: 'Momentum-Based Leverage',
    strategyDetail: 'Dynamic leverage allocation (1-2x) on tokenized S&P 500 exposure. Increases leverage during confirmed uptrends, reduces exposure during volatility spikes. Returns depend on S&P 500 price movement, NOT yield.',
    description: 'Smart beta exposure to the S&P 500 with adaptive risk management. Momentum signals drive leverage decisions to capture upside while limiting drawdowns. ⚠️ This is equity exposure, not a yield product.',
    leverage: '1.5x',
    protocols: ['Centrifuge', 'Morpho', 'Aave'],
    protocolLogos: ['🔷', '🦋', '👻'],
    protocolLogoUrls: ['/logos/centrifuge.svg', '/logos/morpho.svg', '/logos/aave.svg'],
    apy: {
      base: 0,        // Equity has no yield - returns are price-based
      boosted: 0,     // No guaranteed APY
      apy7d: 0,
      apy30d: 0
    },
    metrics: {
      tvl: 1500000,
      nav: 1.15,
      change7d: 2.35,
      change30d: 12.80,
      managementFee: 0.60,
      performanceFee: 15,
      holders: 4,
      monthlyVolume: 12000000
    },
    eligibility: 'Non-U.S. Professional Investors',
    minInvestment: '$100,000',
    redemption: 'Daily (T+2)',
    risk: 'Medium',
    chain: 'Base',
    networks: ['Base', 'Ethereum'],
    centrifugePoolId: '281474976710665',
    inceptionDate: 'Nov 2025'
  },
  {
    id: 'spxa-short',
    name: 'SPXA Short Exposure',
    symbol: 'tqSPXA-S',
    underlying: 'USDC',
    underlyingName: 'Short S&P 500 via Morpho',
    logo: '/logos/spxa.svg',
    assetClass: 'Equity Index (Short)',
    strategy: 'Short Exposure',
    strategyDetail: 'Deposits USDC as collateral on Morpho Blue, borrows SPXA, and immediately sells for USDC. Profits when S&P 500 declines, loses when it rises. Position maintained at -1x exposure with automatic rebalancing.',
    description: 'Inverse exposure to the tokenized S&P 500. Deposit USDC to open a short position on SPXA through Morpho Blue lending. ⚠️ HIGH RISK: Unlimited loss potential if S&P rises significantly. Use for hedging or bearish bets only.',
    leverage: '-1x',
    protocols: ['Morpho Blue', 'Uniswap', 'Centrifuge'],
    protocolLogos: ['🦋', '🦄', '🔷'],
    protocolLogoUrls: ['/logos/morpho.svg', '/logos/uniswap.svg', '/logos/centrifuge.svg'],
    apy: {
      base: 0,       // No yield - this is directional exposure
      boosted: 0,    // No APY - returns depend on price decline
      apy7d: 0,
      apy30d: 0
    },
    metrics: {
      tvl: 500000,
      nav: 1.00,
      change7d: -2.35,   // Inverse of S&P movement
      change30d: -12.80, // Inverse of S&P movement
      managementFee: 0.80,
      performanceFee: 20,
      holders: 2,
      monthlyVolume: 3000000
    },
    eligibility: 'Non-U.S. Professional Investors',
    minInvestment: '$50,000',
    redemption: 'Daily (T+1)',
    risk: 'High',
    chain: 'Base',
    networks: ['Base'],
    centrifugePoolId: '281474976710666',
    inceptionDate: 'Jan 2026'
  }
]

export const formatTVL = (tvl: number): string => {
  if (tvl >= 1000000000) {
    return `$${(tvl / 1000000000).toFixed(2)}B`
  }
  if (tvl >= 1000000) {
    return `$${(tvl / 1000000).toFixed(1)}M`
  }
  if (tvl >= 1000) {
    return `$${(tvl / 1000).toFixed(0)}K`
  }
  return `$${tvl}`
}

export const formatVolume = (vol: number): string => {
  if (vol >= 1000000000) {
    return `$${(vol / 1000000000).toFixed(1)}B`
  }
  if (vol >= 1000000) {
    return `$${(vol / 1000000).toFixed(0)}M`
  }
  return `$${(vol / 1000).toFixed(0)}K`
}

export const totalTVL = vaults.reduce((acc, v) => acc + v.metrics.tvl, 0)
export const avgAPY = vaults.filter(v => v.apy.boosted > 0).reduce((acc, v) => acc + v.apy.boosted, 0) / vaults.filter(v => v.apy.boosted > 0).length
export const totalVolume = vaults.reduce((acc, v) => acc + v.metrics.monthlyVolume, 0)
