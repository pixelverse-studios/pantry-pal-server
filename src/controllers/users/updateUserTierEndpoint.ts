import { Response } from 'express'

import { AuthenticatedRequest } from '../../routes/middleware'
import { db, TABLES } from '../../lib/db'
import { handleGenericError, http } from '../../utils/http'

const updateUserTierEndpoint = async (
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

export default updateUserTierEndpoint
