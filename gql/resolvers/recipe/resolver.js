import RecipeController from './controller.js'
import { Topic } from '../../../utils/logger.js'
const controller = new RecipeController()
const topic = Topic.Recipe

const Queries = {
  async getRecipes(_, payload, ctx) {
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
  async getRecipe(_, payload, ctx) {
    try {
      return await controller.get(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching recipe',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getFilteredRecipes(_, payload, ctx) {
    try {
      return await controller.getFiltered(payload, ctx)
    } catch (error) {
      controller.catchError(
        'fetching filtered recipes',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

const Mutations = {
  async createRecipe(_, payload, ctx) {
    try {
      return await controller.create(payload, ctx)
    } catch (error) {
      console.log(error)
      controller.catchError(
        'creating recipe',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async editRecipe(_, payload, ctx) {
    try {
      return await controller.edit(payload, ctx)
    } catch (error) {
      controller.catchError(
        'edit recipe',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteRecipe(_, payload, ctx) {
    try {
      return await controller.delete(payload, ctx)
    } catch (error) {
      controller.catchError(
        'deleting recipe',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async createCommentInteraction(_, payload, ctx) {
    try {
      return await controller.createComment(payload, ctx)
    } catch (error) {
      controller.catchError(
        'creating comment interaction',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async createRatingInteraction(_, payload, ctx) {
    try {
      return await controller.createRating(payload, ctx)
    } catch (error) {
      controller.catchError(
        'creating rating interaction',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries, Mutations }
