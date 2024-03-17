import { Topic } from '../../../../utils/logger.js'
import CustomCategoryController from './controller.js'

const topic = Topic.CustomCategory
const controller = new CustomCategoryController()

const Queries = {
  async getAllUserCategories(_, payload, ctx) {
    try {
      return await controller.getAllForUser(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'fetching user recipe categories',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getAllCustomCategories(_, __, ctx) {
    try {
      return await controller.getAll(ctx)
    } catch (error) {
      return controller.catchError(
        'fetching custom recipe categories',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async getCustomCategoryById(_, payload, ctx) {
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
  async getCustomCategoryByLabel(_, payload, ctx) {
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
  async createCustomCategory(_, payload, ctx) {
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
  async addBulkCustomCategories(_, payload, ctx) {
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
  async editCustomCategoryById(_, payload, ctx) {
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
  async deleteCustomCategoryById(_, payload, ctx) {
    try {
      return await controller.deleteOneById(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'deleting category by id',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteCustomCategoryByLabel(_, payload, ctx) {
    try {
      return await controller.deleteOneByLabel(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'deleting category by label',
        { topic, operation: ctx.operation },
        error
      )
    }
  },
  async deleteBulkCustomCategoriesById(_, payload, ctx) {
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
  async deleteBulkCustomCategoriesByLabel(_, payload, ctx) {
    try {
      return await controller.deleteBulkByLabel(payload, ctx)
    } catch (error) {
      return controller.catchError(
        'bulk deleting categories by label',
        { topic, operation: ctx.operation },
        error
      )
    }
  }
}

export default { Queries, Mutations }
