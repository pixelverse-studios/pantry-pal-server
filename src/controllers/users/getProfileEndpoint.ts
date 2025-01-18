import { Response } from 'express'

import { db, TABLES } from '../../lib/db'
import { handleGenericError } from '../../utils/http'
import { AuthenticatedRequest } from '../../routes/middleware'

const getProfileEndpoint = async (
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

export default getProfileEndpoint
