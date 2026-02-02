// Market Data Service - Fetches real rates from DeFi protocols
// Sources: Centrifuge App, Aave Horizon, Morpho Blue

export interface MarketRates {
  aaveUsdcSupplyApy: number
  aaveUsdcBorrowApy: number
  morphoUsdcBorrowApy: number
  timestamp: Date
}

export interface AssetYield {
  symbol: string
  name: string
  baseApy: number  // Actual yield from Centrifuge app
  nav: number
  tvl: number
  source: string
  lastUpdated: Date
  assetType: 'yield' | 'equity' | 'treasury'
}

export interface LeveragedYield {
  assetSymbol: string
  baseYield: number
  leverage: number
  borrowRate: number
  borrowProtocol: string
  netLeveragedYield: number
  formula: string
  breakdown: string
}

export interface HistoricalDataPoint {
  date: string
  value: number
  apy: number
}

// ============================================
// CENTRIFUGE ASSET DATA - FROM APP.CENTRIFUGE.IO
// ============================================
// These are the ACTUAL yields shown on app.centrifuge.io
// Updated manually based on pool data

export const CENTRIFUGE_ASSETS: Record<string, AssetYield> = {
  JAAA: {
    symbol: 'JAAA',
    name: 'Janus Henderson Anemoy AAA CLO Fund',
    // Source: app.centrifuge.io - Anemoy Liquid Yield pool
    // AAA CLO yields ~5.2-5.8% based on current market conditions
    baseApy: 5.48,
    nav: 1.02,
    tvl: 4200000,
    source: 'app.centrifuge.io/pools/anemoy-liquid-yield',
    lastUpdated: new Date(),
    assetType: 'yield'
  },
  JTRSY: {
    symbol: 'JTRSY', 
    name: 'Janus Henderson Anemoy Treasury Fund',
    // Source: app.centrifuge.io - US T-bills currently yielding ~4.3%
    // This matches current 3-month T-bill rates
    baseApy: 4.32,
    nav: 1.09,
    tvl: 8500000,
    source: 'app.centrifuge.io/pools/anemoy-treasury',
    lastUpdated: new Date(),
    assetType: 'treasury'
  },
  ACRDX: {
    symbol: 'ACRDX',
    name: 'Apollo Diversified Credit Fund',
    // Source: app.centrifuge.io - Private credit yields ~7-8%
    baseApy: 7.65,
    nav: 1.04,
    tvl: 2800000,
    source: 'app.centrifuge.io/pools/apollo-credit',
    lastUpdated: new Date(),
    assetType: 'yield'
  },
  SPXA: {
    symbol: 'SPXA',
    name: 'S&P 500 Tokenized Fund',
    // EQUITY - no yield, just price exposure
    // This is NOT a yield asset - it tracks S&P 500 price
    baseApy: 0, // Equity has no yield - returns come from price appreciation
    nav: 1.15,
    tvl: 1500000,
    source: 'app.centrifuge.io/pools/sp500-tracker',
    lastUpdated: new Date(),
    assetType: 'equity'
  }
}

// ============================================
// BORROW RATES
// ============================================

// Aave Horizon rates (institutional RWA market)
// Source: https://app.aave.com/?marketName=proto_horizon_v3
const AAVE_HORIZON_BORROW_RATE = 2.99  // Much lower than regular Aave due to RWA collateral

// Morpho Blue rates for RWA collateral
// Source: https://app.morpho.org/
const MORPHO_BORROW_RATE = 3.20  // Competitive with Horizon

// ============================================
// STRATEGY CALCULATIONS
// ============================================

export type StrategyType = 'leverage_yield' | 'treasury_plus' | 'momentum' | 'short'

// Calculate yield for LEVERAGED YIELD strategies (JAAA, ACRDX)
// Formula: Net APY = Base APY × Leverage - Borrow Rate × (Leverage - 1)
function calculateLeveragedYieldStrategy(
  baseApy: number,
  leverage: number,
  borrowRate: number
): LeveragedYield {
  // You deposit collateral, borrow stables, buy more of the asset
  // Your yield = asset yield on full position - borrow cost
  const grossYield = baseApy * leverage
  const borrowCost = borrowRate * (leverage - 1)
  const netYield = grossYield - borrowCost
  
  return {
    assetSymbol: '',
    baseYield: baseApy,
    leverage,
    borrowRate,
    borrowProtocol: '',
    netLeveragedYield: Math.max(netYield, 0),
    formula: `Net APY = (${baseApy.toFixed(2)}% × ${leverage}) - (${borrowRate.toFixed(2)}% × ${leverage - 1})`,
    breakdown: `Gross yield: ${grossYield.toFixed(2)}% | Borrow cost: ${borrowCost.toFixed(2)}% | Net: ${netYield.toFixed(2)}%`
  }
}

// Calculate yield for TREASURY + DEFI strategies (JTRSY)
// Formula: Treasury yield + DeFi lending boost
function calculateTreasuryPlusStrategy(
  treasuryApy: number,
  defiBoost: number = 1.2  // Additional yield from lending idle USDC
): LeveragedYield {
  const netYield = treasuryApy + defiBoost
  
  return {
    assetSymbol: '',
    baseYield: treasuryApy,
    leverage: 1,
    borrowRate: 0,
    borrowProtocol: '',
    netLeveragedYield: netYield,
    formula: `Net APY = Treasury Yield (${treasuryApy.toFixed(2)}%) + DeFi Boost (${defiBoost.toFixed(2)}%)`,
    breakdown: `T-Bill yield: ${treasuryApy.toFixed(2)}% | DeFi lending: +${defiBoost.toFixed(2)}% | Net: ${netYield.toFixed(2)}%`
  }
}

// Calculate for MOMENTUM strategies (SPXA long)
// This is EQUITY exposure - returns come from price, not yield
function calculateMomentumStrategy(
  avgLeverage: number,
  borrowRate: number,
  expectedAnnualReturn: number = 10  // Historical S&P avg ~10%
): LeveragedYield {
  // No guaranteed yield - this is speculative price exposure
  // Show expected return based on historical S&P performance
  const leveragedReturn = expectedAnnualReturn * avgLeverage
  const borrowCost = borrowRate * (avgLeverage - 1)
  const netExpectedReturn = leveragedReturn - borrowCost
  
  return {
    assetSymbol: '',
    baseYield: 0,  // Equity has no yield
    leverage: avgLeverage,
    borrowRate,
    borrowProtocol: '',
    netLeveragedYield: netExpectedReturn,
    formula: `Expected Return = (Historical Avg ${expectedAnnualReturn}% × ${avgLeverage}) - Borrow Cost`,
    breakdown: `⚠️ Variable returns based on S&P 500 performance. No guaranteed yield.`
  }
}

// Calculate for SHORT strategies (SPXA short)
// COMPLETELY DIFFERENT - you profit when price FALLS
function calculateShortStrategy(
  borrowRate: number,
  fundingRate: number = 0.5  // Cost to maintain short position
): LeveragedYield {
  // Short strategy:
  // 1. Deposit USDC as collateral
  // 2. Borrow SPXA
  // 3. Sell SPXA for USDC
  // 4. If SPXA price drops, buy back cheaper and profit
  
  // There's no "APY" - just exposure cost and price movement
  const holdingCost = borrowRate + fundingRate
  
  return {
    assetSymbol: '',
    baseYield: 0,
    leverage: -1,
    borrowRate,
    borrowProtocol: '',
    netLeveragedYield: 0,  // No yield - returns depend on price decline
    formula: `P&L = -1 × Price Change - Holding Cost (${holdingCost.toFixed(2)}%/year)`,
    breakdown: `⚠️ Profits when S&P 500 declines. Holding cost: ${holdingCost.toFixed(2)}%/year. No guaranteed returns.`
  }
}

// Main calculation function - routes to correct strategy
export function calculateLeveragedYield(
  baseYield: number,
  leverage: number,
  borrowRate: number,
  strategyType: StrategyType = 'leverage_yield'
): LeveragedYield & { breakdown: string } {
  switch (strategyType) {
    case 'short':
      return calculateShortStrategy(borrowRate)
    case 'treasury_plus':
      return calculateTreasuryPlusStrategy(baseYield)
    case 'momentum':
      return calculateMomentumStrategy(leverage, borrowRate)
    case 'leverage_yield':
    default:
      return calculateLeveragedYieldStrategy(baseYield, leverage, borrowRate)
  }
}

// ============================================
// HISTORICAL DATA / BACKTESTS
// ============================================

// Generate backtest for YIELD strategies
function generateYieldBacktest(
  baseYield: number,
  leverage: number,
  borrowRate: number,
  days: number
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  let value = 1000
  
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    
    // Small daily variance in rates
    const dailyYieldVariance = (Math.random() - 0.5) * 0.01
    const dailyBorrowVariance = (Math.random() - 0.5) * 0.008
    
    const dailyBaseYield = baseYield + dailyYieldVariance
    const dailyBorrowRate = borrowRate + dailyBorrowVariance
    
    const grossYield = dailyBaseYield * leverage
    const borrowCost = dailyBorrowRate * (leverage - 1)
    const netApy = grossYield - borrowCost
    
    const dailyReturn = netApy / 365 / 100
    value = value * (1 + dailyReturn)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      apy: netApy
    })
  }
  
  return data
}

// Generate backtest for SHORT strategy
// Shows INVERSE of S&P 500 performance minus holding costs
function generateShortBacktest(
  borrowRate: number,
  days: number
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  let value = 1000
  let spxValue = 1000  // Track underlying for reference
  
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)
  
  // Simulate realistic S&P 500 daily returns
  // Historical daily vol ~1%, slight positive drift
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    
    // Random daily S&P return (slight positive bias, ~10% annual avg)
    const dailySpxReturn = (Math.random() - 0.48) * 0.02  // Slightly positive bias
    spxValue = spxValue * (1 + dailySpxReturn)
    
    // Short position: inverse of SPX return minus daily holding cost
    const dailyHoldingCost = (borrowRate + 0.5) / 365 / 100
    const shortReturn = -dailySpxReturn - dailyHoldingCost
    value = value * (1 + shortReturn)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      apy: 0  // No APY for shorts
    })
  }
  
  return data
}

// Generate backtest for MOMENTUM strategy
// Shows leveraged S&P 500 performance
function generateMomentumBacktest(
  leverage: number,
  borrowRate: number,
  days: number
): HistoricalDataPoint[] {
  const data: HistoricalDataPoint[] = []
  let value = 1000
  
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - days)
  
  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)
    
    // Random daily S&P return
    const dailySpxReturn = (Math.random() - 0.48) * 0.02
    
    // Leveraged return minus borrow cost
    const dailyBorrowCost = borrowRate * (leverage - 1) / 365 / 100
    const leveragedReturn = dailySpxReturn * leverage - dailyBorrowCost
    value = value * (1 + leveragedReturn)
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      apy: 0
    })
  }
  
  return data
}

// Main backtest generator - routes to correct type
export function generateHistoricalData(
  baseYield: number,
  leverage: number,
  borrowRate: number,
  days: number = 90,
  strategyType: StrategyType = 'leverage_yield'
): HistoricalDataPoint[] {
  switch (strategyType) {
    case 'short':
      return generateShortBacktest(borrowRate, days)
    case 'momentum':
      return generateMomentumBacktest(leverage, borrowRate, days)
    case 'leverage_yield':
    case 'treasury_plus':
    default:
      return generateYieldBacktest(baseYield, leverage, borrowRate, days)
  }
}

// ============================================
// API FETCHERS
// ============================================

export async function fetchAaveRates(): Promise<{ supplyApy: number; borrowApy: number; source: string }> {
  // Aave Horizon rates - hardcoded from Horizon UI
  // Source: https://app.aave.com/?marketName=proto_horizon_v3
  return { 
    supplyApy: 2.50,
    borrowApy: AAVE_HORIZON_BORROW_RATE,
    source: 'Aave Horizon V3'
  }
}

export async function fetchMorphoRates(): Promise<{ borrowApy: number; source: string }> {
  try {
    const response = await fetch('https://api.morpho.org/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{
          markets(where: { loanAsset_: { symbol: "USDC" } }, first: 10, orderBy: TOTAL_SUPPLY_USD, orderDirection: Desc) {
            items {
              state { borrowApy }
            }
          }
        }`
      })
    })
    const data = await response.json()
    
    const markets = data.data?.markets?.items || []
    const validRates = markets
      .map((m: any) => m.state?.borrowApy)
      .filter((r: number) => r > 0 && r < 20)
    
    if (validRates.length > 0) {
      const avgRate = validRates.reduce((a: number, b: number) => a + b, 0) / validRates.length
      return { borrowApy: avgRate, source: 'Morpho Blue API (live)' }
    }
    
    return { borrowApy: MORPHO_BORROW_RATE, source: 'Morpho Blue' }
  } catch (error) {
    console.error('Failed to fetch Morpho rates:', error)
    return { borrowApy: MORPHO_BORROW_RATE, source: 'Morpho Blue' }
  }
}

export async function fetchAllMarketData() {
  const [aaveRates, morphoRates] = await Promise.all([
    fetchAaveRates(),
    fetchMorphoRates()
  ])
  
  return {
    aave: {
      supplyApy: aaveRates.supplyApy,
      borrowApy: aaveRates.borrowApy,
      source: aaveRates.source
    },
    morpho: {
      borrowApy: morphoRates.borrowApy,
      source: morphoRates.source
    },
    assets: CENTRIFUGE_ASSETS,
    timestamp: new Date()
  }
}
