import deepEqual from 'deep-equal'
import { FormValidations } from '../utils/validations/form.js'
import * as StringValidations from '../utils/validations/stringUtils.js'
import { dateToUTC, dateToLocal } from '../utils/format/dates.js'
import { logWarning } from '../utils/logger.js'
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
      form: FormValidations,
      string: StringValidations,
      deepEquals: deepEqual
    }
    this.formatters = {
      date: { dateToLocal, dateToUTC }
    }
    this.payload = null
    this.schemas = { User }

    const baseErrors = {
      unauthorized: () => ({
        type: 'unauthorized',
        message: () => 'You do not have access to that'
      }),
      notFound: item => ({
        type: 'notFound',
        message: `${item} not found`
      }),
      userNotFound: () => ({
        type: 'notFound',
        message: `User not found`
      }),
      invalid: (field, action) => ({
        type: 'invalid',
        message: `${field} is ${action}`
      }),
      failure: (field, action) => ({
        type: 'failure',
        message: `Failed to ${action} ${field}`
      }),
      duplicate: item => ({
        type: 'duplicate',
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
  handleError(topic, operation, details) {
    logWarning(topic, operation, details)
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
  handleMultiItemSuccess(values, typenameOverride) {
    const { multi } = this.typenames
    return {
      __typename: typenameOverride ?? multi,
      [typenameOverride ?? multi]: values
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
