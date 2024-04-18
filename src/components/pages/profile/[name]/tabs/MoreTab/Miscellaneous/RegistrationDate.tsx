import { useTranslation } from 'react-i18next'

import { OutlinkSVG } from '@ensdomains/thorin'

import { CustomTypography } from '@app/components/customs'
import { useChainName } from '@app/hooks/useChainName'
import type useRegistrationDate from '@app/hooks/useRegistrationData'
import { formatDateTime, formatExpiry, makeEtherscanLink } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

export const RegistrationDate = ({
  registrationData,
}: {
  registrationData: ReturnType<typeof useRegistrationDate>['data']
}) => {
  const { t } = useTranslation('common')
  const chainName = useChainName()
  if (!registrationData) return null
  return (
    <DateLayout>
      <CustomTypography>{t('name.registered')}</CustomTypography>
      <CustomTypography>{formatExpiry(registrationData.registrationDate)}</CustomTypography>
      <CustomTypography>{formatDateTime(registrationData.registrationDate)}</CustomTypography>
      <a
        target="_blank"
        href={makeEtherscanLink(registrationData.transactionHash, chainName)}
        rel="noreferrer"
        data-testid="etherscan-registration-link"
      >
        {t('action.view')}
        <OutlinkSVG />
      </a>
    </DateLayout>
  )
}
