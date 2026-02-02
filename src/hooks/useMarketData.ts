import { useState, useEffect } from 'react'
import { 
  fetchAllMarketData, 
  calculateLeveragedYield, 
  generateHistoricalData,
  CENTRIFUGE_ASSETS,
  type HistoricalDataPoint,
  type StrategyType
} from '../services/marketData'

export interface VaultMarketData {
  baseApy: number
  borrowRate: number
  borrowProtocol: string
  leverage: number
  netApy: number
  formula: string
  breakdown: string
  historicalData: HistoricalDataPoint[]
  sources: {
    assetSource: string
    borrowSource: string
  }
  strategyType: StrategyType
  isYieldStrategy: boolean  // true = shows APY, false = shows exposure
}

export interface MarketDataState {
  aaveSupplyApy: number
  aaveBorrowApy: number
  morphoBorrowApy: number
  vaults: Record<string, VaultMarketData>
  loading: boolean
  lastUpdated: Date | null
}

// Vault configurations with proper strategy types
const VAULT_CONFIGS: Record<string, {
  asset: string
  leverage: number
  borrowProtocol: 'aave' | 'morpho'
  borrowProtocolName: string
  strategyType: StrategyType
}> = {
  'jaaa-loop': { 
    asset: 'JAAA', 
    leverage: 3, 
    borrowProtocol: 'aave',
    borrowProtocolName: 'Aave Horizon',
    strategyType: 'leverage_yield'
  },
  'acrdx-loop': { 
    asset: 'ACRDX', 
    leverage: 2, 
    borrowProtocol: 'morpho',
    borrowProtocolName: 'Morpho Blue',
    strategyType: 'leverage_yield'
  },
  'jtrsy-stable': { 
    asset: 'JTRSY', 
    leverage: 1, 
    borrowProtocol: 'aave',
    borrowProtocolName: 'N/A (no borrowing)',
    strategyType: 'treasury_plus'
  },
  'spxa-momentum': { 
    asset: 'SPXA', 
    leverage: 1.5, 
    borrowProtocol: 'morpho',
    borrowProtocolName: 'Morpho Blue',
    strategyType: 'momentum'
  },
  'spxa-short': { 
    asset: 'SPXA', 
    leverage: -1, 
    borrowProtocol: 'morpho',
    borrowProtocolName: 'Morpho Blue',
    strategyType: 'short'
  }
}

export function useMarketData() {
  const [state, setState] = useState<MarketDataState>({
    aaveSupplyApy: 2.50,
    aaveBorrowApy: 2.99,
    morphoBorrowApy: 3.20,
    vaults: {},
    loading: true,
    lastUpdated: null
  })

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllMarketData()
        
        const vaults: Record<string, VaultMarketData> = {}
        
        for (const [vaultId, config] of Object.entries(VAULT_CONFIGS)) {
          const asset = CENTRIFUGE_ASSETS[config.asset]
          const borrowRate = config.borrowProtocol === 'aave' 
            ? data.aave.borrowApy 
            : data.morpho.borrowApy
          
          // Use strategy-specific calculation
          const result = calculateLeveragedYield(
            asset.baseApy,
            config.leverage,
            borrowRate,
            config.strategyType
          )
          
          // Use strategy-specific backtest
          const historical = generateHistoricalData(
            asset.baseApy,
            config.leverage,
            borrowRate,
            90,
            config.strategyType
          )
          
          // Determine if this is a yield strategy or exposure strategy
          const isYieldStrategy = config.strategyType === 'leverage_yield' || 
                                   config.strategyType === 'treasury_plus'
          
          vaults[vaultId] = {
            baseApy: asset.baseApy,
            borrowRate,
            borrowProtocol: config.borrowProtocolName,
            leverage: config.leverage,
            netApy: result.netLeveragedYield,
            formula: result.formula,
            breakdown: result.breakdown,
            historicalData: historical,
            sources: {
              assetSource: asset.source,
              borrowSource: config.strategyType === 'treasury_plus' 
                ? 'N/A'
                : (config.borrowProtocol === 'aave' ? data.aave.source : data.morpho.source)
            },
            strategyType: config.strategyType,
            isYieldStrategy
          }
        }
        
        setState({
          aaveSupplyApy: data.aave.supplyApy,
          aaveBorrowApy: data.aave.borrowApy,
          morphoBorrowApy: data.morpho.borrowApy,
          vaults,
          loading: false,
          lastUpdated: data.timestamp
        })
      } catch (error) {
        console.error('Failed to load market data:', error)
        setState(prev => ({ ...prev, loading: false }))
      }
    }
    
    loadData()
    
    // Refresh every 5 minutes
    const interval = setInterval(loadData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  return state
}
