import { http, foodFetch } from '../../../utils/http.js'
import { Topic, logInfo } from '../../../utils/logger.js'

const { GET } = http

export const getByName = async name => {
  const params = `food/ingredients/search?query=${name}&addChildren=false&metaInformation=true&number=100`
  logInfo(Topic.Food, 'GET getByName', params)
  return await foodFetch({ params, method: GET })
}

export const getById = async (searchId, amount, units) => {
  const params = `food/ingredients/${searchId}/information?amount=${amount}&unit=${units}`
  logInfo(Topic.Food, 'GET getById', params)
  const {
    id,
    name,
    unit,
    unitShort,
    unitLong,
    aisle,
    image,
    estimatedCost,
    nutrition: { nutrients }
  } = await foodFetch({ params, method: GET })

  const calories = nutrients.find(item => item.name === 'Calories')
  const protein = nutrients.find(item => item.name === 'Protein')
  const carbs = nutrients.find(item => item.name === 'Carbohydrates')
  const fats = nutrients.find(item => item.name === 'Fat')
  const breakdown = {
    calories: { value: calories.amount, percent: calories.percentOfDailyNeeds },
    protein: { value: protein.amount, percent: protein.percentOfDailyNeeds },
    carbs: { value: carbs.amount, percent: carbs.percentOfDailyNeeds },
    fats: { value: fats.amount, percent: fats.percentOfDailyNeeds }
  }

  const calculatedCost = estimatedCost.value / 100
  const releventFields = {
    aisle: aisle.split(',').map(item => item.trim()),
    caloricBreakdown: breakdown,
    id,
    image,
    name,
    estimatedCost: calculatedCost.toFixed(2),
    nutrition: nutrients,
    units: {
      base: unit,
      short: unitShort,
      long: unitLong
    }
  }
  return releventFields
}