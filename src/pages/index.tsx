import Head from 'next/head'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import FaucetBanner from '@app/components/@molecules/FaucetBanner'
import Hamburger from '@app/components/@molecules/Hamburger/Hamburger'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'
import { LeadingHeading } from '@app/components/LeadingHeading'

import ENSFull from '../assets/ENSFull.svg'
import Vector01 from '../assets/background/vector_01.svg'

const GradientTitle = styled.h1(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingTwo};
    text-align: center;
    font-weight: 800;
    background-image: ${theme.colors.gradients.purple};
    background-repeat: no-repeat;
    background-size: 110%;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin: 0;

    ${mq.sm.min(css`
      font-size: ${theme.fontSizes.headingOne};
    `)}
  `,
)

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    max-width: calc(${theme.space['72']} * 2 - ${theme.space['4']});
    line-height: 150%;
    text-align: center;
    margin-bottom: ${theme.space['3']};
  `,
)

const Container = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  `,
)

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-gap: ${theme.space['3']};
    gap: ${theme.space['3']};
  `,
)

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

const Title = styled.h1(
  ({ theme }) => css`
    font-size: 4rem;
    display: flex;
    flex-direction: column;
    max-width: ${theme.breakpoints.xs}px;
    text-align: center;
    line-height: 4rem;

    ${mq.md.max(
      css`
        font-size: 3rem;
        line-height: 3rem;
      `,
    )}
  `,
)

const StyleGradientTitle = styled(GradientTitle)(
  () =>
    css`
      font-size: 4rem;

      ${mq.md.max(
        css`
          font-size: 3rem;
        `,
      )}
    `,
)

const StyleDescription = styled.div(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    color: ${theme.colors.grey};
    margin-top: 1.5rem;

    ${mq.md.max(
      css`
        margin-top: 1rem;
        font-size: ${theme.fontSizes.body};
      `,
    )}
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

const StyledSearchTitle = styled.h2(
  () => css`
    font-size: 2rem;
    font-weight: bold;
    margin-top: 0.5rem;
    text-align: center;

    ${mq.sm.max(
      css`
        font-size: 1.2rem;
      `,
    )}
  `,
)

// { fontSize: '2rem', fontWeight: 'bold', marginTop: '0.5rem' }

const Background = styled.div(
  () => css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 5rem;
    right: 5rem;
  `,
)

export default function Page() {
  const { t } = useTranslation('common')

  return (
    <>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Head>
          <title>JNS</title>
        </Head>
        <StyledLeadingHeading>
          <LogoAndLanguage>
            <StyledENS as={ENSFull} />
          </LogoAndLanguage>
          <Hamburger />
        </StyledLeadingHeading>
        <FaucetBanner />
        <Container>
          <Stack style={{ marginTop: '3rem' }}>
            <Title>
              <span>Secure</span>
              <span style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                Your <StyleGradientTitle> web3 </StyleGradientTitle>
              </span>
              <span>Experince</span>
            </Title>
            <SubtitleWrapper>
              <StyleDescription>{t('description')}</StyleDescription>
            </SubtitleWrapper>

            <div style={{ marginTop: '3rem' }} />
            <SearchInput size="medium" />
            <StyledSearchTitle>Find Your Secure Wallet Name</StyledSearchTitle>

            <div style={{ color: '#B6B6BE', textAlign: 'center' }}>
              Promotion Fixed price regardless of name length{' '}
            </div>
          </Stack>
        </Container>
      </div>

      <Background>
        <Vector01 width="100%" height="70%" />
      </Background>
    </>
  )
}
