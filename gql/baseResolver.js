import { FormValidations } from '../utils/validations/form.js'
import { dateToUTC, dateToLocal } from '../utils/format/dates.js'
import User from '../models/User.js'

class BaseResolver {
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
    this.formatters = {
      date: { dateToLocal, dateToUTC }
    }
    this.payload = null
    this.schemas = { User }

    const baseErrors = {
      noUsersFound: () => ({
        type: 'noUsersFound',
        message: () => 'No users found'
      }),
      userNotFound: () => ({
        type: 'userNotFound',
        message: () => 'User not found'
      }),
      notFound: item => ({
        type: 'notFound',
        message: `${item} not found`
      }),
      badInput: field => ({
        type: 'badInput',
        message: `${field} is required`
      }),
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
  handleSingleItemSuccess(values) {
    return {
      __typename: this.typenames.single,
      ...values._doc
    }
  }
  handleMultiItemSuccess(values) {
    const { multi } = this.typenames
    return {
      __typename: multi,
      [multi]: values
    }
  }
  buildPayload(params, source) {
    const payload = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== source[key] && value !== null) {
        payload[key] = value
      }
    })
    return (this.payload = payload)
  }
}

export default BaseResolver
