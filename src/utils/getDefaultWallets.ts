import { Chain, WalletList, connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets'

export interface MyWalletOptions {
  projectId: string
  chains: Chain[]
}

export const getDefaultWallets = ({
  projectId,
  chains,
}: {
  appName: string
  projectId: string
  chains: Chain[]
}) => {
  const wallets: WalletList = [
    {
      groupName: 'Popular',
      wallets: [
        {
          ...walletConnectWallet({ chains, projectId }),
          iconUrl: './joinwallet.png',
          iconBackground: 'transparent',
          name: 'JOIN',
          id: 'join',
          downloadUrls: {
            mobile: 'https://joinwalletdev.page.link',
          },
        },
        metaMaskWallet({ chains, projectId }),
      ],
    },
  ]

  return connectorsForWallets(wallets)
}
