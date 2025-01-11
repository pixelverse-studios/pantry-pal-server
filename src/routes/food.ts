import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateRequest, authMiddleware } from './middleware'
import food from '../controllers/food'

const router = Router()
const BASE_ROUTE = '/api/v1/food'

router.get(
  `${BASE_ROUTE}/search`,
  [body('query').exists()],
  validateRequest,
  authMiddleware,
  food.searchFoods
)

router.get(
  `${BASE_ROUTE}/nutrition/:foodId`,
  [param('foodId').exists()],
  authMiddleware,
  validateRequest,
  () => {}
)

export default router
