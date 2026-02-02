// Fetch real wallet balances for strategy TVL
import { STRATEGY_WALLETS } from '../config/wallets'

// RPC endpoints for different chains
const RPC_ENDPOINTS = {
  ethereum: 'https://eth.llamarpc.com',
  base: 'https://mainnet.base.org'
}

export interface WalletBalance {
  address: string
  balanceEth: number
  balanceUsd: number
}

export interface TotalTVL {
  totalUsd: number
  byStrategy: Record<string, number>
  lastUpdated: Date
}

// Fetch ETH balance for an address
async function fetchEthBalance(address: string, rpc: string): Promise<number> {
  try {
    const response = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1
      })
    })
    const data = await response.json()
    const balanceWei = parseInt(data.result, 16)
    return balanceWei / 1e18 // Convert to ETH
  } catch (error) {
    console.error(`Failed to fetch balance for ${address}:`, error)
    return 0
  }
}

// Get current ETH price in USD
async function getEthPrice(): Promise<number> {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
    const data = await response.json()
    return data.ethereum?.usd || 2500 // Fallback price
  } catch {
    return 2500 // Fallback
  }
}

// Fetch all strategy wallet balances
export async function fetchStrategyTVL(): Promise<TotalTVL> {
  const ethPrice = await getEthPrice()
  const byStrategy: Record<string, number> = {}
  let totalUsd = 0

  for (const [strategyId, address] of Object.entries(STRATEGY_WALLETS)) {
    // Determine which chain this strategy is on
    const rpc = strategyId.includes('spxa') 
      ? RPC_ENDPOINTS.base 
      : RPC_ENDPOINTS.ethereum
    
    const balanceEth = await fetchEthBalance(address, rpc)
    const balanceUsd = balanceEth * ethPrice
    
    byStrategy[strategyId] = balanceUsd
    totalUsd += balanceUsd
  }

  return {
    totalUsd,
    byStrategy,
    lastUpdated: new Date()
  }
}

// Get strategy count
export function getStrategyCount(): number {
  return Object.keys(STRATEGY_WALLETS).length
}
