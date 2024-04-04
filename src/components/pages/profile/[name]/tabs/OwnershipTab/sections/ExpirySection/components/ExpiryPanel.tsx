import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { OutlinkSVG, mq } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'
import { CustomTypography } from '@app/components/customs'
import { safeDateObj } from '@app/utils/date'

type Props = {
  type: 'expiry' | 'grace-period' | 'registration' | 'parent-expiry' | 'parent-grace-period'
  date: Date
  link?: string
  tooltip?: string
  supportLink?: string
}

const Container = styled.div(({ theme }) => [
  css`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
    border-bottom: 1px solid ${theme.colors.border};
    padding: ${theme.space['4']} 0;
  `,
  mq.lg.min(css`
    border-bottom: none;
    border-right: 1px solid ${theme.colors.border};
    padding: 0 ${theme.space['1']} 0 ${theme.space['4']};
  `),
])

const Header = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

const Link = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[1]};
    color: ${theme.colors.accentPrimary};

    svg {
      width: ${theme.space[3]};
      height: ${theme.space[3]};
    }
  `,
)

const Body = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space[2]};
  `,
)

export const ExpiryPanel = ({ type, date, link, tooltip, supportLink }: Props) => {
  const { t } = useTranslation('profile')
  const _date = safeDateObj(date)
  const timestamp = type === 'expiry' ? _date?.getTime() : undefined
  return (
    <Container data-testid={`expiry-panel-${type}`} data-timestamp={timestamp}>
      <Header>
        <CustomTypography fontVariant="bodyBold" color="text">
          {t(`tabs.ownership.sections.expiry.panel.${type}.title`)}
        </CustomTypography>
        {link && (
          <Link
            target="_blank"
            href={link}
            rel="noreferrer"
            data-testid="etherscan-registration-link"
          >
            <CustomTypography fontVariant="smallBold" color="accent">
              {t('action.view', { ns: 'common' })}
            </CustomTypography>
            <OutlinkSVG />
          </Link>
        )}
        {tooltip && <QuestionTooltip content={tooltip} link={supportLink} />}
      </Header>
      <Body>
        <CustomTypography fontVariant="body" color="text">
          {_date?.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </CustomTypography>
        <CustomTypography fontVariant="small" color="grey">
          {_date?.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
            hour12: false,
          })}
        </CustomTypography>
      </Body>
    </Container>
  )
}
