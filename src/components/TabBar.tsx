/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, CrossSVG, Dialog, LeftChevronSVG, PersonSVG, mq } from '@ensdomains/thorin'

import useHasPendingTransactions from '@app/hooks/transactions/useHasPendingTransactions'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useAvatar } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { useJoin } from '@app/hooks/useJoin'
import { usePrimary } from '@app/hooks/usePrimary'
import { useZorb } from '@app/hooks/useZorb'
import { getDestination, getRoute, legacyFavouritesRoute } from '@app/routes'

import { DisconnectButton, RouteItem } from './@atoms/RouteItem/RouteItem'
import { ConnectButton } from './ConnectButton'

const ExtraNavWrapper = styled.div<{ $isOpen: boolean }>(
  ({ theme, $isOpen }) => css`
    width: ${theme.space['10']};
    height: ${theme.space['10']};

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    overflow: hidden;

    transition: width 0.15s ease-in-out;

    ${$isOpen &&
    css`
      width: calc(var(--tab-container-width) - ${theme.space['4']});
    `}
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    overflow: hidden;
    min-width: ${theme.space['10']};
    width: ${theme.space['10']};
    height: ${theme.space['10']};
    background-color: rgba(196, 196, 196, 1);
    border-radius: ${theme.radii.full};

    img {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
    }
  `,
)

const JoinAvatarWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    overflow: hidden;
    display: flex; /* Use flexbox */
    justify-content: center; /* Center horizontally */
    min-width: ${theme.space['8']};
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    border-radius: ${theme.radii.full};

    img {
      width: ${theme.space['10']};
      height: ${theme.space['10']};
    }
  `,
)

const TabWrapper = styled.div(
  ({ theme }) => css`
    position: fixed;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 90%);
    padding: ${theme.space['4']};
    ${mq.sm.min(
      css`
        display: none;
      `,
    )}
  `,
)

const TabContainer = styled.div<{ $shrink: boolean }>(
  ({ theme, $shrink }) => css`
    --tab-container-width: ${theme.space['56']};

    width: var(--tab-container-width);
    height: ${theme.space['14']};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['6']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.background};
    border: 2px solid ${theme.colors.border};
    padding-left: ${theme.space['2']};
    overflow: hidden;
    position: relative;

    transition: width 0.15s ease-in-out;

    ${$shrink &&
    css`
      --tab-container-width: calc(${theme.space['40']} + ${theme.space['2']});
    `}
  `,
)

const TabItems = styled.div<{ $isConnected: boolean }>(
  ({ theme, $isConnected }) => css`
    position: absolute;
    ${$isConnected
      ? css`
          right: 0;
        `
      : css`
          left: ${theme.space['4']};
        `}
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
    padding: 0 ${theme.space['1.5']};
  `,
)

const BackButton = styled.button(
  ({ theme }) => css`
    width: ${theme.space['10']};
    height: ${theme.space['10']};
    border: 2px solid ${theme.colors.border};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.background};

    display: flex;
    align-items: center;
    justify-content: center;

    & > svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      color: ${theme.colors.grey};
    }
  `,
)

const ArrowOverlay = styled.svg<{ $isOpen: boolean }>(
  ({ theme, $isOpen }) => css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: ${theme.space['10']};
    height: ${theme.space['10']};
    background: rgba(0, 0, 0, 0.25);
    color: ${theme.colors.background};
    padding: ${theme.space['2.5']};
    opacity: 0;

    transition: opacity 0.15s ease-in-out;

    ${$isOpen &&
    css`
      opacity: 1;
    `}
  `,
)

const profileRoute = getRoute('profile')

const TabBarProfile = ({
  address,
  isOpen,
  setIsOpen,
  name,
}: {
  address: string
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
  name?: string
}) => {
  const router = useRouter()
  const chainId = useChainId()
  const { avatar } = useAvatar(name, chainId)
  const zorb = useZorb(address, 'address')
  const hasPendingTransactions = useHasPendingTransactions()
  const [isJoin, setIsJoin] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const { login, logout, useJoinListener } = useJoin()
  const [profile, setProfile] = useState(null) as any

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

  return (
    <>
      <Dialog
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={() => {
              if (isJoin) {
                logout()
              } else {
                login()
              }
            }}
          >
            {isJoin ? 'Logout Join' : 'Connect Join'}
          </Button>
        }
        open={joinModalOpen}
        variant="actionable"
        onDismiss={() => setJoinModalOpen(false)}
        onClose={() => setJoinModalOpen(false)}
      >
        {isJoin && (
          <>
            <img
              alt="joinIconMobile"
              src="https://jfinscan.com/static/apps/joinwallet.png"
              style={{ width: '30px', height: '30px' }}
            />
            <span>{profile?.contactNumber || ''}</span>
          </>
        )}
      </Dialog>
      <ExtraNavWrapper $isOpen={isOpen}>
        <AvatarWrapper onClick={() => setIsOpen((prev) => !prev)}>
          <ArrowOverlay as={CrossSVG} $isOpen={isOpen} />
          {avatar ? (
            <img loading="eager" decoding="sync" alt="avatar" src={avatar} />
          ) : (
            <>
              <ArrowOverlay as={PersonSVG} $isOpen={!isOpen} />
              <img loading="eager" decoding="sync" alt="zorb" src={zorb} />
            </>
          )}
        </AvatarWrapper>
        <JoinAvatarWrapper onClick={() => setJoinModalOpen(true)}>
          <img
            loading="eager"
            decoding="sync"
            alt="avatar"
            src="https://jfinscan.com/static/apps/joinwallet.png"
            style={{ width: '35px', height: '35px' }}
          />
        </JoinAvatarWrapper>
        {name && (
          <RouteItem
            route={profileRoute}
            active={router.asPath === getDestination(`/profile/${name}`)}
          />
        )}
        <RouteItem route={getRoute('settings')} hasNotification={hasPendingTransactions} />
        <DisconnectButton />
      </ExtraNavWrapper>
    </>
  )
}

export const TabBar = () => {
  const router = useRouter()

  const { address } = useAccountSafely()
  const primary = usePrimary(address!, !!address)

  const hasPrimary = !!primary.data?.name
  const hasBack = !!router.query.from

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    if (!address) {
      setIsOpen(false)
    }
  }, [address])

  return (
    <>
      <TabWrapper id="tabbar">
        {hasBack && (
          <BackButton onClick={() => router.back()}>
            <LeftChevronSVG />
          </BackButton>
        )}
        <TabContainer $shrink={!!(address && ((isOpen && !hasPrimary) || !isOpen))}>
          <TabItems $isConnected={!!address}>
            <RouteItem route={getRoute('search')} />
            {address && (
              <>
                <RouteItem route={getRoute('names')} />
                {globalThis?.localStorage?.getItem('ensFavourites') && (
                  <RouteItem route={legacyFavouritesRoute} />
                )}
                <TabBarProfile
                  address={address}
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  name={primary.data?.name}
                />
              </>
            )}
          </TabItems>
          {!address && <ConnectButton isTabBar />}
        </TabContainer>
      </TabWrapper>
    </>
  )
}
