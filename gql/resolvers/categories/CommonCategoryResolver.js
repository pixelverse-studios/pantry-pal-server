import CommonCategoryController from './CommonCategoryController.js'
const controller = new CommonCategoryController()
const handleError = reason => controller.catchError(reason)

const Queries = {
  async getAllCommonCategories(_, payload) {
    try {
      return await controller.getAll(payload)
    } catch (error) {
      return handleError('fetching users recipe categories')
    }
  },
  async getCommonCategoryById(_, payload) {
    try {
      return await controller.getById(payload)
    } catch (error) {
      return handleError('fetching that recipe category')
    }
  },
  async getCommonCategoryByLabel(_, payload) {
    try {
      return await controller.getByLabel(payload)
    } catch (error) {
      return handleError('fetching that recipe category')
    }
  }
}

const Mutations = {
  async createCommonCategory(_, payload) {
    try {
      return await controller.createOne(payload)
    } catch (error) {
      return handleError('creating new recipe category')
    }
  },
  async addBulkCommonCategories(_, payload) {
    try {
      return await controller.createBulk(payload)
    } catch (error) {
      return handleError('creating bulk categories')
    }
  },
  async editCommonCategoryById(_, payload) {
    try {
      return await controller.edit(payload)
    } catch (error) {
      return handleError('editing category')
    }
  },
  async deleteCommonCategoryById(_, payload) {
    try {
      return await controller.deleteOne(payload)
    } catch (error) {
      return handleError('deleting category')
    }
  },
  async deleteBulkCommonCategories(_, payload) {
    try {
      return await controller.deleteBulk(payload)
    } catch (error) {
      return handleError('deleting categories')
    }
  }
}

export default { Queries, Mutations }
