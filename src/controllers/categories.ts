import { Request, Response } from 'express'

import { AuthenticatedRequest } from '../routes/middleware'
import { db, TABLES } from '../lib/db'
import users from './users'
import { handleDbError, handleGenericError, http } from '../utils/http'
import { isUserAdmin } from '../utils/users'

const getAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await db.from(TABLES.CATEGORIES).select('*')
    if (error) {
      throw error
    }

    return res.status(200).json(data)
  } catch (err) {
    return handleGenericError(err, res)
  }
}

const getForUser = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const auth_id = req.user?.auth_id ?? ''

  try {
    const user = await users.getUserRecord(auth_id)

    const record = await db
      .from(TABLES.CATEGORIES)
      .select('*')
      .or(`user_id.eq.${user.id}, type.eq.Common`)

    if (record.error) return handleDbError(record, res)

    return res.status(http.OK).json(record.data)
  } catch (error) {
    return handleGenericError(error, res)
  }
}

const add = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
  const auth_id = req.user?.auth_id ?? ''

  const { label, type } = req.body

  try {
    const user = await users.getUserRecord(auth_id)
    const isAdmin = isUserAdmin(user)

    const { data, error } = await db
      .from(TABLES.CATEGORIES)
      .insert({
        label,
        type: isAdmin ? type : 'Custom',
        user_id: user.id
      })
      .select()

    if (error) {
      throw error
    }

    return res.status(http.CREATED).json(data)
  } catch (err) {
    return handleGenericError(err, res)
  }
}

const remove = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const auth_id = req.user?.auth_id ?? ''

  try {
    const user = await users.getUserRecord(auth_id)
    const isAdmin = isUserAdmin(user)

    const { id } = req.params

    const query = await db
      .from(TABLES.CATEGORIES)
      .select('id')
      .eq('id', id)
      .single()

    if (query.error) return handleDbError(query, res)

    if (isAdmin || query.data.id === user.id) {
      const execution = await db
        .from(TABLES.CATEGORIES)
        .delete()
        .eq('id', id)
        .select()
        .single()

      if (execution.error) {
        return handleDbError(execution, res)
      }

      return res.status(http.NO_CONTENT).send()
    }

    return res
      .status(http.BAD_REQUEST)
      .json({ message: 'Unable to delete requested category.' })
  } catch (error) {
    return handleGenericError(error, res)
  }
}

export default { add, getAll, getForUser, remove }
