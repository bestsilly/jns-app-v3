import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'

const useIsWebView = () => {
  const [isWebView, setIsWebView] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
    const _isWebview = /webview|wv|ip((?!.*Safari)|(?=.*like Safari))/i.test(userAgent)

    const webview = (() => {
      if (isMobile) {
        if (_isWebview) {
          // eslint-disable-next-line no-alert
          alert('is webview')
          return true
        }
      }
      return false
    })()
    setIsWebView(webview)
  }, [])

  return isWebView
}

export default useIsWebView
