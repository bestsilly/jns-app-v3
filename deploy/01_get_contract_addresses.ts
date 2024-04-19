/* eslint-disable import/no-extraneous-dependencies */
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { resolve } from 'path'

import { DeployFunction } from 'hardhat-deploy/types'
import { HardhatRuntimeEnvironment } from 'hardhat/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const allDeployments = await hre.deployments.all()
  const deploymentAddressArray = Object.keys(allDeployments).map((dkey) => [
    dkey,
    allDeployments[dkey].address,
  ])
  const deploymentAddressMap = Object.fromEntries(deploymentAddressArray)

  await writeFile(
    resolve(__dirname, '../.env.local'),
    `NEXT_PUBLIC_DEPLOYMENT_ADDRESSES='${JSON.stringify(deploymentAddressMap)}'`,
  )
  if (!existsSync(resolve(__dirname, '../typings-custom/generated'))) {
    await mkdir(resolve(__dirname, '../typings-custom/generated'))
  }
  await writeFile(
    resolve(__dirname, '../typings-custom/generated/local-contracts-generated.d.ts'),
    `declare module '@app/local-contracts' {
  interface Register {
    deploymentAddresses: {
      ${deploymentAddressArray.map(([name, address]) => `${name}: '${address}'`).join('\n      ')}
    }
  }
}
`,
  )
  console.log('Wrote contract addresses to .env.local')
}

func.runAtTheEnd = true

export default func
