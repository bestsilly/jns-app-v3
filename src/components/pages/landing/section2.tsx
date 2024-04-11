import { BigNumber } from '@ethersproject/bignumber/lib/bignumber'
import { useCallback, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import useSWR from 'swr/immutable'

import { AlertSVG, Skeleton, mq } from '@ensdomains/thorin'

import { CustomHeading, CustomTypography } from '@app/components/customs'

export default function LandingSection2() {
  const Container = styled.div(
    () => css`
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      position: relative;
      z-index: 1;
      min-height: calc(65vh);
      background-image: url('/background02.svg');
      background-size: cover;
      background-position: center;
    `,
  )

  const Stack = styled.div(
    ({ theme }) => css`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: ${theme.space['3']};
      max-width: ${theme.breakpoints.md}px;
    `,
  )

  const Card = styled.div(
    ({ theme }) => css`
      padding: ${theme.space['4']};
      text-align: center;
      border: 1px solid #9790ac;
      border-radius: 5px;
      box-shadow: 0 0 50px 5px #9086af95;
      background: #0e04287a;
      width: 100%;
    `,
  )

  const CardContainer = styled.div(
    ({ theme }) => css`
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      grid-gap: ${theme.space['4']};
      margin-top: ${theme.space['10']};

      ${mq.md.max(
        css`
          grid-template-columns: repeat(1, minmax(0, 1fr));
        `,
      )}
    `,
  )

  const SmallCustomTypography = styled(CustomTypography)(
    () => css`
      font-size: 0.8rem;
    `,
  )

  const AccentTypography = styled(CustomTypography)(
    ({ theme }) => css`
      color: ${theme.colors.accentLight};
      font-weight: bold;
      font-size: 1.5rem;
    `,
  )

  const PriceContainer = styled.div(
    ({ theme }) => css`
      padding-top: ${theme.space['4']};
      padding-bottom: ${theme.space['4']};
      display: flex;
      text-align: center;
      flex-direction: column;
      width: 100%;
      gap: ${theme.space['1']};
    `,
  )

  const PriceValue = styled(CustomTypography)(
    () => css`
      position: 'relative';
      display: flex;
      flex-direction: row;
      justify-content: center;
    `,
  )

  const PriceDiscount = styled.div(
    () => css`
      position: relative;
      top: -6px;
      left: 5px;
      font-weight: bold;
      font-size: 0.9rem;
    `,
  )

  const [prices, setPrices] = useState<
    { letter3: number; letter4: number; letter5: number } | undefined
  >()
  const [originalPrices] = useState({ letter3: 2500, letter4: 500, letter5: 30 })
  const [discount, setDiscount] = useState({ letter3: 0, letter4: 0, letter5: 0 })

  const handleCalculateDiff = (value1: number, value2: number) => {
    return Math.ceil((value1 / value2) * 100) * (value1 > value2 ? 1 : -1)
  }
  const handleCalculateDiscount = useCallback(() => {
    if (prices) {
      const discountLetter3 = handleCalculateDiff(prices.letter3, originalPrices.letter3)
      const discountLetter4 = handleCalculateDiff(prices.letter4, originalPrices.letter4)
      const discountLetter5 = handleCalculateDiff(prices.letter5, originalPrices.letter5)

      setDiscount(() => ({
        letter3: discountLetter3,
        letter4: discountLetter4,
        letter5: discountLetter5,
      }))
    }
  }, [prices, originalPrices])

  const { data, isLoading, error } = useSWR<string[]>(
    'https://jns-bridge-testnet.jfin.workers.dev/get-rent-prices',
    (url: string) =>
      fetch(url, { method: 'POST' }).then((res) => res.json() as unknown as string[]),
  )

  const handleCalculatePrice = useCallback(() => {
    if (!data) return
    const letter3 = BigNumber.from(data[2])
      .div(10 ** 9)
      .toNumber()

    const letter4 = BigNumber.from(data[3])
      .div(10 ** 9)
      .toNumber()

    const letter5 = BigNumber.from(data[4])
      .div(10 ** 9)
      .toNumber()
    setPrices(() => ({
      letter3,
      letter4,
      letter5,
    }))
  }, [data])

  useEffect(() => {
    handleCalculateDiscount()
  }, [handleCalculateDiscount])

  useEffect(() => {
    handleCalculatePrice()
  }, [handleCalculatePrice])

  return (
    <div id="page-section-2" style={{ position: 'relative' }}>
      <Container>
        <Stack>
          <CustomHeading>Pricing</CustomHeading>
          <CustomTypography>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the standard dummy text ever since the 1500s, when an unknown printer took a
            galley of type and scrambled it to make
          </CustomTypography>

          <Skeleton loading={isLoading} style={{ width: '100%' }}>
            {error ? (
              <Card style={{ width: '100%', paddingTop: '2rem', paddingBottom: '2rem' }}>
                <CustomHeading
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'orange',
                    paddingBottom: '0.5rem',
                  }}
                >
                  <AlertSVG />
                  Updating pricing datas
                </CustomHeading>
                <CustomTypography>
                  We are updating pricing data which may not be available at this time. Please try
                  again later.
                </CustomTypography>
              </Card>
            ) : (
              <CardContainer>
                <Card>
                  <CustomHeading>3 Letter</CustomHeading>
                  <SmallCustomTypography>3 Letter for 1 year register</SmallCustomTypography>
                  <PriceContainer>
                    <PriceValue>
                      <span style={{ textDecoration: 'line-through', fontStyle: 'italic' }}>
                        *{originalPrices.letter3.toLocaleString()} JFIN
                      </span>
                      <PriceDiscount>{discount.letter3}%</PriceDiscount>
                    </PriceValue>
                    <AccentTypography>{prices?.letter3.toLocaleString()} JFIN</AccentTypography>
                    <CustomTypography>Per year</CustomTypography>
                  </PriceContainer>
                </Card>
                <Card>
                  <CustomHeading>4 Letter</CustomHeading>
                  <SmallCustomTypography>4 Letter for 1 year register</SmallCustomTypography>
                  <PriceContainer>
                    <PriceValue>
                      <span style={{ textDecoration: 'line-through', fontStyle: 'italic' }}>
                        *{originalPrices.letter4.toLocaleString()} JFIN
                      </span>
                      <PriceDiscount>{discount.letter4}%</PriceDiscount>
                    </PriceValue>
                    <AccentTypography>{prices?.letter4.toLocaleString()} JFIN</AccentTypography>
                    <CustomTypography>Per year</CustomTypography>
                  </PriceContainer>
                </Card>
                <Card>
                  <CustomHeading>5 Letter +</CustomHeading>
                  <SmallCustomTypography>5 Letter+ for 1 year register</SmallCustomTypography>
                  <PriceContainer>
                    <PriceValue>
                      <span style={{ textDecoration: 'line-through', fontStyle: 'italic' }}>
                        *{originalPrices.letter5.toLocaleString()} JFIN
                      </span>
                      <PriceDiscount>{discount.letter5}%</PriceDiscount>
                    </PriceValue>
                    <AccentTypography>{prices?.letter5.toLocaleString()} JFIN</AccentTypography>
                    <CustomTypography>Per year</CustomTypography>
                  </PriceContainer>
                </Card>
              </CardContainer>
            )}
          </Skeleton>
        </Stack>
      </Container>
    </div>
  )
}
