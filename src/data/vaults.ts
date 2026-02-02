export interface Vault {
  id: string
  name: string
  strategy: string
  description: string
  asset: string
  apy: number
  tvl: number
  risk: 'Low' | 'Medium' | 'High'
  chain: string
  protocols: string[]
}

export const vaults: Vault[] = [
  {
    id: 'usdc-loop',
    name: 'USDC Leverage Loop',
    strategy: 'Recursive lending on Morpho',
    description: 'This strategy recursively deposits USDC as collateral and borrows against it to amplify lending yields. Automated rebalancing maintains optimal health factors.',
    asset: 'USDC',
    apy: 12.4,
    tvl: 2500000,
    risk: 'Medium',
    chain: 'Ethereum',
    protocols: ['Morpho', 'Aave'],
  },
  {
    id: 'eth-yield',
    name: 'ETH Yield Optimizer',
    strategy: 'stETH/wETH looping + restaking',
    description: 'Maximizes ETH yield through liquid staking derivatives and recursive lending strategies. Includes exposure to restaking protocols for additional rewards.',
    asset: 'ETH',
    apy: 8.7,
    tvl: 5100000,
    risk: 'Low',
    chain: 'Ethereum',
    protocols: ['Lido', 'Morpho', 'EigenLayer'],
  },
  {
    id: 'rwa-stable',
    name: 'RWA Stable Yield',
    strategy: 'Tokenized treasuries + DeFi lending',
    description: 'Combines the stability of tokenized real-world assets (T-bills, money market funds) with DeFi lending opportunities for enhanced yield.',
    asset: 'USDC',
    apy: 6.2,
    tvl: 1800000,
    risk: 'Low',
    chain: 'Base',
    protocols: ['Centrifuge', 'Morpho'],
  },
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
export const avgAPY = vaults.reduce((acc, v) => acc + v.apy, 0) / vaults.length
