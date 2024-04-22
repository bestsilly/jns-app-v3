import type { BigNumber } from 'ethers'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import usePrevious from 'react-use/lib/usePrevious'
import styled, { css } from 'styled-components'
import { useBalance } from 'wagmi'

import { Field, Heading, Helper, RadioButtonGroup, Toggle, mq } from '@ensdomains/thorin'

// import MoonpayLogo from '@app/assets/MoonpayLogo.svg'
import MobileFullWidth from '@app/components/@atoms/MobileFullWidth'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Card } from '@app/components/Card'
import { ConnectButton } from '@app/components/ConnectButton'
import { CustomButton, CustomTypography, CustomTypographyBlack } from '@app/components/customs'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useContractAddress } from '@app/hooks/useContractAddress'
import { useEstimateFullRegistration } from '@app/hooks/useEstimateRegistration'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import FullInvoice from '../../FullInvoice'
import {
  MoonpayTransactionStatus,
  PaymentMethod,
  RegistrationReducerDataItem,
  RegistrationStepData,
} from '../../types'
import { useMoonpayRegistration } from '../../useMoonpayRegistration'
import TemporaryPremium from './TemporaryPremium'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const OutlinedContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: grid;
    align-items: center;
    grid-template-areas: 'title checkbox' 'description description';
    gap: ${theme.space['2']};

    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    background: ${theme.colors.backgroundSecondary};

    ${mq.sm.min(css`
      grid-template-areas: 'title checkbox' 'description checkbox';
    `)}
  `,
)

const StyledHeading = styled(Heading)(
  ({ theme }) => css`
    width: 100%;
    word-break: break-all;
    color: ${theme.colors.textTertiary};

    @supports (overflow-wrap: anywhere) {
      overflow-wrap: anywhere;
      word-break: normal;
    }
  `,
)

const gridAreaStyle = ({ $name }: { $name: string }) => css`
  grid-area: ${$name};
`

// const moonpayInfoItems = Array.from({ length: 2 }, (_, i) => `steps.info.moonpayItems.${i}`)

const PaymentChoiceContainer = styled.div`
  width: 100%;
`

const StyledRadioButtonGroup = styled(RadioButtonGroup)(
  ({ theme }) => css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.large};
    gap: 0;
  `,
)

// const StyledRadioButton = styled(RadioButton)``

const RadioButtonContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    &:last-child {
      border-top: 1px solid ${theme.colors.border};
    }
  `,
)

// const StyledTitle = styled(CustomTypography)`
//   margin-left: 15px;
// `

// const RadioLabel = styled(CustomTypography)(
//   ({ theme }) => css`
//     margin-right: 10px;
//     color: ${theme.colors.text};
//   `,
// )

// const MoonpayContainer = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 5px;
// `

// const InfoItems = styled.div(
//   ({ theme }) => css`
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: flex-start;
//     gap: ${theme.space['4']};

//     ${mq.sm.min(css`
//       flex-direction: row;
//       align-items: stretch;
//     `)}
//   `,
// )

// const InfoItem = styled.div(
//   ({ theme }) => css`
//     width: 100%;

//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     gap: ${theme.space['4']};

//     padding: ${theme.space['4']};
//     border: 1px solid ${theme.colors.border};
//     border-radius: ${theme.radii.large};
//     text-align: center;

//     & > div:first-of-type {
//       width: ${theme.space['10']};
//       height: ${theme.space['10']};
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       font-size: ${theme.fontSizes.extraLarge};
//       font-weight: ${theme.fontWeights.bold};
//       color: ${theme.colors.backgroundPrimary};
//       background: ${theme.colors.accentPrimary};
//       border-radius: ${theme.radii.full};
//     }

//     & > div:last-of-type {
//       flex-grow: 1;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//     }
//   `,
// )

// const LabelContainer = styled.div`
//   display: flex;
//   flex-wrap: wrap;
// `

const CheckboxWrapper = styled.div(
  () => css`
    width: 100%;
  `,
  gridAreaStyle,
)

const OutlinedContainerDescription = styled(CustomTypography)(gridAreaStyle)

const OutlinedContainerTitle = styled(CustomTypography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    font-weight: ${theme.fontWeights.bold};
    white-space: nowrap;
  `,
  gridAreaStyle,
)

const EthInnerCheckbox = ({
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (val: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')
  const breakpoints = useBreakpoint()

  useEffect(() => {
    if (!started) {
      setReverseRecord(!hasPrimaryName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setReverseRecord])

  return (
    <CheckboxWrapper $name="checkbox">
      <Field hideLabel label={t('steps.pricing.primaryName')} inline reverse disabled={!address}>
        {(ids) => (
          <Toggle
            {...ids?.content}
            disabled={!address}
            size={breakpoints.sm ? 'large' : 'medium'}
            checked={reverseRecord}
            color="accent"
            onChange={(e) => {
              e.stopPropagation()
              setReverseRecord(e.target.checked)
            }}
            data-testid="primary-name-toggle"
          />
        )}
      </Field>
    </CheckboxWrapper>
  )
}

const PaymentChoice = ({
  paymentMethodChoice,
  setPaymentMethodChoice,
  hasEnoughEth,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasPendingMoonpayTransaction,
  address,
  hasPrimaryName,
  reverseRecord,
  setReverseRecord,
  started,
}: {
  paymentMethodChoice: PaymentMethod
  setPaymentMethodChoice: Dispatch<SetStateAction<PaymentMethod>>
  hasEnoughEth: boolean
  hasPendingMoonpayTransaction: boolean
  hasFailedMoonpayTransaction: boolean
  address: string
  hasPrimaryName: boolean
  reverseRecord: boolean
  setReverseRecord: (reverseRecord: boolean) => void
  started: boolean
}) => {
  const { t } = useTranslation('register')

  return (
    <PaymentChoiceContainer>
      <Spacer $height="2" />
      <StyledRadioButtonGroup
        value={paymentMethodChoice}
        onChange={(e) => setPaymentMethodChoice(e.target.value as PaymentMethod)}
      >
        <RadioButtonContainer>
          {paymentMethodChoice === PaymentMethod.ethereum && !hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <Helper type="warning" alignment="horizontal">
                {t('steps.info.notEnoughJFIN')}
              </Helper>
              <Spacer $height="2" />
            </>
          )}
          {paymentMethodChoice === PaymentMethod.ethereum && hasEnoughEth && (
            <>
              <Spacer $height="4" />
              <OutlinedContainer>
                <OutlinedContainerTitle $name="title">
                  <CustomTypographyBlack>{t('steps.pricing.primaryName')}</CustomTypographyBlack>
                </OutlinedContainerTitle>
                <EthInnerCheckbox
                  {...{ address, hasPrimaryName, reverseRecord, setReverseRecord, started }}
                />
                <OutlinedContainerDescription $name="description">
                  <CustomTypographyBlack>
                    {t('steps.pricing.primaryNameMessage')}
                  </CustomTypographyBlack>
                </OutlinedContainerDescription>
              </OutlinedContainer>
              <Spacer $height="2" />
            </>
          )}
        </RadioButtonContainer>
      </StyledRadioButtonGroup>
    </PaymentChoiceContainer>
  )
}

interface ActionButtonProps {
  address?: string
  hasPendingMoonpayTransaction: boolean
  hasFailedMoonpayTransaction: boolean
  paymentMethodChoice: PaymentMethod | ''
  reverseRecord: boolean
  callback: (props: RegistrationStepData['pricing']) => void
  initiateMoonpayRegistrationMutation: ReturnType<
    typeof useMoonpayRegistration
  >['initiateMoonpayRegistrationMutation']
  years: number
  balance: ReturnType<typeof useBalance>['data']
  totalRequiredBalance?: BigNumber
}

export const ActionButton = ({
  address,
  hasPendingMoonpayTransaction,
  hasFailedMoonpayTransaction,
  paymentMethodChoice,
  reverseRecord,
  callback,
  initiateMoonpayRegistrationMutation,
  years,
  balance,
  totalRequiredBalance,
}: ActionButtonProps) => {
  const { t } = useTranslation('register')

  if (!address) {
    return <ConnectButton large />
  }
  if (hasPendingMoonpayTransaction) {
    return (
      <CustomButton data-testid="next-button" disabled loading>
        {t('steps.info.processing')}
      </CustomButton>
    )
  }
  if (hasFailedMoonpayTransaction && paymentMethodChoice === PaymentMethod.moonpay) {
    return (
      <CustomButton
        data-testid="next-button"
        onClick={() => callback({ reverseRecord, years, paymentMethodChoice })}
      >
        {t('action.tryAgain', { ns: 'common' })}
      </CustomButton>
    )
  }
  if (paymentMethodChoice === PaymentMethod.moonpay) {
    return (
      <CustomButton
        loading={initiateMoonpayRegistrationMutation.isLoading}
        data-testid="next-button"
        onClick={() => callback({ reverseRecord, years, paymentMethodChoice })}
        disabled={!paymentMethodChoice || initiateMoonpayRegistrationMutation.isLoading}
      >
        {t('action.next', { ns: 'common' })}
      </CustomButton>
    )
  }
  if (!balance?.value || !totalRequiredBalance) {
    return (
      <CustomButton data-testid="next-button" disabled>
        {t('loading', { ns: 'common' })}
      </CustomButton>
    )
  }
  if (balance?.value.lt(totalRequiredBalance) && paymentMethodChoice === PaymentMethod.ethereum) {
    return (
      <CustomButton data-testid="next-button" disabled>
        {t('steps.pricing.insufficientBalance')}
      </CustomButton>
    )
  }
  return (
    <CustomButton
      data-testid="next-button"
      onClick={() => callback({ reverseRecord, years, paymentMethodChoice })}
      disabled={!paymentMethodChoice}
    >
      {t('action.next', { ns: 'common' })}
    </CustomButton>
  )
}

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  resolverExists: boolean | undefined
  callback: (props: RegistrationStepData['pricing']) => void
  isPrimaryLoading: boolean
  hasPrimaryName: boolean
  registrationData: RegistrationReducerDataItem
  moonpayTransactionStatus?: MoonpayTransactionStatus
  initiateMoonpayRegistrationMutation: ReturnType<
    typeof useMoonpayRegistration
  >['initiateMoonpayRegistrationMutation']
}

const Pricing = ({
  nameDetails,
  callback,
  isPrimaryLoading,
  hasPrimaryName,
  registrationData,
  resolverExists,
  moonpayTransactionStatus,
  initiateMoonpayRegistrationMutation,
}: Props) => {
  const { t } = useTranslation('register')

  const { normalisedName, gracePeriodEndDate, beautifiedName } = nameDetails

  const { address } = useAccountSafely()
  const { data: balance } = useBalance({ address: address as `0x${string}` | undefined })
  const resolverAddress = useContractAddress('PublicResolver')

  const [years, setYears] = useState(registrationData.years)
  const [reverseRecord, setReverseRecord] = useState(() =>
    registrationData.started ? registrationData.reverseRecord : !hasPrimaryName,
  )

  const hasPendingMoonpayTransaction = moonpayTransactionStatus === 'pending'
  const hasFailedMoonpayTransaction = moonpayTransactionStatus === 'failed'

  const previousMoonpayTransactionStatus = usePrevious(moonpayTransactionStatus)

  const [paymentMethodChoice, setPaymentMethodChoice] = useState<PaymentMethod>(
    hasPendingMoonpayTransaction ? PaymentMethod.moonpay : PaymentMethod.ethereum,
  )

  // Keep radio button choice up to date
  useEffect(() => {
    if (moonpayTransactionStatus) {
      setPaymentMethodChoice(
        hasPendingMoonpayTransaction || hasFailedMoonpayTransaction
          ? PaymentMethod.moonpay
          : PaymentMethod.ethereum,
      )
    }
  }, [
    hasFailedMoonpayTransaction,
    hasPendingMoonpayTransaction,
    moonpayTransactionStatus,
    previousMoonpayTransactionStatus,
    setPaymentMethodChoice,
  ])

  const fullEstimate = useEstimateFullRegistration({
    name: normalisedName,
    registrationData: {
      ...registrationData,
      reverseRecord,
      years,
      records: [{ key: 'ETH', value: resolverAddress, type: 'addr', group: 'address' }],
      clearRecords: resolverExists,
      resolver: resolverAddress,
    },
    price: nameDetails.priceData,
  })
  const { hasPremium, premiumFee, gasPrice, yearlyFee, totalYearlyFee, estimatedGasFee } =
    fullEstimate

  const yearlyRequiredBalance = totalYearlyFee?.mul(100).div(100)
  const totalRequiredBalance = yearlyRequiredBalance?.add(premiumFee || 0).add(estimatedGasFee || 0)

  const showPaymentChoice = !isPrimaryLoading && address
  return (
    <StyledCard>
      <StyledHeading>{t('heading', { name: beautifiedName })}</StyledHeading>
      <PlusMinusControl
        minValue={1}
        value={years}
        onChange={(e) => {
          const newYears = parseInt(e.target.value)
          if (!Number.isNaN(newYears)) setYears(newYears)
        }}
        highlighted
      />
      <FullInvoice {...fullEstimate} />
      {hasPremium && gracePeriodEndDate ? (
        <TemporaryPremium startDate={gracePeriodEndDate} name={normalisedName} />
      ) : (
        yearlyFee &&
        estimatedGasFee &&
        gasPrice && (
          <RegistrationTimeComparisonBanner
            rentFee={yearlyFee}
            transactionFee={estimatedGasFee}
            message={t('steps.pricing.multipleYearsMessage')}
          />
        )
      )}
      {showPaymentChoice && (
        <PaymentChoice
          {...{
            paymentMethodChoice,
            setPaymentMethodChoice,
            hasEnoughEth: true,
            hasPendingMoonpayTransaction,
            hasFailedMoonpayTransaction,
            hasPrimaryName,
            address,
            reverseRecord,
            setReverseRecord,
            started: registrationData.started,
          }}
        />
      )}
      <MobileFullWidth>
        <ActionButton
          {...{
            address,
            hasPendingMoonpayTransaction,
            hasFailedMoonpayTransaction,
            paymentMethodChoice,
            reverseRecord,
            callback,
            initiateMoonpayRegistrationMutation,
            years,
            balance,
            totalRequiredBalance,
          }}
        />
      </MobileFullWidth>
    </StyledCard>
  )
}

export default Pricing
