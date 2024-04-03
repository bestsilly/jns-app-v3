import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { MagnifyingGlassSVG } from '@ensdomains/thorin'

import { CustomTypography } from '@app/components/customs'

const Container = styled.div(
  () => css`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

const Message = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: ${theme.space[2]};
    align-items: center;
    color: ${theme.colors.accent};
    width: ${theme.space[40]};
  `,
)

export const SearchViewIntroView = () => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container>
      <Message>
        <MagnifyingGlassSVG />
        <CustomTypography fontVariant="body">
          {t('input.sendName.views.search.views.intro.message')}
        </CustomTypography>
      </Message>
    </Container>
  )
}
