const isString = val => typeof val === 'string' && val != ''
const isEmpty = str => str == null || str.length === 0
const isMatching = (value, comparing) =>
  value.toString().toLowerCase() === comparing.toString().toLowerCase()
const capitalizeFirstLetters = value =>
  value
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.substring(1))
    .join(' ')

export { isString, isEmpty, isMatching, capitalizeFirstLetters }
