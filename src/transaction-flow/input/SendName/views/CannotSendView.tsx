import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog } from '@ensdomains/thorin'

import { CustomTypography } from '@app/components/customs'

const CenteredTypography = styled(CustomTypography)(
  () => css`
    text-align: center;
  `,
)

type Props = {
  onDismiss: () => void
}

export const CannotSendView = ({ onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading alert="error" title={t('input.sendName.views.error.title')} />
      <CenteredTypography>{t('input.sendName.views.error.description')}</CenteredTypography>
      <Dialog.Footer
        trailing={
          <Button colorStyle="redSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
