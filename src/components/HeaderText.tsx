import styled, { css } from 'styled-components'

import { CustomTypography } from './customs'

const Wrapper = styled.div<{ $align: 'left' | 'right' }>(
  ({ $align }) => css`
    display: flex;
    flex-direction: column;
    align-items: ${$align === 'left' ? 'flex-start' : 'flex-end'};
    justify-content: center;
  `,
)

const Title = styled(CustomTypography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.headingThree};
    line-height: ${theme.lineHeights.headingThree};
  `,
)

const Subtitle = styled(CustomTypography)(
  ({ theme }) => css`
    line-height: ${theme.lineHeights.body};
    color: ${theme.colors.greenPrimary};
  `,
)

export const HeaderText = ({
  title,
  subtitle,
  align = 'left',
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'right'
}) => {
  return (
    <Wrapper $align={align}>
      <Title weight="bold">{title}</Title>
      {subtitle && <Subtitle fontVariant="smallBold">{subtitle}</Subtitle>}
    </Wrapper>
  )
}
