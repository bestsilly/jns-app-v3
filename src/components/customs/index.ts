import styled, { css } from 'styled-components'

import { Button, Dialog, Heading, Select, Typography } from '@ensdomains/thorin'

import BaseWrapButton from '../pages/profile/[name]/tabs/MoreTab/Token/BaseWrapButton'

export const CustomSelect = styled(Select)(
  ({ theme }) =>
    css`
      button:hover {
        color: ${theme.colors.textSecondary};
      }
    `,
)

export const CustomHeading = styled(Heading)(
  ({ theme }) => css`
    color: ${theme.colors.textPrimary};
  `,
)

export const CustomTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
  `,
)

export const CustomTypographyBlack = styled(CustomTypography)(
  ({ theme }) => css`
    color: ${theme.colors.backgroundPrimary};
  `,
)

export const CustomDialogHeading = styled(Dialog.Heading)(
  ({ theme }) => css`
    div > * {
      color: ${theme.colors.textPrimary} !important;
      background: '#fff';
    }
  `,
)

export const CustomButton = styled(Button)(
  ({ theme }) => css`
    background-color: ${theme.colors.accent};
    color: #fff !important;

    &:disabled:hover {
      background-color: #ccc;
    }
    &:hover {
      background-color: ${theme.colors.accentActive};
    }
    svg {
      color: #fff;
    }
  `,
)

export const CustomBaseWrapButton = styled(BaseWrapButton)(
  ({ theme }) => css`
    background-color: ${theme.colors.accent};
    color: #fff;

    &:disabled:hover {
      background-color: #ccc;
    }
    &:hover {
      background-color: ${theme.colors.accentActive};
    }
    svg {
      color: #fff;
    }
  `,
)
