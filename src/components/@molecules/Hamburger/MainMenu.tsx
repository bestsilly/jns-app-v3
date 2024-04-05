import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Spinner, Typography, mq } from '@ensdomains/thorin'

import SocialDiscord from '@app/assets/social/SocialDiscord.svg'
import SocialFacebook from '@app/assets/social/SocialFacebook.svg'
import SocialGithub from '@app/assets/social/SocialGithub.svg'
import SocialTelegram from '@app/assets/social/SocialTelegram.svg'
import SocialTwitter from '@app/assets/social/SocialTwitter.svg'
import BaseLink from '@app/components/@atoms/BaseLink'
import { SocialIcon } from '@app/components/SocialIcon'
import { CustomTypography } from '@app/components/customs'
import { useChainName } from '@app/hooks/useChainName'
import useGasPrice from '@app/hooks/useGasPrice'
import { routes } from '@app/routes'
import { useGraphOutOfSync } from '@app/utils/SyncProvider/SyncProvider'
import { makeDisplay } from '@app/utils/currency'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background-color: ${theme.colors.background};

    padding: ${theme.space['4']};
    gap: ${theme.space['2']};

    ${mq.sm.min(css`
      padding: 0;
      gap: 0;
      & > div {
        border-bottom: 1px solid ${theme.colors.border};
      }

      & > div:last-child {
        border-bottom: none;
      }
    `)}
  `,
)

const miscSectionStyle = css(
  ({ theme }) => css`
    background-color: ${theme.colors.greySurface};
    color: ${theme.colors.textSecondary};
    border-radius: ${theme.radii.large};

    ${mq.sm.min(css`
      background-color: transparent;
      border-radius: none;
    `)}
  `,
)

const RoutesSection = styled.div(
  ({ theme }) => css`
    width: 100%;
    padding: ${theme.space['2']};

    display: grid;
    grid-template-columns: repeat(2, 1fr);
  `,
  miscSectionStyle,
)

const RouteItem = styled.a(
  ({ theme }) => css`
    transition: all 0.1s ease-in-out;
    text-align: left;
    padding: ${theme.space['2']} ${theme.space['2']};
    border-radius: ${theme.radii.large};

    &:hover {
      background-color: ${theme.colors.greySurface};
      color: ${theme.colors.textSecondary};
    }

    ${mq.sm.min(css`
      padding: ${theme.space['2']} ${theme.space['4']};
    `)}
  `,
)

const SocialSection = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['4']} ${theme.space['6']};
  `,
  miscSectionStyle,
)

const NetworkSectionContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    padding: ${theme.space['2']};

    #chain-name {
      text-transform: capitalize;
    }

    ${mq.sm.min(css`
      padding: ${theme.space['4']} ${theme.space['6']};
    `)}
  `,
  miscSectionStyle,
)

const NetworkSectionRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    text-align: center;
  `,
)

const NetworkSection = () => {
  const { t } = useTranslation('common')
  const graphOutOfSync = useGraphOutOfSync()
  const chainName = useChainName()
  const { gasPrice } = useGasPrice()

  return (
    <NetworkSectionContainer>
      <NetworkSectionRow>
        {graphOutOfSync && <Spinner color="accent" />}
        <Typography id="chain-name" weight="bold" style={{ color: '#8a8a8a' }}>
          {chainName}
        </Typography>
        {gasPrice && (
          <Typography color="grey">{makeDisplay(gasPrice, undefined, 'Gwei', 9)}</Typography>
        )}
      </NetworkSectionRow>
      {graphOutOfSync && (
        <NetworkSectionRow>
          <CustomTypography fontVariant="small">{t('navigation.syncMessage')}</CustomTypography>
        </NetworkSectionRow>
      )}
    </NetworkSectionContainer>
  )
}

const disconnectedRoutes = routes.filter(
  (route) => route.name !== 'search' && route.connected === false,
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MainMenu = ({ setCurrentView }: { setCurrentView: (view: 'main' | 'language') => void }) => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <RoutesSection>
        {disconnectedRoutes.map((route) => (
          <BaseLink href={route.href} passHref key={route.href}>
            <RouteItem {...(route.href.startsWith('http') ? { target: '_blank' } : {})}>
              <CustomTypography>{t(route.label)}</CustomTypography>
            </RouteItem>
          </BaseLink>
        ))}
      </RoutesSection>
      <SocialSection>
        <SocialIcon
          Icon={SocialTwitter}
          key="twitter"
          color="#5298FF"
          href="https://twitter.com/JFinofficial"
        />
        <SocialIcon
          Icon={SocialGithub}
          key="git"
          color="#f2f2f2"
          href="https://github.com/jfincoin"
        />
        <SocialIcon
          Icon={SocialDiscord}
          key="discord"
          color="#7F83FF"
          href="https://discord.com/invite/kyuEAa69Su"
        />
        <SocialIcon
          Icon={SocialFacebook}
          color="#1877F2"
          key="facebook"
          href="https://www.facebook.com/JFINofficial"
        />
        <SocialIcon
          Icon={SocialTelegram}
          key="telegram"
          color="#24A1DE"
          href="https://t.me/Jfincoin"
        />
      </SocialSection>
      <NetworkSection />
    </Container>
  )
}

export default MainMenu
