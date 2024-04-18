import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useProvider, useQuery } from 'wagmi'

import AggregatorInterface from '@ensdomains/ens-contracts/build/contracts/AggregatorInterface.json'

// import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { CONTRACT_ADDRESSES } from '@app/utils/constants'

const isTestnet = process.env.NEXT_PUBLIC_IS_TESTNET ? 3502 : 3501
const ORACLE_DUMMY = CONTRACT_ADDRESSES[isTestnet].dummyOracle

export const useEthPrice = () => {
  const provider = useProvider()
  const { ready } = useEns()
  const { data, isLoading: loading } = useQuery(
    useQueryKeys().ethPrice,
    async () => {
      const address = ORACLE_DUMMY
      if (!address) throw new Error('Contract address not found')
      if (typeof address !== 'string') throw new Error('Contract address is wrong type')
      const oracle = new Contract(address, AggregatorInterface, provider)
      const latest = (await oracle.latestAnswer()) as BigNumber
      return latest
    },
    {
      enabled: !!provider && ready,
    },
  )
  return {
    data,
    loading,
  }
}
