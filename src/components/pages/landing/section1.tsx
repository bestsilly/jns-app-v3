import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

import Background01 from '@app/assets/background/background01.svg'
import Object01 from '@app/assets/object/object01.svg'
import Object02 from '@app/assets/object/object02.svg'
import { SearchInput } from '@app/components/@molecules/SearchInput/SearchInput'

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['3']};
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

const SubtitleWrapper = styled.div(
  ({ theme }) => css`
    max-width: calc(${theme.space['72']} * 2 - ${theme.space['4']});
    line-height: 150%;
    text-align: center;
    margin-bottom: ${theme.space['3']};
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

const Background = styled.div(
  () => css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  `,
)

const BackgroundObject1 = styled.div(
  () => css`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 15vw;

    ${mq.sm.max(
      css`
        display: none;
      `,
    )}
  `,
)

const BackgroundObject2 = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
    width: 7vw;

    ${mq.sm.max(
      css`
        display: none;
      `,
    )}
  `,
)

const Container = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    z-index: 1;
    min-height: calc(100vh - 80px - 64px);
  `,
)

export default function LandingSection1() {
  const { t } = useTranslation('common')

  return (
    <div id="page-section-1">
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

      <Background>
        <Background01 width="100%" height="70%" />
      </Background>

      <BackgroundObject1>
        <Object01 width="100%" height="100%" />
      </BackgroundObject1>
      <BackgroundObject2>
        <Object02 width="100%" height="100%" />
      </BackgroundObject2>
    </div>
  )
}
