import { ethers } from 'ethers'

const Filter = require('bad-words')

const encodeFunctionCall = (abi: any) => {
  const iface = new ethers.utils.Interface(abi)
  const encoded = iface.encodeFunctionData('getTakedownList')
  return encoded
}

const decodeFunctionResult = (result: any, abi: any) => {
  const iface = new ethers.utils.Interface(abi)
  const parsedResult = iface.decodeFunctionResult('getTakedownList', result)
  return parsedResult
}

export async function getTakendownList(): Promise<string[]> {
  const abi = [
    {
      name: 'getTakedownList',
      type: 'function',
      outputs: [{ type: 'string[]' }],
      stateMutability: 'view',
    },
  ]

  try {
    const rpcResponse = await fetch(process.env.NEXT_PUBLIC_PROVIDER || '', {
      method: 'POST',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'eth_call',
        params: [
          {
            to: process.env.NEXT_PUBLIC_NAME_MANAGER_ADDRESS,
            data: encodeFunctionCall(abi),
          },
          'latest',
        ],
        id: 1,
        jsonrpc: '2.0',
      }),
    })

    if (!rpcResponse.ok) {
      throw new Error('Failed to fetch data from RPC server')
    }
    const rpcData: any = await rpcResponse.json()
    const decodedResult = decodeFunctionResult(rpcData?.result, abi)
    if (!decodedResult) {
      console.error('Decoded result is undefined')
      return []
    }
    return decodedResult[0]
  } catch (error) {
    console.error('Error while fetching list:', error)
    throw new Error('Failed to fetch list')
  }
}

export const isEnglish = (input: string): boolean => {
  return input.split('').every((char) => {
    const charCode = char.charCodeAt(0)
    return charCode >= 32 && charCode <= 126
  })
}

export const isBlacklisted = (input: string) => {
  const filter = new Filter()
  // Access the list of bad words
  const badWordsList: string[] = filter.list
  return badWordsList.some((word) => input.toLowerCase().includes(word.toLowerCase()))
}
