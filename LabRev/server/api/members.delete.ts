import { z } from 'zod'
import { deleteMemberFromStore } from '../utils/memberStore'

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const id = Number(query.id)

  if (isNaN(id)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID'
    })
  }

  const success = await deleteMemberFromStore(id)

  if (!success) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Member not found'
    })
  }

  return { success: true }
})
