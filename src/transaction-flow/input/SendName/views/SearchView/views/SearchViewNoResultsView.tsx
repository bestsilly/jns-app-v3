import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { AlertSVG } from '@ensdomains/thorin'

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
    color: ${theme.colors.yellow};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${theme.space[2]};
    svg {
      width: ${theme.space[5]};
      height: ${theme.space[5]};
    }
  `,
)

export const SearchViewNoResultsView = () => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container>
      <Message>
        <AlertSVG />
        <CustomTypography fontVariant="body">
          {t('input.sendName.views.search.views.noResults.message')}
        </CustomTypography>
      </Message>
    </Container>
  )
}
