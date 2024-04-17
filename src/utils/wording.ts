import { ethers, utils } from 'ethers'

const Filter = require('bad-words')

const encodeFunctionCall = (abi: any) => {
  const iface = new ethers.utils.Interface(abi)
  const encoded = iface.encodeFunctionData(abi[0].name)
  return encoded
}

const decodeFunctionResult = (result: any, abi: any) => {
  const iface = new ethers.utils.Interface(abi)
  const parsedResult = iface.decodeFunctionResult(abi[0].name, result)
  return parsedResult
}

export async function getRestrictWords(): Promise<string[]> {
  const abi = [
    {
      name: 'hashedRestrictWords',
      type: 'function',
      outputs: [{ type: 'bytes32[]' }],
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
    // TODO: set expiry time to 3 days
    localStorage.setItem('hashedRestrictWords', JSON.stringify(decodedResult[0]))
    return decodedResult[0]
  } catch (error) {
    console.error('Error while fetching list:', error)
    throw new Error('Failed to fetch list')
  }
}

export async function getTakendownList(): Promise<string[]> {
  const abi = [
    {
      name: 'hashedTakedownList',
      type: 'function',
      outputs: [{ type: 'bytes32[]' }],
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
    // TODO: set expiry time to 3 days
    localStorage.setItem('hashedTakedownList', JSON.stringify(decodedResult[0]))
    return decodedResult[0]
  } catch (error) {
    console.error('Error while fetching list:', error)
    throw new Error('Failed to fetch list')
  }
}

export const getTempRestrictWords = () => {
  const tempRestrictWords = localStorage.getItem('hashedRestrictWords')
  if (tempRestrictWords) {
    return JSON.parse(tempRestrictWords)
  }
  return []
}

export const getTempTakedownList = () => {
  const tempRestrictWords = localStorage.getItem('hashedTakedownList')
  if (tempRestrictWords) {
    return JSON.parse(tempRestrictWords)
  }
  return []
}

export const isTakedownName = (input: string): boolean => {
  if (typeof window !== 'undefined') {
    const list = JSON.parse(window?.localStorage?.getItem('hashedTakedownList') || '[]')
    const name = input ? input?.replace('.jfin', '') : ''
    return list?.includes(utils.id(name))
  }
  return false
}

export const checkRestrictWords = (input: string): boolean => {
  if (typeof window !== 'undefined') {
    const list = JSON.parse(window?.localStorage?.getItem('hashedRestrictWords') || '[]')
    return list?.includes(input)
  }
  return false
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
