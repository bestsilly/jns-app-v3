import '@rainbow-me/rainbowkit/styles.css'
import { DefaultOptions, QueryClient } from '@tanstack/react-query'
import { Chain, ChainProviderFn, configureChains, createClient } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { makePersistent } from '@app/utils/persist'

import { getDefaultWallets } from './getDefaultWallets'

const CHAIN_NAME = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'jfintestnet' : 'jfin'

const supportedChains = {
  jfin: {
    id: 3501,
    name: 'jfin',
    nativeCurrency: {
      name: 'JFIN',
      symbol: 'JFIN',
      decimals: 18,
    },
    network: 'JFIN',
    rpcUrls: {
      default: {
        http: ['https://rpc.jfinchain.com'],
      },
      public: {
        http: ['https://rpc.jfinchain.com'],
      },
    },
  } as Chain,
  jfintestnet: {
    id: 3502,
    name: 'jfintestnet',
    nativeCurrency: {
      name: 'JFIN',
      symbol: 'JFIN',
      decimals: 18,
    },
    network: 'JFINTestnet',
    rpcUrls: {
      default: {
        http: ['https://rpc.testnet.jfinchain.com'],
      },
      public: {
        http: ['https://rpc.testnet.jfinchain.com'],
      },
    },
  } as Chain,
}

const providerArray: ChainProviderFn<Chain>[] = []

if (process.env.NEXT_PUBLIC_PROVIDER) {
  // for local testing
  providerArray.push(
    jsonRpcProvider({
      rpc: () => ({ http: process.env.NEXT_PUBLIC_PROVIDER! }),
    }),
  )
} else {
  if (!process.env.NEXT_PUBLIC_IPFS) {
    // only use infura if we are not using IPFS
    // since we don't want to allow all domains to access infura
    providerArray.push(
      infuraProvider({
        apiKey: process.env.NEXT_PUBLIC_INFURA_KEY || 'cfa6ae2501cc4354a74e20432507317c',
      }),
    )
  }
  // fallback cloudflare gateway if infura is down or for IPFS
  providerArray.push(
    jsonRpcProvider({
      rpc: (c) => ({
        http: `https://web3.ens.domains/v1/${c.network === 'homestead' ? 'mainnet' : c.network}`,
      }),
    }),
  )
}

const { provider, chains } = configureChains([supportedChains[CHAIN_NAME]], providerArray)

const connectors = getDefaultWallets({
  appName: process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 'Testnet' : 'Mainnet',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  queryClient,
  persister: null,
})

makePersistent(queryClient)

export const refetchOptions: DefaultOptions<unknown> = {
  queries: {
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 120,
    meta: {
      isRefetchQuery: true,
    },
    refetchOnMount: 'always',
  },
}

const queryClientWithRefetch = new QueryClient({
  queryCache: queryClient.getQueryCache(),
  defaultOptions: refetchOptions,
  mutationCache: queryClient.getMutationCache(),
})

const wagmiClientWithRefetch = createClient({
  autoConnect: true,
  connectors,
  provider,
  queryClient: queryClientWithRefetch,
  persister: null,
})

export { chains, queryClient, wagmiClient, wagmiClientWithRefetch }
