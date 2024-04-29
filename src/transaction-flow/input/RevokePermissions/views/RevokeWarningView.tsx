import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Dialog } from '@ensdomains/thorin'

import { CustomHeading, CustomTypography } from '@app/components/customs'
import { getSupportLink } from '@app/utils/supportLinks'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

const StyledAnchor = styled.a(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const RevokeWarningView = () => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading
        alert="error"
        title={
          <CustomHeading>{t('input.revokePermissions.views.revokeWarning.title')}</CustomHeading>
        }
      />
      <CenterAlignedTypography fontVariant="bodyBold">
        {t('input.revokePermissions.views.revokeWarning.subtitle')}
      </CenterAlignedTypography>
      <CenterAlignedTypography fontVariant="body">
        <CustomTypography>
          <Trans
            i18nKey="input.revokePermissions.views.revokeWarning.subtitle2"
            t={t}
            components={{
              infoLink: (
                <StyledAnchor href={getSupportLink('fuses')} target="_blank" rel="noreferrer" />
              ),
            }}
          >
            {t('input.revokePermissions.views.revokeWarning.subtitle2')}
          </Trans>
        </CustomTypography>
      </CenterAlignedTypography>
    </>
  )
}
