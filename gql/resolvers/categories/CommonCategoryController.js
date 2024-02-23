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
  async createOne({ label }) {
    const category = await CommonCategory.findOne({ label })
    if (category != null) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError()
    }
    const newCategory = new CommonCategory({ label, updatedAt: new Date() })
    await newCategory.save()
    const allCats = await CommonCategory.find()
    return this.handleMultiItemSuccess(allCats)
  }
  async createBulk() {}
  async edit() {}
  async deleteOne() {}
  async deleteBulk() {}
}

export default CommonCategoryController
