export interface Vault {
  id: string
  name: string
  symbol: string
  underlying: string
  underlyingName: string
  strategy: string
  strategyDetail: string
  description: string
  leverage: string
  protocols: string[]
  protocolLogos: string[]
  apy: {
    base: number
    boosted: number
    historical30d: number
    forecast: number
  }
  tvl: number
  risk: 'Low' | 'Medium' | 'High'
  chain: string
  centrifugePoolId: string
  backtesting: {
    period: string
    return: number
    maxDrawdown: number
    sharpe: number
  }
}

export const vaults: Vault[] = [
  {
    id: 'jaaa-loop',
    name: 'JAAA 3x Loop',
    symbol: 'tqJAAA',
    underlying: 'JAAA',
    underlyingName: 'Janus Henderson Anemoy AAA CLO Fund',
    strategy: '3x Leverage Loop on Aave Horizon',
    strategyDetail: 'Deposits JAAA as collateral on Aave Horizon, borrows USDC, swaps to more JAAA, repeats to achieve 3x leverage on AAA CLO yields.',
    description: 'Maximize yield on institutional-grade AAA CLO exposure through recursive lending. JAAA provides exposure to diversified senior secured loans, amplified through DeFi leverage.',
    leverage: '3x',
    protocols: ['Centrifuge', 'Aave Horizon', 'Uniswap'],
    protocolLogos: ['🔷', '👻', '🦄'],
    apy: {
      base: 5.9,
      boosted: 14.8,
      historical30d: 13.2,
      forecast: 15.5
    },
    tvl: 4200000,
    risk: 'Medium',
    chain: 'Ethereum',
    centrifugePoolId: '281474976710663',
    backtesting: {
      period: '6 months',
      return: 8.4,
      maxDrawdown: -2.1,
      sharpe: 2.3
    }
  },
  {
    id: 'acrdx-loop',
    name: 'ACRDX 2x Loop',
    symbol: 'tqACRDX',
    underlying: 'ACRDX',
    underlyingName: 'Anemoy Tokenized Apollo Diversified Credit Fund',
    strategy: '2x Leverage Loop on Morpho',
    strategyDetail: 'Deposits ACRDX as collateral on Morpho Blue, borrows USDC at optimized rates, acquires additional ACRDX for 2x leverage.',
    description: 'Enhanced returns on Apollo\'s diversified credit portfolio through Morpho\'s efficient lending markets. Conservative 2x leverage maintains lower liquidation risk.',
    leverage: '2x',
    protocols: ['Centrifuge', 'Morpho Blue', '1inch'],
    protocolLogos: ['🔷', '🦋', '🔴'],
    apy: {
      base: 7.2,
      boosted: 12.4,
      historical30d: 11.8,
      forecast: 13.0
    },
    tvl: 2800000,
    risk: 'Low',
    chain: 'Ethereum',
    centrifugePoolId: '281474976710664',
    backtesting: {
      period: '6 months',
      return: 6.8,
      maxDrawdown: -1.4,
      sharpe: 2.8
    }
  },
  {
    id: 'jtrsy-stable',
    name: 'JTRSY Yield',
    symbol: 'tqJTRSY',
    underlying: 'JTRSY',
    underlyingName: 'Janus Henderson Anemoy Treasury Fund',
    strategy: 'Treasury + DeFi Lending',
    strategyDetail: 'Holds JTRSY (tokenized T-bills) and deploys idle capital to Aave/Compound for additional yield without leverage.',
    description: 'Ultra-safe treasury exposure with DeFi yield enhancement. No leverage, no liquidation risk. Perfect for conservative allocations seeking yield above traditional T-bills.',
    leverage: '1x',
    protocols: ['Centrifuge', 'Aave', 'Compound'],
    protocolLogos: ['🔷', '👻', '🟢'],
    apy: {
      base: 4.8,
      boosted: 5.6,
      historical30d: 5.4,
      forecast: 5.8
    },
    tvl: 8500000,
    risk: 'Low',
    chain: 'Ethereum',
    centrifugePoolId: '281474976710662',
    backtesting: {
      period: '6 months',
      return: 2.9,
      maxDrawdown: -0.2,
      sharpe: 4.1
    }
  },
  {
    id: 'spxa-momentum',
    name: 'SPXA Momentum',
    symbol: 'tqSPXA',
    underlying: 'SPXA',
    underlyingName: 'Janus Henderson Anemoy S&P500® Fund',
    strategy: '1.5x Momentum Strategy',
    strategyDetail: 'Dynamic leverage on tokenized S&P 500 exposure. Increases leverage in uptrends, reduces in downtrends based on momentum signals.',
    description: 'Smart beta exposure to the S&P 500 with adaptive leverage. Momentum-based strategy aims to capture upside while reducing drawdowns.',
    leverage: '1.5x',
    protocols: ['Centrifuge', 'Morpho', 'Aave'],
    protocolLogos: ['🔷', '🦋', '👻'],
    apy: {
      base: 8.5,
      boosted: 11.2,
      historical30d: 9.8,
      forecast: 12.5
    },
    tvl: 1500000,
    risk: 'Medium',
    chain: 'Base',
    centrifugePoolId: '281474976710665',
    backtesting: {
      period: '6 months',
      return: 5.8,
      maxDrawdown: -4.2,
      sharpe: 1.6
    }
  }
]

export const formatTVL = (tvl: number): string => {
  if (tvl >= 1000000) {
    return `$${(tvl / 1000000).toFixed(1)}M`
  }
  if (tvl >= 1000) {
    return `$${(tvl / 1000).toFixed(0)}K`
  }
  return `$${tvl}`
}

export const totalTVL = vaults.reduce((acc, v) => acc + v.tvl, 0)
export const avgAPY = vaults.reduce((acc, v) => acc + v.apy.boosted, 0) / vaults.length
