import { CalendarEvent, google, ics, office365, outlook, yahoo } from 'calendar-link'
import type { Dispatch, SetStateAction } from 'react'
import type { TFunction } from 'react-i18next'

import { CalendarSVG, Dropdown } from '@ensdomains/thorin'

import { CustomButton, CustomTypography } from '@app/components/customs'
import { formatDateTime, formatExpiry } from '@app/utils/utils'

import { DateLayout } from './components/DateLayout'

const calendarOptions = [
  {
    value: 'google',
    label: 'tabs.more.misc.reminderOptions.google',
    function: google,
  },
  {
    value: 'outlook',
    label: 'tabs.more.misc.reminderOptions.outlook',
    function: outlook,
  },
  {
    value: 'office365',
    label: 'tabs.more.misc.reminderOptions.office365',
    function: office365,
  },
  {
    value: 'yahoo',
    label: 'tabs.more.misc.reminderOptions.yahoo',
    function: yahoo,
  },
  {
    value: 'ics',
    label: 'tabs.more.misc.reminderOptions.ical',
    function: ics,
  },
]

const makeEvent = (name: string, expiryDate: Date): CalendarEvent => ({
  title: `Renew ${name}`,
  start: expiryDate,
  duration: [10, 'minute'],
  url: window.location.href,
})

export const ExpirationDate = ({
  setShowEarnifiDialog,
  expiryDate,
  t,
  name,
}: {
  name: string
  expiryDate: Date
  setShowEarnifiDialog: Dispatch<SetStateAction<boolean>>
  t: TFunction<'common', undefined>
}) => (
  <DateLayout>
    <CustomTypography>{t('name.expires')}</CustomTypography>
    <CustomTypography data-testid="expiry-data">{formatExpiry(expiryDate)}</CustomTypography>
    <CustomTypography>{formatDateTime(expiryDate)}</CustomTypography>
    <Dropdown
      shortThrow
      keepMenuOnTop
      width={220}
      items={[
        {
          value: 'earnifi',
          label: t('tabs.more.misc.reminderOptions.earnifi', { ns: 'profile' }),
          onClick: () => {
            setShowEarnifiDialog(true)
          },
        },
        ...calendarOptions.map((option) => ({
          label: t(option.label, { ns: 'profile' }),
          onClick: () => window.open(option.function(makeEvent(name, expiryDate)), '_blank'),
        })),
      ]}
    >
      <CustomButton id="remind-me-button" type="button">
        {t('action.remindMe')}
        <CalendarSVG />
      </CustomButton>
    </Dropdown>
  </DateLayout>
)
