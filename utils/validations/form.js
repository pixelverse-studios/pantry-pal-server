const isValidString = (value) =>
  typeof value === 'string' && value != ''
const isValidPositiveNumber = (value) =>
  typeof value === 'number' && value >= 0
const isValidArray = (arr) => Array.isArray(arr) && arr?.length > 0

export const FormValidations = {
  isValidString,
  isValidPositiveNumber,
  isValidArray
}
