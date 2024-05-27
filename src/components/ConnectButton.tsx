/* eslint-disable @next/next/no-img-element */
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Key, ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useDisconnect } from 'wagmi'

import {
  CheckSVG,
  CogSVG,
  CopySVG,
  ExitSVG,
  Modal,
  PersonSVG,
  Profile,
  mq,
} from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useAvatar } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useCopied } from '@app/hooks/useCopied'
import useIsWebView from '@app/hooks/useIsWebview'
import { useJoin } from '@app/hooks/useJoin'
import { usePrimary } from '@app/hooks/usePrimary'
import { useZorb } from '@app/hooks/useZorb'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { isIOS } from '@app/utils/isIOS'
import { shortenAddress } from '@app/utils/utils'

import BaseLink from './@atoms/BaseLink'
import { CustomButton } from './customs'
import JNSGradientButton from './jns/button'

const WC_STORAGE_KEYS = [
  'wc@2:core:0.3//keychain',
  'wc@2:core:0.3//messages',
  'wc@2:ethereum_provider:/chainId',
  'wc@2:client:0.3//proposal',
  'wc@2:universal_provider:/namespaces',
  'wc@2:core:0.3//subscription',
  'wc@2:core:0.3//history',
  'wc@2:client:0.3//session',
  'wc@2:core:0.3//expirer',
  'wc@2:core:0.3//pairing',
  'wc@2:universal_provider:/optionalNamespaces',
  '-walletlink:https://www.walletlink.org:session:linked',
  'wagmi.connected',
  'wagmi.wallet',
  '-walletlink:https://www.walletlink.org:session:id',
  '-walletlink:https://www.walletlink.org:session:secret',
  '-walletlink:https://www.walletlink.org:version',
  'sessionId',
]

const StyledButtonWrapper = styled.div<{ $isTabBar?: boolean; $large?: boolean }>(
  ({ theme, $isTabBar, $large }) => [
    $isTabBar
      ? css`
          position: absolute;
          align-self: center;
          justify-self: center;

          right: ${theme.space['2']};

          & button {
            padding: 0 ${theme.space['4']};
            width: ${theme.space.full};
            height: ${theme.space['10']};
            border-radius: ${theme.radii.full};
            font-size: ${theme.fontSizes.body};
            ${mq.xs.min(css`
              padding: 0 ${theme.space['8']};
            `)}
          }
        `
      : css`
          position: relative;
          & button {
            /* border-radius: ${theme.radii['2xLarge']}; */
          }
          ${$large &&
          css`
            width: 100%;
            & button {
              border-radius: ${theme.radii.large};
            }
          `}
        `,
  ],
)

const SectionDivider = styled.div(
  ({ theme }) => css`
    width: calc(100% + ${theme.space['4']});
    height: 1px;
    background-color: ${theme.colors.border};
  `,
)

const PersonOverlay = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 1;

    background: rgba(0, 0, 0, 0.25);

    svg {
      color: ${theme.colors.background};
    }
  `,
)

const InstructionWrapper = styled.div(
  ({ theme }) => css`
    width: 70vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;

    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.background};

    transition: all 0.2s ease-out;

    padding: 12px 24px 24px;
    ${mq.sm.max(css`
      width: 100vw;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    `)}
  `,
)

const InstructionGifWrapper = styled.div`
  min-height: 184px;
`

const InstructionGif = styled.img`
  width: 100%;
  margin-bottom: 8px;
`

const InstructionHeader = styled.p`
  font-weight: bold;
  font-size: 18px;
  margin-top: 6px;
  margin-bottom: 12px;
`

const Instruction = styled.ul`
  padding-left: 18px;
`

const ListItem = styled.li`
  list-style: circle;
`

type Props = {
  isTabBar?: boolean
  large?: boolean
  inHeader?: boolean
}
const calculateTestId = (isTabBar: boolean | undefined, inHeader: boolean | undefined) => {
  if (isTabBar) {
    return 'tabbar-connect-button'
  }
  if (!inHeader) {
    return 'body-connect-button'
  }
  return 'connect-button'
}

export const ConnectButton = ({ isTabBar, large, inHeader }: Props) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()
  const { openConnectModal } = useConnectModal()
  const [isIOSDeviceModalOpen, setIsIOSDeviceModalOpen] = useState(false)

  const isIOSDevice = isIOS()

  const onConnectButtonClicked = () => {
    if (isIOSDevice) {
      setIsIOSDeviceModalOpen(true)
    } else {
      openConnectModal?.()
    }
  }

  const isWebview = useIsWebView()

  useEffect(() => {
    if (!isWebview) return
    const connectButton = document.getElementById('connectButton')
    if (connectButton) connectButton.click()
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const walletConnect = document.querySelectorAll(
            'button[data-testid="rk-wallet-option-walletConnect"]',
          )
          if (walletConnect.length > 0) {
            ;(walletConnect[0] as HTMLButtonElement).click()
            observer.disconnect()
          }
        }
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [isWebview])

  return (
    <StyledButtonWrapper $large={large} $isTabBar={isTabBar}>
      <JNSGradientButton
        data-testid={calculateTestId(isTabBar, inHeader)}
        onClick={onConnectButtonClicked}
        size={breakpoints.sm || large ? 'medium' : 'small'}
        width={inHeader ? '45' : undefined}
        shape="rounded"
        id="connectButton"
      >
        {t('wallet.connect')}
      </JNSGradientButton>
      <Modal open={isIOSDeviceModalOpen} onDismiss={() => setIsIOSDeviceModalOpen(false)}>
        <InstructionWrapper>
          <InstructionHeader>Connecting Metamask for iOS Users</InstructionHeader>
          <InstructionGifWrapper>
            <InstructionGif src="/other/walletConnectIosInstruction.gif" alt="ios device" />
          </InstructionGifWrapper>
          <Instruction style={{ whiteSpace: 'pre-line' }}>
            <ListItem>Open our website on your computer.</ListItem>
            <ListItem>Click on the &quot;Connect&quot; button.</ListItem>
            <ListItem>Choose &quot;WalletConnect&quot; from the menu.</ListItem>
            <ListItem>Use mobile phone to scan the QR Code.</ListItem>
            <ListItem>You&apos;re all set to connect to Metamask</ListItem>
          </Instruction>
          <JNSGradientButton
            onClick={() => setIsIOSDeviceModalOpen(false)}
            size={breakpoints.sm || large ? 'medium' : 'small'}
            width={inHeader ? '45' : undefined}
            style={{ marginTop: 16 }}
            shape="rounded"
          >
            Close
          </JNSGradientButton>
        </InstructionWrapper>
      </Modal>
    </StyledButtonWrapper>
  )
}

export const JoinConnectButton = ({ isTabBar, large, inHeader }: Props) => {
  const breakpoints = useBreakpoint()
  const { login } = useJoin()

  return (
    <StyledButtonWrapper $large={large} $isTabBar={isTabBar}>
      <CustomButton
        data-testid={calculateTestId(isTabBar, inHeader)}
        onClick={() => login()}
        size={breakpoints.sm || large ? 'medium' : 'small'}
        width={inHeader ? '45' : undefined}
        shape="rounded"
        style={{ backgroundColor: '#3c32bb' }}
      >
        <img
          src="https://jfinscan.com/static/apps/joinwallet.png"
          alt="joinIcon"
          style={{ width: '25px', height: '25px', verticalAlign: 'top', marginRight: '5px' }}
        />
        <span style={{ verticalAlign: 'middle' }}>Connect Join</span>
      </CustomButton>
    </StyledButtonWrapper>
  )
}

const JoinHeaderProfile = ({ profile }: any) => {
  const { maskPhoneNumber, logout } = useJoin()

  const CustomProfile = styled(Profile)(
    ({ theme }) => css`
      * {
        color: ${theme.colors.textPrimary} !important;
      }
    `,
  )

  return (
    <CustomProfile
      address={profile?.contactNumber || ''}
      ensName={maskPhoneNumber(profile?.contactNumber) || ''}
      style={{ color: '#fff !important' }}
      dropdownItems={
        [
          {
            label: 'Logout Join',
            color: 'red',
            onClick: () => {
              logout()
            },
            icon: <ExitSVG />,
          },
        ] as DropdownItem[]
      }
      avatar={{
        src: profile?.protraitUrl || 'https://jfinscan.com/static/apps/joinwallet.png',
        decoding: 'sync',
        loading: 'eager',
        noBorder: false,
      }}
      size="medium"
      alignDropdown="left"
      data-testid="join-header-profile"
    />
  )
}

const HeaderProfile = ({ address }: { address: string }) => {
  const { t } = useTranslation('common')

  const primary = usePrimary(address!, !address)
  const chainId = useChainId()
  const { avatar } = useAvatar(primary.data?.name, chainId)
  const zorb = useZorb(address, 'address')
  const { disconnect } = useDisconnect()
  const { copy, copied } = useCopied(300)
  const hasPendingTransactions = useHasPendingTransactions()

  const removeWalletConnectStorage = () => {
    WC_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  const onClickDisconnect = () => {
    removeWalletConnectStorage()
    disconnect()
  }

  return (
    <Profile
      style={{ color: '#fff !important' }}
      address={address}
      ensName={primary.data?.beautifiedName}
      dropdownItems={
        [
          ...(primary.data?.name
            ? [
                {
                  label: t('wallet.myProfile'),
                  wrapper: (children: ReactNode, key: Key) => (
                    <BaseLink href="/my/profile" key={key}>
                      {children}
                    </BaseLink>
                  ),
                  as: 'a' as 'a',
                  color: 'text',
                  icon: <PersonSVG />,
                },
              ]
            : []),
          {
            label: t('navigation.settings'),
            color: 'text',
            wrapper: (children: ReactNode, key: Key) => (
              <BaseLink href="/my/settings" key={key}>
                {children}
              </BaseLink>
            ),
            as: 'a',
            icon: <CogSVG />,
            showIndicator: hasPendingTransactions,
          },
          <SectionDivider key="divider" />,
          {
            label: shortenAddress(address),
            color: 'text',
            onClick: () => copy(address),
            icon: copied ? <CheckSVG /> : <CopySVG />,
          },
          {
            label: t('wallet.disconnect'),
            color: 'red',
            onClick: onClickDisconnect,
            icon: <ExitSVG />,
          },
        ] as DropdownItem[]
      }
      avatar={{
        src: avatar || zorb,
        decoding: 'sync',
        loading: 'eager',
        noBorder: false,
        overlay: avatar ? undefined : (
          <PersonOverlay>
            <PersonSVG />
          </PersonOverlay>
        ),
      }}
      size="medium"
      alignDropdown="left"
      indicatorColor="accent"
      data-testid="header-profile"
    />
  )
}

export const HeaderConnect = () => {
  const { address } = useAccountSafely()
  const [isJoin, setIsJoin] = useState(false)
  const [profile, setProfile] = useState(null) as any
  const { useJoinListener } = useJoin()

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

  if (!address) {
    return <ConnectButton inHeader />
  }

  return (
    <>
      {isJoin ? (
        <JoinHeaderProfile profile={profile} handleStorageChange={handleStorageChange} />
      ) : (
        <JoinConnectButton />
      )}
      <HeaderProfile address={address} />
    </>
  )
}
