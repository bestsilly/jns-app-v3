import styled, { css } from 'styled-components'

import { CustomTypography } from '@app/components/customs'

export const CenterAlignedTypography = styled(CustomTypography)(
  () => css`
    text-align: center;
  `,
)
