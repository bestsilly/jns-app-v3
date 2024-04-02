import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Button, Dialog, Typography, mq } from '@ensdomains/thorin'

const Container = styled.div(({ theme }) => [
  css`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    gap: ${theme.space['6']};
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: ${theme.space['128']};
  `),
])

const CustomTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

type Props = {
  title?: string
  description?: string
  confirmLabel?: string
  declineLabel?: string
  onConfirm?: () => void
  onDecline?: () => void
} & HTMLAttributes<HTMLDivElement>

export const ConfirmationDialogView = ({
  title,
  description,
  confirmLabel,
  declineLabel,
  onConfirm,
  onDecline,
  ...props
}: Props) => {
  return (
    <Container {...props}>
      <Dialog.Heading
        title={<span style={{ fontSize: '25px', color: '#fff' }}>{title}</span>}
        alert="warning"
      />
      <CustomTypography>{description}</CustomTypography>
      <Dialog.Footer
        leading={
          <Button
            size="medium"
            colorStyle="accentSecondary"
            onClick={onDecline}
            data-testid="confirmation-dialog-decline-button"
          >
            {declineLabel}
          </Button>
        }
        trailing={
          <Button
            size="medium"
            onClick={onConfirm}
            data-testid="confirmation-dialog-confirm-button"
          >
            {confirmLabel}
          </Button>
        }
      />
    </Container>
  )
}
