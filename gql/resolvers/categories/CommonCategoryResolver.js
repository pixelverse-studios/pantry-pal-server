import { Topic } from '../../../utils/logger.js'
import CommonCategoryController from './CommonCategoryController.js'

const topic = Topic.CommonCategory
const controller = new CommonCategoryController()

const Queries = {
  async getAllCommonCategories(_, __, ctx) {
    try {
      return await controller.getAll(ctx)
    } catch (error) {
      return controller.catchError(
        'fetching common recipe categories',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getCommonCategoryById(_, payload, ctx) {
    try {
      return await controller.getById(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'fetching that recipe category',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getCommonCategoryByLabel(_, payload, ctx) {
    try {
      return await controller.getByLabel(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'fetching that recipe category',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

const Mutations = {
  async createCommonCategory(_, payload, ctx) {
    try {
      return await controller.createOne(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'creating new recipe category',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async addBulkCommonCategories(_, payload, ctx) {
    try {
      return await controller.createBulk(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'creating bulk categories',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async editCommonCategoryById(_, payload, ctx) {
    try {
      return await controller.edit(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'editing category',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteCommonCategoryById(_, payload, ctx) {
    try {
      return await controller.deleteOne(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'deleting category',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteBulkCommonCategoriesById(_, payload, ctx) {
    try {
      return await controller.deleteBulkById(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'bulk deleting categories by id',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteBulkCommonCategoriesByLabel(_, payload, ctx) {
    try {
      return await controller.deleteBulkByLabel(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'bulk deleting categories by label',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
}

export default { Queries, Mutations }
