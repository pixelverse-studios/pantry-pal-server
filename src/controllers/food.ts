import { Request, Response } from 'express'

import { extractNutrients, measurementOptions } from '../utils/food'
import { handleGenericError, http } from '../utils/http'

const KEY = process.env.FOOD_API ?? ''

const searchFoods = async (req: Request, res: Response): Promise<any> => {
  const { query } = req.body

  try {
    const url = 'https://api.nal.usda.gov/fdc/v1/foods/search'

    const payload = {
      query,
      dataType: ['Foundation', 'SR Legacy'],
      pageSize: 50,
      pageNumber: 1,
      sortBy: 'dataType.keyword',
      sort: 'asc'
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': KEY
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    const transformedFoods = data.foods.map((food: any, index: number) => ({
      description: food.description,
      fdcId: food.fdcId,
      foodNutrients: extractNutrients(food.foodNutrients, index === 1)
    }))

    return res.status(http.OK).json(transformedFoods ?? [])
  } catch (error) {
    return handleGenericError(error, res)
  }
}

const getMeasurementOptions = async (
  req: Request,
  res: Response
): Promise<any> => {
  const relevantItems = measurementOptions.map(item => ({
    unit: item.unit,
    label: item.label
  }))

  return res.status(http.OK).json(relevantItems)
}

export default { searchFoods, getMeasurementOptions }
