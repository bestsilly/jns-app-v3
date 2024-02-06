import 'styled-components'

import { darkTheme } from '@ensdomains/thorin'

type Theme = typeof darkTheme

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}
