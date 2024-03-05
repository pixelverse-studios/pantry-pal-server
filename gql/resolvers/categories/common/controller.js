import BaseResolver from '../../../baseResolver.js'
import CommonCategory from '../../../../models/CommonCategory.js'
import { Command, Topic, logError, logInfo } from '../../../../utils/logger.js'

class CommonCategoryController extends BaseResolver {
  constructor() {
    super()
    this.typenames = {
      single: 'RecipeCategory',
      multi: 'RecipeCategories',
      bulk: 'BulkRecipeCategories'
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
    const { string } = this.validations
    const all = await CommonCategory.find()
    const alreadyExists = all.some(item => string.isMatching(label, item.label))
    if (alreadyExists) {
      this.error = this.errors.duplicateItem(this.typenames.single)
      return this.handleError(
        Topic.CommonCategory,
        ctx.operation,
        `Recipe ${label} could not be created`
      )
    }
    const newCategory = new CommonCategory({ label, updatedAt: Date.now() })
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
    const existing = await CommonCategory.find()

    const failed = []
    const succeeded = []

    for await (const label of labels) {
      const alreadyExists = existing.some(item =>
        string.isMatching(label, item.label)
      )
      if (alreadyExists) {
        failed.push(label)
        break
      }
      const newCategory = CommonCategory({ label, updatedAt: Date.now() })
      await newCategory.save()
      succeeded.push(newCategory.label)
    }

    const allCategories = await CommonCategory.find()
    return this.handleBulk(
      { all: allCategories, failed, succeeded },
      this.typenames.bulk
    )
  }
  async edit({ id, newLabel }, ctx) {
    logInfo(
      Topic.CommonCategory,
      ctx.operation,
      `${Command.Edit} ${id} | New Label: ${newLabel}`
    )
    const category = await CommonCategory.findById(id)
    if (category == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError()
    }

    const res = await CommonCategory.findOneAndUpdate(
      { _id: id },
      { label: newLabel, updatedAt: Date.now() }
    )
    console.log('res; ', res)
    return this.handleMultiItemSuccess(await CommonCategory.find())
  }
  async deleteOneById({ id }, ctx) {
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
  async deleteOneByLabel({ label }, ctx) {
    const category = await CommonCategory.findOne({ label })
    if (category == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.CommonCategory)
    }
    logInfo(
      Topic.CommonCategory,
      ctx.operation,
      `${Command.Delete} ${category._id} | ${category.label}`
    )
    await CommonCategory.findByIdAndDelete(category._id)
    const remainingCategories = await CommonCategory.find()
    return this.handleMultiItemSuccess(remainingCategories)
  }
  async deleteBulkById({ ids }, ctx) {
    logInfo(
      Topic.CommonCategory,
      ctx.operation,
      `${Command.Delete_Ids} ${ids.toString()}`
    )
    const all = await CommonCategory.find()
    const failed = []
    const succeeded = []

    for (const item of ids) {
      if (!all.some(obj => obj._id !== item)) {
        failed.push(item)
      }
    }

    const results = await CommonCategory.deleteMany({
      _id: {
        $in: ids
      }
    })
    const refreshedAll = await CommonCategory.find()
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
  async deleteBulkByLabel({ labels }, ctx) {
    const { string } = this.validations
    logInfo(
      Topic.CommonCategory,
      ctx.operation,
      `${Command.Delete_Labels} ${labels.toString()}`
    )
    const all = await CommonCategory.find()
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
    const results = await CommonCategory.deleteMany({
      label: {
        $in: sanitizedLabels
      }
    })
    const refreshedAll = await CommonCategory.find()
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

export default CommonCategoryController
