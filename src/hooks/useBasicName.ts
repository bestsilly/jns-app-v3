import { useMemo } from 'react'
import { useQuery } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils/format'

import { ReturnedENS } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'
import { emptyAddress } from '@app/utils/constants'
import { getRegistrationStatus } from '@app/utils/registrationStatus'
import { isLabelTooLong, yearsToSeconds } from '@app/utils/utils'

import { useGlobalErrorFunc } from './errors/useGlobalErrorFunc'
import { usePccExpired } from './fuses/usePccExpired'
import { useChainId } from './useChainId'
import { useContractAddress } from './useContractAddress'
import useCurrentBlockTimestamp from './useCurrentBlockTimestamp'
import { useSupportsTLD } from './useSupportsTLD'
import { useValidate } from './useValidate'

type ENS = ReturnType<typeof useEns>
type BaseBatchReturn = [ReturnedENS['getOwner']]
type NormalBatchReturn = [...BaseBatchReturn, ReturnedENS['getWrapperData']]
type DnsBatchReturn = [...NormalBatchReturn, ReturnedENS['getResolver'], ReturnedENS['getAddr']]
type ETH2LDBatchReturn = [...NormalBatchReturn, ReturnedENS['getExpiry'], ReturnedENS['getPrice']]
type BatchReturn =
  | []
  | BaseBatchReturn
  | NormalBatchReturn
  | DnsBatchReturn
  | ETH2LDBatchReturn
  | undefined

const EXPIRY_LIVE_WATCH_TIME = 1_000 * 60 * 5 // 5 minutes

const getBatchData = (
  name: string,
  validation: any,
  ens: ENS,
  skipGraph: boolean,
): Promise<BatchReturn> => {
  // exception for "[root]", get owner of blank name
  if (name === '[root]') {
    return Promise.all([ens.getOwner('', { contract: 'registry' })])
  }

  const labels = name.split('.')
  if (validation.isETH && validation.is2LD) {
    if (validation.isShort) {
      return Promise.resolve([])
    }
    return ens.batch(
      ens.getOwner.batch(name, { skipGraph }),
      ens.getWrapperData.batch(name),
      ens.getExpiry.batch(name),
      ens.getPrice.batch(labels[0], yearsToSeconds(1), false),
    )
  }

  if (!validation.isETH && validation.is2LD) {
    const getAddrBatch = ens.getAddr.batch(name)

    return ens.batch(
      ens.getOwner.batch(name),
      ens.getWrapperData.batch(name),
      ens.getResolver.batch(name),
      {
        args: getAddrBatch.args,
        raw: getAddrBatch.raw,
        decode: async (data: string, _name: string, coinType?: string | number | undefined) => {
          const { contracts, universalWrapper } = ens
          const urData = await universalWrapper.decode(data).catch(() => undefined)
          if (!urData) return
          return getAddrBatch.decode({ contracts, universalWrapper }, data, '', coinType)
        },
      },
    )
  }

  return ens.batch(ens.getOwner.batch(name), ens.getWrapperData.batch(name))
}

type UseBasicNameOptions = {
  normalised?: boolean
  skipGraph?: boolean
  enabled?: boolean
}

export const useBasicName = (name?: string | null, options: UseBasicNameOptions = {}) => {
  const { normalised = false, skipGraph = true, enabled = true } = options
  const ens = useEns()

  const chainId = useChainId()

  const { name: _normalisedName, isValid, ...validation } = useValidate(name!, !name)

  const normalisedName = normalised ? name! : _normalisedName

  const { data: supportedTLD, isLoading: supportedTLDLoading } = useSupportsTLD(normalisedName)

  const queryKey = useQueryKeys().basicName(normalisedName, skipGraph)
  const watchedGetBatchData = useGlobalErrorFunc<typeof getBatchData>({
    queryKey,
    func: getBatchData,
    skip: skipGraph,
  })

  const {
    data: batchData,
    isLoading: batchLoading,
    isFetched,
    /** DO NOT REMOVE */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetching,
    isFetchedAfterMount,
    status,
  } = useQuery(
    queryKey,
    async () =>
      watchedGetBatchData(normalisedName, validation, ens, skipGraph).then((r) => r || null),
    {
      enabled: !!(enabled && ens.ready && name && isValid),
    },
  )
  const [ownerData, _wrapperData, expiryOrResolverData, priceOrAddrData] = batchData || []
  const expiryData =
    validation.isETH && validation.is2LD
      ? (expiryOrResolverData as ReturnedENS['getExpiry'])
      : undefined
  const priceData =
    validation.isETH && validation.is2LD ? (priceOrAddrData as ReturnedENS['getPrice']) : undefined
  const addrData =
    !validation.isETH && validation.is2LD ? (priceOrAddrData as ReturnedENS['getAddr']) : undefined

  const wrapperData = useMemo(() => {
    if (!_wrapperData) return undefined
    const { expiryDate, ...rest } = _wrapperData
    return {
      ...rest,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    }
  }, [_wrapperData])

  const expiryDate = expiryData?.expiry ? new Date(expiryData.expiry) : undefined

  const gracePeriodEndDate =
    expiryDate && expiryData?.gracePeriod
      ? new Date(expiryDate.getTime() + expiryData.gracePeriod)
      : undefined

  const isTempPremiumDesynced = !!(
    gracePeriodEndDate &&
    Date.now() + EXPIRY_LIVE_WATCH_TIME > gracePeriodEndDate.getTime() &&
    gracePeriodEndDate.getTime() > Date.now() - EXPIRY_LIVE_WATCH_TIME
  )

  const blockTimestamp = useCurrentBlockTimestamp({ enabled: isTempPremiumDesynced })

  const registrationStatusTimestamp = useMemo(() => {
    if (!isTempPremiumDesynced) return Date.now()
    if (blockTimestamp) return blockTimestamp * 1000
    return Date.now() - EXPIRY_LIVE_WATCH_TIME
  }, [isTempPremiumDesynced, blockTimestamp])

  const registrationStatus = batchData
    ? getRegistrationStatus({
        timestamp: registrationStatusTimestamp,
        validation,
        ownerData,
        wrapperData,
        expiryOrResolverData,
        priceOrAddrData,
        supportedTLD,
        chainId,
      })
    : undefined

  const truncatedName = normalisedName ? truncateFormat(normalisedName) : undefined

  const nameWrapperAddress = useContractAddress('NameWrapper')
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const canBeWrapped = useMemo(
    () =>
      !!(
        ens.ready &&
        nameWrapperAddress &&
        nameWrapperAddress !== emptyAddress &&
        !isWrapped &&
        normalisedName?.endsWith('.eth') &&
        !isLabelTooLong(normalisedName)
      ),
    [ens.ready, nameWrapperAddress, isWrapped, normalisedName],
  )
  const pccExpired = usePccExpired({ ownerData, wrapperData })

  const isLoading = !ens.ready || batchLoading || supportedTLDLoading

  return {
    ...validation,
    normalisedName,
    isValid,
    ownerData,
    wrapperData,
    priceData,
    expiryDate,
    gracePeriodEndDate,
    isLoading,
    truncatedName,
    registrationStatus,
    isWrapped: ownerData?.ownershipLevel === 'nameWrapper',
    pccExpired,
    canBeWrapped,
    addrData: addrData as string | undefined,
    isCachedData: status === 'success' && isFetched && !isFetchedAfterMount,
  }
}
