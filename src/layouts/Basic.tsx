import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useErrorBoundary, withErrorBoundary } from 'react-use-error-boundary'
// import { useIntercom } from 'react-use-intercom'
import styled, { css } from 'styled-components'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import FeedbackSVG from '@app/assets/Feedback.svg'
import ErrorScreen from '@app/components/@atoms/ErrorScreen'
import { Footer } from '@app/components/Footer'
import { useJoin } from '@app/hooks/useJoin'

import { Navigation } from './Navigation'

const Container = styled.div(
  ({ theme }) => css`
    --padding-size: ${theme.space['4']};
    padding: var(--padding-size);
    padding-bottom: 0;
    display: flex;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
    flex-direction: column;
    align-items: stretch;
    @supports (-webkit-touch-callout: none) {
      // hack for iOS/iPadOS Safari
      // width should always be 100% - total padding
      width: calc(100% - calc(var(--padding-size) * 2));
      box-sizing: content-box;
    }
    ${mq.sm.min(css`
      --padding-size: ${theme.space['8']};
      gap: ${theme.space['6']};
      flex-gap: ${theme.space['6']};
    `)}
  `,
)

const ContentWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    align-self: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
    align-items: center;
  `,
)

// const BottomPlaceholder = styled.div(
//   ({ theme }) => css`
//     height: ${theme.space['14']};
//     ${mq.sm.min(
//       css`
//         height: ${theme.space['12']};
//       `,
//     )}
//   `,
// )

export const StyledFeedbackSVG = styled(FeedbackSVG)(() => css``)

export const Basic = withErrorBoundary(({ children }: { children: React.ReactNode }) => {
  const { chain: currentChain } = useNetwork()
  const { switchNetwork } = useSwitchNetwork()
  const router = useRouter()
  const [error] = useErrorBoundary()
  const { getProfile } = useJoin()
  const chainId = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 3502 : 3501

  useEffect(() => {
    if (currentChain && !(currentChain?.id === chainId)) {
      switchNetwork?.(chainId)
      router.push('/unsupportedNetwork')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain?.id, router.pathname])

  const { query } = router

  useEffect(() => {
    if (query?.sessionId) {
      localStorage.setItem('sessionId', query?.sessionId as string)
      window.dispatchEvent(new StorageEvent('storage', { key: 'sessionId' }))
      const profile = localStorage.getItem('profile')

      const fetchData = async () => {
        const result: any = await getProfile()
        if (!result.data) return
        localStorage.setItem('profile', JSON.stringify(result.data))
        window.dispatchEvent(new StorageEvent('storage', { key: 'profile' }))
        window.history.replaceState({}, document.title, window.location.pathname)
      }

      if (!profile) {
        fetchData()
      }
    }
  }, [getProfile, query])

  return (
    <>
      <Navigation />
      <Container className="min-safe" style={{ position: 'relative' }}>
        <ContentWrapper>
          {/* START DEBUG */}
          <u>PATH : {router.pathname}</u>
          <u>Query : {JSON.stringify(router.query, null, 2)}</u>
          <u>Chain: </u>
          <pre>{JSON.stringify(currentChain, null, 2)}</pre>
          {error ? (
            <>
              <ErrorScreen errorType="application-error" />
              {JSON.stringify(error, null, 2)}
            </>
          ) : (
            children
          )}
          {/* END DEBUG */}
        </ContentWrapper>
      </Container>
      <Footer />
    </>
  )
})
