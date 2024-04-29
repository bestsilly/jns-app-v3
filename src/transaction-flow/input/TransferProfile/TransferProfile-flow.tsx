import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { CustomButton, CustomDialogHeading, CustomHeading } from '@app/components/customs'
import { useProfile } from '@app/hooks/useProfile'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'

import { useContractAddress } from '../../../hooks/useContractAddress'
import { makeTransactionItem } from '../../transaction/index'
import { TransactionDialogPassthrough } from '../../types'

type Data = {
  name: string
  isWrapped: boolean
}

export type Props = { data: Data } & TransactionDialogPassthrough

const TransferProfile = ({ data, dispatch }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const resolverAddress = useContractAddress('PublicResolver')

  const { profile, loading } = useProfile(data.name)
  const oldResolverAddress = profile?.resolverAddress

  const updateResolverTransaction = makeTransactionItem('updateResolver', {
    name: data.name,
    resolver: resolverAddress,
    oldResolver: oldResolverAddress,
    contract: data.isWrapped ? 'nameWrapper' : 'registry',
  })

  const handleReset = () => {
    if (!resolverAddress) return
    dispatch({
      name: 'setTransactions',
      payload: [updateResolverTransaction],
    })

    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  const handleTransfer = () => {
    if (!resolverAddress) return
    dispatch({
      name: 'startFlow',
      key: `edit-profile-flow-${data.name}`,
      payload: {
        transactions: [
          makeTransactionItem('migrateProfile', { name: data.name }),
          updateResolverTransaction,
        ],
        resumable: true,
        disableBackgroundClick: true,
      },
    })
  }
  const footerLeading = (
    <Button
      colorStyle="accentSecondary"
      onClick={handleReset}
      data-testid="transfer-profile-leading-btn"
    >
      {t('action.reset', { ns: 'common' })}
    </Button>
  )

  const footerTrailing = (
    <CustomButton onClick={handleTransfer} data-testid="transfer-profile-trailing-btn">
      {t('action.transfer', { ns: 'common' })}
    </CustomButton>
  )

  if (loading) return <TransactionLoader />
  return (
    <>
      <CustomDialogHeading
        title={<CustomHeading>{t('input.transferProfile.title')}</CustomHeading>}
      />
      <InnerDialog>
        <p>{t('input.transferProfile.message1')}</p>
        <p>
          <strong>{t('input.transferProfile.message2')}</strong>
        </p>
      </InnerDialog>
      <Dialog.Footer leading={footerLeading} trailing={footerTrailing} />
    </>
  )
}

export default TransferProfile
