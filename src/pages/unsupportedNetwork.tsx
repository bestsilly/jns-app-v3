import { useRouter } from 'next/router'
import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useNetwork, useSwitchNetwork } from 'wagmi'

import { Helper, mq } from '@ensdomains/thorin'

import { CustomButton } from '@app/components/customs'

const Card = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['3.5']};
    border-radius: ${theme.radii['3xLarge']};
    background-color: ${theme.colors.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    gap: ${theme.space['4']};
    max-height: 75vh;
    overflow-y: auto;

    ${mq.sm.min(css`
      width: initial;
      min-width: ${theme.space['128']};
    `)}
  `,
)

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Page() {
  const { switchNetwork } = useSwitchNetwork()
  const { chain: currentChain } = useNetwork()
  const { t } = useTranslation()
  const router = useRouter()

  const chainId = process.env.NEXT_PUBLIC_IS_TESTNET === 'true' ? 3502 : 3501

  useEffect(() => {
    console.log(currentChain?.id)
    if (currentChain?.id === chainId) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChain?.id])

  const handleChangeNetwork = () => {
    switchNetwork?.(chainId)
  }

  return (
    <Container>
      <Card>
        <Helper type="error">{t('unsupportedNetwork')}</Helper>
        <CustomButton onClick={handleChangeNetwork}>{t('action.changeNetwork')}</CustomButton>
      </Card>
    </Container>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Container>{page}</Container>
}
