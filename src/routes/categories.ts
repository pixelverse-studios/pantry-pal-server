import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateRequest, validateAuth } from './middleware'
import categories from '../controllers/categories'

const router = Router()
const BASE_ROUTE = '/api/v1/categories'

router.get(BASE_ROUTE, categories.getAll)

router.get(
  `${BASE_ROUTE}/:user_id`,
  [param('user_id').exists()],
  validateAuth,
  validateRequest,
  categories.getForUser
)

router.post(
  `${BASE_ROUTE}`,
  [body('label').isString().notEmpty(), body('type').isString().optional()],
  validateAuth,
  validateRequest,
  categories.add
)

router.delete(
  `${BASE_ROUTE}/:id`,
  [param('id').exists()],
  validateAuth,
  validateRequest,
  categories.remove
)

export default router
