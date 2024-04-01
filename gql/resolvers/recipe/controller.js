import BaseResolver from '../../baseResolver.js'
import Recipe from '../../../models/Recipe.js'
import CommonCategory from '../../../models/CommonCategory.js'
import CustomCategory from '../../../models/CustomCategory.js'
import { Command, Topic, logError } from '../../../utils/logger.js'

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

  async getAll() {}
  async get({ id }, ctx) {
    const recipe = await Recipe.findById(id)
    if (recipe == null) {
      this.error = this.errors.notFound(this.typenames.single)
      return this.handleError(Topic.Recipe, ctx.operation, 'Recipe not found')
    }
    return this.handleSingleItemSuccess(recipe)
  }
  async getFiltered() {}
  async create({ payload }, ctx) {
    const recipeByName = await Recipe.findOne({
      title: payload.title,
      userId: payload.userId
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
  async edit() {}
  async delete() {}
  async createComment() {
    // TODO: Add logic for this when we get to the friends list phase
  }
  async createRating() {
    // TODO: Add logic for this when we get to the friends list phase
  }
}

export default RecipeController
