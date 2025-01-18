import { db, TABLES } from '../lib/db'

export const getUserRecord = async (auth_id: string) => {
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
