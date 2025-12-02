import { z } from 'zod'
import { updateMemberInStore } from '../utils/memberStore'

const updateMemberSchema = z.object({
  id: z.number(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  grade: z.enum(['Admin', 'M2', 'M1', 'B4', 'B3']).optional(),
  status: z.enum(['online', 'offline', 'afk']).optional()
})

export default eventHandler(async (event) => {
  const body = await readBody(event)

  const result = updateMemberSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation Error',
      data: result.error.issues
    })
  }

  const { id, ...data } = result.data
  const updatedMember = await updateMemberInStore(id, data)

  if (!updatedMember) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Member not found'
    })
  }

  return updatedMember
})
