import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Helper } from '@ensdomains/thorin'

import { CustomTypography } from '@app/components/customs'
import { shortenAddress } from '@app/utils/utils'

const StyledTypography = styled(CustomTypography)(
  () => css`
    text-align: center;
  `,
)

export const SyncManager = ({ manager, isWrapped }: { manager: string; isWrapped: boolean }) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <StyledTypography>
        <Trans
          i18nKey="intro.syncManager.description"
          ns="transactionFlow"
          components={{ b: <strong /> }}
          values={{ manager: shortenAddress(manager) }}
        />
      </StyledTypography>
      {isWrapped && <Helper type="warning">{t('intro.syncManager.wrappedWarning')}</Helper>}
    </>
  )
}
