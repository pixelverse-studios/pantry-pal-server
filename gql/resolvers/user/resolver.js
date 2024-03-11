import { Topic } from '../../../utils/logger.js'
import UserController from './controller.js'
const controller = new UserController()

const topic = Topic.User

const Queries = {
  async getAllUsers(_, __, ctx) {
    try {
      return await controller.getAll()
    } catch (error) {
      return controller.catchError(
        'fetching all users',
        {
          topic,
          operation: ctx.operation
        },
        error
      )
    }
  },
  async getUser(_, payload, ctx) {
    try {
      return await controller.getByEmail(payload)
    } catch (error) {
      return controller.catchError(
        'fetching user',
        {
          topic,
          operation: ctx.operation
        },
        error
      )
    }
  }
}

const Mutations = {
  async signIn(_, payload, ctx) {
    try {
      const res = await controller.signIn(payload, ctx)
      return res
    } catch (error) {
      return controller.catchError(
        'signing in the user',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteProfile(_, payload, ctx) {
    // TODO: Check token before executing request. Build in a development backdoor
    try {
      const res = await controller.delete(payload.email, ctx)
      return res
    } catch (error) {
      return controller.catchError(
        'deleting that profile',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries, Mutations }
