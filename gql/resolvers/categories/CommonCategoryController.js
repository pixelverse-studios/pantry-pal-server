import BaseResolver from '../../baseResolver.js'
import CommonCategory from '../../../models/CommonCategory.js'

class CommonCategoryController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'RecipeCategory',
      multi: 'RecipeCategories'
    }
  }

  catchError(action) {
    return this.catchError(action)
  }

  async getAll() {
    const categories = await CommonCategory.find()
    if (categories?.length == 0) {
      this.error = this.errors.notFound('Common Categories')
      return this.handleError()
    }
    return this.handleMultiItemSuccess(categories)
  }
  async getById() {}
  async getByLabel() {}
  async createOne() {}
  async createBulk() {}
  async edit() {}
  async deleteOne() {}
  async deleteBulk() {}
}

export default CommonCategoryController
