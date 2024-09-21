import FeedbackController from './controller.js'
import { Topic } from '../../../utils/logger.js'

const controller = new FeedbackController()
const topic = Topic.Feedback

const Queries = {
  async getAllFeedback(_, payload, ctx) {
    try {
      return await controller.getAll(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching recipes',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getFeedbackItem(_, payload, ctx) {
    try {
      return await controller.get(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching feedback item',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

const Mutations = {
  async createFeedback(_, payload, ctx) {
    try {
      return await controller.create(payload, ctx)
    } catch (error) {
      controller.catchError(
        'creating feedback item',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async editFeedback(_, payload, ctx) {
    try {
      return await controller.edit(payload, ctx)
    } catch (error) {
      controller.catchError(
        'editing feedback item',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteFeedback(_, payload, ctx) {
    try {
      return await controller.delete(payload, ctx)
    } catch (error) {
      controller.catchError(
        'deleting feedback item',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries, Mutations }
