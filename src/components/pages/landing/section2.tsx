import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

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
      max-width: ${theme.breakpoints.sm}px;
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
          <CardContainer>
            <Card>
              <CustomHeading>3 Letters</CustomHeading>
              <SmallCustomTypography>3 Letter for 1 year register</SmallCustomTypography>
              <PriceContainer>
                <CustomTypography style={{ textDecoration: 'line-through', fontStyle: 'italic' }}>
                  *2,500 JFIN
                </CustomTypography>
                <AccentTypography>1,250 JFIN</AccentTypography>
                <CustomTypography>Per year</CustomTypography>
              </PriceContainer>
            </Card>
            <Card>
              <CustomHeading>4 Letters</CustomHeading>
              <SmallCustomTypography>4 Letter for 1 year register</SmallCustomTypography>
              <PriceContainer>
                <CustomTypography style={{ textDecoration: 'line-through', fontStyle: 'italic' }}>
                  *500 JFIN
                </CustomTypography>
                <AccentTypography>250 JFIN</AccentTypography>
                <CustomTypography>Per year</CustomTypography>
              </PriceContainer>
            </Card>
            <Card>
              <CustomHeading>5 Letters</CustomHeading>
              <SmallCustomTypography>5 Letter for 1 year register</SmallCustomTypography>
              <PriceContainer>
                <CustomTypography style={{ textDecoration: 'line-through', fontStyle: 'italic' }}>
                  *30 JFIN
                </CustomTypography>
                <AccentTypography>15 JFIN</AccentTypography>
                <CustomTypography>Per year</CustomTypography>
              </PriceContainer>
            </Card>
          </CardContainer>
        </Stack>
      </Container>
    </div>
  )
}
