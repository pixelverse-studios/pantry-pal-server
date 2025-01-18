import { Router } from 'express'
import { body, param } from 'express-validator'

import { validateAuth, validateRequest } from '../../routes/middleware'
import getAllUsersEndpoint from './getAllUsersEndpoint'
import getProfileEndpoint from './getProfileEndpoint'
import updateUserTierEndpoint from './updateUserTierEndpoint'

const router = Router()

const BASE_ROUTE = '/api/v1/user'

router.get('/api/v1/users', validateRequest, getAllUsersEndpoint)
router.get(`${BASE_ROUTE}`, validateAuth, getProfileEndpoint)

router.patch(
  `${BASE_ROUTE}/tier`,
  [body('tier').isString().notEmpty()],
  validateAuth,
  updateUserTierEndpoint
)

export default router
