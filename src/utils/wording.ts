const Filter = require('bad-words')

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
