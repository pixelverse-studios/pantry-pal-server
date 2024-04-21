export const defaultRange = {
  min: 0,
  max: 0,
  step: 0
}

const filters = {
  titles: [],
  ingredients: {
    names: [],
    aisles: []
  },
  macros: {
    calories: defaultRange,
    protein: defaultRange,
    carbs: defaultRange,
    fat: defaultRange
  },
  cost: defaultRange,
  cookingMethod: [],
  category: [],
  allergies: [],
  rating: defaultRange,
  difficulty: defaultRange,
  tags: [],
  createdAt: defaultRange,
  users: []
}
const allCounted = {
  calories: [],
  protein: [],
  carbs: [],
  fat: [],
  cost: [],
  rating: [],
  difficulty: [],
  createdAt: []
}

const setMinMaxStep = all => ({
  min: Math.min(...all),
  max: Math.max(...all),
  step: all.length
})
const removeDuplicateStrings = values => [...new Set(values)]
const removeDuplicateObjects = values => {
  const map = new Map(values.map(val => [val._id, val]))
  const unique = [...map.values()]
  return unique
}

export const setFilters = recipes => {
  recipes.forEach(recipe => {
    const { ingredients } = filters
    filters.titles.push(recipe.title)
    recipe.ingredients.forEach(ingredient => {
      ingredients.names.push(ingredient.name)
      ingredients.aisles.push(...ingredient.aisle)
    })
    allCounted.calories.push(recipe.macros.calories)
    allCounted.protein.push(recipe.macros.protein)
    allCounted.carbs.push(recipe.macros.carbs)
    allCounted.fat.push(recipe.macros.fat)
    allCounted.cost.push(recipe.totalEstimatedCost)
    allCounted.rating.push(recipe.rating)
    allCounted.difficulty.push(recipe.difficulty)
    allCounted.createdAt.push(recipe.createdAt)

    filters.cookingMethod.push(recipe.cookingMethod)
    filters.category.push(recipe.category)
    filters.allergies.push(...recipe.allergies)
    filters.tags.push(...recipe.tags)
    filters.users.push(recipe.user)
  })

  filters.titles = removeDuplicateStrings(filters.titles)
  filters.ingredients.names = removeDuplicateStrings(filters.ingredients.names)
  filters.ingredients.aisles = removeDuplicateStrings(
    filters.ingredients.aisles
  )
  filters.cookingMethod = removeDuplicateStrings(filters.cookingMethod)
  filters.category = removeDuplicateObjects(filters.category)
  filters.allergies = removeDuplicateStrings(filters.allergies)
  filters.tags = removeDuplicateStrings(filters.tags)
  filters.users = removeDuplicateObjects(filters.users)

  filters.macros.calories = setMinMaxStep(allCounted.calories)
  filters.macros.protein = setMinMaxStep(allCounted.protein)
  filters.macros.carbs = setMinMaxStep(allCounted.carbs)
  filters.macros.fat = setMinMaxStep(allCounted.fat)
  filters.cost = setMinMaxStep(allCounted.cost)
  filters.rating = setMinMaxStep(allCounted.rating)
  filters.difficulty = setMinMaxStep(allCounted.difficulty)
  filters.createdAt = setMinMaxStep(allCounted.createdAt)

  return filters
}
