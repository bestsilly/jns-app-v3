import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import FaucetBanner from '@app/components/@molecules/FaucetBanner'
import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { LeadingHeading } from '@app/components/LeadingHeading'
import LandingSection1 from '@app/components/pages/landing/section1'
import LandingSection2 from '@app/components/pages/landing/section2'

import ENSFull from '../assets/ENSFull.svg'

const StyledENS = styled.div(
  ({ theme }) => css`
    height: ${theme.space['8.5']};
  `,
)

const LogoAndLanguage = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const StyledLeadingHeading = styled(LeadingHeading)(
  () => css`
    ${mq.sm.min(
      css`
        display: none;
      `,
    )}
  `,
)

export default function Page() {
  console.log(process.env.NEXT_PUBLIC_IS_TESTNET === 'true')
  return (
    <>
      <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <StyledLeadingHeading>
          <LogoAndLanguage>
            <StyledENS as={ENSFull} />
          </LogoAndLanguage>
          <Hamburger />
        </StyledLeadingHeading>
        <FaucetBanner />
        <LandingSection1 />
        <LandingSection2 />
      </div>
    </>
  )
}
