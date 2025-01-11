import { Request, Response } from 'express'

import { AuthenticatedRequest } from '../routes/middleware'
import { db, TABLES } from '../lib/db'
import { handleGenericError, handleDbError, http } from '../utils/http'

const getAll = async (req: Request, res: Response): Promise<any> => {
  try {
    const { data, error } = await db.from(TABLES.USERS).select('*')

    if (error) {
      throw error
    }
    return res.status(200).json(data)
  } catch (err) {
    return handleGenericError(err, res)
  }
}

const getProfile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  try {
    const auth_id = req.user?.auth_id

    const { data, error } = await db
      .from(TABLES.USERS)
      .select('*')
      .eq('auth_id', auth_id)
      .single()

    if (error) {
      throw error
    }
    return res.status(200).json(data)
  } catch (err: any) {
    return handleGenericError(err, res)
  }
}

const getUserRecord = async (auth_id: string) => {
  try {
    const record = await db
      .from(TABLES.USERS)
      .select('*')
      .eq('auth_id', auth_id)
      .single()

    if (record.error) throw record.error

    return record.data
  } catch (err) {
    throw err
  }
}

const updateTier = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<any> => {
  const auth_id = req.user?.auth_id
  const { tier } = req.body

  try {
    const { error } = await db
      .from(TABLES.USERS)
      .update({ tier })
      .eq('auth_id', auth_id)

    if (error) throw error

    return res.status(http.NO_CONTENT).send()
  } catch (err) {
    return handleGenericError(err, res)
  }
}

export default { getAll, getUserRecord, getProfile, updateTier }
