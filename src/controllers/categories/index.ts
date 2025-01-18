import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateAuth, validateRequest } from '../../routes/middleware'

const router = Router()
const BASE_ROUTE = '/api/v1/categories'

router.get(BASE_ROUTE, validateRequest, getAllCategoriesEndpoint)
router.get(
  `${BASE_ROUTE}/:user_id`,
  [param('user_id').exists()],
  validateRequest,
  validateAuth,
  getUserCategoriesEndpoint
)

router.post(
  BASE_ROUTE,
  [body('label').isString().notEmpty(), body('type').isString().optional()],
  validateAuth,
  validateRequest,
  addCategoryEndpoint
)

router.delete(
  `${BASE_ROUTE}/:id`,
  validateAuth,
  validateRequest,
  deleteCategoryEndpoint
)

export default router
