import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateRequest, validateAuth } from './middleware'
import food from '../controllers/food'

const router = Router()
const BASE_ROUTE = '/api/v1/food'

router.get(
  `${BASE_ROUTE}/search`,
  [body('query').exists()],
  validateRequest,
  validateAuth,
  food.searchFoods
)

router.get(
  `${BASE_ROUTE}/measurements`,
  validateRequest,
  food.getMeasurementOptions
)

export default router
