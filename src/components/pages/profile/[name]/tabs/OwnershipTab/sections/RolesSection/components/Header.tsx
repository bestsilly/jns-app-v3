import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Tag } from '@ensdomains/thorin'

import { CustomTypography } from '@app/components/customs'

const Container = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
)

export const Header = ({ count }: { count: number }) => {
  const { t } = useTranslation('profile')
  return (
    <Container>
      <CustomTypography fontVariant="headingTwo">
        {t('tabs.ownership.sections.roles.title')}
      </CustomTypography>
      <Tag size="small">{t('tabs.ownership.sections.roles.addresses', { count })}</Tag>
    </Container>
  )
}
