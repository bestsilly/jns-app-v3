import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { Card } from '@app/components/Card'
import { CustomHeading, CustomTypography } from '@app/components/customs'
import { useChainId } from '@app/hooks/useChainId'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useJoin } from '@app/hooks/useJoin'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import FullInvoice from '../FullInvoice'
import { RegistrationReducerDataItem } from '../types'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const InfoItems = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};

    ${mq.sm.min(css`
      flex-direction: row;
      align-items: stretch;
    `)}
  `,
)

const InfoItem = styled.div(
  ({ theme }) => css`
    width: 100%;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};

    padding: ${theme.space['4']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    text-align: center;

    & > div:first-of-type {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${theme.fontSizes.extraLarge};
      font-weight: ${theme.fontWeights.bold};
      color: ${theme.colors.backgroundPrimary};
      background: ${theme.colors.accentPrimary};
      border-radius: ${theme.radii.full};
    }

    & > div:last-of-type {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
  `,
)

const ProfileButton = styled.button(
  () => css`
    cursor: pointer;
  `,
)

const infoItemArr = Array.from({ length: 3 }, (_, i) => `steps.info.ethItems.${i}`)

type Props = {
  registrationData: RegistrationReducerDataItem
  nameDetails: ReturnType<typeof useNameDetails>
  callback: (data: { back: boolean }) => void
  onProfileClick: () => void
}

const Info = ({
  registrationData,
  nameDetails: { normalisedName, priceData },
  callback,
  onProfileClick,
}: Props) => {
  const { t } = useTranslation('register')
  const chainId = useChainId()
  const isTestnet = chainId === 3502

  const estimate = useEstimateFullRegistration({
    name: normalisedName,
    registrationData,
    price: priceData,
  })

  const { login, useJoinListener } = useJoin()
  const breakpoints = useBreakpoint()
  const [isJoin, setIsJoin] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [profile, setProfile] = useState(null) as any
  const isAllow = isTestnet ? true : profile && profile.level !== 'BRONZE'

  const handleStorageChange = () => {
    if (!localStorage.getItem('sessionId')) {
      setIsJoin(false)
    } else {
      setIsJoin(true)
      const profileData = localStorage.getItem('profile')
      setProfile(profileData ? JSON.parse(profileData) : {})
    }
  }

  useJoinListener(handleStorageChange)

  const handleJoin = () => {
    if (isJoin) {
      if (isAllow) {
        callback({ back: false })
      } else {
        setDialogOpen(true)
      }
    } else {
      login()
    }
  }

  const CustomDialogHeading = styled(Dialog.Heading)(
    ({ theme }) => css`
      color: ${theme.colors.textPrimary} !important;
    `,
  )

  return (
    <>
      <div>
        <Dialog open={dialogOpen} variant="closable" onDismiss={() => setDialogOpen(false)}>
          <CustomDialogHeading
            alert="warning"
            title={
              <CustomHeading style={{ textAlign: 'center', fontSize: '20px' }}>
                Action Required: Upgrade Join account
              </CustomHeading>
            }
          />
          <CustomTypography style={breakpoints.sm ? { width: '500px' } : { padding: '16px' }}>
            Your Join account is currently BRONZE. To access this feature, your account must be at
            least SILVER. You can upgrade your account with the Join application.
          </CustomTypography>
        </Dialog>
      </div>

      <StyledCard>
        <CustomHeading>{t('steps.info.heading')}</CustomHeading>
        <CustomTypography>{t('steps.info.subheading')}</CustomTypography>
        <InfoItems>
          {infoItemArr.map((item, inx) => (
            <InfoItem key={item}>
              <CustomTypography>{inx + 1}</CustomTypography>
              <CustomTypography>{t(item)}</CustomTypography>
            </InfoItem>
          ))}
        </InfoItems>
        <FullInvoice {...estimate} />
        {!registrationData.queue.includes('profile') && (
          <ProfileButton data-testid="setup-profile-button" onClick={onProfileClick}>
            <CustomTypography weight="bold" color="accent">
              {t('steps.info.setupProfile')}
            </CustomTypography>
          </ProfileButton>
        )}
        <ButtonContainer>
          <MobileFullWidth>
            <Button colorStyle="accentSecondary" onClick={() => callback({ back: true })}>
              {t('action.back', { ns: 'common' })}
            </Button>
          </MobileFullWidth>
          <MobileFullWidth>
            <Button
              data-testid="next-button"
              style={{ backgroundColor: '#3c32bb' }}
              onClick={() => {
                handleJoin()
              }}
            >
              {isJoin ? (
                t('action.begin', { ns: 'common' })
              ) : (
                <>
                  <img
                    src="https://jfinscan.com/static/apps/joinwallet.png"
                    alt="joinIcon"
                    style={{
                      width: '25px',
                      height: '25px',
                      verticalAlign: 'top',
                      marginRight: '5px',
                    }}
                  />
                  <span style={{ verticalAlign: 'middle' }}>Connect Join</span>
                </>
              )}
            </Button>
          </MobileFullWidth>
        </ButtonContainer>
      </StyledCard>
    </>
  )
}

export default Info
