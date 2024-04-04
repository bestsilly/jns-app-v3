import Link from 'next/link'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import type { UrlObject } from 'url'

import OutlinkSVG from '@app/assets/Outlink.svg'

import BaseLink from './@atoms/BaseLink'
import { CustomTypography } from './customs'

export const StyledAnchor = styled.a(
  ({ theme }) => css`
    padding-right: ${theme.space['4']};
    position: relative;
    color: ${theme.colors.accent};
    cursor: pointer;
  `,
)

const OutlinkIcon = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: ${theme.space['0']};
    right: ${theme.space['0']};
    width: ${theme.space['3.5']};
    height: ${theme.space['3.5']};
    opacity: 0.5;
  `,
)

export const OutlinkTypography = styled(CustomTypography)(
  () => css`
    display: inline-block;
  `,
)

export const Outlink = ({
  href,
  children,
  ...props
}: Omit<ComponentProps<'a'>, 'href' | 'target' | 'rel'> &
  ComponentProps<typeof StyledAnchor> & {
    href: string | UrlObject
  }) => {
  const InnerContent = (
    <StyledAnchor {...props} rel="noreferrer noopener" target="_blank" role="link">
      <OutlinkTypography fontVariant="smallBold" color="blue">
        {children}
      </OutlinkTypography>
      <OutlinkIcon as={OutlinkSVG} />
    </StyledAnchor>
  )

  if (typeof href === 'string' && href.startsWith('http')) {
    return (
      <Link href={href} passHref>
        {InnerContent}
      </Link>
    )
  }

  return (
    <BaseLink href={href} passHref>
      {InnerContent}
    </BaseLink>
  )
}
