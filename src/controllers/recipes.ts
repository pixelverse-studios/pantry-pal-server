import { Request, Response } from 'express'

import { db, VIEWS } from '../lib/db'
import { handleGenericError } from '../utils/http'

const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await db.from(VIEWS.RECIPE_DETAILS).select('*')
    if (error) {
      throw error
    }
    res.status(200).json(data)
  } catch (err) {
    handleGenericError(err, res)
  }
}

export default { getAll }
