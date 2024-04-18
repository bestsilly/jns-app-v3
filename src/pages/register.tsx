import { utils } from 'ethers'
import { ReactElement, useEffect } from 'react'
import { useAccount } from 'wagmi'

import Registration from '@app/components/pages/profile/[name]/registration/Registration'
import { useChainId } from '@app/hooks/useChainId'
import { useInitial } from '@app/hooks/useInitial'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { getSelectedIndex } from '@app/hooks/useRegistrationReducer'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { getTempRestrictWords, getTempTakedownList } from '@app/utils/wording'

export default function Page() {
  const router = useRouterWithHistory()
  const name = router.query.name as string

  const initial = useInitial()

  const { address } = useAccount()
  const chainId = useChainId()

  const nameDetails = useNameDetails(name, true)
  const { isLoading: detailsLoading, registrationStatus } = nameDetails

  const isLoading = detailsLoading || initial

  useEffect(() => {
    const _tempRestrictWords = getTempRestrictWords()
    const _tempTakedownList = getTempTakedownList()
    const fetchWordList = async () => {
      try {
        if (
          [..._tempRestrictWords, ..._tempTakedownList]?.includes(
            utils.id(name.replace(/\.jfin$/, '')),
          )
        ) {
          router.push(`/profile/invalid`)
        }
      } catch {
        // fetch list failed
      }
    }

    if (name) {
      fetchWordList()
    }
  }, [name])

  if (!isLoading && registrationStatus !== 'available' && registrationStatus !== 'premium') {
    let redirect = true

    if (nameDetails.ownerData?.owner === address && !!address) {
      const registrationData = JSON.parse(
        localStorage.getItem('registration-status') || '{"items":[]}',
      )
      const index = getSelectedIndex(registrationData, {
        address: address!,
        name: nameDetails.normalisedName,
        chainId,
      })
      if (index !== -1) {
        const { stepIndex, queue } = registrationData.items[index]
        const step = queue[stepIndex]
        if (step === 'transactions' || step === 'complete') {
          redirect = false
        }
      }
    }

    if (redirect && name) {
      router.push(`/profile/${name}`)
    }
  }

  return <Registration {...{ nameDetails, isLoading }} />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
