/* eslint-disable no-param-reassign */
import { RecordOptions } from '@jfinchain/jnsjs/utils/recordHelpers'
import { FieldArrayWithId } from 'react-hook-form'

import coinsWithIcons from '@app/constants/coinsWithIcons.json'
import { ProfileRecord, ProfileRecordGroup, sortValues } from '@app/constants/profileRecordOptions'
import supportedGeneralRecordKeys from '@app/constants/supportedGeneralRecordKeys.json'
import supportedAccounts from '@app/constants/supportedSocialRecordKeys.json'
import { DetailedProfile } from '@app/hooks/useNameDetails'
import type { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import {
  contentHashProtocolToContentHashProvider,
  contentHashToString,
  getProtocolTypeAndContentId,
} from '@app/utils/contenthash'

export const profileRecordsToRecordOptions = (
  profileRecords: ProfileRecord[] = [],
  clearRecords = false,
): RecordOptions => {
  return profileRecords.reduce<RecordOptions>(
    (options, record) => {
      if (!record.key) return options

      const { key, value = '', group } = record

      const recordItem = {
        key: key.trim(),
        value: value.trim(),
      }

      if (record.key === 'avatar') {
        const currentAvatarValue = options.texts?.find((r) => r.key === 'avatar')?.value || ''
        const defaultAvatarValue =
          !!currentAvatarValue && !!recordItem.value && group === 'media'
            ? recordItem.value
            : currentAvatarValue
        const newAvatarValue = defaultAvatarValue || currentAvatarValue || recordItem.value
        return {
          ...options,
          texts: [
            ...(options.texts?.filter((r) => r.key !== 'avatar') || []),
            { key: 'avatar', value: newAvatarValue },
          ],
        }
      }

      if (record.type === 'text') {
        return {
          ...options,
          texts: [...(options.texts?.filter((r) => r.key !== recordItem.key) || []), recordItem],
        }
      }

      if (record.type === 'addr') {
        return {
          ...options,
          coinTypes: [
            ...(options.coinTypes?.filter((r) => r.key !== recordItem.key) || []),
            recordItem,
          ],
        }
      }

      if (record.type === 'contenthash') {
        return {
          ...options,
          contentHash: recordItem.value,
        }
      }

      if (record.type === 'abi') {
        return {
          ...options,
          abi: {
            data: recordItem.value,
          },
        }
      }

      return options
    },
    {
      clearRecords: !!clearRecords,
    },
  )
}

export const profileEditorFormToProfileRecords = (data: ProfileEditorForm): ProfileRecord[] => {
  return [
    ...data.records,
    ...(data.avatar
      ? [
          {
            key: 'avatar',
            type: 'text',
            group: 'media',
            value: data.avatar,
          } as ProfileRecord,
        ]
      : []),
  ]
}

export const profileRecordsToProfileEditorForm = (records: ProfileRecord[]): ProfileEditorForm => {
  return records.reduce<{ avatar: string; records: ProfileRecord[] }>(
    (result, record) => {
      if (record.key === 'avatar' && record.group === 'media')
        return { ...result, avatar: record.value || '' }
      const normalizedRecord = {
        ...record,
        value: record.value || '',
      }
      return {
        ...result,
        records: [...result.records, normalizedRecord],
      }
    },
    { avatar: '', records: [] },
  )
}

const sortProfileRecords = (recordA: ProfileRecord, recordB: ProfileRecord): number => {
  const unknownGroupValue: { [key in ProfileRecordGroup]: number } = {
    media: 1,
    general: 199,
    social: 299,
    address: 399,
    website: 499,
    other: 599,
    custom: 999,
  }
  const recordAValue =
    sortValues[recordA.group]?.[recordA.key.toLowerCase()] || unknownGroupValue[recordA.group]
  const recordBValue =
    sortValues[recordB.group]?.[recordB.key.toLowerCase()] || unknownGroupValue[recordB.group]
  return recordAValue - recordBValue
}

// transform addr records into type text
export const transformAddrToTextEditRecords = (form: ProfileEditorForm) => {
  form.records.forEach((value) => {
    if (value.key.includes('ETHEREUM') && value.group !== 'custom') {
      value.type = 'text'
      value.group = 'address'
    }
  })

  return form
}

// transform text addr records into type address (edit fields)
export const transformTextToAddrEditRecords = (
  profileRecords: FieldArrayWithId<ProfileEditorForm, 'records', 'id'>[],
) => {
  const profileRecordsClone = [...(profileRecords || [])]
  const customAddressSet = new Set(coinsWithIcons.map((coin) => coin.toUpperCase()))

  profileRecordsClone.forEach((profileRecord) => {
    if (customAddressSet.has(profileRecord.key)) {
      profileRecord.type = 'addr'
      profileRecord.group = 'address'
    }
  })

  return profileRecordsClone
}

// transform text addr records into type address (profile fields)
export const transformTextToAddressProfileRecords = (profile: DetailedProfile | undefined) => {
  if (!profile) {
    return
  }

  const profileClone: DetailedProfile = JSON.parse(JSON.stringify(profile))
  const textsClone = [...(profileClone?.records?.texts || [])]
  const coinTypesClone = [...(profileClone?.records?.coinTypes || [])] as any

  const customAddressList = coinsWithIcons.map((v) => v.toUpperCase())
  if (textsClone) {
    for (let i = textsClone.length - 1; i >= 0; i -= 1) {
      const value = textsClone[i]
      if (customAddressList.includes(value.key as string)) {
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

export const profileToProfileRecords = (profile?: DetailedProfile): ProfileRecord[] => {
  const records = profile?.records || {}
  const texts: ProfileRecord[] =
    records.texts?.map(({ key, value }) => {
      if (key === 'avatar') {
        return {
          key: key as string,
          type: 'text',
          group: 'media',
          value,
        }
      }
      /* eslint-disable no-nested-ternary */
      const group: ProfileRecordGroup = supportedGeneralRecordKeys.includes(key as string)
        ? 'general'
        : supportedAccounts.includes(key as string)
        ? 'social'
        : 'custom'
      /* eslint-enable no-nested-ternary */
      return {
        key: key as string,
        type: 'text',
        group,
        value,
      }
    }) || []
  const addresses: ProfileRecord[] =
    records.coinTypes?.map(({ addr, coin }: any) => {
      return {
        key: coin,
        type: 'addr',
        group: 'address',
        value: addr,
      }
    }) || []

  const contentHashStr = contentHashToString(records.contentHash)
  const { protocolType, contentId } = getProtocolTypeAndContentId(contentHashStr)
  const protocolKey = contentHashProtocolToContentHashProvider(protocolType || undefined)
  const website: ProfileRecord[] =
    protocolKey && contentId
      ? [{ key: protocolKey, type: 'contenthash', group: 'website', value: contentHashStr }]
      : []

  const abi: ProfileRecord[] = records.abi?.data
    ? [{ key: 'abi', type: 'abi', group: 'other', value: records.abi.data }]
    : []
  const profileRecords = [...texts, ...addresses, ...website, ...abi]
  const sortedProfileRecords = profileRecords.sort(sortProfileRecords)
  return sortedProfileRecords
}

export const getProfileRecordsDiff = (
  currentRecords: ProfileRecord[],
  previousRecords: ProfileRecord[] = [],
): ProfileRecord[] => {
  const updatedAndNewRecords = currentRecords
    .map((currentRecord) => {
      const identicalRecord = previousRecords.find(
        (previousRecord) =>
          previousRecord.key === currentRecord.key && previousRecord.group === currentRecord.group,
      )
      // remove records that are empty
      if (!currentRecord.value) return null
      // record is new
      if (!identicalRecord) return currentRecord
      // record is updated
      if (identicalRecord.value !== currentRecord.value) return currentRecord
      // remove records that have not changed
      return null
    })
    .filter((r) => !!r) as ProfileRecord[]
  const deletedRecords = previousRecords
    .filter((previousRecord) => {
      // Can only have a single website, so check that no other website exists
      if (previousRecord.group === 'website')
        return currentRecords.findIndex((currentRecord) => currentRecord.group === 'website') === -1
      return (
        currentRecords.findIndex(
          (currentRecord) =>
            currentRecord.key === previousRecord.key &&
            currentRecord.group === previousRecord.group,
        ) === -1
      )
    })
    .map((r) => ({
      ...r,
      value: '',
    }))
  return [...updatedAndNewRecords, ...deletedRecords]
}
