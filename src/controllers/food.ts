import { Request, Response } from 'express'

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

    // const requests = [
    //   fetch(url, {
    //     method: 'POST',
    //     headers,
    //     body: JSON.stringify({
    //       ...payload,
    //       dataType: ['Foundation', 'SR Legacy']
    //     })
    //   }),
    //   fetch(url, {
    //     method: 'POST',
    //     headers,
    //     body: JSON.stringify({
    //       ...payload,
    //       dataType: ['Branded']
    //     })
    //   })
    // ]

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    const extractNutrients = (nutrients: any) => {
      const getNutrientValue = (nutrientNumber: number) => {
        const nutrient = nutrients.find(
          (n: any) => n.nutrientId === nutrientNumber
        )
        return nutrient ? nutrient.value : 0
      }

      return {
        calories: getNutrientValue(1008),
        carbohydrates: getNutrientValue(1005),
        cholesterol: getNutrientValue(1253),
        fat: getNutrientValue(1004),
        fiber: getNutrientValue(1079),
        protein: getNutrientValue(1003),
        sodium: getNutrientValue(1093),
        sugar: getNutrientValue(1063),
        vitamin_a: getNutrientValue(1104),
        vitamin_c: getNutrientValue(1162),
        vitamin_d: getNutrientValue(1114)
      }
    }

    const transformedFoods = data.foods.map((food: any) => ({
      description: food.description,
      fdcId: food.fdcId,
      foodNutrients: extractNutrients(food.foodNutrients)
    }))

    return res.status(http.OK).json(transformedFoods ?? [])
  } catch (error) {
    console.log(error)
    return handleGenericError(error, res)
  }
}

const getFoodDetails = async (req: Request, res: Response): Promise<any> => {}

export default { searchFoods }
