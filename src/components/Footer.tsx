import styled, { css } from 'styled-components'

export const Footer = () => {
  const FooterWrapper = styled.div(
    ({ theme }) => css`
      padding: 32px;
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: ${theme.colors.gradients.purple};
      border-top: 1px solid #9673f751;
    `,
  )

  const FooterText = styled.div(
    () => css`
      color: #a588f4c9;
      font-size: 15px;
      margin: auto;
      text-align: center;
    `,
  )
  return (
    <footer>
      <FooterWrapper>
        <FooterText>J Ventures Co., Ltd. Copyright ©2024</FooterText>
      </FooterWrapper>
    </footer>
  )
}
