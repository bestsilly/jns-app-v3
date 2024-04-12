import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'

import { CustomTypographyBlack } from '@app/components/customs'
import { useEthPrice } from '@app/hooks/useEthPrice'
import { CurrencyDisplay } from '@app/types'
import { makeDisplay } from '@app/utils/currency'

type Props = {
  eth?: BigNumber
  /* Percentage buffer to multiply value by when displaying in ETH, defaults to 100 */
  bufferPercentage?: number
  currency: CurrencyDisplay
  rounding?: boolean
}

export const CurrencyText = ({
  eth,
  bufferPercentage = 100,
  currency = 'eth',
  rounding,
}: Props) => {
  const { data: ethPrice, loading } = useEthPrice()

  if (loading || !eth || !ethPrice) return null

  if (currency === 'eth') {
    // replace eth symbol with jfin
    return (
      <CustomTypographyBlack>
        {makeDisplay(eth.mul(bufferPercentage).div(100), 5, 'jfin', 18, rounding)}
      </CustomTypographyBlack>
    )
  }
  return (
    <CustomTypographyBlack>
      {makeDisplay(eth.mul(ethPrice).div(1e8), 2, currency, 18)}
    </CustomTypographyBlack>
  )
}
