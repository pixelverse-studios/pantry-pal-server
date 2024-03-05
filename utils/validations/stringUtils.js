const isString = val => typeof val === 'string' && val != ''
const isEmpty = str => str == null || str.length === 0
const isMatching = (value, comparing) =>
  value.toLowerCase() === comparing.toLowerCase()

export { isString, isEmpty, isMatching }
