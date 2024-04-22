import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { ParsedInputResult } from '@jfinchain/jnsjs/utils/validation'

import type { ReturnedENS } from '@app/types/index'

import { emptyAddress } from './constants'
import { isBlacklisted, isEnglishLowerCaseOrNumeric } from './wording'

export type RegistrationStatus =
  | 'invalid'
  | 'registered'
  | 'gracePeriod'
  | 'premium'
  | 'available'
  | 'short'
  | 'imported'
  | 'owned'
  | 'notImported'
  | 'notOwned'
  | 'unsupportedTLD'

export const getRegistrationStatus = ({
  timestamp,
  validation: { isETH, is2LD, isShort, type },
  ownerData,
  wrapperData,
  expiryData,
  priceData,
  supportedTLD,
  normalisedName,
}: {
  timestamp: number
  validation: Partial<Omit<ParsedInputResult, 'normalised' | 'isValid'>>
  ownerData?: ReturnedENS['getOwner']
  wrapperData?: ReturnedENS['getWrapperData']
  expiryData?: ReturnedENS['getExpiry']
  priceData?: ReturnedENS['getPrice']
  supportedTLD?: boolean | null
  normalisedName?: string | null
}): RegistrationStatus => {
  if (isETH && is2LD && isShort) {
    return 'short'
  }

  if (isBlacklisted(normalisedName || '') || !isEnglishLowerCaseOrNumeric(normalisedName || '')) {
    return 'invalid'
  }

  if (!ownerData && !wrapperData) return 'invalid'

  if (!isETH && !supportedTLD) {
    return 'unsupportedTLD'
  }

  if (isETH && is2LD) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    if (expiryData && expiryData.expiry) {
      const { expiry: _expiry, gracePeriod } = expiryData as {
        expiry: Date | string
        gracePeriod: number
      }
      const expiry = new Date(_expiry)
      if (expiry.getTime() > timestamp) {
        return 'registered'
      }
      if (expiry.getTime() + gracePeriod > timestamp) {
        return 'gracePeriod'
      }
      const { premium } = priceData as {
        base: BigNumber
        premium: BigNumber
      }
      if (premium.gt(0)) {
        return 'premium'
      }
    }
    return 'available'
  }
  if (ownerData && ownerData.owner !== emptyAddress) {
    if (is2LD) {
      return 'imported'
    }
    return 'owned'
  }
  if (type === 'name' && !is2LD) {
    // more than 2 labels
    return 'notOwned'
  }
  return 'notImported'
}
