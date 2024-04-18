import styled, { css } from 'styled-components'

import { CustomTypography } from '@app/components/customs'

const DescriptionWrapper = styled(CustomTypography)(
  ({ theme }) => css`
    display: inline;
    text-align: center;
    a {
      display: inline-block;
    }
    margin-bottom: ${theme.space['2']};
  `,
)

export const GenericWithDescription = ({ description }: { description: string }) => {
  return (
    <DescriptionWrapper>
      <CustomTypography>{description}</CustomTypography>
    </DescriptionWrapper>
  )
}
