const isValidString = (value: string) =>
  typeof value === 'string' && value != ''
const isValidPositiveNumber = (value: number) =>
  typeof value === 'number' && value >= 0
const isValidArray = (arr: any[]) => Array.isArray(arr) && arr?.length > 0

export const FormValidations = {
  isValidString,
  isValidPositiveNumber,
  isValidArray
}
