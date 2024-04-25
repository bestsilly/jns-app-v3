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
    blockExplorers: {
      default: {
        name: 'JFIN Scan',
        url: 'https://jfinscan.com/',
      },
    },
    contracts: {
      ensRegistry: {
        address: '0x75b8e9cA8991A390720488d80AA6789D048485E5',
      },
      ensUniversalResolver: {
        address: '0x606ccc2fd102035d3844eCFb44277D6625404499',
        blockCreated: 18431911,
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 13857465,
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
    contracts: {
      ensRegistry: {
        address: '0x8Dd72c36Df956bC2220b09dAc908DdC8C62AeC2b',
      },
      ensUniversalResolver: {
        address: '0x192624E2A70Ffbf9215F2Ea9909fBDD9d1bac720',
        blockCreated: 18280526,
      },
      multicall3: {
        address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        blockCreated: 13854497,
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
