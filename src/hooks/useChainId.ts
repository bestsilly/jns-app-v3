import { useNetwork } from 'wagmi'

export const useChainId = (): number => {
  const chainId = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 3502 : 3501
  const { chain } = useNetwork()
  return chain?.id || chainId
}
