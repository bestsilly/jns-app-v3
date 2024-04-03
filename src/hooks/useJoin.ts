/* eslint-disable @typescript-eslint/naming-convention */
import crypto from 'crypto'
import moment from 'moment'

export const useJoin = () => {
  const generateEncryptedToken = () => {
    const inputData = moment().add(7, 'hours').toISOString()

    const keyInBytes = Buffer.from(process.env.NEXT_PUBLIC_JOIN_SECRET || '', 'base64')
    const keyIvBytes = Buffer.from(process.env.NEXT_PUBLIC_JOIN_IV || '', 'base64')

    const encrypt = (val: string) => {
      const cipher = crypto.createCipheriv('aes-256-cbc', keyInBytes, keyIvBytes)
      let encrypted = cipher.update(val, 'utf8', 'base64')
      encrypted += cipher.final('base64')
      return encrypted
    }

    return encrypt(inputData)
  }

  const login = async () => {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_JOIN_BASE_URL}/api-ext/partner/request-webview`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          token: generateEncryptedToken(),
          'x-api-key': process.env.NEXT_PUBLIC_JOIN_API_KEY || '',
        },
        body: JSON.stringify({
          productId: process.env.NEXT_PUBLIC_JOIN_PRODUCT_ID,
          subModuleId: process.env.NEXT_PUBLIC_JOIN_SUBMODULE_ID,
          platformMiniAppID: process.env.NEXT_PUBLIC_JOIN_PLATFORM_MINIAPP_ID,
          redirectUrl: window.location.href,
        }),
      },
    ).then((res) => res.json())

    window.location.replace((result as any).url)
  }

  const logout = () => {
    localStorage.removeItem('sessionId')
    localStorage.removeItem('profile')
  }

  const getProfile = async () => {
    return fetch(`${process.env.NEXT_PUBLIC_JOIN_BASE_URL}/api-ext/partner-cus/info`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: generateEncryptedToken(),
        'x-api-key': process.env.NEXT_PUBLIC_JOIN_API_KEY || '',
        sessionId: localStorage.getItem('sessionId') || '',
      },
    }).then((res) => res.json())
  }

  return { login, logout, getProfile }
}