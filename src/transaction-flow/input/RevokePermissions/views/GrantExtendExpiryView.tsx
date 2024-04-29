import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { CheckboxRow } from '@ensdomains/thorin'

import { CustomDialogHeading, CustomHeading } from '@app/components/customs'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  register: UseFormRegister<FormData>
}

export const GrantExtendExpiryView = ({ register }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <CustomDialogHeading
        title={
          <CustomHeading>
            {t('input.revokePermissions.views.grantExtendExpiry.title')}
          </CustomHeading>
        }
      />
      <CheckboxRow
        data-testid="checkbox-CAN_EXTEND_EXPIRY"
        label={t('input.revokePermissions.views.grantExtendExpiry.fuses.CAN_EXTEND_EXPIRY')}
        {...register(`parentFuses.CAN_EXTEND_EXPIRY`, {})}
      />
    </>
  )
}
