import jwt from 'jsonwebtoken'
import { FormValidations } from '../utils/validations/form.js'
import User from '../models/User.js'

class BaseResolver {
  constructor() {
    this.authToken = null
    this.error = {}
    this.errors = {}
    this.addedErrors = null
    this.catchErrorType = 'failure'
    this.typename = ''
    this.typenames = { single: '', multi: '' }
    this.validations = {
      form: FormValidations
    }
    this.payload = null
    this.schemas = { User }

    const baseErrors = {
      notFound: item => ({
        type: 'notFound',
        message: `${item} not found`
      }),
      badInput: field => ({
        type: 'badInput',
        message: `${field} is required`
      }),
      //   someFieldsRequired: (fields: [string], item) => {
      //     const fieldsToString = fields.split()
      //     return {
      //       type: 'someFieldsRequired',
      //       message: `At least one of the following is required for ${item}: ${fieldsToString}`
      //     }
      //   },
      //   allFieldsRequired: (fields, item) => {
      //     const fieldsToString = fields.split()
      //     return {
      //       type: 'allFieldsRequired',
      //       message: `All of the following fields are required for ${item}: ${fieldsToString}`
      //     }
      //   },
      failedToMutate: (field, action) => ({
        type: 'failedToMutate',
        message: `Failed to ${action} ${field}`
      }),
      duplicateItem: item => ({
        type: 'duplicateItem',
        message: `${item} already exists`
      })
    }
    this.errors = { ...baseErrors }
  }
  catchError(action) {
    return {
      __typename: this.catchErrorType,
      message: `There was an issue ${action}. Please try again`
    }
  }
  handleError() {
    return {
      __typename: 'Errors',
      ...this.error
    }
  }
  generateToken(values) {
    return jwt.sign({ ...values }, 'PPAL_USER', { expiresIn: '110h' })
  }
  handleSingleItemSuccess(values) {
    return {
      __typename: this.typenames.single,
      ...values._doc
    }
  }
  handleMultiItemSuccess(key, values) {
    return {
      __typename: this.typenames.multi,
      [key]: values
    }
  }
  buildPayload(params, source) {
    const payload = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== source[key]) {
        payload[key] = value
      }
    })
    return (this.payload = payload)
  }
}

export default BaseResolver
