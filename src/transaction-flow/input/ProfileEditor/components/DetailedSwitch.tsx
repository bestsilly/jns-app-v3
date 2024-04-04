import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Toggle } from '@ensdomains/thorin'

import { CustomTypography } from '@app/components/customs'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};
  `,
)

const ContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    flex-direction: column;
    gap: ${theme.space['1']};
  `,
)

const StyledToggle = styled(Toggle)(
  ({ theme }) => css`
    background: ${theme.colors.greyPrimary};
  `,
)

type ToggleProps = ComponentProps<typeof Toggle>

type Props = {
  title?: string
  description?: string
} & ToggleProps

export const DetailedSwitch = forwardRef<HTMLInputElement, Props>(
  ({ title, description, ...toggleProps }, ref) => {
    return (
      <Container data-testid="detailed-switch">
        <ContentContainer>
          {title && <CustomTypography fontVariant="bodyBold">{title}</CustomTypography>}{' '}
          {description && <CustomTypography fontVariant="small">{description}</CustomTypography>}
        </ContentContainer>
        <StyledToggle ref={ref} {...toggleProps} size="large" />
      </Container>
    )
  },
)
