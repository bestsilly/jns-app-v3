import styled, { css } from 'styled-components'

import { Banner, mq } from '@ensdomains/thorin'

export default () => {
  const WarningWrapper = styled.div(
    () => css`
      width: 100%;
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
        <Banner alert="warning">Importing DNS names is not supported</Banner>
      </WarningWrapper>
    </>
  )
}
