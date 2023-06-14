import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { checkIsDecrypted } from '@ensdomains/ensjs/utils/labels'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { ReturnedENS } from '@app/types'
import { nameParts } from '@app/utils/name'

import { useHasGlobalError } from './errors/useHasGlobalError'
import { checkAvailablePrimaryName } from './names/useAvailablePrimaryNamesForAddress/utils'
import { useSetPrimaryNameTransactionFlowItem } from './primary/useSetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from './resolver/useResolverStatus'
import { useNameDetails } from './useNameDetails'
import { useSelfAbilities } from './useSelfAbilities'
import { useSubnameAbilities } from './useSubnameAbilities'

type Action = {
  onClick: () => void
  label: string
  red?: boolean
  disabled?: boolean
  tooltipContent?: string
  tooltipPlacement?: 'left' | 'right'
  skip2LDEth?: boolean
  warning?: string
  fullMobileWidth?: boolean
}

type Props = {
  name: string
  address: string | undefined
  profile: ReturnedENS['getProfile']
  selfAbilities: ReturnType<typeof useSelfAbilities>
  subnameAbilities: ReturnType<typeof useSubnameAbilities>['abilities']
  ownerData: ReturnType<typeof useNameDetails>['ownerData']
  wrapperData: ReturnType<typeof useNameDetails>['wrapperData']
  expiryDate: ReturnType<typeof useNameDetails>['expiryDate']
}

export const useProfileActions = ({
  name,
  address,
  profile,
  selfAbilities,
  subnameAbilities,
  ownerData,
  wrapperData,
  expiryDate,
}: Props) => {
  const { t } = useTranslation('profile')
  const { createTransactionFlow, prepareDataInput } = useTransactionFlow()

  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'

  const resolverStatus = useResolverStatus(name, {
    migratedRecordsMatch: address ? { key: '60', type: 'addr', addr: address } : undefined,
    enabled: !!ownerData,
  })

  const primary = usePrimary(address)

  const isAvailablePrimaryName = checkAvailablePrimaryName(
    primary.data?.name,
    resolverStatus.data,
  )({
    name,
    isMigrated: !!profile?.isMigrated,
    isResolvedAddress: profile?.address === address,
    isController: !isWrapped && ownerData?.owner === address,
    isWrappedOwner: isWrapped && ownerData?.owner === address,
    expiryDate,
    fuses: wrapperData,
  })

  const setPrimaryNameTransactionFlowItem = useSetPrimaryNameTransactionFlowItem({
    name,
    address,
    isWrapped,
    profileAddress: profile?.address,
    resolverAddress: profile?.resolverAddress,
    resolverStatus: resolverStatus.data,
  })

  const hasGlobalError = useHasGlobalError()

  const showUnknownLabelsInput = prepareDataInput('UnknownLabels')
  const showProfileEditorInput = prepareDataInput('ProfileEditor')
  const showDeleteEmancipatedSubnameWarningInput = prepareDataInput(
    'DeleteEmancipatedSubnameWarning',
  )

  const isLoading =
    primary.isLoading || resolverStatus.isLoading || setPrimaryNameTransactionFlowItem.isLoading

  const profileActions = useMemo(() => {
    const actions: Action[] = []
    if (!address || isLoading) return actions

    if (isAvailablePrimaryName && !!setPrimaryNameTransactionFlowItem.data) {
      const key = `setPrimaryName-${name}-${address}`
      actions.push({
        label: t('tabs.profile.actions.setAsPrimaryName.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        tooltipPlacement: 'left',
        onClick: !checkIsDecrypted(name)
          ? () =>
              showUnknownLabelsInput(key, {
                name,
                key,
                transactionFlowItem: setPrimaryNameTransactionFlowItem.data!,
              })
          : () => createTransactionFlow(key, setPrimaryNameTransactionFlowItem.data!),
      })
    }

    if (selfAbilities.canEdit) {
      actions.push({
        label: t('tabs.profile.actions.editProfile.label'),
        tooltipContent: hasGlobalError
          ? t('errors.networkError.blurb', { ns: 'common' })
          : undefined,
        tooltipPlacement: 'left',
        onClick: () =>
          showProfileEditorInput(
            `edit-profile-${name}`,
            { name },
            { disableBackgroundClick: true },
          ),
      })
    }

    if (subnameAbilities.canDelete && subnameAbilities.canDeleteContract) {
      const action = subnameAbilities.isPCCBurned
        ? {
            label: t('tabs.profile.actions.deleteSubname.label'),
            onClick: () => {
              showDeleteEmancipatedSubnameWarningInput(
                `delete-emancipated-subname-warning-${name}`,
                { name },
              )
            },
            tooltipContent: hasGlobalError
              ? t('errors.networkError.blurb', { ns: 'common' })
              : undefined,
            red: true,
            skip2LDEth: true,
          }
        : {
            label: t('tabs.profile.actions.deleteSubname.label'),
            onClick: () =>
              createTransactionFlow(`deleteSubname-${name}`, {
                transactions: [
                  makeTransactionItem('deleteSubname', {
                    name,
                    contract: subnameAbilities.canDeleteContract!,
                    method: subnameAbilities.canDeleteMethod,
                  }),
                ],
              }),
            tooltipContent: hasGlobalError
              ? t('errors.networkError.blurb', { ns: 'common' })
              : undefined,
            red: true,
            skip2LDEth: true,
          }
      actions.push(action)
    } else if (subnameAbilities.canDeleteError) {
      actions.push({
        label: t('tabs.profile.actions.deleteSubname.label'),
        onClick: () => {},
        disabled: true,
        red: true,
        skip2LDEth: true,
        tooltipContent: subnameAbilities.canDeleteError,
      })
    }

    if (subnameAbilities.canReclaim) {
      const { label, parent } = nameParts(name)
      actions.push({
        label: t('tabs.profile.actions.reclaim.label'),
        warning: t('tabs.profile.actions.reclaim.warning'),
        fullMobileWidth: true,
        onClick: () => {
          createTransactionFlow(`reclaim-${name}`, {
            transactions: [
              makeTransactionItem('createSubname', {
                contract: 'nameWrapper',
                label,
                parent,
              }),
            ],
          })
        },
      })
    }

    if (actions.length === 0) return undefined
    return actions
  }, [
    address,
    name,
    selfAbilities.canEdit,
    subnameAbilities.canDelete,
    subnameAbilities.canDeleteContract,
    subnameAbilities.canDeleteError,
    subnameAbilities.canDeleteMethod,
    subnameAbilities.isPCCBurned,
    subnameAbilities.canReclaim,
    setPrimaryNameTransactionFlowItem.data,
    t,
    showUnknownLabelsInput,
    createTransactionFlow,
    showProfileEditorInput,
    showDeleteEmancipatedSubnameWarningInput,
    isLoading,
    hasGlobalError,
    isAvailablePrimaryName,
  ])

  return {
    profileActions,
    loading: isLoading,
  }
}
