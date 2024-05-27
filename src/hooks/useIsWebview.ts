import { useEffect, useState } from 'react'
import { browserName, isMobile } from 'react-device-detect'

const useIsWebView = () => {
  const [isWebView, setIsWebView] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera

    const webview = (() => {
      if (isMobile) {
        if (browserName === 'Chrome') {
          return /wv/.test(userAgent) || /; wv\)/.test(userAgent)
        }
        if (browserName === 'Safari') {
          return /.+AppleWebKit(?!.*Safari)/.test(userAgent)
        }
      }
      return false
    })()

    setIsWebView(webview)
  }, [])

  return isWebView
}

export default useIsWebView
