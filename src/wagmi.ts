import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, base, arbitrum } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Torque Finance',
  projectId: 'torque-finance-demo', // Replace with real WalletConnect project ID
  chains: [mainnet, base, arbitrum],
  ssr: false,
})
