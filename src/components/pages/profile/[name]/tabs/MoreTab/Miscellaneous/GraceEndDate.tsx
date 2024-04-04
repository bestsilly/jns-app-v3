import { useTranslation } from 'react-i18next'

import { CustomTypography } from '@app/components/customs'
import { GRACE_PERIOD } from '@app/utils/constants'
import { formatDateTime, formatExpiry } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

export const GraceEndDate = ({ expiryDate }: { expiryDate: Date }) => {
  const { t } = useTranslation('common')
  if (!expiryDate) return null

  const graceEndDate = new Date(expiryDate.getTime() + GRACE_PERIOD)

  return (
    <DateLayout>
      <CustomTypography>{t('name.graceEnd')}</CustomTypography>
      <CustomTypography>{formatExpiry(graceEndDate)}</CustomTypography>
      <CustomTypography>{formatDateTime(graceEndDate)}</CustomTypography>
    </DateLayout>
  )
}
