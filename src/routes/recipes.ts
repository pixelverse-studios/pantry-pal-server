import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateRequest } from './middleware'
import recipes from '../controllers/recipes'

const recipesRouter: Router = Router()
const BASE_ROUTE = '/api/v1/recipes'

recipesRouter.get(BASE_ROUTE, recipes.getAll)

export default recipesRouter
