import { UseFormRegister } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckboxRow } from '@ensdomains/thorin'

import { CustomDialogHeading, CustomTypography } from '@app/components/customs'
import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'

import type { FormData } from '../RevokePermissions-flow'

type Props = {
  managerAddr: string
  register: UseFormRegister<FormData>
  onDismiss: () => void
}

const CenterAlignedTypography = styled(CustomTypography)(
  () => css`
    text-align: center;
  `,
)

export const RevokePCCView = ({ managerAddr, register }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { data: { nameOrAddr } = {} } = usePrimaryNameOrAddress(managerAddr)

  return (
    <>
      <CustomDialogHeading title={t('input.revokePermissions.views.revokePCC.title')} />
      <CenterAlignedTypography fontVariant="body" color="text">
        <CustomTypography>
          <Trans
            i18nKey="input.revokePermissions.views.revokePCC.subtitle"
            t={t}
            values={{ account: nameOrAddr }}
          />
        </CustomTypography>
      </CenterAlignedTypography>
      <CheckboxRow
        data-testid="checkbox-pcc"
        label={t('input.revokePermissions.views.revokePCC.title')}
        {...register('parentFuses.PARENT_CANNOT_CONTROL')}
      />
    </>
  )
}
