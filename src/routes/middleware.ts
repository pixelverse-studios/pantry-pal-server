import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { validationResult } from 'express-validator'

export const validateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })
    return
  }
  next()
}

interface UserPayload {
  auth_id: string
}

export interface AuthenticatedRequest extends Request {
  user?: UserPayload
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    console.log('token: ', token)
    if (!token) {
      throw new Error('No authentication token provided')
    }

    const decoded = jwt.verify(token, process.env.SUPABASE_JWT as string, {
      algorithms: ['HS256']
    })
    req.user = {
      auth_id: decoded.sub
    } as UserPayload

    next()
  } catch (err) {
    res.status(401).json({ message: 'Authentication required' })
  }
}
