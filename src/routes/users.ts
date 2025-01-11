import { Router } from 'express'
import { body, param } from 'express-validator'

import { authMiddleware } from './middleware'
import users from '../controllers/users'

const router = Router()
const BASE_ROUTE = '/api/v1/user'

router.get('/api/v1/users', users.getAll)
router.get(`${BASE_ROUTE}`, authMiddleware, users.getProfile)
router.patch(
  `${BASE_ROUTE}/tier`,
  [body('tier').isString().notEmpty()],
  authMiddleware,
  users.updateTier
)

export default router
