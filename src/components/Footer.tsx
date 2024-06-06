// import { useEffect, useState } from 'react'
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

  // const [localStorageData, setLocalStorageData] = useState<{ [key: string]: string }>({})
  /* START DEBUG */
  // useEffect(() => {
  //   const keys = Object.keys(localStorage)
  //   const data: { [key: string]: string } = {}

  //   keys.forEach((key) => {
  //     const storedData = localStorage?.getItem(key)
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData)
  //         data[key] = JSON.stringify(parsedData, null, 2)
  //       } catch (error) {
  //         data[key] = storedData
  //       }
  //     }
  //   })

  //   setLocalStorageData(data)
  // }, [])
  /* END DEBUG */
  return (
    <footer>
      <FooterWrapper>
        <FooterText>J Ventures Co., Ltd. Copyright ©2024</FooterText>
      </FooterWrapper>

      {/* START DEBUG */}
      {/* <div
        style={{
          overflowX: 'scroll',
          padding: 8,
          background: 'white',
          color: 'black',
          fontSize: 10,
        }}
      >
        {Object.entries(localStorageData).map(([key, value]) => (
          <div key={key}>
            <u>{key}</u>
            <div style={{ background: '#cccccc' }}>
              <pre>{value}</pre>
            </div>
          </div>
        ))}
      </div> */}
      {/* END DEBUG */}
    </footer>
  )
}
