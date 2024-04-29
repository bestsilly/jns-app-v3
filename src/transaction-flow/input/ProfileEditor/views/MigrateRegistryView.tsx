import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { CustomButton, CustomHeading } from '@app/components/customs'

import { CenteredTypography } from '../components/CenteredTypography'
import { ContentContainer } from '../components/ContentContainer'
import { StyledInnerDialog } from '../components/StyledInnerDialog'

type Props = {
  name: string
  onCancel?: () => void
}
export const MigrateRegistryView = ({ name, onCancel }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Heading
        title={
          <CustomHeading>
            {t('input.profileEditor.warningOverlay.migrateRegistry.title')}
          </CustomHeading>
        }
        alert="error"
      />
      <StyledInnerDialog>
        <ContentContainer>
          <CenteredTypography>
            {t('input.profileEditor.warningOverlay.migrateRegistry.subtitle')}
          </CenteredTypography>
        </ContentContainer>
      </StyledInnerDialog>
      <Dialog.Footer
        leading={
          <Button
            colorStyle="accentSecondary"
            onClick={onCancel}
            data-testid="warning-overlay-back-button"
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <CustomButton
            as="a"
            href={`https://legacy.ens.domains/name/${name}`}
            target="_blank"
            data-testid="warning-overlay-next-button"
          >
            {t('input.profileEditor.warningOverlay.migrateRegistry.action')}
          </CustomButton>
        }
      />
    </>
  )
}
