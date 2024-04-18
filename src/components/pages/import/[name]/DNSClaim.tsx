import styled, { css } from 'styled-components'

import { Banner, mq } from '@ensdomains/thorin'

export default () => {
  const WarningWrapper = styled.div(
    ({ theme }) => css`
      color: ${theme.colors.textSecondary};
      width: 100%;
      max-width: 48rem !important;
      grid-column: span 1;
      height: min-content;
      ${mq.sm.min(css`
        grid-column: span 2;
      `)}
    `,
  )

  return (
    <>
      <WarningWrapper>
        <Banner alert="warning" style={{ color: '#fff' }}>
          Importing DNS names is not supported
        </Banner>
      </WarningWrapper>
    </>
  )
}
