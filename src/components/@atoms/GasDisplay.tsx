import styled, { css } from 'styled-components'

import { Skeleton } from '@ensdomains/thorin'

import GasSVG from '@app/assets/Gas.svg'

// import { makeDisplay } from '@app/utils/currency'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['1']};

    font-size: ${theme.fontSizes.small};
    color: ${theme.colors.textTertiary};
    font-weight: bold;

    padding: 0 ${theme.space['4']};
  `,
)

// type Props = {
//   gasPrice: BigNumber | undefined
// }

const GasDisplay = () => {
  // const gasLabel = gasPrice ? makeDisplay(gasPrice, 0, 'Gwei', 9) : '-'
  const gasLabel = '20 Gwei'

  return (
    <Container>
      <GasSVG />
      <Skeleton>{gasLabel}</Skeleton>
    </Container>
  )
}

export default GasDisplay
