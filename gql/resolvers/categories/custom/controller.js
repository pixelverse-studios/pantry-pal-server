import BaseResolver from '../../../baseResolver.js'
import CustomCategory from '../../../../models/CustomCategory.js'
import CommonCategory from '../../../../models/CommonCategory.js'
import { Command, Topic, logError, logInfo } from '../../../../utils/logger.js'

class CustomCategoryController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'RecipeCategory',
      multi: 'RecipeCategories',
      bulk: 'BulkRecipeCategories',
      owned: 'UsersCategories'
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

  mapCategories(categories, src) {
    return categories.map(({ _id, label, updatedAt, createdAt }) => ({
      _id,
      label,
      updatedAt,
      createdAt,
      src
    }))
  }

  async checkAgainstCommon(item) {
    const common = await CommonCategory.find()
    const flattened = common.map(cat => cat.label)
    const { string } = this.validations
    return flattened.some(category => string.isMatching(item, category))
  }

  async getAllForUser({ userId }) {
    const allCommon = await CommonCategory.find()
    const transformedCommons = this.mapCategories(allCommon, 'Common')
    const allCustomForUser = await CustomCategory.find({ userId })
    const transformedCustoms = this.mapCategories(allCustomForUser, 'Custom')
    const returnValues = [...transformedCommons]
    if (transformedCustoms.length > 0) returnValues.push(...transformedCustoms)

    return this.handleMultiItemSuccess(returnValues, this.typenames.owned)
  }
  async getAll(ctx) {
    const categories = await CustomCategory.find()
    if (categories?.length == 0) {
      this.error = this.errors.notFound('Custom Categories')
      return this.handleError(
        Topic.CustomCategory,
        ctx.operation,
        'System has no custom recipe categories'
      )
    }
    return this.handleMultiItemSuccess(categories)
  }
  async getById({ userId, id }, ctx) {
    const category = await CustomCategory.find({ userId })
    if (category == null) {
      this.error = this.errors.notFound('Custom Category')
      return this.handleError(
        Topic.CustomCategory,
        ctx.operation,
        `Recipe ID ${id} could not be found`
      )
    }
    return this.handleSingleItemSuccess(category)
  }
  async getByLabel({ userId, label }, ctx) {
    const category = await CustomCategory.findOne({ userId, label })
    if (category == null) {
      this.error = this.errors.notFound('Custom Category')
      return this.handleError(
        Topic.CustomCategory,
        ctx.operation,
        `Recipe ${label} could not be found`
      )
    }
    return this.handleSingleItemSuccess(category)
  }
  async createOne({ userId, label }, ctx) {
    const { string } = this.validations
    const all = await CustomCategory.find({ userId })
    const alreadyExists = all.some(item => string.isMatching(label, item.label))
    const existsInCommon = await this.checkAgainstCommon(label)
    if (alreadyExists || existsInCommon) {
      this.error = this.errors.duplicate(this.typenames.single)
      return this.handleError(
        Topic.CustomCategory,
        ctx.operation,
        `Recipe ${label} already exists`
      )
    }
    const newCategory = new CustomCategory({
      label,
      updatedAt: Date.now(),
      userId
    })
    await newCategory.save()
    const allCats = await CustomCategory.find()
    return this.handleMultiItemSuccess(allCats)
  }
  async createBulk({ userId, labels }, ctx) {
    const { string } = this.validations
    if (labels.some(label => string.isEmpty(label)) || labels?.length < 1) {
      this.error = this.errors.invalid('Category label', 'missing')
      return this.handleError(
        Topic.CustomCategory,
        ctx.operation,
        'No labels were provided for bulk creating categories'
      )
    }
    const existingCustom = await CustomCategory.find()

    const failed = []
    const succeeded = []

    for await (const label of labels) {
      const existsInCommon = await this.checkAgainstCommon(label)
      const alreadyExists = existingCustom.some(item =>
        string.isMatching(label, item.label)
      )
      if (alreadyExists || existsInCommon) {
        failed.push(label)
      } else {
        const newCategory = CustomCategory({
          label,
          updatedAt: Date.now(),
          userId
        })
        await newCategory.save()
        succeeded.push(newCategory.label)
      }
    }

    const allCategories = await CustomCategory.find()
    return this.handleBulk(
      { all: allCategories, failed, succeeded },
      this.typenames.bulk
    )
  }
  async edit({ id, userId, newLabel }, ctx) {
    logInfo(
      Topic.CustomCategory,
      ctx.operation,
      `${Command.Edit} ${id} | New Label: ${newLabel}`
    )
    const category = await CustomCategory.findById(id)
    if (category == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }
    const existsInCommon = await this.checkAgainstCommon(newLabel)
    const currentCustoms = await CustomCategory.find({ userId })
    const isDupe = currentCustoms.some(item => item.label === newLabel)
    if (isDupe || existsInCommon) {
      this.error = this.errors.duplicate(this.typenames.single)
      return this.handleError(
        Topic.CustomCategory,
        ctx.operation,
        `Recipe ${newLabel} already exists`
      )
    }

    await CustomCategory.findOneAndUpdate(
      { _id: id, userId },
      { label: newLabel, updatedAt: Date.now() }
    )
    return this.handleMultiItemSuccess(await CustomCategory.find())
  }
  async deleteOneById({ id, userId }, ctx) {
    const category = await CustomCategory.findOne({ _id: id, userId })
    logInfo(
      Topic.CustomCategory,
      ctx.operation,
      `${Command.Delete} ${category._id} | ${category.label}`
    )
    if (category == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.CustomCategory)
    }
    await CustomCategory.findByIdAndDelete(id)
    const remainingCategories = await CustomCategory.find()
    return this.handleMultiItemSuccess(remainingCategories)
  }
  async deleteOneByLabel({ label, userId }, ctx) {
    const category = await CustomCategory.findOne({ label, userId })
    logInfo(
      Topic.CustomCategory,
      ctx.operation,
      `${Command.Delete} ${category._id} | ${category.label}`
    )
    if (category == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.CustomCategory)
    }
    await CustomCategory.findByIdAndDelete(category._id)
    const remainingCategories = await CustomCategory.find()
    return this.handleMultiItemSuccess(remainingCategories)
  }
  async deleteBulkById({ ids, userId }, ctx) {
    logInfo(
      Topic.CustomCategory,
      ctx.operation,
      `${Command.Delete_Ids} ${ids.toString()}`
    )
    const all = await CustomCategory.find({ userId })
    const failed = []
    const succeeded = []

    for (const item of ids) {
      if (!all.some(obj => obj._id !== item)) {
        failed.push(item)
      }
    }

    const results = await CustomCategory.deleteMany({
      _id: {
        $in: ids
      }
    })
    const refreshedAll = await CustomCategory.find()
    if (results.deletedCount === ids.length) {
      succeeded.push(...ids)
    } else {
      for (const item of ids) {
        if (
          !refreshedAll.some(doc => doc._id === item) &&
          !failed.includes(item)
        ) {
          succeeded.push(item)
        }
      }
    }
    return this.handleBulk(
      { all: refreshedAll, succeeded, failed },
      this.typenames.bulk
    )
  }
  async deleteBulkByLabel({ labels, userId }, ctx) {
    const { string } = this.validations
    logInfo(
      Topic.CustomCategory,
      ctx.operation,
      `${Command.Delete_Labels} ${labels.toString()}`
    )
    const all = await CustomCategory.find({ userId })
    const failed = []
    const succeeded = []

    for (const item of labels) {
      const existsInAll = all.some(obj => string.isMatching(item, obj.label))
      if (!existsInAll) {
        failed.push(item)
      }
    }

    const sanitizedLabels = labels.map(item => {
      const match = all.find(obj => string.isMatching(item, obj.label))
      return match != null ? match.label : item
    })
    const results = await CustomCategory.deleteMany({
      label: {
        $in: sanitizedLabels
      }
    })
    const refreshedAll = await CustomCategory.find()
    const doAmountsMatch = results.deletedCount === labels.length
    if (doAmountsMatch) {
      succeeded.push(...labels)
    } else {
      for (const item of labels) {
        const existsInDb = refreshedAll.some(doc =>
          string.isMatching(item, doc.label)
        )
        const existsInFailed = failed.some(fail =>
          string.isMatching(item, fail)
        )
        if (!existsInDb && !existsInFailed) {
          succeeded.push(item)
        }
      }
    }
    return this.handleBulk(
      { all: refreshedAll, succeeded, failed },
      this.typenames.bulk
    )
  }
}

export default CustomCategoryController
