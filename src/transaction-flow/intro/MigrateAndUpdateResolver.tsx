import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Outlink } from '@app/components/Outlink'
import { CustomTypography } from '@app/components/customs'
import { getSupportLink } from '@app/utils/supportLinks'

const DescriptionWrapper = styled(CustomTypography)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['5']};
    text-align: center;
    a {
      display: inline-block;
    }
    margin-bottom: ${theme.space['2']};
  `,
)

export const MigrateAndUpdateResolver = () => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <DescriptionWrapper>
        <CustomTypography color="textTertiary">
          {t('intro.migrateAndUpdateResolver.heading')}
          &nbsp;
          <span>
            <Outlink href={getSupportLink('resolver')}>
              {t('intro.migrateAndUpdateResolver.link')}
            </Outlink>
          </span>
        </CustomTypography>
        <CustomTypography color="textSecondary" weight="bold">
          {t('intro.migrateAndUpdateResolver.warning')}
        </CustomTypography>
      </DescriptionWrapper>
    </>
  )
}
