import { useNetwork } from 'wagmi'

export const useChainId = (): number => {
  const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET ? 3502 : 3501
  const { chain } = useNetwork()
  return chain?.id || isTestnet
}
