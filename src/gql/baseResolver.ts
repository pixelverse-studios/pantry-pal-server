import { FormValidations } from '../utils/form'
import User from '../models/User'

interface ErrorType {
  type: string
  message: string
}

interface Typenames {
  single: string
  multi: string
}

class BaseResolver {
  authToken: null | string
  addedErrors: null | any
  error: {} | ErrorType
  errors: {} | any
  catchErrorType: string
  typenames: Typenames
  validations: any
  payload: any
  schemas: any

  constructor() {
    this.authToken = null
    this.error = {}
    this.errors = {}
    this.addedErrors = null
    this.catchErrorType = 'failure'
    this.typenames = { single: '', multi: '' }
    this.validations = {
      form: FormValidations
    }
    this.payload = null
    this.schemas = { User }

    const baseErrors = {
      notFound: (item: string) => ({
        type: 'notFound',
        message: `${item} not found`
      }),
      badInput: (field: string) => ({
        type: 'badInput',
        message: `${field} is required`
      }),
      //   someFieldsRequired: (fields: [string], item: string) => {
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
      failedToMutate: (field: string, action: string) => ({
        type: 'failedToMutate',
        message: `Failed to ${action} ${field}`
      }),
      duplicateItem: (item: string) => ({
        type: 'duplicateItem',
        message: `${item} already exists`
      })
    }
    this.errors = { ...baseErrors }
  }
  catchError(action: string) {
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
  handleSingleItemSuccess(values: any) {
    return {
      __typename: this.typenames.single,
      ...values._doc
    }
  }
  handleMultiItemSuccess(key: string, values: any) {
    return {
      __typename: this.typenames.multi,
      [key]: values
    }
  }
  buildPayload(params: any, source: any) {
    const payload = {} as any
    Object.entries(params).forEach(([key, value]) => {
      if (value !== source[key]) {
        payload[key] = value
      }
    })
    return (this.payload = payload)
  }
}

export default BaseResolver
