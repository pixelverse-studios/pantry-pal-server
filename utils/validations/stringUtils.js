const isString = val => typeof val === 'string' && val != ''
const isEmpty = str => str == null || str.length === 0

export { isString, isEmpty }
