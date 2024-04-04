import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'
import { CustomTypography } from '@app/components/customs'
import { getSupportLink } from '@app/utils/supportLinks'

export const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

export const Header = () => {
  const { t } = useTranslation('profile')
  return (
    <Container>
      <CustomTypography fontVariant="headingFour">
        {t('tabs.ownership.sections.contract.title')}
      </CustomTypography>
      <QuestionTooltip
        content={t('tabs.ownership.sections.contract.tooltip')}
        link={getSupportLink('contract-address')}
      />
    </Container>
  )
}
