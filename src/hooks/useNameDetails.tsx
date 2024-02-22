import { ReactNode, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useChainId } from 'wagmi'

import { coinsWithIcons } from '@app/constants/coinsWithIcons'
import { useEns } from '@app/utils/EnsProvider'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'
import { formatFullExpiry } from '@app/utils/utils'

import { useBasicName } from './useBasicName'
import useDNSOwner from './useDNSOwner'
import { useGetABI } from './useGetABI'
import { useProfile } from './useProfile'

export type Profile = NonNullable<ReturnType<typeof useProfile>['profile']>
export type DetailedProfileRecords = Profile['records'] & {
  abi?: { data: string; contentType?: number }
}
export type DetailedProfile = Omit<Profile, 'records'> & {
  records: DetailedProfileRecords
}

// transform text addr records into type address (profile fields)
const transformTextToAddressProfileRecords = (profile: DetailedProfile | undefined) => {
  if (!profile) {
    return
  }

  const profileClone: DetailedProfile = JSON.parse(JSON.stringify(profile))
  const textsClone = [...(profileClone?.records?.texts || [])]
  const coinTypesClone = [...(profileClone?.records?.coinTypes || [])] as any

  const coinList = coinsWithIcons.map((v) => v.toUpperCase())
  if (textsClone) {
    for (let i = textsClone.length - 1; i >= 0; i -= 1) {
      const value = textsClone[i]
      if (coinList.includes(value.key as string)) {
        coinTypesClone?.push({
          type: 'addr',
          addr: value.value,
          key: value.key,
          coin: value.key as string,
        })
        textsClone.splice(i, 1)
      }
    }
  }

  if (profileClone.records) {
    profileClone.records.texts = textsClone
    profileClone.records.coinTypes = coinTypesClone
  }

  return profileClone
}

export const useNameDetails = (name: string, skipGraph = false) => {
  const { t } = useTranslation('profile')
  const { ready } = useEns()
  const chainId = useChainId()

  const {
    isValid,
    normalisedName,
    isLoading: basicLoading,
    isCachedData: basicIsCachedData,
    registrationStatus,
    expiryDate,
    gracePeriodEndDate,
    ...basicName
  } = useBasicName(name, { normalised: false, skipGraph })

  const {
    profile: baseProfile,
    loading: profileLoading,
    status,
    isCachedData: profileIsCachedData,
  } = useProfile(normalisedName, {
    skip: !normalisedName || normalisedName === '[root]',
    resolverAddress: RESOLVER_ADDRESSES[chainId]?.[0],
    skipGraph,
  })

  const { abi, loading: abiLoading } = useGetABI(
    normalisedName,
    !normalisedName || normalisedName === '[root]',
  )

  const profile: DetailedProfile | undefined = useMemo(() => {
    if (!baseProfile) return undefined
    return {
      ...baseProfile,
      records: {
        ...baseProfile.records,
        ...(abi ? { abi } : {}),
      },
    }
  }, [abi, baseProfile])

  const {
    dnsOwner,
    isLoading: dnsOwnerLoading,
    isCachedData: dnsOwnerIsCachedData,
  } = useDNSOwner(normalisedName, isValid)

  const error: string | ReactNode | null = useMemo(() => {
    if (isValid === false) {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'unsupportedTLD' || registrationStatus === 'notImported') {
      return t('errors.unsupportedTLD')
    }
    if (profile && !profile.isMigrated && typeof profile.isMigrated === 'boolean') {
      return (
        <>
          {t('errors.migrationNotAvailable')}
          <a href={`https://legacy.ens.domains/name/${normalisedName}`}>
            {t('errors.migrationNotAvailableLink')}
          </a>
        </>
      )
    }
    if (profile && profile.message) {
      return profile.message
    }
    if (registrationStatus === 'invalid') {
      return t('errors.invalidName')
    }
    if (registrationStatus === 'gracePeriod') {
      return `${t('errors.expiringSoon', { date: formatFullExpiry(gracePeriodEndDate) })}`
    }
    if (
      // bypass unknown error for root name
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      !abiLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.message', { ns: 'common' })
    }
    return null
  }, [
    gracePeriodEndDate,
    normalisedName,
    profile,
    profileLoading,
    abiLoading,
    ready,
    registrationStatus,
    status,
    t,
    isValid,
  ])

  const errorTitle = useMemo(() => {
    if (registrationStatus === 'gracePeriod') {
      return t('errors.hasExpired', { name })
    }
    if (
      normalisedName !== '[root]' &&
      !profile &&
      !profileLoading &&
      !abiLoading &&
      ready &&
      status !== 'idle' &&
      status !== 'loading'
    ) {
      return t('errors.networkError.title', { ns: 'common' })
    }
  }, [
    registrationStatus,
    name,
    t,
    profile,
    profileLoading,
    abiLoading,
    ready,
    status,
    normalisedName,
  ])

  const isLoading = !ready || profileLoading || abiLoading || basicLoading || dnsOwnerLoading

  return {
    error,
    errorTitle,
    normalisedName,
    isValid,
    profile,
    transformedProfile: transformTextToAddressProfileRecords(profile),
    isLoading,
    dnsOwner,
    basicIsCachedData: basicIsCachedData || dnsOwnerIsCachedData,
    profileIsCachedData,
    registrationStatus,
    gracePeriodEndDate,
    expiryDate,
    ...basicName,
  }
}
