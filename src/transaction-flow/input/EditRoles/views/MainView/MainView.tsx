import { useFieldArray, useFormContext, useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, ScrollBox } from '@ensdomains/thorin'

import { CustomButton, CustomDialogHeading, CustomHeading } from '@app/components/customs'

import type { EditRolesForm } from '../../EditRoles-flow'
import { EditRolesFooter } from '../../components/EditRolesFooter'
import { RoleCard } from './components/RoleCard'

const StyledScrollBox = styled(ScrollBox)(
  ({ theme }) => css`
    flex: 1;
    width: 100%;
    margin-right: -${theme.space[2]};
  `,
)

const ScrollBoxContent = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[4]};
    padding: ${theme.space[4]} 0;
  `,
)

type Props = {
  onSelectIndex: (index: number) => void
  onSave: () => void
  onCancel: () => void
}

export const MainView = ({ onSelectIndex, onCancel, onSave }: Props) => {
  const { t } = useTranslation()
  const { control } = useFormContext<EditRolesForm>()
  const { fields: roles } = useFieldArray<EditRolesForm>({ control, name: 'roles' })
  const formState = useFormState({ control, name: 'roles' })

  // Bug in react-hook-form where isDirty is not always update when using field array.
  // Manually handle the check instead.
  const isDirty = !!formState.dirtyFields?.roles?.some((role) => !!role.address)

  return (
    <>
      <CustomDialogHeading title={<CustomHeading>Edit roles</CustomHeading>} />
      <StyledScrollBox hideDividers>
        <ScrollBoxContent>
          {roles.map((role, index) => (
            <RoleCard
              key={role.role}
              role={role.role}
              address={role.address}
              dirty={formState.dirtyFields.roles?.[index]?.address}
              onClick={() => onSelectIndex?.(index)}
            />
          ))}
        </ScrollBoxContent>
      </StyledScrollBox>
      <EditRolesFooter
        leading={
          <Button colorStyle="accentSecondary" onClick={() => onCancel()}>
            {t('action.cancel')}
          </Button>
        }
        trailing={
          <CustomButton
            data-testid="edit-roles-save-button"
            disabled={!isDirty}
            onClick={() => onSave()}
          >
            {t('action.save')}
          </CustomButton>
        }
      />
    </>
  )
}
