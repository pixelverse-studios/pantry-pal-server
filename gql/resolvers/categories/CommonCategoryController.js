import BaseResolver from '../../baseResolver.js'
import CommonCategory from '../../../models/CommonCategory.js'
import { Command, Topic, logError, logInfo } from '../../../utils/logger.js'

class CommonCategoryController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'RecipeCategory',
      multi: 'RecipeCategories'
    }
  }

  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    return this.catchError(action)
  }

  handleBulk(response, typename) {
    const returnValues = {}
    Object.entries(response).forEach(([key, value]) => {
      returnValues[key] = value
    })

    return {
      __typename: typename,
      ...returnValues
    }
  }

  async getAll(ctx) {
    const categories = await CommonCategory.find()
    if (categories?.length == 0) {
      this.error = this.errors.notFound('Common Categories')
      return this.handleError(
        Topic.CommonCategory,
        ctx.operation,
        'System has no common recipe categories'
      )
    }
    return this.handleMultiItemSuccess(categories)
  }
  async getById({ id }, ctx) {
    const category = await CommonCategory.findById(id)
    if (category == null) {
      this.error = this.errors.notFound('Common Category')
      return this.handleError(
        Topic.CommonCategory,
        ctx.operation,
        `Recipe ID ${id} could not be found`
      )
    }
    return this.handleSingleItemSuccess(category)
  }
  async getByLabel({ label }, ctx) {
    const category = await CommonCategory.findOne({ label })
    if (category == null) {
      this.error = this.errors.notFound('Common Category')
      return this.handleError(
        Topic.CommonCategory,
        ctx.operation,
        `Recipe ${label} could not be found`
      )
    }
    return this.handleSingleItemSuccess(category)
  }
  async createOne({ label }, ctx) {
    const category = await CommonCategory.findOne({ label })
    if (category != null) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError(
        Topic.CommonCategory,
        ctx.operation,
        `Recipe ${label} could not be created`
      )
    }
    const newCategory = new CommonCategory({ label, updatedAt: new Date() })
    await newCategory.save()
    const allCats = await CommonCategory.find()
    return this.handleMultiItemSuccess(allCats)
  }
  async createBulk({ labels }, ctx) {
    const { string } = this.validations
    if (labels.some(label => string.isEmpty(label)) || labels?.length < 1) {
      this.error = this.errors.badInput('Category label')
      return this.handleError(
        Topic.CommonCategory,
        ctx.operation,
        'No labels were provided for bulk creating categories'
      )
    }

    const failed = []
    const succeeded = []

    for (const label of labels) {
      const category = await CommonCategory.findOne({ label })
      if (category != null) {
        failed.push(label)
        break
      }
      const newCategory = CommonCategory({ label, updatedAt: new Date() })
      await newCategory.save()
      succeeded.push(newCategory.label)
    }

    const allCategories = await CommonCategory.find()
    return this.handleBulk(
      { all: allCategories, failed, succeeded },
      'BulkRecipeCategories'
    )
  }
  async edit() {}
  async deleteOne({ id }, ctx) {
    const category = await CommonCategory.findById(id)
    if (category == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.CommonCategory)
    }
    logInfo(
      Topic.CommonCategory,
      ctx.operation,
      `${Command.Delete} ${category._id} | ${category.label}`
    )
    await CommonCategory.findByIdAndDelete(id)
    const remainingCategories = await CommonCategory.find()
    return this.handleMultiItemSuccess(remainingCategories)
  }
  async deleteBulkById() {}
  // async deleteBulkById({ids}, ctx) {}
  async deleteBulkByLabel() {}
}

export default CommonCategoryController
