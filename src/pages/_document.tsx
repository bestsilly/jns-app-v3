/* eslint-disable @next/next/no-title-in-document-head */
import { AppPropsType, AppType } from 'next/dist/shared/lib/utils'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const ipfsPathScript = `
  (function () {
    const { pathname } = window.location
    const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
    const base = document.createElement('base')

    base.href = ipfsMatch ? ipfsMatch[0] : '/'
    document.head.append(base)
  })();
`

const hiddenCheckScript = `
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', () => {
      if (typeof window.ethereum !== 'undefined') {
        window.location.reload()
      }
    }, {
      once: true,
    })
  } else if (document.hidden || document.visibilityState === 'hidden') {
    document.addEventListener('visibilitychange', () => {
      if (typeof window.ethereum !== 'undefined') {
        window.location.reload()
      }
    }, {
      once: true,
    })
  }
`

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: AppType) => (props: AppPropsType) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          {/* eslint-disable-next-line react/no-danger */}
          <script dangerouslySetInnerHTML={{ __html: hiddenCheckScript }} />
          {process.env.NEXT_PUBLIC_IPFS && (
            <>
              {/* eslint-disable-next-line react/no-danger */}
              <script dangerouslySetInnerHTML={{ __html: ipfsPathScript }} />
              {/* eslint-disable-next-line @next/next/no-css-tags */}
              <link rel="stylesheet" href="./fonts/fonts.css" />
            </>
          )}
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
          <script
            defer
            data-domain="app.ens.domains"
            src="https://plausible.io/js/script.outbound-links.js"
          />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <title>JNS</title>
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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
