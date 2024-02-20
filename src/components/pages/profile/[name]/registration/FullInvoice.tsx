import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Colors } from '@ensdomains/thorin'

import GasDisplay from '@app/components/@atoms/GasDisplay'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE } from '@app/utils/constants'
import useUserConfig from '@app/utils/useUserConfig'

const OptionBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const InvoiceContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['2']};
    width: 100%;
  `,
)

type Props = ReturnType<typeof useEstimateFullRegistration>

const FullInvoice = ({ years, totalYearlyFee, hasPremium, premiumFee }: Props) => {
  const { t } = useTranslation('register')

  const { userConfig } = useUserConfig()
  const currencyDisplay = userConfig.currency === 'fiat' ? userConfig.fiat : 'eth'

  const invoiceItems = useMemo(
    () => [
      {
        label: t('invoice.yearRegistration', { years }),
        bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
        value: totalYearlyFee,
      },
      ...(hasPremium
        ? [
            {
              label: t('invoice.temporaryPremium'),
              value: premiumFee,
              bufferPercentage: CURRENCY_FLUCTUATION_BUFFER_PERCENTAGE,
              color: 'blue' as Colors,
            },
          ]
        : []),
    ],
    [t, years, totalYearlyFee, hasPremium, premiumFee],
  )

  return (
    <InvoiceContainer>
      <OptionBar>
        <GasDisplay />
      </OptionBar>
      <Invoice items={invoiceItems} unit={currencyDisplay} totalLabel={t('invoice.total')} />
    </InvoiceContainer>
  )
}

export default FullInvoice
