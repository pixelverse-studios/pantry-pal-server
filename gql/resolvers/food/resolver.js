import { Topic } from '../../../utils/logger.js'
import FoodController from './controller.js'
const controller = new FoodController()
const topic = Topic.Food

const Queries = {
  async getSearchResults(_, payload, ctx) {
    try {
      return await controller.getSearchResults(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching search results',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getFood(_, payload, ctx) {
    try {
      return await controller.getFood(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching food data',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries }
