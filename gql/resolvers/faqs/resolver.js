import { Topic } from '../../../utils/logger.js'
import FaqController from './controller.js'
const controller = new FaqController()

const topic = Topic.Faqs

const Queries = {
  async getFaqs(_, __, ctx) {
    try {
      return await controller.getAll()
    } catch (error) {
      controller.catchError(
        'fetching all FAQs',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getFaqById(_, payload, ctx) {
    try {
      return await controller.getById(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching FAQ',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

const Mutations = {
  async createFaq(_, payload, ctx) {
    try {
      return await controller.create(payload, ctx)
    } catch (error) {
      controller.catchError(
        'creating FAQ',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async editFaq(_, payload, ctx) {
    try {
      return await controller.edit(payload, ctx)
    } catch (error) {
      controller.catchError(
        'editing FAQ',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteFaq(_, payload, ctx) {
    try {
      return await controller.delete(payload, ctx)
    } catch (error) {
      controller.catchError(
        'deleting FAQ',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries, Mutations }
