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

          <script
            defer
            data-domain="app.ens.domains"
            src="https://plausible.io/js/script.outbound-links.js"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
