import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateRequest, validateAuth } from './middleware'
import recipes from '../controllers/recipes'

const recipesRouter: Router = Router()
const BASE_ROUTE = '/api/v1/recipes'

recipesRouter.get(BASE_ROUTE, validateRequest, recipes.getAll)

recipesRouter.post(
  `${BASE_ROUTE}`,
  [],
  validateAuth,
  validateRequest,
  recipes.create
)

export default recipesRouter
