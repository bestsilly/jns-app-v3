/* eslint-disable @next/next/no-title-in-document-head */
import { RainbowKitProvider, Theme, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { merge } from 'lodash'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement, ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { ThemeProvider, createGlobalStyle, css, keyframes } from 'styled-components'
import { WagmiConfig } from 'wagmi'

import { ThorinGlobalStyles, mq, darkTheme as thorinDarkTheme } from '@ensdomains/thorin'

import { Notifications } from '@app/components/Notifications'
import { TransactionStoreProvider } from '@app/hooks/transactions/TransactionStoreContext'
import { Basic } from '@app/layouts/Basic'
import { TransactionFlowProvider } from '@app/transaction-flow/TransactionFlowProvider'
import { BreakpointProvider } from '@app/utils/BreakpointProvider'
import { EnsProvider } from '@app/utils/EnsProvider'
import { GlobalErrorProvider } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'
import { SyncDroppedTransaction } from '@app/utils/SyncProvider/SyncDroppedTransaction'
import { SyncProvider } from '@app/utils/SyncProvider/SyncProvider'
import { setupAnalytics } from '@app/utils/analytics'
import { chains, wagmiClient } from '@app/utils/query'

import i18n from '../i18n'
import '../styles.css'

const thorinGlobalTheme: typeof thorinDarkTheme = merge(thorinDarkTheme, {
  colors: {
    accentPrimary: '#3c32bb',
    accent: '#3c32bb',
    accentLight: '#4134eb',
    background: '#101112',
    backgroundPrimary: '#101112',
    backgroundSecondary: '#fff',
    greySurface: 'white',
    textSecondary: '#3e4042',
  },
})

const breakpoints = {
  xs: '(min-width: 360px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

const rainbowKitTheme = merge(
  darkTheme({ accentColor: thorinGlobalTheme.colors.accent, borderRadius: 'medium' }),
  {
    fonts: {
      body: 'Satoshi, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    },
  } as Theme,
)

const anim = keyframes`
  0% {
    opacity: 1;
  }

  0%, 99% {
    pointer-events: auto;
  }

  100% {
    opacity: 0.5;
    pointer-events: none;
  }
`

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
  }

  *,
  ::before,
  ::after {
    font-family: Satoshi,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Fira Sans",
      "Droid Sans",
      "Helvetica Neue",
      sans-serif;
  }

  body {
    background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(19,5,59,1) 100%);
  }



  
  body, .min-safe {
 
    ${mq.sm.max(css`
      min-height: calc(100vh);
      padding-bottom: 50px;
    `)}

    min-height: calc(100vh - 80px);
   
    /* stylelint-disable-next-line value-no-vendor-prefix */
    @supports (-webkit-touch-callout: none) {
      /* stylelint-disable-next-line value-no-vendor-prefix */
      min-height: -webkit-fill-available;
    }
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  * {
    box-sizing: border-box;
    font-feature-settings: "ss01" on, "ss03" on;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -moz-font-feature-settings: "ss01" on, "ss03" on;
  }

  .cacheable-component > div:last-of-type > div > * {
    transition: opacity 0.15s ease-in-out;
    opacity: 1;
  }

  .cacheable-component-cached > div:last-of-type > div > * {
    opacity: 0.5;
    pointer-events: none;
    animation: ${anim} 0.25s ease-in-out 0.5s backwards;

    &.transaction-loader {
      opacity: 1;
      pointer-events: auto;
      animation: none;
    }
  }
`

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

setupAnalytics()

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <>
      <Head>
        <title>JNS</title>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta name="title" content="JNS" />
        <meta
          name="description"
          content="JNS is your unified gateway to the decentralized web. A singular name for all your blockchain addresses and your portal to a decentralized presence."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jns-app.pages.dev/" />
        <meta property="og:title" content="JNS" />
        <meta
          property="og:description"
          content="JNS is your unified gateway to the decentralized web. A singular name for all your blockchain addresses and your portal to a decentralized presence."
        />
        <meta property="og:image" content="/cover.png" />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://jns-app.pages.dev/" />
        <meta property="twitter:title" content="JNS" />
        <meta
          property="twitter:description"
          content="JNS is your unified gateway to the decentralized web. A singular name for all your blockchain addresses and your portal to a decentralized presence."
        />
        <meta property="twitter:image" content="/cover.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <I18nextProvider i18n={i18n}>
        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider theme={rainbowKitTheme} chains={chains}>
            <TransactionStoreProvider>
              <EnsProvider>
                <ThemeProvider theme={thorinGlobalTheme}>
                  <BreakpointProvider queries={breakpoints}>
                    <GlobalStyle />
                    <ThorinGlobalStyles theme={thorinGlobalTheme} />
                    <GlobalErrorProvider>
                      <SyncProvider>
                        <TransactionFlowProvider>
                          <SyncDroppedTransaction>
                            <Notifications />
                            <Basic>{getLayout(<Component {...pageProps} />)}</Basic>
                          </SyncDroppedTransaction>
                        </TransactionFlowProvider>
                      </SyncProvider>
                    </GlobalErrorProvider>
                  </BreakpointProvider>
                </ThemeProvider>
              </EnsProvider>
            </TransactionStoreProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </I18nextProvider>
    </>
  )
}

export default MyApp
