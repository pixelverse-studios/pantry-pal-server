import { Request, Response } from 'express'

import { db, TABLES } from '../../lib/db'
import { handleGenericError, http } from '../../utils/http'

const getAllUsersEndpoint = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { data, error } = await db.from(TABLES.USERS).select('*')

    if (error) {
      throw error
    }
    return res.status(http.OK).json(data)
  } catch (err) {
    return handleGenericError(err, res)
  }
}

export default getAllUsersEndpoint
