import BaseResolver from '../../baseResolver.js'
import Recipe from '../../../models/Recipe.js'
import CommonCategory from '../../../models/CommonCategory.js'
import CustomCategory from '../../../models/CustomCategory.js'
import { Command, Topic, logError, logInfo } from '../../../utils/logger.js'

class RecipeController extends BaseResolver {
  constructor() {
    super()

    this.typenames = {
      single: 'Recipe',
      multi: 'Recipes'
    }
  }
  catchError(action, { topic, operation }, error) {
    logError(topic, operation, error)
    return this.catchError(action)
  }
  async getFullCategory(id) {
    const [custom, common] = await Promise.all([
      CustomCategory.findById(id),
      CommonCategory.findById(id)
    ])
    if (custom != null) return { categoryId: custom._id, label: custom.label }
    if (common != null) return { categoryId: common._id, label: common.label }

    logError(Topic.Recipe, 'getFullCategory', `${Command.Fetch} ${id}`)
    throw new Error('No category was found with the provided ID')
  }

  async getAll({ userId }) {
    if (userId == undefined) {
      const allRecipes = await Recipe.find()
      return this.handleMultiItemSuccess(allRecipes)
    } else {
      const userRecipes = await Recipe.find({ userId })
      return this.handleMultiItemSuccess(userRecipes)
    }
  }
  async get({ id }, ctx) {
    const recipe = await Recipe.findById(id)
    if (recipe == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.Recipe, ctx.operation, 'Recipe not found')
    }
    return this.handleSingleItemSuccess(recipe)
  }
  async getFiltered() {}
  async getByKeyword({ userId, search }, ctx) {
    const searchParam = new RegExp(search, 'i')
    const regex = { $regex: searchParam }
    const searchConditions = [
      { title: regex },
      { 'ingredients.name': regex },
      { 'category.label': regex },
      { tags: regex }
    ]
    const query =
      userId != null
        ? {
            userId,
            $or: searchConditions
          }
        : {
            $or: searchConditions
          }
    const recipes = await Recipe.find(query)
    if (recipes.length > 0) {
      return this.handleMultiItemSuccess(recipes)
    } else {
      const message = `No recipes were found with "${search}"`
      this.error = this.errors.customMessage(message)
      return this.handleInfo(Topic.Recipe, ctx.operation, message)
    }
  }
  async create({ userId, payload }, ctx) {
    const recipeByName = await Recipe.findOne({
      title: payload.title,
      userId
    })
    if (recipeByName != null) {
      this.error = this.errors.duplicate(this.typenames.single)
      return this.handleError(
        Topic.Recipe,
        ctx.operation,
        `Duplicate recipe: ${payload.title}`
      )
    }

    const category = await this.getFullCategory(payload.category)
    const macros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
    const costs = []
    payload.ingredients.forEach(ingredient => {
      costs.push(ingredient.estimatedCost)

      const protein = ingredient.nutrition.find(
        nutrient => nutrient.name === 'Protein'
      )
      const carbs = ingredient.nutrition.find(
        nutrient => nutrient.name === 'Carbohydrates'
      )
      const fat = ingredient.nutrition.find(nutrient => nutrient.name === 'Fat')
      macros.protein += protein.amount
      macros.carbs += carbs.amount
      macros.fat += fat.amount
    })

    const totalEstimatedCost = costs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    }, 0)

    const newRecipe = new Recipe({
      ...payload,
      userId,
      category,
      image: payload?.image != null ? payload.image : '',
      totalEstimatedCost,
      macros,
      interactions: {
        ratings: [],
        comments: []
      },
      updatedAt: new Date()
    })
    const saved = await newRecipe.save()
    return this.handleSingleItemSuccess(saved)
  }
  async edit({ id, userId, payload }, ctx) {
    // TODO: Validate userId to token
    const recipe = await Recipe.findOne({ _id: id, userId })
    if (recipe == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.Recipe, ctx.operation, 'Recipe not found')
    }
    const { deepEquals } = this.validations
    const editedPayload = {}
    for (const [key, value] of Object.entries(payload)) {
      const isMatching = deepEquals(value, recipe[key], { strict: true })
      if (!isMatching) {
        editedPayload[key] = value ?? recipe[key]
      }
    }
    if (Object.keys(editedPayload).length === 0) {
      this.error = this.errors.failure(
        'there were no valid updates provided',
        'update recipe,'
      )
      return this.handleError(
        Topic.Recipe,
        ctx.operation,
        `Unable to edit recipe ${id}`
      )
    }
    const updated = await Recipe.findByIdAndUpdate(id, editedPayload, {
      new: true
    })
    return this.handleSingleItemSuccess(updated)
  }
  async delete({ id }, ctx) {
    logInfo(Topic.Recipe, ctx.operation, `${Command.Delete} ${id}`)
    const result = await Recipe.findByIdAndDelete(id)
    const { string } = this.validations
    const success = string.isMatching(result._id, id)
    return success
  }
  async deleteBulk({ ids }) {
    const results = await Recipe.deleteMany({ _id: { $in: ids } })
    const refreshed = await Recipe.find()

    const failed = []
    const succeeded = []
    if (results.deletedCount === ids.length) {
      succeeded.push(...ids)
    } else {
      for (const id of ids) {
        if (!refreshed.some(doc => doc._id === id) && !failed.includes(id)) {
          succeeded.push(id)
        } else {
          failed.push(id)
        }
      }
    }
    const response = { total: ids.length, succeeded, failed }
    return {
      __typename: 'BulkDeletes',
      ...response
    }
  }
  async createComment() {
    // TODO: Add logic for this when we get to the friends list phase
  }
  async createRating() {
    // TODO: Add logic for this when we get to the friends list phase
  }
}

export default RecipeController
