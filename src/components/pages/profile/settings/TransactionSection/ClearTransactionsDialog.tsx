import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { CustomButton, CustomDialogHeading } from '@app/components/customs'

const StyledInnerDialog = styled(InnerDialog)(
  () => css`
    text-align: center;
  `,
)

type Props = { onClear: () => void } & Omit<ComponentProps<typeof Dialog>, 'children' | 'variant'>

export const ClearTransactionsDialog = ({ open, onDismiss, onClose, onClear }: Props) => {
  const { t } = useTranslation('settings')
  return (
    <Dialog open={open} variant="blank" onDismiss={onDismiss} onClose={onClose}>
      <CustomDialogHeading
        alert="warning"
        title={t('section.transaction.clearTransactions.title')}
      />
      <StyledInnerDialog>
        {t('section.transaction.clearTransactions.description')}
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <CustomButton onClick={onClear} data-testid="clear-transactions-dialog-clear-button">
            {t('section.transaction.clearTransactions.actionLabel')}
          </CustomButton>
        }
      />
    </Dialog>
  )
}
