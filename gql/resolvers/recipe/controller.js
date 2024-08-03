import BaseResolver from '../../baseResolver.js'
import Recipe from '../../../models/Recipe.js'
import CommonCategory from '../../../models/CommonCategory.js'
import CustomCategory from '../../../models/CustomCategory.js'
import { Command, Topic, logError, logInfo } from '../../../utils/logger.js'
import { setFilters } from '../../../utils/recipe/index.js'

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
    if (custom != null) return { _id: custom._id, label: custom.label }
    if (common != null) return { _id: common._id, label: common.label }

    logError(Topic.Recipe, 'getFullCategory', `${Command.Fetch} ${id}`)
    throw new Error('No category was found with the provided ID')
  }

  async getAll() {
    const allRecipes = await Recipe.find().sort({ createdAt: -1 })
    return this.handleMultiItemSuccess(allRecipes)
  }
  async getForUser({ userId }) {
    const userRecipes = await Recipe.find({ 'user._id': userId }).sort({
      createdAt: -1
    })
    return this.handleMultiItemSuccess(userRecipes)
  }
  async get({ id }, ctx) {
    const recipe = await Recipe.findById(id)
    if (recipe == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.Recipe, ctx.operation, 'Recipe not found')
    }

    const { number } = this.utils
    recipe.macros = {
      calories: number.handleRoundNumber(recipe.macros.calories),
      protein: number.handleRoundNumber(recipe.macros.protein),
      carbs: number.handleRoundNumber(recipe.macros.carbs),
      fat: number.handleRoundNumber(recipe.macros.fat)
    }
    console.log(recipe)
    return this.handleSingleItemSuccess(recipe)
  }
  async getFilters({ userId }) {
    const recipes =
      userId != null
        ? await Recipe.find({ 'user._id': userId })
        : await Recipe.find()
    const filters = setFilters(recipes)
    return {
      __typename: 'Filter',
      ...filters
    }
  }
  async getFiltered({ filters }) {
    // Do we even need this on the server? We are returning the full data set to the ui, and giving it the possible filters. We can just do client side filtering.
    // TODO: Check token for all functions
    console.log(filters)
  }
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
            'user._id': userId,
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
      'user._id': userId
    })
    if (recipeByName != null) {
      this.error = this.errors.duplicate(this.typenames.single)
      return this.handleError(
        Topic.Recipe,
        ctx.operation,
        `Duplicate recipe: ${payload.title}`
      )
    }

    const category = await this.getFullCategory(
      payload.category?.id ?? payload.category
    )
    const macros = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    }
    const { number } = this.utils
    const costs = []
    payload.ingredients.forEach(ingredient => {
      costs.push(ingredient.estimatedCost)
      const getNutrientValue = label =>
        ingredient.nutrition.find(nutrient => nutrient.name === label)
      macros.calories += number.handleRoundNumber(
        getNutrientValue('Calories').amount
      )
      macros.protein += number.handleRoundNumber(
        getNutrientValue('Protein').amount
      )
      macros.carbs += number.handleRoundNumber(
        getNutrientValue('Carbohydrates').amount
      )
      macros.fat += number.handleRoundNumber(getNutrientValue('Fat').amount)
    })

    const totalEstimatedCost = costs.reduce((accumulator, currentValue) => {
      return accumulator + currentValue
    }, 0)

    const user = await this.schemas.User.findById(userId)

    const newRecipe = new Recipe({
      ...payload,
      user: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        avatar: user.avatar
      },
      category,
      image: payload?.image != null ? payload.image : '',
      totalEstimatedCost,
      macros,
      interactions: {
        ratings: [],
        comments: []
      },
      totalTime: payload.prepTime + payload.cookTime,
      updatedAt: new Date()
    })
    const saved = await newRecipe.save()
    return this.handleSingleItemSuccess(saved)
  }
  async edit({ id, userId, payload }, ctx) {
    // TODO: Validate userId to token
    const recipe = await Recipe.findOne({ _id: id, 'user._id': userId })
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
    editedPayload.totalTime = payload.prepTime + payload.cookTime
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
